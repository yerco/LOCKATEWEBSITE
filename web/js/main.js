console.log("Alive!");

var conn = new WebSocket('ws://localhost:8018');
conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
    console.log(e.data);
};
