# Recipe Management Application (SPA) Outline
## Frontend (React)

### Single Page Application:
Routes for browsing recipes, viewing details, and adding new recipes.

Implemented React Router for client-side routing.

Using Bootstrap CSS for styling.

### Features Implemented:
Recipe Listing: Browse all recipes.

Recipe Detail Page: View specific recipe details.

Add Recipe Form: Form to add a new recipe (title, ingredients, cooking instructions, and optional cover image).

Search Functionality: Search recipes by title or ingredient.

## Backend (Node.js + Express + MongoDB)

### Node.js and Express Setup:
#### Set up a basic Express server to handle API routes.

```bash
sudo apt install nodejs npm -y
```

Create project

```bash
mkdir express-app && cd express-app
npm init -y
npm i express
```

#### Run server

```bash
node server.js
```

#### Configured to run using PM2 (with automatic restart on reboot).

```bash
npm install -g pm2
```

#### Start server with pm2

```bash
pm2 start server.js --name express-app
```

#### pm2 restart on boot

```bash
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
pm2 save
```

#### Firewall

```bash
sudo ufw allow 3000/tcp
```

### API Endpoints:

```GET /recipes:``` Retrieve all recipes.

```GET /recipes/:id:``` Retrieve a specific recipe by ID.

```POST /recipes:``` Add a new recipe to the database.

```PUT /recipes/:id:``` Update an existing recipe.

```DELETE /recipes/:id:``` Delete a specific recipe.

### Connected to MongoDB for persistent storage.:

#### MongoDB running in a Docker container.

```bash
npm i mongoose dotenv
```

docker

```bash
sudo apt install docker.io
```

mongoDB container

```bash
sudo docker run -d -p 27017:27017 --name mongodb mongo
```

check

```bash
sudo docker ps
```

restart express

```bash
node run dev
```

#### Successfully connected to MongoDB and the API can interact with it.


test POST

```bash
curl -X POST http://10.0.0.57:5000/recipes \
-H "Content-Type: application/json" \
-d '{
  "title": "Chicken Alfredo",
  "ingredients": ["chicken", "heavy cream", "pasta", "garlic", "parmesan"],
  "instructions": "Cook the chicken, prepare the sauce, and combine with pasta."
}'
```

test GET

```bash
curl http://10.0.0.57:5000/recipes
```



#### Docker restart policy set to ensure MongoDB container starts on system reboot.

```bash
sudo docker stop 9342148c1485
sudo docker rm 9342148c1485
sudo docker run --name mongodb -d --restart=always -p 27017:27017 mongo
```

check

```bash
sudo docker ps
```

restart policy

```bash
sudo docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' mongodb
```

#### Data validation

```bash
npm i joi
```

### Reverse proxy

```bash
sudo apt install nginx -y
```

#### nginx file

```bash
sudo nano /etc/nginx/sites-available/express-app
```

Config file

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable site && restart nginx

```bash
sudo ln -s /etc/nginx/sites-available/express-app /etc/nginx/sites-enable
sudo systemctl restart nginx
```

#### ssl

```bash
sudo apt install openssl -y
```

self signed cert

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt
```

Configure nginx for ssl

```bash
sudo nano /etc/nginx/sites-available/express-app
```
Update config
```nginx
server {
    listen 443 ssl;
    server_name 10.0.0.57;

    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name 10.0.0.57;

    return 301 https://$host$request_uri;
}
```

#### restart nginx

```bash
sudo systemctl restart nginx
```



## Deployment and Automation:

### PM2 for API:
The API is being managed by PM2 for process management and auto-restart on failure or reboot.

### MongoDB in Docker:
MongoDB is running inside a Docker container.

Docker is configured to restart MongoDB automatically on system reboots.

### NGINX as Reverse Proxy:
NGINX is set up as a reverse proxy to handle incoming HTTP requests and forward them to the Express API running on port 5000.

NGINX is configured to serve the React frontend and API on the same domain, with proper routing.

SSL configuration with OpenSSL: Used OpenSSL to generate SSL certificates for secure HTTPS traffic.

The frontend React app is served statically by NGINX, while API requests are forwarded to the backend Express server.

### Backup & Restore:
Still need to configure a backup strategy for MongoDB (e.g., using mongodump for MongoDB backups).
Consider automated backups and maybe setting up PM2 for backup management.

## Next Steps / Features to Implement:

Backup Strategy: Set up MongoDB backups (manual or automated).

Frontend Enhancements: Improve UI/UX, add features like image uploads for recipes.

Search Functionality: Enhance search with MongoDB’s full-text search or use external services.

State Management: Implement Context API or Redux to manage the app state efficiently.

Deploy: Set up deployment on platforms like Heroku, Vercel, AWS, etc.

Documentation: Finalize setup instructions and README with clear deployment and usage guidelines.

## bash

set up express

```bash
sudo apt install nodejs npm -y
```

create project

```bash
mkdir express-app && cd express-app
npm init -y
npm i express
```

run server

```bash
node server.js
```

Ctrl+C

install pm2 globally

```bash
npm install -g pm2
```

start server with pm2

```bash
pm2 start server.js --name express-app
```

pm2 restart on boot

```bash
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
pm2 save
```

firewall

```bash
sudo ufw allow 5000/tcp
```

reverse proxy

```bash
sudo apt install nginx -y
```

nginx file

```bash
sudo nano /etc/nginx/sites-available/express-app
```

config file

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

save and exit

enable site && restart nginx

```bash
sudo ln -s /etc/nginx/sites-available/express-app /etc/nginx/sites-enable
sudo systemctl restart nginx
```

ssl

```bash
sudo apt install openssl -y
```

self signed cert

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt
```

configure nginx for ssl

```bash
sudo nano /etc/nginx/sites-available/express-app
```

```nginx
server {
    listen 443 ssl;
    server_name 10.0.0.57;

    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name 10.0.0.57;

    return 301 https://$host$request_uri;
}
```

save and exit

restart nginx

```bash
sudo systemctl restart nginx
```

RESTful

```bash
npm i cors body-parser nodemon
```

monogoDB

```bash
npm i mongoose dotenv
```

docker

```bash
sudo apt install docker.io
```

mongoDB container

```bash
sudo docker run -d -p 27017:27017 --name mongodb mongo
```

check

```bash
sudo docker ps
```

restart express

```bash
node run dev
```

test POST

```bash
curl -X POST http://10.0.0.57:5000/recipes \
-H "Content-Type: application/json" \
-d '{
  "title": "Chicken Alfredo",
  "ingredients": ["chicken", "heavy cream", "pasta", "garlic", "parmesan"],
  "instructions": "Cook the chicken, prepare the sauce, and combine with pasta."
}'
```

test GET

```bash
curl http://10.0.0.57:5000/recipes
```

get db container to start at boot

```bash
sudo docker stop 9342148c1485
sudo docker rm 9342148c1485
sudo docker run --name mongodb -d --restart=always -p 27017:27017 mongo
```

check

```bash
sudo docker ps
```

restart policy

```bash
sudo docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' mongodb
```

data validation

```bash
npm i joi
```
