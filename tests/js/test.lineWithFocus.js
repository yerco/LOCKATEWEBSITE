var expect = chai.expect;
var allData;

describe('Line with focus', function() {
    'use strict';
    describe('Scale', function() {
        xit('should retrieve data from the API (resolves)', function() {
            var limit = 10;
            return requestHandler(limit).then(function(data) {
                //console.log(data.target.response);
                expect(data).not.to.be.empty;
            });
        });

        xit('should have a function to transform Dates to timestamps', function() {
            var dateSampleString = "Wed Apr 18 2018 15:10:31";
            var dateSampleTimestamp = 1524064231; // without millis '1524064231
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
            var graphPacketSample = [
                {
                    key: "Gateway 1",
                    area: false,
                    values: [
                        {x:1523946958, y:20},
                        {x:1523946954, y:33}
                        // ,{x:1374562814000, y:12}
                        // ,{x:1374563814000, y:0}
                        // ,{x:1374564814000, y:5}
                        // ,
                        // {x:1374565814000, y:6}
                    ]
                }
            ];

            var graphPacketsSamples = {
                "phones_around_now": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853, y:15},
                        {x:1526316847, y:49}
                    ]
                },
                "phones_around_hour_mean": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853, y:96},
                        {x:1526316847, y:16}
                    ]
                },
                "phones_detected_hour": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853, y:26},
                        {x:1526316847, y:0}
                    ]
                },
                "phones_detected_today": {
                    key: "Gateway 1 - Node 1",
                    area: false,
                    values: [
                        {x:1526316853, y:37},
                        {x:1526316847, y:71}
                    ]
                }
            };

            var adaptedPacket = adaptData(responsePacketSample);
            expect(adaptedPacket).to.deep.equal(graphPacketsSamples);
        });

        /* This is a graphic test - need to check the browser */
        xit('should make graphs with requested sample of data (including links)', function() {
            "use strict";
            var limit = 100;
            requestHandler(limit).then(function(e) {
                allData = adaptData(JSON.parse(e.target.response));
                renderChart('phones_around_hour_mean');
                //expect(e).not.to.be.empty;
            }, function() {
                console.log("Error");
            });
        });

       xit('should make a graph with the requested info', function() {
            // here timestamps are backward
            var sample = [
                {
                    key: "Gateway1",
                    area: false,
                    values: [
                        {x: 1524465354000, y: 20, series: 0}, // Monday, 23 April 2018 06:35:54
                        {x: 1524378954000, y: 33, series: 0}, //Sunday, 22 April 2018 06:35:54
                        {x: 1524292554000, y: 13, series: 0}, // Saturday, 21 April 2018 06:35:54
                        {x: 1524206154000, y: 93, series: 0}, // Friday, 20 April 2018 06:35:54
                        {x: 1524119754000, y: 88, series: 0}, // Thursday, 19 April 2018 06:35:54
                        {x: 1524033354000, y: 37, series: 0}, // Wednesday, 18 April 2018 06:35:54
                        {x: 1523946954000, y: 87, series: 0}, // Tuesday, 17 April 2018 06:35:54
                        {x: 1523880648000, y: 6, series: 0}, // Monday, 16 April 2018 12:10:48
                        {x: 1523774154000, y: 23, series:0 }, // Sunday, 15 April 2018 06:35:54
                        {x: 1523697945000, y: 56, series: 0}, // Saturday, 14 April 2018 09:25:45
                        {x: 1523597836000, y: 24, series: 0} // Friday, 13 April 2018 05:37:16
                    ]
                }
            ];
            sample[0].values = sample[0].values.reverse();
            var startBrush = sample[0].values[0].x;
            var endBrush = sample[0].values[6].x;

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
            addGraphWrapper(sample, startBrush, endBrush);
        });
    });
});