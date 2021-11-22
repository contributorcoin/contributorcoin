FROM node:16 as build

ARG BUILD_CONTEXT

WORKDIR /app

# Copy packages and install dependencies
COPY package.json /app
COPY yarn.lock /app
COPY ./packages/$BUILD_CONTEXT/package.json /app/packages/$BUILD_CONTEXT/
RUN yarn install --frozen-lockfile

# Copy and build apps
COPY ./packages/$BUILD_CONTEXT /app/packages/$BUILD_CONTEXT/
RUN yarn build:$BUILD_CONTEXT

FROM nginx:stable-alpine
ARG BUILD_CONTEXT
COPY --from=build /app/packages/$BUILD_CONTEXT/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

