var chartDivId = "chart";

window.currentChart = "phones_around_now";

/**
 *
 * @param topic - left for possible future use
 * @param data
 */
function panelsInfo(topic, data) {
    "use strict";
    /* Section get through the websocket */
    // add to DOM
    var packet = data.packet[0];
    //console.log(packet['gateway_id']);
    //console.log(packet);
    //console.log(packet['node_record'][0]['timestamp']);
    //console.log(packet['node_record'][0]['node_summary']['phones_around']);
    var timeData = packet['node_record'][0]['timestamp'];
    var phonesAroundNow = packet['node_record'][0]['node_summary']['phones_around_now'];
    var phonesAroundHourMean = packet['node_record'][0]['node_summary']['phones_around_hour_mean'];
    var phonesDetectedHour = packet['node_record'][0]['node_summary']['phones_detected_hour'];
    var phonesDetectedToday = packet['node_record'][0]['node_summary']['phones_detected_today'];
    // localtime(s) plus GMT offset indication
    var gatewayTime = new Date(packet['timestamp'] * 1000);
    var nodeTime = new Date(packet['node_record'][0]['timestamp'] * 1000);
    document.getElementById("phones-around-now").innerHTML = phonesAroundNow;
    document.getElementById("phones-around-hour-mean").innerHTML = phonesAroundHourMean;
    document.getElementById("phones-detected-hour").innerHTML = phonesDetectedHour;
    document.getElementById("phones-detected-today").innerHTML = phonesDetectedToday;
    var gatewayTimes = document.getElementsByClassName("gateway-time");
    for (var i = 0; i < gatewayTimes.length; i++) {
        gatewayTimes[i].innerHTML = gatewayTime;
    }
    var nodeTimes = document.getElementsByClassName("node-time");
    for (i = 0; i < nodeTimes.length; i++) {
        nodeTimes[i].innerHTML = nodeTime;
    }
}

/* DEVELOPMENT */
var conn = new ab.Session('ws://localhost:8018',
/* PRODUCTION */
//var conn = new ab.Session('ws://lockate.hopto.org:8018',
    function() {
        "use strict";
        conn.subscribe('gateway_record', function(topic, data) {

            // Info gotten through websocket
            panelsInfo(topic, data);

            /* Section get through AJAX request */
            /* graph  nvd3 */
            var limit = 100;
            // we start with `phones_around_hour_now`
            requestHandler(limit).then(function(e) {
                window.allData = adaptData(JSON.parse(e.target.response));
                console.log(window.allData);
                specificGraphData[0] = allData[window.currentChart];
                // reverse -> order timestamps
                specificGraphData[0].values = specificGraphData[0].values.reverse();
                renderChart(window.currentChart, "chart");
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

