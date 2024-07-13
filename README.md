# CBPath Project

## Overview
CBPath is a web-based application designed to manage and review courses. This project is divided into two main parts: the backend and the frontend. The backend is built using Node.js and Prisma, while the frontend is built using React.

## Table of Contents
- [Overview](https://github.com/JeffrayZhang/cbpath/new/main?filename=README.md#overview/)
- [Backend](https://github.com/JeffrayZhang/cbpath/new/main?filename=README.md#backend/)
  - [Prerequisites](https://github.com/JeffrayZhang/cbpath/new/main?filename=README.md#prerequisites/)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
  - [Folder Structure](#folder-structure)
- [Frontend](#frontend)
  - [Prerequisites](#prerequisites-1)
  - [Installation](#installation-1)
  - [Running the Application](#running-the-application)
  - [Folder Structure](#folder-structure-1)
- [License](#license)

## Backend

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Prisma](https://www.prisma.io/)
- [Vercel CLI](https://vercel.com/docs/cli) (for deployment)

### Installation

Navigate to the backend directory:

cd backend
### Install the dependencies:

```
yarn install
```
### Environment Variables
Create a .env file in the backend directory and add the necessary environment variables. You can refer to the .env.example file for the required variables.

### Running the Server
To run the server in development mode:

```
yarn dev
```
#### To build the project:

```
yarn build
```
### To start the server in production mode:

```
yarn start
```
### Folder Structure
The backend folder structure is as follows:

```bash
backend/
├── dist/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── routes/
│   │   ├── course-router.ts
│   │   ├── review-router.ts
│   │   └── user-router.ts
│   ├── middleware.ts
│   ├── db.ts
│   └── server.ts
├── .husky/
│   └── pre-commit
├── package.json
├── tsconfig.json
└── yarn.lock
```
## Frontend
### Prerequisites
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
### Installation
Navigate to the frontend directory:
```
cd frontend
```

Install the dependencies:

```
yarn install
```
### Running the Application
To start the development server:
```
yarn start
```
#### To build the project:

```
yarn build
```

### Folder Structure
The frontend folder structure is as follows:
```bash
frontend/
├── public/
│   ├── favicon.svg
│   ├── index.html
│   ├── logo.svg
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── confirm-modal.tsx
│   │   ├── course-components.tsx
│   │   ├── course-review-form.tsx
│   │   ├── error-course-not-found.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── firebase.ts
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── CoursePage.tsx
│   ├── Profile.tsx
│   ├── error-icon.svg
│   ├── index.css
│   ├── index.tsx
│   ├── logo-icon-hover.svg
│   ├── logo-icon.svg
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
├── .gitignore
├── package.json
├── tsconfig.json
└── yarn.lock
```
