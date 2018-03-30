<?php

namespace SiteBundle\Util;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/**
 * This class, usually implemented by a Connection instance, is a
 * representation of a client's connection on the other side of the socket.
 */
class CapturedDataReceiver implements MessageComponentInterface
{
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage();
    }

    function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    function onMessage(ConnectionInterface $from, $msg)
    {
        $num_received = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s'."\n",
            $from->resourceId, $msg, $num_received, $num_received == 1 ? '' :
                's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client
                // connected
                $client->send($msg);
            }
        }
    }

    function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it
        // messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId}has disconnected\n";
    }

    function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred:{$e->getMessage()}\n";

        $conn->close();
    }
}