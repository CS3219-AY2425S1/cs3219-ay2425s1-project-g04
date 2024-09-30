Written in JS, using publish-subscribe pattern
To spin up rabbitmq container in docker:  docker run -d --hostname rmq --name rabbit-server -p 8080:15672 -p 5672:5672 rabbitmq:3-management

map 8080 on our own localhost port to 15672 port on rabbitmq and 5672 port to 5672 port 

Different exchanges we can use + Bindings to Queues -> Queues
- Direct exchange e.g. directs to queue by looking at routing key, user requests taxi A, routes to taxi A
- Topic exchange e.g. directs to queue by looking at routing key PATTERNS on bindings e.g. user requests for eco & large taxi, routes to taxis with tag eco/large, 
routing key must be denoted by period e.g. taxi.eco.large routes to taxi.eco.small taxi.eco.large, does support strict routing key matchin like direct exchange but
can also perform wildcard matching using * and # as placeholders e.g. taxi.any.large routes to all taxis bound as a large taxi e.g. taxi.*.large 
- Fanout exchange e.g. does not care about routing key even if provided, used to inform all taxis about blocked road 
- Headers exchange e.g. directs to queue by looking at HEADERS instead of routing key, used by reporting status at taxi company, argument x-match specifies if headers must
match all or any -> for reports for all taxis for trips from New York or to New York then x-match=ANY, from=NEW YORK, to=NEW YORK, to find taxis only with trips within New york,
set x-match to ALL 
