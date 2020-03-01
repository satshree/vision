""" 
    Port scanning feature for Vision
"""
__author__ = "Satshree Shrestha"

from modules import resources

################################################################################
def port_scanner(ip, ports, port_range):
    """ Perform port scanning. """

    known_ports = resources.get_port()
    prompt_result = []

    print('-' * 60)
    if port_range == 0:
        # If user does not provide range
        try:
            # Create a TCP socket for connection
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            # Set connection time out
            sock.settimeout(4)

            # Connect to given port to check for open port
            sock.connect((ip, int(ports)))

            # If connection is successful, no exception is raised
            if int(ports) in known_ports.keys():
                print('Port {} open. Service = {}'.format(ports, known_ports[int(ports)]))
            else:
                try:
                    print('Port {} open. Service = {}'.format(ports, socket.getservbyport(ports).upper()))
                except:
                    print('Port {} open. Service unknown'.format(ports))
        except:
            # If exception is raised, the given port is closed
            if ports in known_ports.keys():
                print('Port {} closed. Service = {}'.format(ports, known_ports[ports]))
            else:
                try:
                    print('Port {} closed. Service = {}'.format(ports, socket.getservbyport(ports).upper()))
                except:
                    print('Port {} closed. Service unknown'.format(ports))
    else:
        # If user provides range
        port_range += 1
        for port_to_scan in range(ports, port_range):
            print('\rScanning port {}'.format(port_to_scan), end='')

            try:
                # Create a TCP Socket for connectoin
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

                # Set connection time out
                sock.settimeout(4)

                # Connect to given port to check for open port
                sock.connect((ip, port_to_scan))

                # If connection is successful, no exception is raised
                if ports in known_ports.keys():
                    prompt_result.append('Port {} open. Service = {}'.format(ports, known_ports[ports]))
                else:
                    try:
                        prompt_result.append('Port {} open. Service = {}'.format(ports, socket.getservbyport(ports).upper()))
                    except:
                        prompt_result.append('Port {} open. Service unknown'.format(ports))
            except:
                # If exception is raised, the given port is closed
                pass
        
        print('')
        # Print out list of open ports
        if not prompt_result:
            print('No ports are open in given range.')
        else:
            for results in prompt_result:
                print(results)
    
    print('-' * 60)