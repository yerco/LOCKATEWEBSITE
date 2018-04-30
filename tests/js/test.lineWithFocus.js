var expect = chai.expect;

describe('Line with focus', function() {
    'use strict';
    describe('Scale', function() {
        xit('should retrieve data from the API (resolves)', function() {
            var limit = 10;
            return requestHandler(limit).then(function(data) {
                console.log(data.responseXML);
                expect(data).not.to.be.empty;
            });
        });

        it('should have a function to transform Dates to timestamps', function() {
            var dateSampleString = "Wed Apr 18 2018 15:10:31 GMT+0200 (CEST)";
            var dateSampleTimestamp = 1524057031000; // without millis '1524064231
            var timestamp = datestringToTimestamp(dateSampleString);
            expect(timestamp).to.be.equal(dateSampleTimestamp);
        });

        xit('should adapt the data to a proper format',function() {

            // conversions to timestamp using https://www.epochconverter.com/
            var responsePacketSample =
                [
                    {
                        "gateway_id": 1,
                        "gateway_summary": {
                            "device": "RPI",
                            "name": "naifo_gateway",
                            "location": "penalolen"
                        },
                        "gateway_timestamp": {
                            "date": "2018-04-17 08:35:58.000000",
                            "timezone_type": 3,
                            "timezone": "UTC"
                        },
                        "node_summary": {
                            "phones_around": 20,
                            "name": "naifo_node",
                            "phones_detected": 25
                        },
                        "node_timestamp": {
                            "date": "2018-04-17 08:35:58.000000",
                            "timezone_type": 3,
                            "timezone": "UTC"
                        }
                    },
                    {
                        "gateway_id": 1,
                        "gateway_summary": {
                            "device": "RPI",
                            "name": "naifo_gateway",
                            "location": "penalolen"
                        },
                        "gateway_timestamp": {
                            "date": "2018-04-17 08:35:54.000000",
                            "timezone_type": 3,
                            "timezone": "UTC"
                        },
                        "node_summary": {
                            "phones_around": 33,
                            "name": "naifo_node",
                            "phones_detected": 39
                        },
                        "node_timestamp": {
                            "date": "2018-04-17 08:35:54.000000",
                            "timezone_type": 3,
                            "timezone": "UTC"
                        }
                    }
                ];

            var graphPacketSample = [
                {
                    key: "Gateway1",
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

            var megaPacket = adaptData(responsePacketSample);
            expect(megaPacket).to.deep.equal(graphPacketSample);
        });

        xit('should make a graph with example sort of data', function() {
            var limit = 100;
            var downwardLimit = Math.ceil(limit * 0.7);
            var upperLimit = Math.floor(limit * 0.8);
            requestHandler(limit).then(function(e) {
                //console.log(e);
                //console.log(e.target.response);
                //console.log(JSON.parse(e.target.response));
                console.log(adaptData(JSON.parse(e.target.response)));
                var data = adaptData(JSON.parse(e.target.response));
                data[0].values = data[0].values.reverse();
                //console.log
                var startBrush = data[0].values[downwardLimit].x;
                var endBrush = data[0].values[upperLimit].x;
                addGraphWrapper(data, startBrush, endBrush);
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
            var startDummy = dummyDataTime[0].values[1].x;
            var endDummy = dummyDataTime[0].values[4].x;
            addGraphWrapper(sample, startBrush, endBrush);
            //addGraphWrapper(dummyDataTime, startDummy, endDummy);
        });
    });
});