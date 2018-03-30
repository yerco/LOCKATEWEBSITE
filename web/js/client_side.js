var conn = new ab.Session('ws://localhost:8018',
    function() {
        conn.subscribe('gateway_record', function(topic, data) {
            // add to DOM

            packet = data.packet[0];
            //console.log(packet['gateway_id']);
            console.log(packet);
        });
    },
    function() {
        console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
);

console.log("eventual thing happening");
