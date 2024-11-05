<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar proyecto
2. Instalar dependencias
``` bash
yarn install
```
3. Clonar archivo __env.template__ y renombrarlo a __.env__
4. Cambiar las variables de entorno
5. Levantar base de datos
```bash
docker compose up -d
```
6. Ejecutar SEED
```
http://localhost:3000/api/seed
```
7. Levantar en modo desarrollo
```bash
yarn start:dev
```