import * as msi from 'electron-wix-msi';
import * as path from 'path';

// const appDir = "./vision-win32-x64"
// const outDir = "./installer"

const appDir = path.resolve("vision-win32-x64")
const outDir = path.resolve("installer")

const msiCreator = new msi.default.MSICreator({
  appDirectory: appDir,
  outputDirectory: outDir,
  description: 'Install Vision, The Easy and Simple Network Scanning Tool.',
  exe: 'Vision',
  name: 'Vision',
  manufacturer: 'Satshree Shrestha',
  programFilesFolderName:"Vision",
  shortcutFolderName:"Vision",
  shortcutName:"Vision",
  version: '2.0.0',
  ui: {
    chooseDirectory: true
  },
});

msiCreator.create().then(() => msiCreator.compile());