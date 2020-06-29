#!/usr/bin/python

import os
import sys
import shutil

if len(sys.argv) != 2:
    print("Wrong number of arguments, expected commit name")
    sys.exit()

shutil.rmtree('js_src')
os.system('tsc')
shutil.rmtree('compiled/typed-screeps')
os.rename('compiled/ts_src', 'compiled/js_src')
shutil.move('compiled/js_src', 'js_src')
shutil.rmtree('compiled')

# print("Shall we continue? \"Y\" for Yes.")
# s = input()
# if s[0] != 'Y':
#     sys.exit()
#
# for fileName in os.listdir("ts_src"):
#     if fileName.endswith("js"):
#         os.system("mv ts_src/" + fileName + " .")
#
# os.system("git add *.js")
# os.system("git add ts_src")
# os.system("git commit -m \"" + sys.argv[1] + "\"")
# os.system("git push")
