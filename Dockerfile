FROM node:lts-bullseye-slim

WORKDIR /app

COPY app.js \
    index.html \
    requests.html \
    package.json \
    package-lock.json \
    /app/


RUN npm install

EXPOSE 3100

ENTRYPOINT ["node", "app.js"]

