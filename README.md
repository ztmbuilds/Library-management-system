## Description

This API allows users to perform various operations related to library management, including user authentication, book management, borrowing and returning books, and handling fines and reservations.

## Features

- Authentication & Authorization
- Book management
- Borrowing and Returning books
- Reservation management
- Fine management

## Built with

- Nodejs(version 18.18.0)
- Expressjs
- MongoDB

## Getting Started

### Prerequisites

The tools listed below are needed to run this application:

- Node
- Npm

You can check the Node.js and npm versions by running the following commands.

### Check node.js version

`node -v`

### Check npm version

`npm -v`

## Installation

To run this API on your local machine:

- Install project dependencies by running `npm install`.

- Start the server with `npm start:dev` to run in developement environment and `npm start:prod` for production environment

## Configuration

Create a `.env` file containing the environment variables listed in `sample.env`

## Base URL

Localhost: http://127.0.0.1:{PORT}/ (`PORT` specified in `.env`)

Live URL: https://library-management-system-s1x4.onrender.com

## Documentation

View swagger documentation here: https://library-management-system-s1x4.onrender.com/api/docs/
