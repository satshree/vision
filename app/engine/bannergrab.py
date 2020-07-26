import sys
import socket 
import json
from modules.common import echo_result


def grab(host, payload, port):
    """ Banner Grabbing. """

    echo_result('Grabbing banner for port {}.'.format(port))

    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5)
        s.connect((host, int(port)))

        s.send(payload.encode())

        banners = s.recv(8000).decode('utf-8').strip()
        s.close()
    except Exception as e:
        echo_result("Unable to Grab Banner. {}".format(e))
    else:
        return banners

if __name__ == "__main__":
    host = socket.gethostbyname(sys.argv[1])
    port__payload = json.loads(sys.argv[-1])

    banner = grab(host, port__payload[0], port__payload[-1])

    echo_result(banner)
