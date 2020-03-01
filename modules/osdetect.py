from math import isclose
from modules.resources import well_known_ports
import scapy.all as scapy
from scapy.layers import http
import socket
import random 

def os_detect(every_ip):
    # LOG FOR REPORT
    log = open('log.txt', 'w')
    separator = '-' * 100
    log.write(separator + '\n')
    log.write('Log of replies from different hosts.\n')
    log.write(separator + '\n')
    separator = '-' * 80

    os_ttl = {
                'Linux (Kernel 2.4 and 2.6)':64,
                'Google Linux':64,
                'FreeBSD': 64,
                'Windows XP':128,
                'Windows Vista, 7 (Server 2008)':128,
                'iOS 12.4 (Cisco Routers)':255,
                'macOS':64
            }

    os_window = {
                'Linux (Kernel 2.4 and 2.6)':5840,
                'Google Linux':5720,
                'FreeBSD': 65535,
                'Windows XP':65535,
                'Windows Vista, 7 (Server 2008)':8192,
                'iOS 12.4 (Cisco Routers)':4128,
                'macOS':65535
            }

    # load = b'abcdefghijklmnopqrstuvwabcdefghi'

    detected = {}

    print('-' * 100)
    print('OS Detection: BETA')
    print('-' * 100)

    count = 0
    for ip in every_ip:
        count += 1
        # Log
        log.write('>>> ' + str(ip)+ ' <<<\n')
        log.write(separator + '\n')

        # Create TCP Packet to analyze
        _ip = scapy.IP(dst=ip)

        for destination_port in well_known_ports():
            source_port = random.randint(10000, 60000)
            # source_port = 80
            tcp_packet = _ip/scapy.TCP(sport=source_port, dport=destination_port, flags="U")

            # Receive response to analyze
            tcp_response = scapy.sr1(tcp_packet, timeout=1, verbose=False)

            # Check the ttl and window size value of TCP reply from every hosts
            for os, ttl in os_ttl.items():
                try:
                    if isclose(tcp_response[scapy.TCP].window, os_window[os], rel_tol=0.5) and isclose(tcp_response[scapy.IP].ttl, ttl, rel_tol=0.5):
                        detected[ip] = os
                        break
                    else: 
                        detected[ip] = 'Unknown'
                        break
                except Exception as e:
                    # print('EXCEPTION', str(e))
                    detected[ip] = '--------'

            # LOG
            try:
                test = tcp_response[scapy.TCP]
                test = tcp_response[scapy.IP]

                try:
                    log.write('port: {} ({}) | window: {} | ttl: {} | dataofs: {}\n'.format(destination_port, socket.getservbyport(destination_port).upper(), tcp_response[scapy.TCP].window, tcp_response[scapy.IP].ttl, tcp_response[scapy.TCP].dataofs))
                except:
                    log.write('port: {} | window: {} | ttl: {} | dataofs: {}\n'.format(destination_port, tcp_response[scapy.TCP].window, tcp_response[scapy.IP].ttl, tcp_response[scapy.TCP].dataofs))
                
                try:
                    log.write('User Agent: {}\n'.format(tcp_response[http.HTTPRequest].User_Agent.decode('utf-8')))
                except:
                    pass 

                if detected[ip] in os_ttl.keys():
                    log.write('OS Detected: {}\n'.format(detected[ip]))
                log.write(separator + '\n')
            except:
                pass

            # Status
            try:
                print('\r Analyzing host {} ({}) | Probing Port: {}, {}'.format(ip, count, destination_port, socket.getservbyport(destination_port).upper()), " " * 35, end='')
            except:
                print('\r Analyzing host {} ({}) | Probing Port: {}'.format(ip, count, destination_port), " " * 35, end='')

            if detected[ip] in os_ttl.keys():
                break

    print('')
    log.close()
    return detected