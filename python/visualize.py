import csv
import sys
import json
from modules.common import echo_result

__author__ = "Satshree Shrestha"


def check_ip(host, organized_data):
    for each in organized_data:
        if host == each["Vendor"]:
            each["Count"] += 1
            return False
    
    return True
            
def organize(results):
    organized_data = []

    for host, info in results.items():
        if check_ip(info['Vendor'], organized_data):
            organized_data.append({
                # "IP":host,
                "Vendor":info["Vendor"],
                "Count":1
            })
    
    return organized_data

def convert_to_port(ports):
    port_list = ports.split(",")

    for index, port in enumerate(port_list):
        if "----" in port:
            port_list[index] = port[4:]
    
    return port_list

def read_from_file(path):
    hosts = {}
    host_list = []
    meta = None

    with open(path, 'r') as file:
        csv_rows = csv.reader(file, delimiter=",")
        for index, row in enumerate(csv_rows):
            if index == 0:
                if row[0] == "S.N":
                    continue
                else:
                    raise Exception

            if len(row) == 7:
                ip = row[1]
                hosts[ip] = {
                    'MAC':row[2],
                    'Vendor':row[3],
                    'Hostname':row[4],
                    'OS':row[5],
                    'Ports':convert_to_port(row[6]),
                }

                host = hosts[ip]
                host.update({'IP':ip})
                host_list.append(
                    host
                )
            
            if len(row) > 0 and "Vision scan saved" in row[0]:
                meta = row[0]

    return (hosts, host_list, meta)

if __name__ == "__main__":
    path = sys.argv[-1]

    try:
        host, host_list, meta = read_from_file(path)
    except:
        echo_result("Unable to import data.")
    else:
        output = {
            'hosts':host_list,
            'organized':organize(host),
            'meta':meta
        }

        echo_result(json.dumps(output))
    
    sys.exit(0)