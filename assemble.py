#!/usr/bin/python

import os
import sys

if len(sys.argv) != 2:
    print("Wrong number of arguments, expected commit name")
    sys.exit()

for fileName in os.listdir("."):
    if fileName.endswith("js"):
        os.remove(fileName)

os.system("tsc")

print("Shall we continue? [Y\N]")
s = input()
print(s)
if s[0] != 'Y':
    sys.exit()


for fileName in os.listdir("ts_src"):
    if fileName.endswith("js"):
        os.system("mv ts_src/" + fileName + " .")

os.system("git add *.js")
os.system("git commit -m \"" + sys.argv[1] + "\"")
os.system("git push")
