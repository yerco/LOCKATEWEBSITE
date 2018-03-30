<?php

namespace SiteBundle\Service;

use Psr\Log\LoggerInterface;
use ZMQContext;

class JsonHandler
{
    protected $logger;
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

    public function receivedJson($json) {
        $request_json_content = json_decode($json->getContent());

        if ($request_json_content->gateway_record) {
            $entry_data = array(
                'category' => 'gateway_record',
                'packet' => $request_json_content->gateway_record,
                'article' => 'articulo',
                'when' => time()
            );
            $context = new ZMQContext();
            $socket = $context->getSocket(\ZMQ::SOCKET_PUSH, "my pusher");
            $socket->connect("tcp://localhost:5555");

            $this->logger->info("Records sent .");
            // pay attention to this name `gateway_id`
            // (it's same at ReceiverPusher `onNewData`

            //var_dump($request_json_content);
            $socket->send(json_encode(
                    $entry_data
                )
            );
        }
    }
}