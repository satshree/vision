import csv
import sys
import json
import os
from modules.common import echo_result
from datetime import datetime

__author__ = "Satshree Shrestha"

if __name__ == "__main__":
    now = datetime.now().strftime("%Y-%B-%d %I:%M:%S %p %A")
    desktop_dir = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop') 
    file_name = os.path.join(desktop_dir, "vision.csv")

    try:
        with open(file_name, "w", encoding='utf-8') as file:
            pen = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            pen.writerow(['S.N', 'IP Address', 'MAC Address', 'Manufacturer', 'Hostname', 'Operating System', 'Open Ports'])

            hosts = json.loads(sys.argv[-1])
            counter = 1
            for host, info in hosts.items():
                ports = '----'
                if 'Ports' in info:
                    if info['Ports']:
                        for port in info['Ports']:
                            ports += (port + ", ")
                    
                        ports = ports[:-2]
                    else:
                        ports = '----'

                pen.writerow([counter, host, info['MAC'], info['Vendor'], info['Hostname'], info['OS'], ports])
                counter += 1
                
            pen.writerow([""])
            pen.writerow(["Vision scan saved on {}".format(now)])

        echo_result(json.dumps(True))
    except Exception as e:
        echo_result(json.dumps(False))