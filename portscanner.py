"""
    A simple port scanning tool used for various network security purposes.
    Date created = 29 - June - 2019
    First stable version = 1 - July - 2019
    Latest stable version = 7 - October - 2019
    reference and brief information about 'socket' = https://www.pythonforbeginners.com/code-snippets-source-code/port-scanner-in-python/
    documentation = https://docs.python.org/2/library/socket.html
"""
__author__ = 'Satshree Shrestha'

################################################################################
# Import dependencies/libraries
import socket
from datetime import datetime

try:
    import database
except:
    print("Make sure 'database.py' is in same folder.")
    to_continue = input("\n\nPress Enter to exit.")
    exit(0)

################################################################################


def scan_port(remote_server_ip, port, time):
    """ Scans all the ports of given IP address. """

    try:
        # AF_NET = Socket Family (here, IPv4) ; SOCK_STREAM = Socket type TCP connection ; for UDP, use SOCK_DGRAM.
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        if time == "1":
            # Define time to listen to a port.
            sock.settimeout(0.825)

        '''
            connect_ex = Like connect(address), but return an error indicator instead of raising an exception for errors
            returned by the C-level connect() call (other problems, such as “host not found,” can still raise exceptions).
            The error indicator is 0 if the operation succeeded, otherwise the value of the errno variable.
            This is useful to support, for example, asynchronous connects. [From Documentation]
        '''

        result = sock.connect_ex((remote_server_ip, port))

        if result == 0:
            ports = database.get_port().keys()
            desc = database.get_port()
            if port in ports:
                open_ports = "Port {} Open" .format(port) + " : " + "'" + desc[port] + "'"
            else:
                try:
                    open_ports = "Port {} Open" .format(port) + " : " + "'" + socket.getservbyport(port).upper() + "'"
                except:
                    open_ports = "Port {} Open" .format(port)
        else:
            open_ports = "Port Closed"
        sock.close()

    except KeyboardInterrupt:
        open_ports = "1ERROR: Interrupted!"
    except socket.gaierror:
        open_ports = "1ERROR: Hostname could not be resolved."
    except socket.error:
        open_ports = "1ERROR: Couldn't connect to server"

    return open_ports

################################################################################
def choice_method():
    """ Select scan method. """

    loop = True
    while loop:
        try:
            print("-" * 100)
            print("How would you like to scan?")
            print("1.   Scan by IP address (example, 192.168.1.0)")
            print("2.   Scan by domain name (example, www.example.com)\n")
            choice = input("Enter your choice: ")
            if choice == "1" or choice == "2":
                loop = False
            else:
                print("-" * 100)
                print("Enter either 1 or 2")
        except:
            print("-" * 100)
            print("Try again.")

    return choice

################################################################################
def choice_type():
    """ Select scan type. """

    loop = True
    while loop:
        try:
            print("-" * 100)
            print("-" * 100)
            print("What would you like to scan?")
            print("1.   Scan individual port (example, 80)")
            print("2.   Scan port range (example, 20 - 443)\n")
            method = input("Enter your choice: ")
            if method == "1" or method == "2":
                loop = False
            else:
                print("-" * 100)
                print("Enter either 1 or 2")
        except:
            print("-" * 100)
            print("Try again.")

    return method

################################################################################
def choice_time():
    """ Select scan speed. """

    loop = True
    while loop:
        try:
            print("-" * 100)
            print("-" * 100)
            print("How fast would you like your scan to be?")
            print("1.   Fast scan")
            print("2.   Slow scan (listens for a port completely.)\n")
            time = input("Enter your choice: ")
            if time == "1" or time == "2":
                loop = False
            else:
                print("-" * 100)
                print("Enter either 1 or 2")
        except:
            print("-" * 100)
            print("Try again.")

    return time

