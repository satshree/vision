# Vision 2.0
Scan Your Network for Online Hosts with VISION. <br> Vision will scan your network and list out all the online devices. Vision is built with React.js for UI, Electron.js for desktop platform and Python at the heart of Vision for network scanning. 
<hr>
<b>This is the 2nd version of VISION.</b>  <br>
For the first version, Vision was built on Electron.js and plain HTML, CSS, JavaScript with Python. In this second version, the UI of Vision is developed using React.js and the Python files have been compiled into Microsoft Windows Executable Binaries. This introduces more stable and fluent UI with no necessity of installing Python dependencies on user's system.  

## Requirements
The following tools must be installed in order to run Vision.  
1. Nmap (<a href="https://nmap.org/dist/nmap-7.80-setup.exe" download>Download Here</a>) 
2. Microsoft Visual C++ Redistributable 14.0 + (<a href="https://www.microsoft.com/en-us/download/details.aspx?id=48145" target="_blank">Download Here</a>)

## Setup
<a href="https://drive.google.com/file/d/11-lL1bJE0ssUQEBAOY4xk4qxoD5IGrRS/view?usp=sharing" target="_blank">Download installer here.</a>  

## Usage
Vision provides you with two options to scan network,
  
1. <b>Default Scan</b>: On starting Vision, press on "Let Vision Do The Dirty Work". Your network will be scanned until Vision finds two empty subnets.  
2. <b>Custom Scan</b>: On starting Vision, press on "Scan The Network Yourself". Here, Vision will let you scan a range of IP addresses or a single IP address.  
  
Once the scanning is done, all the hosts will be listed on graphical view and tabular view. The graph represents total number of devices grouped by their manufacturers. From tabular view, you can perform port scanning or OS fingerprinting on individual hosts. You can also save the scanned hosts as CSV file. Vision will save the file on your Desktop.  
  
3. <b>Other Options</b>: With this new version, you can probe about any device on the internet as long as you know their public IP or domain name. Along with this, you can also import previously saved results to visualize and list out the devices scanned at that moment. However, you cannot perform any further actions on imported data.  

## Development
Vision is now built on Electron.js - React.js - Python. The Python dependencies are unchanged while there are several new dependencies for Node.js regarding React.js (obviously).  
  
Follow following steps to run Vision.  
1. Install dependencies  
    - npm install  
    - To install from 'requirements.txt' => pip install -r requirements.txt  
    - To install from 'Pipfile' => pipenv install  
  
2. If dependencies were install from Pipfile, run following command before starting Vision.  
    - pipenv shell  

3. Update the 'loadURL' value in 'magic.js' to localhost URL.  

4. Make sure to update the path to backend scripts in 'electron.js'.  

5. Run 'npm run start' or 'npm start' to start a development server.  

6. On the other terminal, run 'npm run electron' to start Vision.

## Author
Satshree Shrestha  
Nepal
