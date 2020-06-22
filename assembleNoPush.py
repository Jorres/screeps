#!/usr/bin/python

import os

for fileName in os.listdir("."):
    if fileName.endswith("js"):
        os.remove(fileName)

os.system("tsc")

for fileName in os.listdir("ts_src"):
    if fileName.endswith("js"):
        os.system("mv ts_src/" + fileName + " .")
