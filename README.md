<h1 align="center">
  👨‍🎓 Portal Alunos API 📚
</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=79A6F5&labelColor=0A1033">
</p>

## 💻 Project

API for a students portal where teachers can create posts, visualize it own posts, update and delete them and students can visualize all posts created by teachers, similar to a blog.

## :hammer_and_wrench: Features

- [ ] REST API;
- [ ] Database persistance (PostgreSQL + TypeORM);
- [ ] User CRUD;
- [ ] Post CRUD;
- [ ] Schema validation with Zod;
- [ ] Docker image;
- [ ] Paginated list requests;
- [ ] Permissions based on user role;
- [ ] CI/CD;
- [ ] Unit tests;

## ✨ Technologies

- [ ] NestJs
- [ ] Typescript
- [ ] PostgreSQL
- [ ] TypeORM
- [ ] Zod
- [ ] CI/CD using Github Actions and DockerHub
- [ ] Docker
- [ ] Jest (unit tests)
- [ ] Faker (mocks)
- [ ] Swagger
- [ ] ESLint + Prettier

## 👨‍💻 Getting started

```cl
# Clone the project
$ git clone https://github.com/Gustavotc/fiap-tech-challenge-fullstack-grupo-13-node.git
```

##### Env setup

Create a `.env` file in the project root folder, folowing the `.env.example` template.

##### Project setup

```cl
# Install the project dependencies
$ npm install
```

```cl
# Run docker compose
$ docker compose up
```

##### Database setup

Access PGAdmin through `localhost:5050` and log in using `PG_ADMIN_USER` and `PG_ADMIN_PASSWORD` env variables.

Right click on “servers”, click on “register” and “server”.
In “general” tab, inform “name” as `DATABASE_NAME` env variable.
In “connection” tab, fill the “host name” with `DATABASE_HOST`, “port” with `DATABASE_PORT`, “username” with `DATABASE_USER` e “password” with `DATABASE_PASSWORD` env variables.

With the new connection stablished, create a new database runing the following SQL comands:

```SQL
# create the new database
CREATE DATABASE portal_alunos;

# create extesion to generate UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# create posts table
CREATE TABLE public.posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id uuid
);

# create user roles table
CREATE TABLE public.roles (
    type character varying NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);

# create users table
CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role_id uuid
);
```

## ✅ Test

```cl
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

<br />
