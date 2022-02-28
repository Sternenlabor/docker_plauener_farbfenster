const http = require("http");
const https = require("https");

const run = (floor, host) => {

    var options = {
        host: "www.sternenlabor.de",
        path: "/wp-admin/admin-ajax.php?action=farbfenster_get_floor&floor=" + floor,
        headers: { "User-Agent": "Sternenlabor" }
    };

    https.get(options, function (res) {
        var json = "";
        res.on("data", function (chunk) {
            json += chunk;
        });
        res.on("end", function () {
            if (res.statusCode === 200) {
                const options = {
                    hostname: host,
                    port: 80,
                    path: "/json/state",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": json.length
                    }
                };
            
                const req = http.request(options, res => {
                    console.log(`statusCode: ${res.statusCode}`);
            
                    res.on("data", d => {
                        process.stdout.write(d);
                    })
                })
            
                req.on("error", error => {
                    console.error(error);
                })
            
                req.write(json)
                req.end();
            } else {
                console.log('Status:', res.statusCode);
            }
        });
    }).on('error', function (err) {
        console.log('Error:', err);
    });
};

const runAll = () => {
    run(3, "WLED-Fenster-2OG");
    run(4, "WLED-Fenster-3OG");
}

runAll(); // initially, run it once

setInterval(runAll, 1000); // run again every second
