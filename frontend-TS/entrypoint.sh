#!/bin/sh

rm ./src/config.ts
cp ./src/config.ts.example ./src/config.ts
sed -i "s/SED_REPLACEMENT_BACKEND_URL/${BACKEND_URL}/g" ./src/config.ts

if [ ${ENV} = "PROD" ]; then
    echo "Starting the application in production mode"
    serve ./dist -p 4000
else
    echo "Starting the application in dev mode"
    npm run dev
fi

