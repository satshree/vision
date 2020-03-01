"""
    A simple network and port scanning tool used for various network security purposes.
    Date created = 16 - June - 2019
    First stable version = 27 - June - 2019
    Version for macOS created on 29 - September - 2019
    Latest stable version = 11 - October - 2019
    Documentation of scapy for research done = https://scapy.readthedocs.io/en/latest/usage.html
"""
__author__ = 'Satshree Shrestha'

################################################################################
# Import dependencies/libraries
import sys
import time
try:
    import scapy.all as scapy
except:
    print("Make sure 'scapy' is installed.")

    if sys.platform == 'win32':
        print("Try running 'pip install scapy'")
    else:
        print("Try running 'pip install python-scapy")
    to_continue = input("\n\nPress Enter to exit.")
    exit(0)

import socket
from banners import upperbanner, midbanner, lowerbanner

try:
    from modules import resources, bannergrabbing, systeminfo, hostinfo, portscanning, shell, osdetect
except Exception as e:
    print(e)
    print("Make sure following files are in folder named 'modules'.")
    print("\n1. bannergrabbing.py")
    print("2. portscanning.py")
    print("3. osdetect.py")
    print("4. shell.py")
    print("5. resources.py")
    print("6. database.txt")
    print("7. hostinfo.py")
    print("8. systeminfo.py")
    to_continue = input("\n\nPress Enter to exit.")
    exit(0)

################################################################################
def network_scan(ip):
    """ This is where the scanning happens. """

    try:
        # Create ARP packet targeted to 'ip' (Gateway IP Address).
        arp = scapy.ARP(pdst=ip)

        # Create a broadcast ethernet frame with broadcast MAC address.
        broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")

        # Stack ARP packet above broadcast frame.
        arp_broadcast = broadcast/arp

        '''
             'srp' method sends packets configured as 'arp_broadcast', receives answered packets (Online hosts) and unanswered (Probably offline or non existing hosts).
             'srp' method works on Layer 2, 'sr' method will do same in Layer 3.
             This method returns 2 lists. Only index[0] i.e. answered packets is captured.
             This list has index[0] = packets, index[1] = answer.
             timeout=2 or else it won't stop broadcasting. verbose=False to not print out the transmission.
        '''
        answered = scapy.srp(arp_broadcast, timeout=2, verbose=False)[0]

        '''
            Here, the ARP packet is sent to gateway in Layer 3.
            After reaching Layer 2, the packet is broadcasted as it has broadcast frame.
            Hence, all the online devices will answer to this ARP request which will be shown to the user.
            This is how the network scanning works.
        '''

        client = []
        ip_add = []
        mac_add = []

        for element in answered:
            # 'psrc' refers to IP address.
            ip_add.append(element[1].psrc)

            # 'hwsrc' refers to MAC address.
            mac_add.append(element[1].hwsrc.upper())

        client.append(ip_add)
        client.append(mac_add)

        return client
    except Exception as e:
        print("")
        print("-" * 100)
        print("")
        print("#" * 10, "Error detected!", "#" * 10)
        print("\nError Details:", str(e))
        print("\nPlease submit this error to 'satshree.shrestha@yahoo.com' to debug.\n"
              "This will help in improvement of this program. :)\n")
        print("-" * 100)
        print("Thank you for using this program.\nDesigned and made by Satshree Shrestha.")
        print("-" * 100)
        input("\n\nPress Enter to continue.")
        exit(0)

################################################################################
def scan_network(ip):
    """ This is where the scanning happens (if called from other module). """

    result = []

    try:
        for i in range(1,11):
            result[i] = network_scan(systeminfo.get_default_gateway())

        retrieved = filter(result, 10)

        return retrieved
    except Exception as e:
        print("")
        print("-" * 100)
        print("")
        print("#" * 10, "Error detected!", "#" * 10)
        print("\nError Details:", str(e))
        print("\nPlease submit this error to 'satshree.shrestha@yahoo.com' to debug.\n"
              "This will help in improvement of this program. :)\n")
        print("-" * 100)
        print("Thank you for using this program.\nDesigned and made by Satshree Shrestha.")
        print("-" * 100)
        to_continue = input("\n\nPress Enter to continue.")
        exit(0)

################################################################################
def filter(result, total_scan):
    """
        -    Here, the scanning is done 5 times and each time, different number of devices is shown.
             This is why scan is done 5 times as not all devices are shown in 1 or 2 scans.
             In 5 scans carried out, some devices can be seen in 3 but not in 1 and 2.
             Also, same device can be seen in all the scans (e.g, gateway).
             So, the following block of codes will filter out the duplicate devices found in 5 scans.

        -    'hold_scan' is a 2D list that holds information of each scans in respective iteration.
             **The index [0] will hold list of IP addresses and index [1] will hold list of their respective MAC address.**
             'collection_of_ip_mac' is the huge collection (dictionary) of all IP addresses and MAC addresses from the 5 scans.
             The main concept is, when the values are added to the dictionary, if the value exists, it gets replaced, if not, it is added.
             Hence, the key is the IP address and its value is the MAC address and their value will never be misplaced as it is maintained in the scan list variables.
             This is how the redundant devices are removed.
    """

    collection_of_ip_mac = {}

    for j in range(total_scan):
        hold_scan = result[j]
        for i in range(len(hold_scan[0])):
            collection_of_ip_mac[hold_scan[0][i]] = hold_scan[1][i]

    return collection_of_ip_mac

################################################################################
def break_ip(IP):
    """ This will break the IP into its 4 octets. """

    octets = IP.split(".")

    octet1 = octets[0]
    octet2 = octets[1]
    octet3 = octets[2]
    octet4 = octets[3]

    broken_ip = [octet1, octet2, octet3, octet4]

    return broken_ip

