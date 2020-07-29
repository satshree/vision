# Vision
Scan Your Network for Online Hosts with VISION. Vision will scan your network and list out all the online devices.  
The front end GUI of Vision is built with 'Electron'. The main backend process is built completely in Python. 
<hr>
<i>This is the 2nd version of VISION.</i>  
For the first version, Vision was built on Electron.js and plain HTML, CSS, JavaScript with Python. In this second version, the GUI of Vision is developed using React.js and the Python files have been compiled into Microsoft Windows Executable Binaries. This introduces more stable and fluent GUI with no necessity of installing Python dependencies on user's system.  

## Requirements
The following tools must be installed in order to run Vision.  
1. Nmap <a href="https://nmap.org/dist/nmap-7.80-setup.exe" download> Download Here </a> 
2. Microsoft Visual C++ Redistributable 14.0 +  <a href="https://www.microsoft.com/en-us/download/confirmation.aspx?id=48145" download> Download Here </a>

## Setup
<a href="https://drive.google.com/file/d/1kPUdkb31I2jSgwvsYGaZWalAe8mqHv9j/view?usp=sharing" target="_blank">Download installer here.</a>  
<hr>

## Development
Vision is now built on Electron.js - React.js - Python. The Python dependencies are unchanged while there are several new dependencies for Node.js regarding React.js (obviously).  
  
Follow following steps to run Vision using npm and Python.  
1. Install dependencies  
    - npm install  
    - To install from 'requirements.txt' => pip install -r requirements.txt  
    - To install from 'Pipfile' => pipenv install  
  
2. If dependencies were install from Pipfile, run following command before starting Vision.  
    - pipenv shell  
  
3. Run 'npm run start' or 'npm start' to start a development server.  
4. On the other terminal, run 'npm run electron' to start electron.
  
## Usage
Vision provides you with two options to scan network,
  
1. <i>Default Scan</i>: On starting Vision, press on "Let Vision Do The Dirty Work". Your network will be scanned until Vision finds two empty subnets.  
2. <i>Custom Scan</i>: On starting Vision, press on "Scan Network Yourself". Here, Vision will let you scan a range of IP address or a single IP address.  
  
Once the scanning is done, all the hosts will be listed on graphical view and tabular view. The graph represents total number of devices grouped by their manufacturers. From tabular view, you can perform port scanning or OS fingerprinting on individual hosts. You can also save the scanned hosts as CSV file. Vision will save the file on your Desktop.  
  
3. <i>Other Options</i>: With this new version, you can probe about any device on the internet as long as you know their public IP or domain name. Along with this, you can also import previously saved results to visualize and list out the devices scanned at that moment. However, you cannot perform any further actions on imported data.  

## Author
Satshree Shrestha  
Nepal
