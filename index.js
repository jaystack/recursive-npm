#!/usr/bin/env node
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
var argv = require('yargs')
            .usage('Usage: $0 <path> [command]')
            .array('command')
            .alias('c', 'command')
            .describe('command', 'script name(s)')
            .example(`$0 ./ -command 'install -q' build`, `run 'npm install -q' and 'npm run build' commands recursively from './' root path`)
            .help('h')
            .alias('h', 'help')
            .argv;

var rootFolder = process.cwd()
if (argv._ && argv._.length>0) {
   rootFolder = argv._[0]
}
if (!argv.command || (argv.command && argv.command.length < 1)) {
  argv.command = ['install'];
}
recursiveInstall(rootFolder);

console.log("Finished.");

function recursiveInstall(folder) {

  if(isNpmPackage(folder)) {
    performNpmInstall(folder);
  }

  getSubfolders(folder).forEach(
    f => recursiveInstall(f)
  );

}

function isNpmPackage(folder) {
  try{
    fs.accessSync(path.join(folder, 'package.json'));
  }
  catch(err) {
    return false;
  }
  return true;
}


function performNpmInstall(folder) {

  for (var i = 0; i < argv.command.length; i++) {
    var cmd = argv.command[i];
    if (cmd.indexOf('install') != 0) {
      cmd = 'run ' + cmd;
    }
    cmd = 'npm ' + cmd;
    const options = {
      cwd: folder,
      env: process.env,
      stdio: 'inherit'
    };
    console.log("--------------------");
    console.log("***", folder,"> ", cmd);
    console.log("--------------------");
    child_process.execSync(cmd, options);
  }
}

function getSubfolders(folder) {
  return fs.readdirSync(folder)
           .filter(file => fs.statSync(path.join(folder, file)).isDirectory() && file !== 'node_modules' )
           .map(subfolder => path.join(folder, subfolder));
}
