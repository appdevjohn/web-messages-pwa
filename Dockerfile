FROM node:20

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "preview", "--", "--host=0.0.0.0"]