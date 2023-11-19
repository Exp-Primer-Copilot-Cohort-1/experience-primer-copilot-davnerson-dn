// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

// Create server
http.createServer(function (req, res) {
    // Get URL
    var pathname = url.parse(req.url).pathname;
    // Get query
    var query = url.parse(req.url).query;
    // Get method
    var method = req.method.toLowerCase();

    if (method === 'get' && pathname === '/comment') {
        // Get comments
        readComments(function (comments) {
            // Return comments
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(comments));
        });
    } else if (method === 'post' && pathname === '/comment') {
        // Get data
        var data = '';
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            // Get comment
            var comment = querystring.parse(data).comment;
            // Get comments
            readComments(function (comments) {
                // Add comment
                comments.push(comment);
                // Save comments
                saveComments(comments, function () {
                    // Return comments
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(comments));
                });
            });
        });
    } else {
        // Return 404
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("404 Not Found");
    }
}).listen(8080);

// Read comments
function readComments(callback) {
    // Read file
    fs.readFile('comments.json', function (err, data) {
        if (err) {
            // Return empty array
            callback([]);
        } else {
            // Return comments
            callback(JSON.parse(data));
        }
    });
}

// Save comments
function saveComments(comments, callback) {
    // Write file
    fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
        if (err) {
            throw err;
        } else {
            // Call callback
            callback();
        }
    });
}

// Print message
console.log('Server running at http:// localhost:8080/');
