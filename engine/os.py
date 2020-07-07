import sys
from nmap import PortScanner
from modules.common import echo_result

__author__ = "Satshree Shrestha"

if __name__ == "__main__":
    _nmap = PortScanner()
    ip = sys.argv[-1]
    try:
        _nmap.scan(ip, arguments="-O")
        os = _nmap[ip]["osmatch"][0]["name"]
    except:
        os = 'Unable to identify'
    finally:
        echo_result(os)