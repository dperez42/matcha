FROM node:latest as build-stage

# ENV NODE_ENV=development 
# ENV NODE_ENV=production

# automatically creates the dir and sets it as the current working dir
WORKDIR /app
# this will allow us to run vite and other tools directly
ENV PATH /usr/src/node_modules/.bin:$PATH

# inject all environment vars we'll need
#ARG VITE_BACKEND_URL
# expose the variable to the finished cotainer
#ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package*.json ./

# RUN npm cache clean --force
#RUN npm i -g @vitejs/plugin-vue
#RUN npm i -g vite

# Updating packages and fixing vulnerabilities
RUN npm update 
RUN npm cache clean --force
RUN npm install -g 
RUN npm i vite@latest -D
# --legacy-peer-deps
# use a more specific COPY, as this will include files like `Dockerfile`, we don't really need inside our containers.
#RUN npm i -g @vitejs/plugin-vue
#RUN npm i -g vite
#RUN npm i -g vite-plugin-vuetify
#RUN ln -s /usr/local/lib/node_modules/ ../node_modules

COPY . ./

#RUN npm run build

# DEVELOPMENT STAGE
FROM build-stage as dev-stage
EXPOSE 8010
CMD ["npm", "run", "dev"]

# PRODCUTION STAGE
FROM build-stage as prod-builder
RUN npm run build

FROM nginx:latest as prod-stage
COPY --from=prod-builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


