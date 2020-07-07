import json
import subprocess
import sys
__author__ = "Satshree Shrestha"

import warnings
warnings.filterwarnings("ignore")

def check_dependencies():
    while True:
        try:
            import scapy 
            import netifaces 
            import nmap 
        except ModuleNotFoundError as e:
            print(json.dumps("Installing Python module '{}' ... ".format(e.name)))
            # sys.stdout.flush()
            install(e.name)
        else:
            break

def install(module):
    a=subprocess.check_call(["pip", "install", module])
    return

if __name__ == "__main__":
    try:
        check_dependencies()
        from modules import systeminfo
        from modules.common import echo_result
        ip = systeminfo.get_ip_address()
        gateway = systeminfo.get_default_gateway()
    except:
        print(json.dumps({
            'ip':'Unable to find.',
            'gateway':'Unable to find.'
        }))
        sys.stdout.flush()
    else:
        print(json.dumps({
            'ip':ip,
            'gateway':gateway
        }))
        sys.stdout.flush()