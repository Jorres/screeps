#!/bin/bash

LOCALFOLDER='/home/jorres/.config/Screeps/scripts/screepsandbox_atannergaming_com___21025/default'

echo "$LOCALFOLDER"

cd "$LOCALFOLDER"
rm *.js 2> /dev/null
ls
cd ~/work/screeps/js_src
cp *.js "$LOCALFOLDER"