################################################################################
def select_target(choice):
    """ Select target to scan. """

    remote_server = ""
    loop = True
    while loop:
        try:
            if choice == "1":
                print("-" * 100)
                print("-" * 100)
                remote_server_ip = input("Enter an IP address of remote host to scan: ")
                loop = False
            else:
                print("-" * 100)
                print("-" * 100)
                remote_server = input("Enter a domain name of remote host to scan: ")
                remote_server_ip = socket.gethostbyname(remote_server)
                loop = False
        except:
                print("-" * 100)
                print("Cannot resolve the host name. Retry.")

    return [remote_server_ip, remote_server]

################################################################################
def get_port():
    """ Get port from user. """

    loop = True
    while loop:
        try:
            print("-" * 100)
            port = int(input("Enter the port you want to scan: "))

            loop = False
        except:
            print("-" * 100)
            print("Retry")

    return port

################################################################################
def get_port_range():
    """ Get port range from user. """

    loop = True
    while loop:
        try:
            print("-" * 100)
            rangesstart = int(input("Enter the first port of the range you want to scan: "))
            rangesend = int(input("Enter the last port of the range you want to scan: "))

            if rangesstart >= rangesend:
                raise EOFError

            loop = False
        except EOFError:
            print("-" * 100)
            print("Please enter proper range.")
        except:
            print("-" * 100)
            print("Retry")

    return [rangesstart, rangesend]

################################################################################
def scan_individual(remote_server_ip, time):
    """ Scan given port. """

    try:
        port = get_port()

        print("-" * 100)
        print("\n\n", "*" * 10, "Please be patient while scanning.", "*" * 10, "\n\n")

        print("-" * 100)
        if remote_server_ip[1] == "":
            print("Scanning port", port, "in remote host", remote_server_ip[0], "...\n")
        else:
            print("Scanning port", port, "in remote host", "'" + remote_server_ip[1] + "'", "(" + remote_server_ip[0] + ")", "...\n")

        if time == "1":
            print("Scan type: Fast Scan.\n")
        else:
            print("Scan type: Slow Scan.\n")

        # To calculate time.
        t1 = datetime.now()

        # Scan.
        scanned_port = scan_port(remote_server_ip[0], port, time)

        # To calculate time.
        t2 = datetime.now()

        time_taken = str(t2 - t1).split(":")
        total_hour = time_taken[0]
        total_minute = time_taken[1]
        total_second = round(float(time_taken[2]))


        # Check for errors.
        if scanned_port[0] == 1:
            raise Exception
        else:
            print("")
            # Print results.
            print("-" * 100)
            print(scanned_port)
            print("-" * 100)
            print("Time taken for scan:", total_hour, "hours", total_minute, "minutes", total_second, "seconds")

    except Exception:
        print("")
        print("-" * 100)
        print(scanned_port[1:])

################################################################################
def scan_range(remote_server_ip, time):
    """ Scan specified port range. """

    result = []

    progress = 1

    try:
        ranges = get_port_range()
        start = ranges[0]
        end = ranges[1] + 1

        print("-" * 100)
        print("\n\n", "*" * 10, "This will take very long time. Please be patient while scanning.", "*" * 10, "\n\n")

        print("-" * 100)
        if remote_server_ip[1] != "":
            print("Scanning remote host", "'" + remote_server_ip[1] + "'", "(" + remote_server_ip[0] + ")", "...\n")
        else:
            print("Scanning remote host", remote_server_ip[0], "...\n")

        if time == "1":
            print("Scan type: Fast Scan.")
        else:
            print("Scan type: Slow Scan.")

        print("Scan port range:", ranges[0], "-", ranges[1])

        print("")

        # To calculate time.
        t1 = datetime.now()

        # Scan.
        print("-" * 100)
        for port in range(start, end):
            progress_percent = int(((progress/(end - start)) * 100))

            print("\r Progress:", progress_percent, "%", end="")
            print(" | Scanning Port:", port, end="")

            scanned_port = scan_port(remote_server_ip[0], port, time)

            # Check for errors.
            if scanned_port[0] == 1:
                raise EOFError
            else:
                if scanned_port != "Port Closed":
                    result.append(scanned_port)

            progress += 1

        # To calculate time.
        t2 = datetime.now()

        time_taken = str(t2 - t1).split(":")
        total_hour = time_taken[0]
        total_minute = time_taken[1]
        total_second = round(float(time_taken[2]))

        print("")
        # Print results.
        if len(result) == 0:
            print("-" * 100)
            print("NO OPEN PORTS!")
        else:
            print("-" * 100)
            if remote_server_ip[1] != "":
                print("The following are the open ports in network", "'" + remote_server_ip[1] + "'", "(" + remote_server_ip[0] + ")")
            else:
                print("The following are the open ports in network", remote_server_ip[0])

            print("-" * 100)
            for open_ports in result:
                print(open_ports)

        print("-" * 100)
        print("Time taken for scan:", total_hour, "hours", total_minute, "minutes", total_second, "seconds")

    except EOFError:
        print("")
        print("-" * 100)
        print(scanned_port[1:])
    except KeyboardInterrupt:
        print("")
        print("-" * 100)
        print("Interrupted...")

