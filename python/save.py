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
    # desktop_dir = os.path.join('/home/satshree', 'Desktop') 
    file_name = os.path.join(desktop_dir, "vision.csv")

    try:
        with open(file_name, "w", encoding='utf-8') as file:
            pen = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            pen.writerow(['S.N', 'IP Address', 'MAC Address', 'Manufacturer', 'Hostname', 'Operating System', 'Open Ports'])

            hosts = json.loads(sys.argv[-1])
            counter = 1
            for host in hosts:
                ports = ""
                if 'Ports' in host:
                    if host['Ports']:
                        for port in host['Ports']:
                            ports += (port + ", ")
                    
                        ports = ports[:-2]
                    else:
                        ports = '----'

                pen.writerow([counter, host['IP'], host['MAC'], host['Vendor'], host['Hostname'], host['OS'], ports])
                counter += 1
                
            pen.writerow([""])
            pen.writerow(["Vision scan saved on {}".format(now)])

        echo_result(1)
    except Exception as e:
        echo_result(2)
    
    sys.exit(0)