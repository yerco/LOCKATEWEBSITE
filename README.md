# README.md

This site receives request from a counterpart API which stores data sent
by sensors (through their gateways)

## current software libraries versions

### Front-end
- nvd3 version 1.8.6-dev (CSS) - /css/nv.d3.css
- nvd3 version 1.8.6 (JS) - /js/nv.d3.min.js
- AutobahnJS unique official release - /js/autobahn.js
- Bootstrap v3.3.7 (CSS) - /bootstrap/css/bootstrap.min.css
- Bootstrap v3.3.6 (JS) - js/bootstrap.min.js
- Font Awesome 4.2.0 - /bootstrap/css/font-awesome.min.css
- d3.js ?????? - /js/d3.min.js
- jQuery v2.1.4 - /js/jquery.min.js

### Back-end
- Symfony 3.4
- as for the rest check composer(.json;.lock) 

## Dependencies
```
sudo apt-get install libzmq-dev
sudo apt-get install php-zmq
sudo apt-get install php-mysql
```

## Important Production and Development changes

File which need modifications (comment out lines) when switching from production
and development
- **src/SiteBundle/Util/push_server.php**
    - `tcp://127.0.0.1:5555` dev
    - `tcp://<IP HOST>:5555` prod
- **src/SiteBundle/Controller/SiteController.php**
    - `$socket->connect("tcp://127.0.0.1:5555");` dev
    - `$socket->connect("tcp://<IP HOST>:5555");` prod
    - NEW: `parameters.yml` now has an environment value, still testing it.
- **web/js/client_side.js**
    - `var conn = new ab.Session('ws://localhost:8018',` dev
    - `var conn = new ab.Session('ws://<IP HOST>:8018',` prod
Note:
- **app/AppKernel.php** has modifications to solve the `datetime timezone` error at prod.
It does not have effects on dev.

## Websockets

This is needed:

### Push Server

Run:
`$ php src/SiteBundle/Util/push_server.php`

If it does not start there could be X pending requests in the browser: try again X times.