################################################################################
if __name__ == "__main__":
    err_count = 0
    LOOP = True
    while LOOP:
        try:
            # Banner
            print("-" * 100)
            print("-" * 45, " VISION ", '-' * 45)
            print("-" * 100)
            print("-" * 42, " PORT SCANNER ", '-' * 42)
            print("-" * 100)
            print("\n This will scan the open ports in the network that you select.\n")

            # Select scan method. IP or Host
            choice = choice_method()

            # Select scan type. Range or Individual
            method = choice_type()

            # Select scan time. Fast or Slow
            time = choice_time()

            # Select target.
            remote_server_ip = select_target(choice)

            # Scan.
            if method == "1":
                scan_individual(remote_server_ip, time)
            else:
                scan_range(remote_server_ip, time)

            print("-" * 100)
            print("Thank you for using this program.\nDesigned and made by Satshree Shrestha.")

            # Continue
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

        except Exception as e:
            print("")
            print("-" * 100)
            print("")
            print("#" * 10, "Error detected!", "#" * 10)
            print("\nError Details:", str(e))
            print("\nPlease submit this error to 'satshree.shrestha@yahoo.com' to debug.\n"
                  "This will help in improvement of this program. :)\n")
            print("-" * 100)
            print("Latest stable version created: 7 October 2019")
            print("-" * 100)
            print("Thank you for using this program.\nDesigned and made by Satshree Shrestha.")
            print("-" * 100)
            to_continue = input("\n\nPress Enter to continue.")
            exit(0)
            '''
        except KeyboardInterrupt:
            err_count += 1
            if err_count == 5:
                print("")
                print("-" * 100)
                print("#" * 10, "Too Many Errors Detected. EXITING APP!", "#" * 10, "\n\n")
                exit(1)
            else:
                print("")
                print("-" * 100)
                print("#" * 10, "Keyboard Interrupt detected!", "#" * 10)
                print("Process unsuccessful!\n\nRESTARTING!\n\n\n\n")
        except EOFError:
            err_count += 1
            if err_count == 5:
                print("")
                print("-" * 100)
                print("#" * 10, "Too Many Errors Detected. EXITING APP!", "#" * 10, "\n\n")
                exit(1)
            else:
                print("")
                print("-" * 100)
                print("#" * 10, "Error detected!", "#" * 10)
                print("Process unsuccessful!\n\nRESTARTING!\n\n\n\n")
        except:
            err_count += 1
            if err_count == 5:
                print("")
                print("-" * 100)
                print("#" * 10, "Too Many Errors Detected. EXITING APP!", "#" * 10, "\n\n")
                exit(1)
            else:
                print("")
                print("-" * 100)
                print("#" * 10, "Unexpected error detected!", "#" * 10, "\n\nRESTARTING!\n\n\n\n")
            '''
