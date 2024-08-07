# OneTimeChat - UI

Send group messages anonymously with no account or app needed. Conversations are deleted 30 days after the last message is sent, and anyone with the link can view and send messages.

This application requires a backend service to function. You can find that codebase [here](https://github.com/appdevjohn/web-messages-service).

## Required Environment Variables

| Name              | Description                           | Example               |
| ----------------- | ------------------------------------- | --------------------- |
| VITE_API_BASE_URL | The base URL for the backend service. | http://localhost:8000 |

## Running on your Local Machine

1. Ensure Node.js is installed on your machine.
2. Run `npm install` in this directory to install dependencies.
3. Run `npm run dev` to run in a development environment.

## Running in a Production Environment

1. Ensure Node.js is installed on your machine.
2. Run `npm install` in this directory.
3. Run `npm run build` to build a production application.
4. Run `npm run preview` to serve the production application.
