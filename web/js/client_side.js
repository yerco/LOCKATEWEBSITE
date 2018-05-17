var timeData;
var phonesAroundNow;
var phonesAroundHourMean;
var phonesDetectedHour;
var phonesDetectedToday;
var gatewayTime;
var nodeTime;
var chartDivId = "chart";
var phones_around_hour_mean = [];

window.currentChart = "phones_around_now";

/* DEVELOPMENT */
var conn = new ab.Session('ws://localhost:8018',
/* PRODUCTION */
//var conn = new ab.Session('ws://lockate.hopto.org:8018',
    function() {
        "use strict";
        conn.subscribe('gateway_record', function(topic, data) {
            // add to DOM
            var packet = data.packet[0];
            //console.log(packet['gateway_id']);
            console.log(packet);
            //console.log(packet['node_record'][0]['timestamp']);
            //console.log(packet['node_record'][0]['node_summary']['phones_around']);
            timeData = packet['node_record'][0]['timestamp'];
            phonesAroundNow = packet['node_record'][0]['node_summary']['phones_around_now'];
            phonesAroundHourMean = packet['node_record'][0]['node_summary']['phones_around_hour_mean'];
            phonesDetectedHour = packet['node_record'][0]['node_summary']['phones_detected_hour'];
            phonesDetectedToday = packet['node_record'][0]['node_summary']['phones_detected_today'];
            gatewayTime = new Date(packet['timestamp'] * 1000);
            nodeTime = new Date(packet['node_record'][0]['timestamp'] * 1000);
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

            /* graph  nvd3 */
            var limit = 100;
            var downwardLimit = Math.ceil(limit * 0.7);
            // `limit - 1` last element of the array
            var upperLimit = Math.floor(limit - 1);
            // we start with `phones_around_hour_now`
            requestHandler(limit).then(function(e) {
                window.allData = adaptData(JSON.parse(e.target.response));
                console.log(window.allData);
                specificGraphData[0] = allData[currentChart];
                // reverse -> order timestamps
                specificGraphData[0].values = specificGraphData[0].values.reverse();
                var startBrush = window.allData[currentChart].values[downwardLimit].x;
                var endBrush = window.allData[currentChart].values[upperLimit].x;
                //console.log(allData);
                renderChart(window.currentChart);
                //addGraphWrapper(specificGraphData, startBrush, endBrush);
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

