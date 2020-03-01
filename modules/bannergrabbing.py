""" Banner Grabbing. """
__author__ = 'Satshree Shrestha'
import socket
from modules.resources import well_known_ports

def scan_port(host):
    """ Scan for well known open ports. """

    # Well known ports
    port = well_known_ports()
    open_ports = []
    
    print('-' * 60)
    print('Scanning for well known open ports.')

    # Perform port scanning
    for i in port:
        print('\rPort:', i, end='')
        try:
            # Start TCP Connection
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            # Set timeout 
            s.settimeout(0.825)

            # Connect to given host at given port
            s.connect((host, i))

            # If no exception raised, connection is successful and port is open
            open_ports.append(i)
        except KeyboardInterrupt:
            print('')
            print('-' * 60)
            print('KeyboardInterrupt detected...')
            print('No further ports will be scanned.')
            print('-' * 60)
            print('')
            break
        except:
            pass

    print('')
    print('-' * 60)
    print('{} open ports found.'.format(len(open_ports)), open_ports)

    return open_ports
    
def banner(host, ports):
    """ Perform banner grabbing. """

    if len(ports) == 0:
        print('-' * 60)
        print('Sadly, no well known ports are open on the host for banner grabbing')
        print('-' * 60)
    else:
        for i in ports:
            print('-' * 60)

            try:
                print('Grabbing banner for port {}.'.format(i), socket.getservbyport(i).upper())
            except:
                print('Grabbing banner for port {}.'.format(i))

            try:
                # Start TCP connection
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

                # Set set time out
                s.settimeout(5)

                # Connect to given host at given port
                s.connect((host, i))

                # Payload for banner grabbing
                data0 = "GET / HTTP/1.1\r\nhost:"
                # data1 = str(host)
                data1 = str(socket.gethostbyname(socket.gethostname()))
                data2 = "\r\nConnection: close\r\n\r\n"
                payload = data0 + data1 + data2 

                # Send payload to host
                s.send(payload.encode())

                # Receive banner from host
                received = s.recv(1024).decode('utf-8')

                print('-' * 60)
                # Make banner readable
                print(received.strip())
            except:
                print('>> Cannot grab banner for port {}.'.format(i), socket.getservbyport(i).upper())
        print('-' * 60)


