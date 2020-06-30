#!/usr/bin/python

import os
import sys
import shutil

if len(sys.argv) != 2:
    print("Wrong number of arguments, expected commit name")
    sys.exit()

os.system('tsc > assembly_log.txt')
lines = open('assembly_log.txt').readlines()
for l in lines:
    if not('typed-screeps' in l):
        print(l)
os.system("rm assembly_log.txt")
shutil.rmtree('compiled/typed-screeps', ignore_errors=True)
os.rename('compiled/ts_src', 'compiled/js_src')
shutil.move('compiled/js_src', 'js_src')
shutil.rmtree('compiled', ignore_errors=True)

print("Shall we continue? \"Y\" for Yes.")
s = input()
if s[0] != 'Y':
    print("Upload aborted")
    sys.exit()

os.system("git add js_src ts_src")
os.system("git commit -m \"" + sys.argv[1] + "\"")
os.system("git push")
