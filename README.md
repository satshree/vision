# Vision
Scan Your Network for Online Hosts with VISION.  
Vision will scan your network and list out all the online devices.  
The front end GUI of Vision is built with 'Electron'. The main backend process is built completely in Python. 

## Requirements
For normal usage, you are required to have latest version of Python installed.  

For development,  
1. Python 3.*  
2. npm  
3. Follow below mentioned steps to install dependencies.    

## Setup
<a href="https://drive.google.com/file/d/1kPUdkb31I2jSgwvsYGaZWalAe8mqHv9j/view?usp=sharing" target="_blank">Download installer here.</a>  
  
Follow following steps to run Vision using npm and Python.  
1. Install dependencies  
    - npm install  
    - To install from 'requirements.txt' => pip install -r requirements.txt  
    - To install from 'Pipfile' => pipenv install  
  
2. If dependencies were install from Pipfile, run following command before starting Vision.  
    - pipenv shell  
  
3. Run 'npm run start' or 'npm start' or 'electron .'    
  
## Usage
Vision provides you with two options to scan network,
  
1. <i>Default Scan</i>: On starting Vision, press on "Let Vision Do The Dirty Work". Your network will be scanned until Vision finds two empty subnets.  
2. <i>Custom Scan</i>: On starting Vision, press on "Scan Network Yourself". Here, Vision will let you scan a range of IP address or a single IP address.  
  
Once the scanning is done, all the hosts will be listed on graphical view and tabular view. The graph represents total number of devices grouped by their manufacturers. From tabular view, you can perform port scanning or OS fingerprinting on individual hosts. You can also save the scanned hosts as CSV file. Vision will save the file on your Desktop.  

## Author
Satshree Shrestha  
Nepal
