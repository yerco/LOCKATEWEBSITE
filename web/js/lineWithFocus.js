var prodUrl = "http://lockate.hopto.org:81";
var devUrl = "http://localhost:81";

function requestHandler(limit) { //(callback) {
    'use strict';
    //var url = devUrl + "/api/v1/lastgatewayevents/1/" + limit;
    var url = prodUrl + "/api/v1/lastgatewayevents/1/" + limit;
    return new Promise( function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = resolve;
        // Error case
        request.onerror = reject;
        // request.onreadystatechange = function() {
        //     if (request.readyState === 4) {
        //         console.log(request.response);
        //     }
        // };
        request.send();
    });

    /* another way */
    /*
    var request = $.ajax({
        url: devUrl + "/api/v1/lastgatewayevents/1/5",
        method: "GET"
    });

    request.done(function(msg) {
        callback(msg);
    });

    request.fail(function( jqXHR, textStatus ) {
        console.log(textStatus);
    });
    */
}
/* another way */
//requestHandler(dataAdapt);
// requestHandler()
//     .then(function(e) {
//         console.log(e.target.response)
//     }, function (e) {
//         console.log("Request error");
//     });

/**
 *
 * @param dateString - string ex: "Wed Apr 18 2018 15:10:31 GMT+0200 (CEST)"
 * @returns {number} - int ex (above example 1524057031)
 */
function datestringToTimestamp(dateString) {
    'use strict';
    var date = new Date(dateString);
    var timestampMillis = date.getTime();
    var timeStamp = timestampMillis;// / 1000;
    return timeStamp
}

function adaptData(packet) {
    'use strict';
    //var time = packet[value]['gateway_timestamp']['date']
    // var that keeps x(s) and y(s)
    var values = [];
    var packetKeys =  [];
    var xValue, yValue;
    var key;
    var megaPacket = [];
    var packetToGraph = {
        key: "",
        area: false,
        values: []
    };
    /**
     * BEWARE! this has been tested for just 1 gateway! (gateway_id = 1)
     */
    for (var value in packet) {
        //console.log(packet[value]);
        // extract gateway ID
        if (packetKeys.indexOf(packet[value]["gateway_id"]) === -1) {
            packetKeys.push(packet[value]["gateway_id"]);
            //console.log(packet[value]["gateway_timestamp"]["date"]);
            xValue = datestringToTimestamp(packet[value]["gateway_timestamp"]["date"])
            yValue = packet[value]["node_summary"]["phones_around"];
            //yValue = packet[value]["node_summary"]["phones_detected"];
            key = "Gateway" + packet[value]["gateway_id"];
            packetToGraph.key = key;
            packetToGraph.values.push({
                x: xValue, //d3.time.format.utc("%d %b, %H:%M")(newNow),
                y: yValue
            });
        }
        else { // already caught gateway ID
            // timestamps come in format like `date: "2018-04-17 08:35:54.000000"`
            // we need timestamps
            xValue = datestringToTimestamp(packet[value]["gateway_timestamp"]["date"])
            yValue = packet[value]["node_summary"]["phones_around"];
            //yValue = packet[value]["node_summary"]["phones_detected"];
            packetToGraph.values.push({
                x: xValue, //d3.time.format.utc("%d %b, %H:%M")(newNow),
                y: yValue
            });

        }
    }
    megaPacket.push(packetToGraph);

    return megaPacket;
}

var dummyData = [
    {key: "Stream0", area: false, values: [
        {x:0, y:12},
        {x:1, y:12},
        {x:2, y:0},
        {x:3, y:5},
        {x:4, y:6}
        ]
    }
    /*
    ,
    {key: "Stream1", area: false, values: [{x:2, y:0, series:1}]},
    {key: "Stream2", area: false, values: [{x:3, y:12, series:1}]},
    {key: "Stream3", area: false, values: [{x:4, y:0, series:1}]}
    */
];


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function addGraphWrapper(data, startBrush, endBrush) {
    nv.addGraph(function () {
        var chart = nv.models.lineWithFocusChart();

        /* Initial sliding frame */
        //chart.brushExtent([1, 3]);
        //chart.brushExtent([1523946958, 1522926985]);
        //chart.brushExtent([1374561814000, 1374565814000]);
        chart.brushExtent([startBrush, endBrush]);


        // chart.xAxis.tickFormat(d3.format(',f')).axisLabel("Stream - 3,128,.1");
        chart.xAxis.tickFormat(
            function (d) {
                return d3.time.format('%d-%b %H:%M:%S')(new Date(d));
            }
        )
            .axisLabel("Stream dd");


        // chart.x2Axis.tickFormat(d3.format(',f'));
        chart.x2Axis.tickFormat(
            function (d) {
                return d3.time.format('%d-%b %H:%M:%S')(new Date(d));
            }
        )
            .axisLabel("Stream dd");

        chart.yTickFormat(d3.format(',.2f'));

        chart.useInteractiveGuideline(true);
        // console.log("MEGA");
        // console.log(megaPacket);
        d3.select('#chart svg')
        //.datum(testData())
        //.datum(dummyData)
        //.datum(dummyData02)
        //    .datum(dummyDataTime)
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

// addGraphWrapper();
console.log("lineWithFocus stuff");

var limit = 10;
requestHandler(limit).then(function(e) {
    var data = adaptData(JSON.parse(e.target.response));
    data[0].values = data[0].values.reverse();
    var startBrush = data[0].values[3].x;
    var endBrush = data[0].values[8].x;
    addGraphWrapper(data, startBrush, endBrush);
}, function() {
    console.log("Error");
});
