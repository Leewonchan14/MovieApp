FROM node:18-alpine as build

WORKDIR /app

# Increase Node.js memory limit
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY ./package.json ./package.json

RUN npm install

COPY . .

ARG VITE_BACKEND_BASE_URL

ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

RUN npm run build

FROM build as dev

CMD ["npm", "run", "serve"]

FROM nginx:latest as prod

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]