import json
from modules import systeminfo
from modules.common import echo_result

__author__ = "Satshree Shrestha"

if __name__ == "__main__":
    try:
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