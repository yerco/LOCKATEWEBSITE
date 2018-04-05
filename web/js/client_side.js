var timeData;
var phonesAround;
var gatewayTime;
var nodeTime;

var conn = new ab.Session('ws://localhost:8018',
    function() {
        conn.subscribe('gateway_record', function(topic, data) {
            // add to DOM
            packet = data.packet[0];
            //console.log(packet['gateway_id']);
            //console.log(packet);
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
        });
    },
    function() {
        console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
);

console.log("eventual thing happening");

var smoothie = new SmoothieChart({
    grid:{millisPerLine:60000},
    timestampFormatter:SmoothieChart.timeFormatter,
    millisPerPixel:300
});
smoothie.streamTo(document.getElementById("mycanvas"));

var line1 = new TimeSeries();

setInterval(function() {
    //line1.append(timeData, phonesAround);
    line1.append(timeData + '000', phonesAround);
    //line2.append(new Date().getTime(), Math.random());
}, 60000);

// Add to SmoothieChart
smoothie.addTimeSeries(line1);
