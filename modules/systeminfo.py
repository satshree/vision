""" 
    System related informations for Vision.
    Date Created = 1 December 2019
""" 
__author__ = "Satshree Shrestha"

# Libraries
import socket
import subprocess
import sys
from netifaces import gateways, AF_INET

################################################################################
def get_ip_address():
    """ This will retrieve the IP address of the system. """

    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

        sock.connect(('10.255.255.255', 1))
        ip_address = sock.getsockname()[0]
    except:
        try:
            # Get hostname of the system
            system_hostname = socket.gethostname()

            # Get IP Address of the system
            ip_address = socket.gethostbyname(system_hostname)
        except:
            ip_address = '...... seems like Vision is unable to retrieve your IP Address.'

    # if sys.platform == 'win32':
    #     # FOR WINDOWS

    #     # Runs 'ipconfig' on command prompt, decode output and split every word into list.
    #     command = subprocess.check_output(["ipconfig"]).decode('utf-8').split()

    #     # Run for loop from behind to get index position of WAN interface "Subnet" Mask.
    #     for i in range((len(command)-1), 0, -1):
    #         if command[i] == "Subnet":
    #             index=i
    #             break

    #     # WAN interface IP address is placed right before Subnet Mask.
    #     ip_address = command[index-1]
    # elif sys.platform == 'darwin':
    #     # FOR macOS

    #     try:
    #         sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    #         sock.connect(('10.255.255.255', 1))
    #         ip_address = sock.getsockname()[0]
    #     except:
    #         try:
    #             # Get hostname of the system
    #             system_hostname = socket.gethostname()

    #             # Get IP Address of the system
    #             ip_address = socket.gethostbyname(system_hostname)
    #         except:
    #             ip_address = '...... seems like Vision is unable to retrieve your IP Address.'

    # else:
    #     print('\nCannot identify your system. Vision works on Windows and macOS.\n')
    #     return OSError

    return ip_address

################################################################################
def get_default_gateway():
    """ This will retrieve the default gateway of the system. """

    # if sys.platform == 'win32':
    #     # FOR WINDOWS

    #     # Run COMMAND PROMPT command, decode it and split it into list
    #     cmd = subprocess.check_output(['ipconfig']).decode('utf-8').split()

    #     # The last value will be gateway
    #     gateway = cmd.pop()
    # elif sys.platform == 'darwin':
    #     # FOR macOS

    #     # Run terminal command to get default gateway
    #     terminal_command = subprocess.check_output(['route', '-n', 'get', 'default']).decode('utf-8').split()

    #     # Get index number for gateway
    #     index = terminal_command.index('gateway:')

    #     # Default gateway
    #     gateway = terminal_command[index + 1]
    # else:
    #     print('\nCannot identify your system. Vision works on Windows and macOS.\n')
    #     return OSError

    return gateways()['default'][AF_INET][0]

def get_wlan_iface():
    return gateways()['default'][AF_INET][-1]