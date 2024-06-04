FROM node:20.10
WORKDIR /app
RUN npm cache clean --force
COPY package*.json ./
RUN npm install
RUN npm install bcrypt
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm","run","start:prod"]