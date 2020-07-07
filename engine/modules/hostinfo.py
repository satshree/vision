"""
    Retrieve information from discovered host for Vision. 
"""
__author__ = "Satshree Shrestha"

# Libraries
import socket
from modules import resources

################################################################################
def identify_vendor(result):
    """ This will identify vendor from MAC address. """

    # Retrieve all the MAC address from 'database.txt'.
    OUI = resources.get_OUI()
    identified = {}

    for IP, unidentified in result.items():
        unidentified_sliced = unidentified[:8]
        for MAC, Vendor in OUI.items():
            if unidentified_sliced == MAC:
                identified[IP] = Vendor

    for IP in result.keys():
        if IP not in identified.keys():
            identified[IP] = "--- unable to identify ---"

    return identified

################################################################################
def identify_hostname(IP):
    """ This will identify hostname. """

    try:
        try:
            hostname = socket.gethostbyaddr(IP)[0]
        except:
            hostname = "----"

        return hostname
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