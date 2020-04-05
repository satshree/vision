""" Organize Data for Vision. """
__author__ = "Satshree Shrestha"
from main import echo_result
import sys
import json 

organized_data = []

def check_ip(host):
    for each in organized_data:
        if host == each["Vendor"]:
            each["Count"] += 1
            return False
    
    return True

if __name__ == "__main__":
    results = json.loads(sys.argv[-1])

    for host, info in results.items():
        if check_ip(info['Vendor']):
            organized_data.append({
                "IP":host,
                "Vendor":info["Vendor"],
                "Count":1
            })
    
    echo_result(json.dumps(organized_data))
    
    