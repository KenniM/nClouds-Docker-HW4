# nClouds - Docker Final Project

This project is a small web application that uses a Relational Database `(MySQL)` and a Cache Engine `(Redis)` to store a list or emails and names, each list (from MySQL and Redis) can store different values, but you can't store duplicated email entries on a single database.

The Web Application is based on the `ReactJS` framework, its Docker image is already created and available on Dockerhub.

To get the data stored in both MySQL and Redis databases, we're going to use a `NodeJS` application, like the web app, its Docker image is already created and available on Dockerhub.

For MySQL and Redis, were going the use their official latest versions and we're going to set them up using `Docker compose` to connect all of our four containers.

Also, we're going to set up passwords to get access to both databases, so, we're going to use `Docker secrets` to improve our containers security

* **NOTE**: we're going to use this project as a Demo, so, on this Github repo you can find the required files (`/db` folder) with the defined password to get access to the containers. **This files should not be shared through public repos**.

## Launching the project

Since we have already both Web app and API images, there is no need to download the whole repo, we just need the `/db` folder with their files and the `docker-compose.yml` file to launch our application, but you can download the repo to get the source code anyways.

```yml
version: '3.9'

# We're going to use each container as a service
services:
# Get the MySQL image
  mysql_db:
    image: mysql:latest
    container_name: mysql_db
    ports:
      - '3306:3306'
# The first volume is used to create the table we are going to use in our database, we can create any .sql file we want and put it into the /db/sql/scripts folder

# The second one is going to get used as our data folder. If we don't create this volume, all our data will get lost if we stop the container
    volumes:
      - ./db/sql/scripts:/docker-entrypoint-initdb.d/
      - ./db/sql/data:/var/lib/mysql

# Since we're going to use Secrets, the root password must be specified through the MYSQL_ROOT_PASSWORD_FILE environment, then, we specify the secret location
    environment:
      - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/mysql_root_password
      - MYSQL_DATABASE=hw4
      - MYSQL_ROOT_HOST=%

# To make the previous environments work, we must include our secret into this container, its defintion can be found at the end of this file
    secrets:
      - mysql_root_password

  redis_db_s:
# Get the Redis image, we can use the alpine version
    image: redis:alpine
    container_name: redis_db
# Import the secrets you want to use on this container. For Redis, you have to provide an ACL file to setup the password, this file is going to be our secret, then we will use it on the redis.conf file to set up our redis server
    secrets:
      - REDIS_ACL_SECRET
# When we start the container, we're going to tell redis to start using our customized configuration file.
    command: redis-server /usr/local/etc/redis/redis.conf
# We need to put our redis.conf file into the container
    volumes:
      - ./db/cache/redis.conf:/usr/local/etc/redis/redis.conf


  nodeApi:
# Get the corresponding NodeJS API image
    image: kenni26/nclouds_hw4_api
    container_name: node_api
    ports:
      - '3500:3500'
# Include the secrets you want to use
    secrets:
      - REDIS_PASSWORD
      - mysql_root_password
    links:
      - mysql_db
      - redis_db_s
    depends_on:
      - mysql_db
      - redis_db_s
  
  web_app:
# Get the corresponding ReactJS Web App image
    image: kenni26/nclouds_hw4_web_app
    container_name: web_app
    ports:
      - "8080:80"
    links:
      - nodeApi
      - mysql_db
      - redis_db_s

# Here, we can define our secrets, we assign them a name and then, we can specify a file location
secrets:
  mysql_root_password:
    file: ./db/sql/db_root_password.txt
  REDIS_ACL_SECRET:
    file: ./db/cache/users.acl
  REDIS_PASSWORD:
    file: ./db/cache/redisPsw.txt

``` 
Finally, we can start our Docker compose project
Go to your project root folder, open a terminal and run:
```shell
docker-compose build
docker-compose up -d
```
Wait until Docker finishes to download all the images and start all the containers.

Once it finished, you can go to `localhost:8080` and test the app.