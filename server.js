var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');

var _ = require('underscore');

const ROOT = "./public_html";

var server = http.createServer(handleRequest); 
server.listen(2017);
console.log('Server listening on port 2017');

var devices = {};

function handleRequest(req, res) {
	//process the request
	console.log(req.method+" request for: "+req.url);
	
	//parse the url
	var urlObj = url.parse(req.url,true);
	var filename = ROOT+urlObj.pathname;

	//the callback sequence for static serving...
	if (urlObj.pathname ==='/getType/') {
		var queryData = url.parse(req.url, true).query;

		var postBody = "";
        req.setEncoding('utf8');
        req.on('data', function(chunk){
            postBody+=chunk;
        });
        req.on('end', function(){
            var userData = JSON.parse(postBody);
            var data = findDeviceType(userData);

            respond(200, JSON.stringify(data));
        });

		console.log("Query Data");

	} else {
		fs.stat(filename,function(err, stats){
			if(err){   //try and open the file and handle the error, handle the error
				respondErr(err);
			}else{
				if(stats.isDirectory())	filename+="/index.html";
			
				fs.readFile(filename,function(err, data){
					if(err)respondErr(err);
					else respond(200,data);
				});
			}
		});			
	}
	
	//locally defined helper function
	//serves 404 files 
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.message);
			else respond(404,data);
		});
	}
		
	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ",err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}
		
	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}	
	
};//end handle request

function findDeviceType(data) {		
	var deviceHome;

	var lowerName = data.name.toLowerCase();
	var lowerDesc = data.description.toLowerCase();

	if (lowerName.indexOf("phone") !== -1 || lowerDesc.indexOf("phone") !== -1 || lowerDesc.indexOf("android") !== -1) {
		deviceHome = createHomePageOb(data, "phone");
	} else if (lowerName.indexOf("tv") !== -1 || lowerDesc.indexOf("tv") !== -1) {
		deviceHome = createHomePageOb(data, "television");
	} else if (lowerName.indexOf("desktop") !== -1 || lowerDesc.indexOf("desktop") !== -1){
		deviceHome = createHomePageOb(data, "computer");
	} else if (lowerName.indexOf("gateway") !== -1 || lowerDesc.indexOf("gateway") !== -1) {
		deviceHome = createHomePageOb(data, "router");
	} else if (lowerName.indexOf("toast") !== -1 || lowerDesc.indexOf("toast") !== -1) {
		deviceHome = createHomePageOb(data, "toaster");
	} else if (lowerName.indexOf("thermostat") !== -1 || lowerDesc.indexOf("thermostat") !== -1) {
		deviceHome = createHomePageOb(data, "thermostat");
	} else if (lowerName.indexOf("printer") !== -1 || lowerDesc.indexOf("printer") !== -1) {
		deviceHome = createHomePageOb(data, "printer");
	} else if (lowerName.indexOf("xbox") !== -1 || lowerDesc.indexOf("xbox") !== -1 || lowerDesc.indexOf("playstation") !== -1 || lowerName.indexOf("playstation") !== -1 || lowerDesc.indexOf("wii") !== -1 || lowerName.indexOf("wii") !== -1) {
		deviceHome = createHomePageOb(data, "console");
	} else if (lowerName.indexOf("smoke") !== -1 || lowerDesc.indexOf("smoke") !== -1) {
		deviceHome = createHomePageOb(data, "smokedetector");
	} else if (lowerName.indexOf("chromecast") !== -1 || lowerDesc.indexOf("chromecast") !== -1) {
		deviceHome = createHomePageOb(data, "chromecast");
	} else {
		deviceHome = {
			name: data.name,
			description: data.description,
			type: "generic"
		}
	}
	
	return deviceHome;
}

function createHomePageOb(data, type) {
	var device;

	device = {
		name: data.name,
		description: data.description,
		type: type
	}

	return device;
}
