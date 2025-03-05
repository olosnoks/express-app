# self hosted web app on ubuntu vps

tldr: use credit card to buy vps. 2 cores 2gb 25gb should be fine

## spin up ubuntu iso

### see hardening.sh

ssh or console into ubuntu vm

# backend

## set up express

```bash
sudo apt install nodejs npm -y
```

### create project

```bash
mkdir express-app && cd express-app
npm init -y
npm i express
```

### create a server.js

### run server

```bash
node server.js
```

Ctrl+C

### install pm2 globally

```bash
npm install -g pm2
```

### start server with pm2

```bash
pm2 start server.js --name express-app
```

### pm2 restart on boot

```bash
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
pm2 save
```

### firewall

```bash
sudo ufw allow 3000/tcp
```

## reverse proxy

```bash
sudo apt install nginx -y
```

### nginx file

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

### enable site && restart nginx

```bash
sudo ln -s /etc/nginx/sites-available/express-app /etc/nginx/sites-enable
sudo systemctl restart nginx
```

### ssl

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
        proxy_pass http://localhost:3000;
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

### restart nginx

```bash
sudo systemctl restart nginx
```

## RESTful

```bash
npm i cors body-parser nodemon
```

### create index.js

## monogoDB

```bash
npm i mongoose dotenv
```

### create .env

modify index.js to load var and connect to DB

### docker

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

### check

```bash
sudo docker ps
```

restart policy

```bash
sudo docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' mongodb
```
