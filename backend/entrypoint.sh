#!/bin/sh
# Reinstall bcrypt
echo "Reinstalling bcrypt..."
npm uninstall bcrypt
npm install bcrypt
#
## Start the application
echo "Starting the application..."
echo $0 $@
npm run start:debug
