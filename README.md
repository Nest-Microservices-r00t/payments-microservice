<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Payments microservice

1. Clonar el proyecto
2. Crear un archivo `.env` basado en el archivo `.env.template`
3. Levantar el proyecto con `npm run start:dev`
4. Create port forward to localhost [text](https://dashboard.hookdeck.com/create-first-connection)
5. Levantar el webhook port forward `hookdeck listen 3003 stripe-to-localhos`
6. Consumir servicio desde Postman para pruebas.