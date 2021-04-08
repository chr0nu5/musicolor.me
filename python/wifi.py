import subprocess
from time import sleep

if __name__ == '__main__':
    while True:
        p = subprocess.Popen("arp-scan -l", stdout=subprocess.PIPE, shell=True)
        (output, err) = p.communicate()
        p_status = p.wait()
        print output
        sleep(5)
