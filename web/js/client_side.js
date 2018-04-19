var timeData;
var phonesAround;
var phonesDetected;
var gatewayTime;
var nodeTime;

/* DEVELOPMENT */
//var conn = new ab.Session('ws://localhost:8018',
/* PRODUCTION */
var conn = new ab.Session('ws://lockate.hopto.org:8018',
    function() {
        conn.subscribe('gateway_record', function(topic, data) {
            // add to DOM
            packet = data.packet[0];
            //console.log(packet['gateway_id']);
            console.log(packet);
            //console.log(packet['node_record'][0]['timestamp']);
            //console.log(packet['node_record'][0]['node_summary']['phones_around']);
            timeData = packet['node_record'][0]['timestamp'];
            phonesAround = packet['node_record'][0]['node_summary']['phones_around'];
            phonesDetected = packet['node_record'][0]['node_summary']['phones_detected'];
            gatewayTime = new Date(packet['timestamp'] * 1000);
            nodeTime = new Date(packet['node_record'][0]['timestamp'] * 1000);
            document.getElementById("phones-around").innerHTML = phonesAround;
            document.getElementById("phones-detected").innerHTML = phonesDetected;
            document.getElementById("gateway-time").innerHTML = gatewayTime;
            document.getElementById("node-time").innerHTML = nodeTime;

            /* graph  nvd3 */
            var limit = 100;
            var downwardLimit = Math.ceil(limit * 0.7);
            var upperLimit = Math.floor(limit * 0.8);
            requestHandler(limit).then(function(e) {
                var data = adaptData(JSON.parse(e.target.response));
                data[0].values = data[0].values.reverse();
                var startBrush = data[0].values[downwardLimit].x;
                var endBrush = data[0].values[upperLimit].x;
                addGraphWrapper(data, startBrush, endBrush);
            }, function() {
                console.log("Error");
            });

        });
    },
    function() {
        console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
);

console.log("eventual thing happening");

