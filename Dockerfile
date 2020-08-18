FROM node:12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .
EXPOSE 3000

CMD ["node", "./bin/run"]