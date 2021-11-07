FROM node:16
WORKDIR /app
COPY package.json /app
RUN npm ci --only=production && npm cache clean --force
COPY . /app
EXPOSE 3001
EXPOSE 5001
