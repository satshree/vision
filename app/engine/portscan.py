import sys
import json
import socket
from scapy.all import IP, TCP, sr1
# from modules.resources import well_known_ports
from modules.common import echo_result

__author__ = "Satshree Shrestha"

def scan_port(host, ports, verbose=True):
    """ Stealth scan the given ports. """
    
    # Create IP packet targeted to host.
    ip = IP(dst=host)
    
    open_ports = []
    for port in ports:
        if verbose:
            echo_result("Probing port {}".format(port))
        # Create a TCP 'SYN' packet.
        tcp = TCP(dport=int(port), flags="S", seq=int(port))

        # Stack IP and TCP packets to send.
        packet = ip/tcp

        # Connect to given port to check for open port.
        reply = sr1(packet, verbose=False, timeout=0.7)  # sr1 sends packets at Layer 3.

        try:
            if reply.seq > 0:
                # If the port is open.
                try:
                    open_ports.append("{} ({})".format(port, socket.getservbyport(int(port)).upper()))
                except:
                    open_ports.append("{}".format(port))
        except:
            pass

    return open_ports

if __name__ == "__main__":
    host = sys.argv[1]

    ports = sys.argv[-1].split(",")

    open_ports = scan_port(host, ports)
    
    echo_result(json.dumps(open_ports))
