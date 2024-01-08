# NITC Buy Sell Marketplace API

Welcome to the Buy and Sell Marketplace API! This API collection provides the essential functionality for creating an application where users can buy and sell old products through an online platform. The API includes features such as User Authentication, Product Management, Rating & Review, and a Real-time Chat application system.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [API Endpoints](#api-endpoints)
   - [GET Chats](#get-chats)
   - [POST Send Message](#post-send-message)
   - [GET Get Messages](#get-get-messages)
4. [Usage Examples](#usage-examples)
   - [GET Chats Example](#get-chats-example)
   - [POST Send Message Example](#post-send-message-example)
   - [GET Get Messages Example](#get-get-messages-example)
5. [Installation](#installation)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

This API collection is designed to facilitate the development of a web or mobile application for buying and selling old products. Whether you're building a full-fledged marketplace or adding these features to an existing application, this API provides the necessary tools to create a seamless user experience.

## Features

- **User Authentication:** Secure user registration and login system.
- **Product Management:** Manage products for buying and selling.
- **Rating & Review:** Allow users to rate and review products.
- **Real-time Chat:** Enable real-time communication between buyers and sellers.

## API Endpoints

### GET Chats

Retrieve a list of chats for the authenticated user.

- **Endpoint:** `https://nitc-buysell-backend-rest-api.onrender.com/api/v1/chats/get-chats`
- **Method:** GET
- **Response:** No response body

### POST Send Message

Send a message in a specific chat.

- **Endpoint:** `https://nitc-buysell-backend-rest-api.onrender.com/api/v1/chats/send-message`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "chatId": "65901d228fc99392eeba3210",
    "messageBody": "Hello world"
  }
  ```
- **Response:** No response body

### GET Get Messages

Retrieve messages from a specific chat.

- **Endpoint:** `https://nitc-buysell-backend-rest-api.onrender.com/api/v1/chats/get-messages`
- **Method:** GET
- **Response:** No response body

## Usage Examples

### GET Chats Example

```nodejs
var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://nitc-buysell-backend-rest-api.onrender.com/api/v1/chats/get-chats',
  headers: { }
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

### POST Send Message Example

```nodejs
var axios = require('axios');
var data = '{"chatId":"65901d228fc99392eeba3210","messageBody":"Hello world"}';

var config = {
  method: 'post',
  url: 'https://nitc-buysell-backend-rest-api.onrender.com/api/v1/chats/send-message',
  headers: { },
  data: data
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

### GET Get Messages Example

```nodejs
var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://nitc-buysell-backend-rest-api.onrender.com/api/v1/chats/get-messages',
  headers: { }
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

## Installation

To install and run this API, follow the steps in the project's documentation.

## Contributing

If you would like to contribute to the development of this API, please follow the guidelines outlined in the CONTRIBUTING.md file.

## License

This project is licensed under the [MIT License](LICENSE).