""" 
    All required external data for Vision.
"""
__author__ = "Satshree Shrestha"

# Libraries
import os

def get_OUI():
    """
        This keeps all the MAC address and Vendor in a dictionary.
        Database used from 'Wireshark manufacturer database'.
        https://code.wireshark.org/review/gitweb?p=wireshark.git;a=blob_plain;f=manuf
        First 'database.txt' created = 27 - June - 2019
    """

    # 'database.txt' is a text file that contains all the MAC addresses and their vendors.
    current_dir = os.path.dirname(os.path.realpath(__file__))  
    filename = os.path.join(current_dir, 'database.txt')
    file = open(filename, 'r', encoding="utf-8")

    # Create a list of all the lines from 'file'.
    proper_file = file.readlines()

    # Removing '\n' from 'proper_file'.
    proper = [line.rstrip('\n') for line in proper_file]

    # Create a dictionary that will hold all the MAC addresses and their vendors.
    OUI = {}

    # Filter in such a way: key = MAC address, element = Vendor - 'additional name'(if any).
    for i in proper:
        split_list = i.split('\t')
        if len(split_list) == 2:
            OUI[split_list[0]] = split_list[1]
        elif len(split_list) == 3:
            OUI[split_list[0]] = split_list[1] + " - " + split_list[2]

    file.close
    return OUI

def well_known_ports():
    """ Returns all the well known ports. """
    ports = [5,7,18,20,21,22,23,25,29,37,42,43,49,53,69,70,79,80,103,108,109,110,\
            115,118,119,137,139,143,150,156,161,179,190,194,197,201,389,396,443,\
            444,445,458,514,546,547,563,569,631,691,1080,1311,1900,3124,3128,3306,\
            5000,5432,11371,65535]
    
    return ports

            
def get_port():
    """ List of well known port numbers. """

    # Source: "https://www.webopedia.com/quick_ref/portnumbers.asp"

    ports = {
        1: "TCP Port Service Multiplexer (TCPMUX)",
        5: "Remote Job Entry (RJE)",
        7: "ECHO",
        18: "Message Send Protocol (MSP)",
        20:	"FTP -- Data",
        21:	"FTP -- Control",
        22:	"SSH Remote Login Protocol",
        23:	"Telnet",
        25:	"Simple Mail Transfer Protocol (SMTP)",
        29:	"MSG ICP",
        37:	"Time",
        42:	"Host Name Server (Nameserver)",
        43:	"WhoIs",
        49:	"Login Host Protocol (Login)",
        53:	"Domain Name System (DNS)",
        69:	"Trivial File Transfer Protocol (TFTP)",
        70:	"Gopher Services",
        79:	"Finger",
        80:	"HTTP",
        103:	"X.400 Standard",
        108:	"SNA Gateway Access Server",
        109:	"POP2",
        110:	"POP3",
        115:	"Simple File Transfer Protocol (SFTP)",
        118:	"SQL Services",
        119:	"Newsgroup (NNTP)",
        137:	"NetBIOS Name Service",
        139:	"NetBIOS Datagram Service",
        143:	"Interim Mail Access Protocol (IMAP)",
        150:	"NetBIOS Session Service",
        156:	"SQL Server",
        161:	"SNMP",
        179:	"Border Gateway Protocol (BGP)",
        190:	"Gateway Access Control Protocol (GACP)",
        194:	"Internet Relay Chat (IRC)",
        197:	"Directory Location Service (DLS)",
        389:	"Lightweight Directory Access Protocol (LDAP)",
        396:	"Novell Netware over IP",
        443:	"HTTPS",
        444:	"Simple Network Paging Protocol (SNPP)",
        445:	"Microsoft-DS",
        458:	"Apple QuickTime",
        546:	"DHCP Client",
        547:	"DHCP Server",
        563:	"SNEWS",
        569:	"MSN",
        1080:	"Socks"
    }
    
    return ports
