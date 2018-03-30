<?php

namespace SiteBundle\Util;

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

/**
 * This script mediates data sent between each client and our
 * CapturedDataReceiver application, and catches errors
 */
require __DIR__ . '/../../../vendor/autoload.php';

$port = 8081;

$server = IoServer::factory(
    //new CapturedDataReceiver(),
    new HttpServer(
        new WsServer(
            new CapturedDataReceiver()
        )
    ),
    $port
);

$server->run();

