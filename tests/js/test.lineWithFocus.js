var expect = chai.expect;
var allData;

describe('Line with focus', function() {
    'use strict';
    describe('Scale', function() {
        xit('should retrieve data from the API (resolves)', function() {
            var limit = 2;
            return requestHandler(limit).then(function(data) {
                console.log(data.target.response);
                expect(data).not.to.be.empty;
            });
        });

        xit('should have a function to transform Dates to timestamps', function() {
            // 1.- From the websocket we receive a plain timestamp
            // 2.- from AJAX we receive a time formated as
            //      Ex: {"date":"2018-05-23 10:14:30.000000","timezone_type":3,"timezone":"UTC"}
            // a UTC/GMT time
            var dateSampleString = "2018-05-23 10:14:30.000000";
            // the equivalent timestamp
            var dateSampleTimestamp = 1527070470000; // without millis '1527070470
            // Human time (GMT): Wednesday, 23 May 2018 10:14:30
            // Human time (Your time zone): Wednesday, 23 May 2018 12:14:30 GMT+02:00
            var timestamp = datestringToTimestamp(dateSampleString);
            expect(timestamp).to.be.equal(dateSampleTimestamp);
        });

        xit('should adapt the data to a proper format (AdaptData)',function() {

            // conversions to timestamp using https://www.epochconverter.com/
            // endpoint ` /api/v1/lastgatewaynodesevents/{gateway_id}/{node_id}/{limit}`
            var responsePacketSample =
                [
                    {
                        "gateway_id_real": 1,
                        "gateway_summary": {
                            "device": "RPI",
                            "name": "naifo_gateway",
                            "location": "penalolen"
                        },
                        "gateway_timestamp": {
                            "date": "2018-05-14 16:54:13.000000", // 1526316853; millis 1526316853000
                            "timezone_type": 3,
                            "timezone": "UTC"
                        },
                        "node_id_real": 1,
                        "node_summary": {
                            "phones_around_now": 15,
                            "phones_around_hour_mean": 96,
                            "phones_detected_hour": 26,
                            "phones_detected_today": 37,
                            "name": "naifo_node"
                        },
                        "node_timestamp": {
                            "date": "2018-05-14 16:54:13.000000", // 1526316853; millis 1526316853000
                            "timezone_type": 3,
                            "timezone": "UTC"
                        }
                    },
                    {
                        "gateway_id_real": 1,
                        "gateway_summary": {
                            "device": "RPI",
                            "name": "naifo_gateway",
                            "location": "penalolen"
                        },
                        "gateway_timestamp": {
                            "date": "2018-05-14 16:54:07.000000", // 1526316847; millis 1526316847000
                            "timezone_type": 3,
                            "timezone": "UTC"
                        },
                        "node_id_real": 1,
                        "node_summary": {
                            "phones_around_now": 49,
                            "phones_around_hour_mean": 16,
                            "phones_detected_hour": 0,
                            "phones_detected_today": 71,
                            "name": "naifo_node"
                        },
                        "node_timestamp": {
                            "date": "2018-05-14 16:54:07.000000", // 1526316847; millis 1526316847000
                            "timezone_type": 3,
                            "timezone": "UTC"
                        }
                    }
                ]
            ;
            /*
            var graphPacketSample = [
                {
                    key: "Gateway 1",
                    area: false,
                    values: [
                        {x:1523946958000, y:20},
                        {x:1523946954000, y:33}
                        // ,{x:1374562814000, y:12}
                        // ,{x:1374563814000, y:0}
                        // ,{x:1374564814000, y:5}
                        // ,
                        // {x:1374565814000, y:6}
                    ]
                }
            ];
            */
            var graphPacketsSamples = {
                "phones_around_now": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853000, y:15},
                        {x:1526316847000, y:49}
                    ]
                },
                "phones_around_hour_mean": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853000, y:96},
                        {x:1526316847000, y:16}
                    ]
                },
                "phones_detected_hour": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853000, y:26},
                        {x:1526316847000, y:0}
                    ]
                },
                "phones_detected_today": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853000, y:37},
                        {x:1526316847000, y:71}
                    ]
                }
            };

            // this has millis
            var adaptedPacket = adaptData(responsePacketSample);
            console.log(adaptedPacket);
            expect(adaptedPacket).to.deep.equal(graphPacketsSamples);
        });

        /* This is a graphic test - need to check the browser */
        xit('should make graphs with requested sample of data (including links)', function() {
            "use strict";
            var limit = 100;
            requestHandler(limit).then(function(e) {
                allData = adaptData(JSON.parse(e.target.response));
                renderChart('phones_around_hour_mean', "otra-chart");
                //expect(e).not.to.be.empty;
            }, function() {
                console.log("Error");
            });
        });

        /* This is a graphic test - need to check the browser */
       xit('should make a graph with the requested info', function() {
            // here timestamps are backward
            var sample = [
                {
                    key: "Gateway1",
                    area: false,
                    color: "red",
                    values: [
                        {x: 1524465354000, y: 20, series: 0}, // Monday, 23 April 2018 06:35:54 GMT
                        {x: 1524378954000, y: 99, series: 0}, //Sunday, 22 April 2018 06:35:54 GMT
                        {x: 1524292554000, y: 20, series: 0}, // Saturday, 21 April 2018 06:35:54 GMT
                        {x: 1524206154000, y: 93, series: 0}, // Friday, 20 April 2018 06:35:54 GMT
                        {x: 1524119754000, y: 88, series: 0}, // Thursday, 19 April 2018 06:35:54 GMT
                        {x: 1524033354000, y: 37, series: 0}, // Wednesday, 18 April 2018 06:35:54 GMT
                        {x: 1523946954000, y: 87, series: 0}, // Tuesday, 17 April 2018 06:35:54 GMT
                        {x: 1523880648000, y: 6, series: 0}, // Monday, 16 April 2018 12:10:48 GMT
                        {x: 1523774154000, y: 23, series:0 }, // Sunday, 15 April 2018 06:35:54 GMT
                        {x: 1523697945000, y: 56, series: 0}, // Saturday, 14 April 2018 09:25:45 GMT
                        {x: 1523597836000, y: 24, series: 0} // Friday, 13 April 2018 05:37:16 GMT
                    ]
                }
            ];
            // Pay attention to this reverse
            sample[0].values = sample[0].values.reverse();
            var startBrush = sample[0].values[6].x;
            var endBrush = sample[0].values[10].x;

            // this is organized by time increasing
            var dummyDataTime = [
                {
                    key: "Stream0", area: false,
                    values: [
                        {x:1374561814, y:12},
                        {x:1374562814, y:12},
                        {x:1374563814, y:0},
                        {x:1374564814, y:5},
                        {x:1374565814, y:6}
                    ]
                }
            ];
            addGraphWrapper(sample, startBrush, endBrush, "otra-chart");
        });

       xit('should fill the panel/boxes with numbers received through the websocket', function() {
           "use strict";
           // as received through the websocket
            var websocket_packet =
                {
                    'gateway_record': [{
                        'gateway_id': 1,
                        'gateway_summary': {'device': 'RPI', 'name': 'naifo_gateway', 'location': 'penalolen'},
                        'node_record': [{
                            'node_summary': {
                                'phones_around_now': 33,
                                'phones_around_hour_mean': 40,
                                'phones_detected_hour': 66,
                                'phones_detected_today': 83,
                                'name': 'naifo_node'
                            },
                            'node_id': 1,
                            // GMT: Wednesday, 23 May 2018 10:14:30
                            // Amsterdam: Wednesday, 23 May 2018 12:14:30 GMT+02:00 DST
                            'timestamp': '1527070470',
                            'sensor_record': [{
                                'input': [{
                                    'rssi': 26.409003545865204,
                                    'company': 'ARRIS Group, Inc.',
                                    'mac': '54:65:de:60:d0:b0'
                                }, {
                                    'rssi': 26.42148613246015,
                                    'company': 'HUAWEI TECHNOLOGIES CO.,LTD',
                                    'mac': '7c:7d:3d:ab:c1:92'
                                }], 'sensor_id': 1, 'sensor_description': {'name': 'Atheros'}
                            }]
                        }],
                        // GMT: Wednesday, 23 May 2018 10:14:30
                        // Amsterdam: Wednesday, 23 May 2018 12:14:30 GMT+02:00 DST
                        'timestamp': '1527070470'
                    }]
                };

            // this chunk is analogous to the function `panelsInfo` from `client_side.js`
            var packet = websocket_packet.gateway_record[0];
            console.log(packet);
            var timeData = packet['node_record'][0]['timestamp'];
            var phonesAroundNow = packet['node_record'][0]['node_summary']['phones_around_now'];
            var phonesAroundHourMean = packet['node_record'][0]['node_summary']['phones_around_hour_mean'];
            var phonesDetectedHour = packet['node_record'][0]['node_summary']['phones_detected_hour'];
            var phonesDetectedToday = packet['node_record'][0]['node_summary']['phones_detected_today'];
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
           expect(document.getElementById("phones-around-now").innerText).to.equal('33');
           expect(document.getElementById("phones-around-hour-mean").innerText).to.equal('40');
           expect(document.getElementById("phones-detected-hour").innerText).to.equal('66');
           expect(document.getElementById("phones-detected-today").innerText).to.equal('83');
       });

    });
});