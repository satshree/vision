const {path} = require('path');
const { MSICreator } = require('electron-wix-msi');

const appDir = path.join(__dirname, "app")
const outDir = path.join(__dirname, "installer")

const msiCreator = new MSICreator({
  appDirectory: appDir,
  outputDirectory: outDir,
  description: 'Install Vision',
  exe: 'vision',
  name: 'vision',
  manufacturer: 'Satshree Shrestha',
  version: '0.1.1',
  ui: {
    chooseDirectory: true
  },
});

msiCreator.create().then(() => msiCreator.compile());