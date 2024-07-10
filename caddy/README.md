# HTTP Caddyfile and Filebrowser

This is a small Docker stack made to run with Traefik reverse proxy.

It includes two services :

- [Filebrowser](https://filebrowser.org/) to interacte with the server filesystem
- [Caddy](https://caddyserver.com) to serve a folder using http(s)

It is typically usefull when you need to simply host and manage files that need to be accesed using http(s) on a server.

## Instalation

Clone the repo and edit `.env` and `filebrowser.json` to youur needs.

Launch with `docker compose up`



