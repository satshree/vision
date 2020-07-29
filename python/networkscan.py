import socket
import sys
import json
import os
from scapy.all import IP, TCP, ARP, Ether, srp, sr1
from modules import systeminfo, hostinfo, oui#, resources
from modules.common import echo_result

__author__ = "Satshree Shrestha"

# current_file_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), sys.argv[0])

# CLASS


class NetworkScan:
    def __init__(self, ip_range=[], ip=None):
        # Initialize required variables.
        self.ip_range = ip_range
        if self.ip_range:
            self.ip = self.ip_range[0]
        else:
            self.ip = ip
        self.hosts = {}
        self.gateway = '.'.join(self.break_ip(
            systeminfo.get_default_gateway(), subnet=True))
        self.empty_subnet_counter = 0

    def break_ip(self, IP, subnet=False):
        """ This will break the IP into its 4 octets. """

        octets = IP.split(".")

        octet1 = octets[0]
        octet2 = octets[1]
        octet3 = octets[2]
        if subnet:
            octet4 = '0/24'
        else:
            octet4 = octets[3]

        broken_ip = [octet1, octet2, octet3, octet4]

        return broken_ip

    def update_gateway(self):
        """ Increase the third octet of gateway by one. """
        gateway_octets = self.break_ip(self.gateway, subnet=True)

        gateway_octets[2] = str(int(gateway_octets[2]) + 1)
        self.gateway = '.'.join(gateway_octets)

    def update_ip(self):
        """ Update IP from the range to scan. """
        octets = self.break_ip(self.ip)

        if int(octets[-1]) == 255:
            octets[-2] = str(int(octets[-2]) + 1)
            octets[-1] = str(1)
            self.ip = '.'.join(octets)
        else:
            octets[-1] = str(int(octets[-1]) + 1)
            self.ip = '.'.join(octets)

    def count_empty_subnet(self):
        """ Count empty subnet. """
        self.empty_subnet_counter += 1

    def reset_subnet_counter(self):
        """ Reset subnet counter. """
        self.empty_subnet_counter = 0

    def scan(self):
        """ Scan the network. """

        # Create ARP packet.
        if self.ip_range or self.ip:
            arp = ARP(pdst=self.ip)
        else:
            arp = ARP(pdst=self.gateway)

        # Create a broadcast ethernet frame with broadcast MAC address.
        broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")

        # Stack ARP packet above broadcast frame.
        arp_broadcast = broadcast/arp

        # Use 'srp' method to send frames on layer 2, 0 index is list of answers.
        answered = srp(arp_broadcast, timeout=2, verbose=False)[0]

        # Catch online hosts
        for element in answered:
            # 'psrc' refers to IP address | 'hwsrc' refers to MAC address.
            ip = element[1].psrc
            mac = element[1].hwsrc.upper()

            # OBJECT | DICTIONARY
            self.hosts[ip] = {
                'MAC': mac}


        return len(answered)

    def vendor(self):
        """ Identify vendor of online caught hosts. """

        # Retrieve all OUI
        # oui = resources.get_OUI()
        oui_obj = oui.oui

        for host in self.hosts:
            mac = self.hosts[host]['MAC']
            self.hosts[host]['Vendor'] = oui_obj.get(mac[:8])

    def hostname(self):
        """ Set Hostname of the device. """

        for ip in self.hosts.keys():
            hostname = hostinfo.identify_hostname(ip)
            self.hosts[ip]['Hostname'] = hostname
    
    def get_host_lists(self):
        """ Return all the hosts in list format. """

        host_list = []

        for host, meta in self.all_hosts.items():
            host_list.append({
                'IP': host,
                'MAC': meta['MAC'], 
                "Vendor": meta["Vendor"],
                "Hostname": meta["Hostname"],
                "OS": None, 
                "Ports": []
            })

        return host_list

    @property
    def all_hosts(self):
        """ Return all the hosts. """
        return self.hosts


# FUNCTION

def check_ip(host, organized_data):
    for each in organized_data:
        if host == each["Vendor"]:
            each["Count"] += 1
            return False
    
    return True


def organize(results):
    organized_data = []

    for host, info in results.items():
        if check_ip(info['Vendor'], organized_data):
            organized_data.append({
                # "IP":host,
                "Vendor":info["Vendor"],
                "Count":1
            })
    
    return organized_data

def main():
    """ Main module. """
    echo_result("Scanning your network ...")

    if 'default' in sys.argv:
        # Initialize network scanner.
        net = NetworkScan()

        while True:
            total_hosts = 0

            # Break loop if more than 2 subnets are found empty.
            if net.empty_subnet_counter == 2:
                break

            # Scan the network with 5 scan attempts.
            for i in range(5):
                # Scan the network
                hosts = net.scan()

                # Count total hosts found in the attempt.
                total_hosts += hosts

                # Send status to Electron.
                echo_result("Scanning Subnet: {} | Scan Attempt: {} | Replies Caught: {}".format(
                    net.gateway, (i+1), hosts))

            if total_hosts == 0:
                # Count empty subnet.
                net.count_empty_subnet()
            else:
                # Reset counter if next subnet is not empty.
                net.reset_subnet_counter()

            net.update_gateway()

    elif 'range' in sys.argv:
        # Initialize IP range.
        ip_range = sys.argv[-1].split(",")

        # Initialize network scanner.
        net = NetworkScan(ip_range=ip_range)

        # Get last octet values.
        last_ip_octet = int(net.break_ip(ip_range[-1])[-1])
        current_ip_last_octet = int(net.break_ip(net.ip)[-1])
        total_ip = last_ip_octet - current_ip_last_octet + 1

        # Initialize progress variables.
        progress = 0
        total_progress = 0

        while True:
            # Progress status.
            total_progress = int((progress/(total_ip-1))*100)
            current_ip_last_octet = int(net.break_ip(net.ip)[-1])

            # Break the loop after last scan.
            if current_ip_last_octet == last_ip_octet:
                break

            # Send status to Electron.
            echo_result("Scanning Host: {} | {} of {} devices,{}".format(
                net.ip, progress, total_ip, total_progress))

            # Scan the network.
            net.scan()

            # Update IP address.
            net.update_ip()

            progress += 1

    elif 'particular' in sys.argv:
        ip = sys.argv[-1]

        # Initialize network scanner.
        net = NetworkScan(ip=ip)

        echo_result("Scanning Host '{}' ...".format(ip))
        net.scan()

    # Get vendor names, hostnames and operating system.
    net.vendor()
    net.hostname()
    hosts = net.get_host_lists()

    output = {
        'hosts':hosts,
        'organized':organize(net.all_hosts)
    }

    # Give out results to Electron.
    echo_result(json.dumps(output))


# MAIN
if __name__ == "__main__":
    main()
    sys.exit(0)
