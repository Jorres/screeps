#!/usr/bin/python

import os

os.system('rm -rf js_src')
os.system('tsc')
os.system('rm -rf compiled/typed-screeps')
os.system('mv compiled/ts_src compiled/js_src')
os.system('mv compiled/js_src js_src')
os.system('rm -rf compiled')
