<?php

namespace SiteBundle\Util;

use React;
use React\EventLoop\Factory;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Wamp\WampServer;
use ZMQ;

require __DIR__ . '/../../../vendor/autoload.php';


$loop = Factory::create();
$pusher = new ReceiverPusher();

// Listen for the web server to make a ZeroMQ push after an ajax request
$context = new React\ZMQ\Context($loop);
$pull = $context->getSocket(ZMQ::SOCKET_PULL);
// Binding to 127.0.0.1 means the only client that can connect is itself
$pull->bind('tcp://127.0.0.1:5555');
$pull->on('message', array($pusher, 'onNewData'));

// Set up our WebSocket server for clients wanting real-time updates
$webSock = new React\Socket\Server('0.0.0.0:8018', $loop); // Binding to 0.0.0
//.0 means remotes can connect
$webServer = new IoServer(
    new HttpServer(
        new WsServer(
            new WampServer(
                $pusher
            )
        )
    ),
    $webSock
);

$loop->run();

