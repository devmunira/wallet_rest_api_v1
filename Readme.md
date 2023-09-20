
# Wallet
#### A Personal Finance Management System

The Personal Finance Management System is a web application designed to empower users to manage their financial activities seamlessly. Project Motive To provide users with free financial services while leveraging user data for business insights. Key features include:


## Core Features

 - Authentication
 - Role-Permission Based Authorization
 - Forgot Password with Email Verification
 - Seeding Full DB
 - Profile Update & Password Change
 - User Management
 - Accounts Management
 - Expense Tracking
 - Income Management
 - Records Generation
 - Categories Management
 - Multiple Filtering System


## Tech Stack

**Server:** Node, Express , MongoDB , Node Mailer, Express Validator


## API Reference

#### Get all items

```http
  GET /api/v1/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `access_token` | `Bearer Token` | **Required**. Authorization Header |
| `limit` | `Number` | **Not Required**. Default 10 |
| `page` | `Number` | **Not Required**. Default 1 |
| `sortBy` | `string` | **Not Required**. Default updatedAt |
| `sortType` | `string` | **Not Required**. Default desc |
| `search` | `string` | **Not Required**. Search Query |
| `select` | `string` | **Not Required**. Select for Get Specific Item |
| `populate` | `string` | **Not Required**. Populate Relational Data |

#### Get Single item

```http
  GET /api/v1/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |
| `select` | `string` | **Not Required**. Select for Get Specific Item |
| `populate` | `string` | **Not Required**. Populate Relational Data |

#### Update or Create New Item
```http
  PUT /api/v1/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Update Exiting Item
```http
  PATCH /api/v1/items/${id}
```
#### Delete Item
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |


```http
  DELETE /api/v1/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |





## API Swagger Documentation

[Documentation](https://app.swaggerhub.com/apis/FSWFOFFICIAL/wallet/1.0.0#/)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SERVER_PORT` In which port your app will run on local mechine

`SITE_URL` Main Site URL like: http://localhost:400

`API_BASE_URL` API Base URL Like: http://localhost:400/api/v1

`JWT_SECRET` JWT Token Secret for creating access & refresh Token

`MONGOOSE_STRING` MongoDB Connection String 

`SMTP_USER` SMTP Server User for sending mail

`SMTP_PASS` SMTP Server Password

`SITE_MAIL` From which Mail your app mail will send

`SITE_Name` Application Name




## Run Locally

Clone the project

```bash
  git clone https://github.com/devmunira/wallet_rest_api_v1.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```
Seed Required Role & Permission Based Data.
If you want to check forgot password route and get email verification mail to your inbox please set valid 
email address in user and admin data to src/dbSeeder/userSeeder.js file 

#### Setup TYPE and Sparate DB for production on .env file

```bash
  TYPE = 'production'
  MONGOOSE_TEST_STRING = 'mongodb://127.0.0.1:27017/wallet'
```


```bash
  npm run seed
```
Start the server

```bash
  npm run dev
```


## Running Tests

To run tests, First Setup your app

#### Setup TYPE and Sparate DB on .env file

```bash
  TYPE = 'test'
  MONGOOSE_TEST_STRING = 'mongodb://127.0.0.1:27017/test'
```

#### Seed Data to DB

```bash
  npm run seed
```

#### Run Server 

To test a private route, follow these steps:

Launch the server and Login to obtain an access token.

Access the Swagger UI and log in to the Admin account.

Copy the generated access token.

Open the "server.test.js" file and paste the access token into the "TOKEN" constant.

usernameOrEmail : admin@gmail.com 

password: 200720Ab!

```bash
  npm run dev
```


#### Finally Run 

```bash
  npm run test
```

#### If Want to clear chache of test case run

```bash
  npm run cache
```


## Support

For support, email me@muniraakter.com


## Authors

- [@devmunira](https://www.github.com/devmunira)

