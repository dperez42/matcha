# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM node:latest as build-stage

# automatically creates the dir and sets it as the current working dir
WORKDIR /usr/src/app
# this will allow us to run vite and other tools directly
#ENV PATH /usr/src/node_modules/.bin:$PATH

# inject all environment vars we'll need
#ARG VITE_BACKEND_URL
# expose the variable to the finished cotainer
#ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package.json ./

RUN npm install --legacy-peer-deps
# use a more specific COPY, as this will include files like `Dockerfile`, we don't really need inside our containers.
COPY . .

#RUN npm run build

# etapa de desarrollo
FROM build-stage as dev-stage
EXPOSE 8000
CMD ["npm", "run", "dev"]

# etapa de producción
#FROM nginx:1.13.12-alpine as prod-stage
#COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
#EXPOSE 81
#CMD ["nginx", "-g", "daemon off;"]


