"""
    Banners for Vision
"""
__author__ = "Satshree Shrestha"

from modules import systeminfo

def upperbanner():
    print("-" * 100)
    print("-" * 45, " VISION ", '-' * 45)
    print("-" * 100)
    print("-" * 40, " NETWORK  SCANNER ", '-' * 40)
    print("-" * 100)

    # The minimum length of an IP address string would be 8 => 0.0.0.0
    if len(systeminfo.get_default_gateway()) < 8:
        raise LookupError

    print("\n This will scan and list out the devices in your network!\n\n")
    print(" Your IP address is", systeminfo.get_ip_address(), "\n\n")
    print(" Scanning network through", systeminfo.get_default_gateway(), "(Your default gateway)\n\n")
    print(" Each subnet are scanned 5 times.")
    print("\n\n", "*" * 10, "Please be patient while scanning.", "*" * 10)
    print("")

def midbanner():
    print("-" * 100)
    print("The 'Device Manufacturer' may not always be correct!")
    print("Most of the times, the modem model will be shown.")
    print("Also, some devices might not have the original MAC address due to various factors.")

    print("-" * 100)
    print("The device you're looking for is not listed above?")
    print("You can try running the program again.\nOFFLINE DEVICES WON'T BE LISTED!")

def lowerbanner():
    print("-" * 100)
    print("Latest stable version created: 21 December 2019")
    print("-" * 100)
    print("Thank you for using this program.\nDesigned and made by Satshree Shrestha.")
