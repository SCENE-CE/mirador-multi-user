# Mirador multi user 

Mirador multi user is a project that aims to create a multi-user environment for the Mirador 4 viewer.

## Installation DEV (Docker)

- Clone this repo : `git clone git@github.com:SCENE-CE/mirador-multi-user.git`
- `cd mirador-multi-user`
- `cp .env.dev.sample .env`. Change password stuff
- `nvm use`
- `cd backend`
- `npm install`
- `cd ../frontend-TS`
- `npm install`
- `cd ..`
- `docker-compose up --build`
- 
- ## Installation PROD (Docker)

- Clone this repo : `git clone git@github.com:SCENE-CE/mirador-multi-user.git`
- `cd mirador-multi-user`
- `cp .env.dev.sample .env`. Change password stuff
- `docker-compose up --build`

Now you can access :
- frontend to `localhost:4000`
- backend to `localhost:3000`
- DB to `localhost:3306`


