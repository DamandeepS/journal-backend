# Journal Backend

This is a simple backend made with nodejs and mongodb, it is configured with Typescript and ESLint

before you run this, make sure to add details about your mongodb instance using following env variables

## Env Variable

`MONGO_DB_INSTANCE`
`MONGO_CERTIFICATE` if you are using Certificate to login, Put Stringified Certificate here
`MONGO_PRIVATE_KEY` if you are using Certificate to login, Put Sringified PrivateKey here

To start, run `npm i` to install dependencies

## Scripts

`npm run build` - For production build

`npm run start` - To run the server

`npm run dev`   - For development

`npm run lint`  - for linting
