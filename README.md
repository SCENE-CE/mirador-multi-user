# Mirador multi user 

Mirador multi user is a project that aims to create a multi-user environment for the Mirador 4 viewer.

## Installation DEV (Docker)

- Clone this repo : `git clone git@github.com:SCENE-CE/mirador-multi-user.git`
- `cd mirador-multi-user`
- `cp .env.dev.sample .env`. Change password stuff
- define CADDY_HOST to access to medias and manifests
- `cp frontend/src/config/config.sample.ts frontend/src/config/config.ts`
- `nvm use`
- `cd backend`
- `npm install`
- `cd ../frontend-TS`
- `npm install`
- `cd ..`
- `docker-compose up --build`
- `docker-compose exec backend /bin/sh`
- `npm run typeorm:generate-migration --name=db-init`
- `npm run typeorm migration:run -- -d ./src/config/dataSource.ts`
  Now you can access :
- frontend to `localhost:4000`
- backend to `localhost:3000`
- DB to `localhost:3306`
- Caddy to `localhost:9000`

- ## Installation PROD (Docker)

- Clone this repo : `git clone git@github.com:SCENE-CE/mirador-multi-user.git`
- `cd mirador-multi-user`
- `cp .env.prod.sample .env`. Change password stuff
- `cp frontend/src/config/config.sample.ts frontend/src/config/config.ts`
- `docker-compose up --build`
- generate db : 
  - `npm run typeorm:generate-migration --name=create-db`
  - `npm run typeorm migration:run -- -d ./src/config/dataSource.ts`
- change db password and JWT secret into .env file.