################################################################################
def print_hostnames(hostnames, os_result):
    """ This will print host names. """

    print("IP\t\t| Host name \t\t | Operating System")
    print("-" * 100)

    for IP, host in hostnames.items():
        if len(host) > 13:
            print(IP + "\t| " + host + "\t | " + os_result[IP])
        else:    
            print(IP + "\t| " + host + "\t\t | " + os_result[IP])

    print("-" * 100)
    print("'----' means the program was unable to identify hostname.")
    print("[*] Hostname won't be resolved if your DNS Resolver is not properly configured.")


################################################################################
def print_result(scan_list, manufacturer):
    """ Print out the result. """

    print("IP\t\t| MAC \t\t\t | \tDevice Manufacturer")
    print("-" * 100)
    for IP, MAC in scan_list.items():
        print(IP + "\t| " + MAC + "\t | " + manufacturer[IP])

################################################################################
if __name__ == "__main__":
    start = time.time()

    LOOP = True
    err_count = 0
    while LOOP:
        try:
            # Variables
            result = {}
            final_result = []
            filtered = {}
            found_empty_subnet = 0
            scan = True

            # Banner
            upperbanner()

            # Network Scanning
            gateway = systeminfo.get_default_gateway()

            gateway_octet = break_ip(gateway)

            increment = 0
            # 'while loop' to scan until the last empty subnet
            while scan:
                # To increase the subnet after every scan
                subnets = int(gateway_octet[2]) + increment
                network_to_scan = gateway_octet[0] + "." + gateway_octet[1] + "." + str(subnets) + ".0/24"

                total_scan = 5
                print("-" * 100)
                for scan_attempt in range(total_scan + 1):
                    print("\r Scanning subnet:", network_to_scan, "| Scan Attempt:", scan_attempt, end="")
                    result[scan_attempt] = network_scan(network_to_scan)

                # Value that increases subnet value
                increment += 1

                # Filter out redundant DEVICES
                filtered_ip_mac = filter(result, total_scan)

                # Check for the empty subnet
                if len(filtered_ip_mac.keys()) == 0:
                    print(" | No devices found.")

                    # Increase the count of empty subnet
                    found_empty_subnet += 1
                else:
                    print(" | Total number of devices found on this subnet:", len(filtered_ip_mac.keys()))

                    # Reset the value because the subnet next to empty subnet is not empty
                    found_empty_subnet = 0

                # Because two subnet cannot be empty serially.
                if found_empty_subnet == 2:
                    if increment == 3:
                        subnet_value = "only"
                    else:
                        subnet_value = "last"

                    print("-" * 100)
                    print(gateway_octet[0] + "." + gateway_octet[1] + "." + str(int(subnets) - 2) +
                          ".0/24 is the %s subnet." % subnet_value)
                    break

                final_result.append(filtered_ip_mac)

            # Compile all the scanned result into 'filtered'
            for results in final_result:
                for IP, MAC in results.items():
                    filtered[IP] = MAC

            # Identify vendor
            manufacturer = hostinfo.identify_vendor(filtered)

            # Total number of devices
            print("-" * 100)
            print("The total number of devices found = ", len(filtered.keys()))

            # Identify hostname
            print("-" * 100)
            print("Identifying host names...")

            count_host = 1
            hostnames = {}

            print("-" * 100)
            for IP in filtered.keys():
                print("\r Progress:", int((count_host / len(filtered.keys())) * 100), "%", "| Identifying host:",
                      count_host, end="")
                hostnames[IP] = hostinfo.identify_hostname(IP)
                count_host += 1
            print("")

            # OS Detection
            os_result = osdetect.os_detect(filtered.keys())

            # Print out results
            print("-" * 100)
            print("Here are the list of devices found online in your network.")

            print("-" * 100)
            print_result(filtered, manufacturer)

            print("-" * 100)
            print_hostnames(hostnames, os_result)

            # Banner
            midbanner()

            # Time status
            end = time.time()
            total_time = end - start

            print('-' * 100)
            print('Operation completed at about {:.2f} seconds. | Approximately {} minutes'.format(total_time, int(total_time/60)))

            # Shell mode
            print("-" * 100)
            print("Entering interactive shell mode.")
            print("-" * 100)

            shell.shell(filtered, manufacturer, hostnames, os_result)

           # Banner
            lowerbanner()

            SUB_LOOP = True
            while SUB_LOOP:
                try:
                    print("-" * 100)
                    CONTINUE = input("Do you want to re-scan?[Yes/No]: ")
                    if CONTINUE.upper() == "YES" or CONTINUE.upper() == "Y":
                        SUB_LOOP = False
                        print("\n\nRESTARTING!\n\n")
                    elif CONTINUE.upper() == "NO" or CONTINUE.upper() == "N":
                        print("\n\n")
                        SUB_LOOP = False
                        LOOP = False
                    else:
                        print("-" * 100)
                        print("Retry")
                except:
                    print("")
                    print("-" * 100)
                    print("Retry")

        except LookupError:
            print("\n Unable to retrieve your gateway address!")
            print("\n Make sure your WiFi is turned ON.")
            print("-" * 100)

            print("")
            to_continue = input("\n Press enter to restart.")

            print("\n\n\n\n\n\n")

        except Exception as e:
            print("")
            print("-" * 100)
            print("")
            print("#" * 10, "Error detected!", "#" * 10)
            print("\nError Details:", str(e))
            print("\nPlease submit this error to 'satshree.shrestha@yahoo.com' to debug.\n",
                  "This will help in improvement of this program. :)\n")
            print("-" * 100)
            print("Thank you for using this program.\nDesigned and made by Satshree Shrestha.")
            print("-" * 100)
            to_continue = input("\n\nPress Enter to continue.")
            exit(0)
