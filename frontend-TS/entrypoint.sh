#!/bin/sh


if [ "${ENV}" = "PROD" ]; then
    echo "Starting the application in production mode"
    serve ./dist -p 4000 --single
else
    pwd
    ls -l
    whoami
    echo $UID
    echo "Starting the application in dev mode"
    npm run dev
fi

