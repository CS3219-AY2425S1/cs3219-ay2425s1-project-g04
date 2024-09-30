Written in JS, using publish-subscribe pattern
To spin up rabbitmq container in docker:  docker run -d --hostname rmq --name rabbit-server -p 8080:15672 -p 5672:5672 rabbitmq:3-management

map 8080 on our own localhost port to 15672 port on rabbitmq and 5672 port to 5672 port 