"""
    Interactive shell mode for Vision.
"""
__author__ = "Satshree Shrestha"

from modules import portscanning, bannergrabbing

def shell(scan_list, manufacturer, hostnames, os_result):
    """ Interactive shell mode to list out other information. """

    print("Type 'hostname <IP address>' to list out its hostname.")
    print("Type 'manufacturer <IP address>' to list out its manufacturer vendor.")
    print("Type 'mac <IP address>' to list out its MAC address.")
    print("Type 'os <IP address>' to list out its Operating System.")
    print("\nAdditional features,")
    print("Type 'banner <IP address>' to perform banner grabbing.")
    print("Type 'port <IP address> <port to scan>' to perform port scanning on one port.")
    print("Type 'port <IP address> <first port of range> <last port of range>' to perform port scanning.")
    print("\nThe <IP address> should be from the ones scanned above!")
    print("Type 'done' to exit shell mode.")
    print("-" * 100)

    while True:
        try:
            interactive = input("Vision >>> ")

            if not interactive:
                pass
            elif interactive == 'done':
                break
            elif interactive.split()[0] == "mac":
                IP = interactive.split()[1]

                try:
                    int(IP.split(".")[0])
                except:
                    raise Exception

                if IP not in scan_list.keys():
                    raise LookupError

                print("MAC address of " + IP + " = " + scan_list[IP])

            elif interactive[0:21] == "hostname manufacturer":
                IP = interactive[22:]

                try:
                    int(IP.split(".")[0])
                except:
                    raise Exception

                if IP not in scan_list.keys():
                    raise LookupError

                print("For " + IP + "\nHostname = " + hostnames[IP] + "\nManufacturer = " + manufacturer[IP])

            elif interactive.split()[0] == "manufacturer":
                IP = interactive.split()[1]

                try:
                    int(IP.split(".")[0])
                except:
                    raise Exception

                if IP not in manufacturer.keys():
                    raise LookupError

                print("Manufacturer of " + IP + " = " + manufacturer[IP])
            elif interactive.split()[0] == "hostname":
                IP = interactive.split()[1]

                try:
                    int(IP.split(".")[0])
                except:
                    raise Exception

                if IP not in hostnames.keys():
                    raise LookupError

                print("Hostname for " + IP + " = " + hostnames[IP])
            elif interactive.split()[0] == "os":
                IP = interactive.split()[1]

                try:
                    int(IP.split(".")[0])
                except:
                    raise Exception

                if IP not in os_result.keys():
                    raise LookupError

                print("Operating System of " + IP + " = " + os_result[IP])
            elif interactive.split()[0] == "banner":
                IP = interactive.split()[1]

                try:
                    int(IP.split(".")[0])
                except:
                    raise Exception

                if IP not in hostnames.keys():
                    raise LookupError

                print("Banner Grabbing", IP)
                banner_grabbing(IP)
            elif interactive.split()[0] == "port":
                IP = interactive.split()[1]

                try:
                    int(IP.split(".")[0])
                except:
                    raise Exception

                if IP not in hostnames.keys():
                    raise LookupError

                port = interactive.split()[2]

                try:
                    # If user provides range
                    port_range = interactive.split()[3]
                    portscanning.port_scanner(IP, int(port), int(port_range))
                except IndexError:
                    # If user does not provide range
                    portscanning.port_scanner(IP, port, 0)
            else:
                raise Exception
        except KeyboardInterrupt:
            print("'KeyboardInterrupt' detected.")
        except LookupError:
            print("No such device found during scan.")
        except Exception:
            print("Make sure to type commands in correct format.")
            print("Vision supports 'port', 'banner', 'hostname', 'manufacturer' and 'mac' until this version")
            continue

################################################################################
def banner_grabbing(ip):
    """ Perform banner grabbing. """

    # Scan for open ports.
    open_ports = bannergrabbing.scan_port(ip)

    # Perform banner grabbing
    bannergrabbing.banner(ip, open_ports)
