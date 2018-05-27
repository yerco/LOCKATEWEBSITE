//var prodUrl = "http://lockate.hopto.org:81";
var devUrl = "http://localhost:81";
var specificGraphData = [];
var graphLinks = [
    "phones_around_now",
    "phones_around_hour_mean",
    "phones_detected_hour",
    "phones_detected_today"
];

function requestHandler(limit) { //(callback) {
    'use strict';
    var url = devUrl + "/api/v1/lastgatewaynodesevents/1/1/" + limit;
    //var url = prodUrl + "/api/v1/lastgatewayevents/1/" + limit;
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
 * Assuming Amsterdam timezone dateString
 *
 * @param dateString - string ex: "Wed Apr 18 2018 15:10:31"
 * @returns {number} - int ex (above example 1524064231)
 */
function datestringToTimestamp(dateString) {
    'use strict';
    var date = new Date(dateString);
    // Amsterdam Time - done this way to work in firefox too.
    // As Amsterdam is GMT+02 we remove the offset first.
    date.setHours(date.getHours() - 2);
    // this line below does not work in firefox, left to remember.
    //var date = new Date(dateString + " " + "UTC+2");
    var timestampMillis = date.getTime() - (date.getTimezoneOffset() * 1000 * 60);
    var timeStamp = timestampMillis;// / 1000;
    return timeStamp;
}

function adaptData(packet) {
    'use strict';
    //var time = packet[value]['gateway_timestamp']['date']
    var xValue, yValue;
    var key;
    var packetToGraph = {
        "phones_around_now": {
            key: "",
            area: false,
            values: []
        },
        "phones_around_hour_mean": {
            key: "",
            area: false,
            values: []
        },
        "phones_detected_hour": {
            key: "",
            area: false,
            values: []
        },
        "phones_detected_today": {
            key: "",
            area: false,
            values: []
        }
    };

    /**
     * BEWARE! this has been tested for just 1 gateway! (gateway_id = 1)
     */
    //console.log(packet);
    for (var value in packet) {
        // console.log(packet[value]["gateway_id_real"]);
        // extract gateway ID (it's send in the request too)
        //console.log(packet[value]["gateway_id_real"]);
        if (packet[value]["gateway_id_real"]) {
            key = "Gateway " + packet[value]["gateway_id_real"] + " - Node " +
                packet[value]["node_id_real"];
            // filling keys
            packetToGraph["phones_around_now"].key = key;
            packetToGraph["phones_around_hour_mean"].key = key;
            packetToGraph["phones_detected_hour"].key = key;
            packetToGraph["phones_detected_today"].key = key;

            // phones_around_now
            xValue = datestringToTimestamp(packet[value]["node_timestamp"]["date"]);
            yValue = packet[value]["node_summary"]["phones_around_now"];
            packetToGraph["phones_around_now"].values.push(
                {x: xValue, y: yValue}
            );
            // time (xValue) is the same for the whole lecture
            // phones_around_hour_mean
            yValue = packet[value]["node_summary"]["phones_around_hour_mean"];
            packetToGraph["phones_around_hour_mean"].values.push(
                {x: xValue, y: yValue}
            );
            // phones_detected_hour
            yValue = packet[value]["node_summary"]["phones_detected_hour"];
            packetToGraph["phones_detected_hour"].values.push(
                {x: xValue, y: yValue}
            );
            // phones_detected_today
            yValue = packet[value]["node_summary"]["phones_detected_today"];
            packetToGraph["phones_detected_today"].values.push(
                {x: xValue, y: yValue}
            );
            /* old way
            packetToGraph.values.push({
                x: xValue, //d3.time.format.utc("%d %b, %H:%M")(newNow),
                y: yValue
            });
            */
        }
        else { // problem big time - No gateway_id
            console.log("Problems no gateway_id detected");
        }
    }
    //console.log(packetToGraph);
    return packetToGraph;
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

function addGraphWrapper(data, startBrush, endBrush, chartDivId) {
    "use strict";
    console.log("addGraphWrapper's data");
    console.log(data);
    nv.addGraph(function () {
        var chart = nv.models.lineWithFocusChart()
            .margin({right:50, left: 75});
        chart.interpolate("linear");
        /* Initial sliding frame */
        //chart.brushExtent([1, 3]);
        //chart.brushExtent([1523946958, 1522926985]);
        //chart.brushExtent([1374561814000, 1374565814000]);
        chart.brushExtent([startBrush, endBrush]);

        // chart.xAxis.tickFormat(d3.format(',f')).axisLabel("Stream - 3,128,.1");
        chart.xAxis
            .axisLabel('Date and Time')
            .tickFormat(
            function (d) {
                return d3.time.format('%d-%b %H:%M')(new Date(d));
            }
        );

        // chart.x2Axis.tickFormat(d3.format(',f'));
        chart.x2Axis.tickFormat(
            function (d) {
                return d3.time.format('%d-%b %H:%M')(new Date(d));
            }
        );
        chart.yAxis.axisLabel('var_name'+' [units]');
        chart.yTickFormat(d3.format(',.2f'));

        chart.useInteractiveGuideline(true);
        // console.log("MEGA");
        // console.log(megaPacket);
        d3.select("#" + chartDivId + " " + "svg")
        //d3.select('#'+ chartDivId + ' ' + 'svg')
        //.datum(testData())
        //.datum(dummyData)
        //.datum(dummyData02)
        //    .datum(dummyDataTime)
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        // Improves tooltip re-rendering behavior.
        d3.selectAll('.nvtooltip').style('opacity', '0');
        return chart;
    });
}

function renderChart(currentChart, chartDivId) {
    "use strict";
    window.currentChart = currentChart;
    console.log("chart div id: ", chartDivId);
    // coloring active graph's link
    graphLinks.forEach(function(clickedLink) {
        if (clickedLink === currentChart) {
            document.getElementById(clickedLink).style.backgroundColor="#d9edf7";
            document.getElementById(clickedLink).style.fontWeight="bold";
        }
        else {
            document.getElementById(clickedLink).style.backgroundColor="transparent";
            document.getElementById(clickedLink).style.fontWeight="normal";
        }
    });
    var limit = 100;
    var downwardLimit = Math.ceil(limit * 0.7);
    // `limit - 1` last element of the array
    var upperLimit = Math.floor(limit - 1);
    specificGraphData[0] = window.allData[currentChart];
    // Reverse timestamps needs to be done just once
    if (specificGraphData[0].values[0].x > specificGraphData[0].values[1].x) {
        specificGraphData[0].values = specificGraphData[0].values.reverse();
    }
    //console.log("allData");
    //console.log(window.allData[currentChart]);
    var startBrush = window.allData[currentChart].values[downwardLimit].x;
    var endBrush = window.allData[currentChart].values[upperLimit].x;
    addGraphWrapper(specificGraphData, startBrush, endBrush, chartDivId);
}

// addGraphWrapper();
console.log("lineWithFocus stuff");

/** runs at first load **/
var limit = 100;
requestHandler(limit).then(function(e) {
        'use strict';
        window.allData = adaptData(JSON.parse(e.target.response));
        renderChart("phones_around_now", "chart");
    }, function() {
        console.log("Error");
    }
);
