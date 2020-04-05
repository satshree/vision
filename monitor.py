from modules.systeminfo import get_wlan_iface, get_ip_address
from collections import Counter
from scapy.all import sniff as _
from main import echo_result
import json

iface = get_wlan_iface()
counter = Counter()
ip = get_ip_address()
first_octet = ip.split(".")[0]
    
def sniff():
    _(iface=iface, filter="ip", store=False, prn=process)

def process(packet):
    _ip = packet[0][1].src
    _first_octet = _ip.split(".")[0]

    if _first_octet == first_octet and _ip != ip:
        # _proto = packet[0][1].proto

        info = (_ip)#, _proto)
        counter.update([info])

        capture = {
            "IP":info,
            "Count":counter[info]
        }
        echo_result(json.dumps(capture))
    
if __name__ == "__main__":
    try:
        sniff()
    except Exception as e:
        echo_result(json.dumps({"IP":"ERROR,{}".format(str(e))}))