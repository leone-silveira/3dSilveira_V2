FROM node:20-alpine AS build
WORKDIR /app
COPY ./frontend/package*.json ./
RUN yarn install --frozen-lockfile && yarn cache clean
COPY ./frontend .
RUN yarn build

FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html