#!/usr/bin/python

import os
import sys
import shutil

if len(sys.argv) != 2:
    print("Wrong number of arguments, expected commit name")
    sys.exit()

os.system('rm -rf js_src')
os.system('tsc')
os.system('rm -rf compiled/typed-screeps')
os.system('mv compiled/ts_src compiled/js_src')
os.system('mv compiled/js_src js_src')
os.system('rm -rf compiled')

print("Shall we continue? \"Y\" for Yes.")
s = input()
if s[0] != 'Y':
    print("Upload aborted")
    sys.exit()

os.system("git add js_src ts_src")
os.system("git commit -m \"" + sys.argv[1] + "\"")
os.system("git push")
