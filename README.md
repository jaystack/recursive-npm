# recursive-npm

A small utility to recursivly run npm command...

## Install
`npm install recursive-npm -g`

## Usage
recursive-npm
run `npm install` in current folder and all subfolders

recursive-npm ./test
run `npm install` in test folder and all subfolders

recursive-npm ./test -command 'install -q' build
run `npm install -q` after that `npm run build` commands in test folder and all subfolders
