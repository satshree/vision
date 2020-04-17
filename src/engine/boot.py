import json
import subprocess
import sys
__author__ = "Satshree Shrestha"

def check_dependencies():
    try:
        import scapy 
        import netifaces 
        import nmap 
    except ModuleNotFoundError:
        print(json.dumps("INSTALL"))
        sys.stdout.flush()
        subprocess.check_output(["pip", "install", "scapy"])
        subprocess.check_output(["pip", "install", "netifaces"])
        subprocess.check_output(["pip", "install", "python-nmap"])

if __name__ == "__main__":
    try:
        check_dependencies()
        from modules import systeminfo
        from modules.common import echo_result
        ip = systeminfo.get_ip_address()
        gateway = systeminfo.get_default_gateway()
    except:
        echo_result(json.dumps({
            'ip':'Unable to find.',
            'gateway':'Unable to find.'
        }))
    else:
        echo_result(json.dumps({
            'ip':ip,
            'gateway':gateway
        }))