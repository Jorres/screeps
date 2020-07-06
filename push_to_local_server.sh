#!bin/bash

LOCALFOLDER='~/.config/Screeps/scripts/127_0_0_1___21025/default'

echo "$LOCALFOLDER"

cd "$LOCALFOLDER"
rm '*.js'
cd ~/work/screeps/js_src
cp *.js "$LOCALFOLDER"
