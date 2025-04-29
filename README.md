# ![RealWorld Example App](https://github.com/SeuRonao/realworld-express-prisma/raw/main/logo.png)

> ## Typescript + NestJS + Prisma codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API

This codebase was created to demonstrate a backend built with **Typescript + NestJS + Prisma** including CRUD operations, authentication, routing, pagination, and more.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## How it works

The project is build using [TypeScript](https://www.typescriptlang.org/) for language, [NestJS](https://expressjs.com/) for routing and server framework and [Prisma](https://www.prisma.io/) as an _ORM_.

The project uses [PostgreSQL](https://www.postgresql.org/) for the database.

For unit testing it uses the [Jest](https://jestjs.io/) framework since it is what is promoted by prisma team to mock testing function that change the database.

## Getting started

To run this project you should have _node/npm_ installed.

Run `npm install` to install the dependencies.

Create an environment file `.env` inside the root folder with the following attributes:

```.env
DATABASE_URL=file:./dev.db
JWT_SECRET=theSecretForCreatingTheJWT
```

- To run the development version `npm run start:dev`
- To run the development version with debugging `npm run start:debug`
- To run the production build `npm run start:prod`
- To build a production version `npm run build`
- To run postman test `npm run test:postman`
