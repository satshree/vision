""" 
    System related informations for Vision.
    Date Created = 1 December 2019
""" 
__author__ = "Satshree Shrestha"

# Libraries
from netifaces import gateways, AF_INET, ifaddresses

################################################################################
def get_ip_address():
    """ This will retrieve the IP address of the system. """
    try:
        iface = get_wlan_iface()
        return ifaddresses(iface)[AF_INET][0]["addr"]
    except:
        return "0.0.0.0"

################################################################################
def get_default_gateway():
    """ This will retrieve the default gateway of the system. """
    try:
        return gateways()['default'][AF_INET][0]
    except:
        return "0.0.0.0"

def get_wlan_iface():
    try:
        return gateways()['default'][AF_INET][-1]
    except:
        return ""