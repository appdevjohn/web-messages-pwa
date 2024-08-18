FROM node:20

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

ENV PORT=4173

EXPOSE $PORT

CMD ["npm", "run", "preview", "--", "--host=0.0.0.0"]