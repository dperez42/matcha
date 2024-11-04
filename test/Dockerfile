# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM node
# automatically creates the dir and sets it as the current working dir
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm i vite@latest -D
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
