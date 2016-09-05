/*
  This script runs npm install (and optionally typings install) in the base folder and its subfolders.

  Argument 1 (optional): Start folder (default value: current folder)
                        must be set if additional arguments used
  Argument 2 (optional): installMode
  Argument 3 (optional): '-t' -> perform typings install
*/

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const a1 = process.argv[2];
const a2 = process.argv[3];
const a3 = process.argv[4];

if (a1 === '-h') {
  console.log();
  console.log("This script runs npm install (and optionally typings install) in the base folder and its subfolders.");
  console.log();
  console.log("Argument 1 (optional): Start folder (default value: current folder)");
  console.log("                       must be set if additional arguments used");
  console.log("Argument 2 (optional): installMode");
  console.log("Argument 3 (optional): '-t' -> perform typings install");
  process.exit(0);
}

const rootFolder = a1 || process.cwd();
//const installMode = process.argv[3];
const installMode = (a2 !== null && a2 !== undefined && a2 !== '-t') ? a2 : '';
const doTypings = (a2 !== null && a2 !== undefined && a2 === '-t')
                  ? true
                  : (a3 !== null && a3 !== undefined && a3 === '-t')
                    ? true
                    : false;


const elapsed_time = function (noteBefore, noteAfter) {
  noteBefore = noteBefore || '';
  noteAfter = noteAfter || '';
  const precision = 3; // 3 decimal places
  const elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
  let sec = process.hrtime(start)[0];
  const min = Math.floor(sec / 60);
  sec = sec - min * 60;
  console.log(noteBefore + min + " m, " + sec + " s, " + elapsed.toFixed(precision) + " ms" + noteAfter); // print message + time
  start = process.hrtime(); // reset the timer
}

let start = process.hrtime();

recursiveInstall(rootFolder);

console.log();
console.log("Finished.");
elapsed_time("Elapsed time: ", ".");


function recursiveInstall(folder){

  if(isNpmPackage(folder)){
    performNpmInstall(folder);
    if (doTypings) performTypingsInstall(folder);
  }

  getSubfolders(folder).forEach(
    f => recursiveInstall(f)
  );

}


function isNpmPackage(folder){

  try{
    fs.accessSync(path.join(folder, 'package.json'));
  }
  catch(err){
    return false;
  }

  return true;

}


function performNpmInstall(folder){

  const command = 'npm install' + ((installMode !== null && installMode !== undefined) ? ' ' + installMode : '');

  const options = {
    cwd: folder,
    env: process.env,
    stdio: 'inherit'
  };

  console.log("--------------------");
    console.log("***", folder,"> ", command);
    console.log("--------------------");
  child_process.execSync(command, options);

}


function performTypingsInstall(folder) {

  const command = 'typings install';

  const options = {
    cwd: folder,
    env: process.env,
    stdio: 'inherit'
  };

  console.log(folder, "> ", command);
  child_process.execSync(command,options);

}


function getSubfolders(folder){

  return fs.readdirSync(folder)
    .filter(file => fs.statSync(path.join(folder, file)).isDirectory() && file !== 'node_modules' )
    .map(subfolder => path.join(folder, subfolder));

}