const API = "http://cuhackathon-challenge.martellotech.com";
var deviceList = []; //this will hold all 14 (or so) objects
var currentPage = -1;

$(document).ready(function(){ //this function runs once the page loads!
  poll();
});

//poll the API for another set of data every minute
function poll(duration){
  deviceList = [];
  $("#allDevices").empty();
  console.log("polling...");
  $.ajax({ //send off a request for a new game, telling the server our answer to the current one
      method:"POST",
      url:"/reset/",
      data: "",
      dataType:'json'
  });
  $("#dropdownButtons").empty();
  requestDevices();
  setTimeout(poll,20000); //change back to 60,000 later
}

//this requests a list of devices from the API
function requestDevices(){
    $.ajax({
      method:"GET",
      url:API+"/devices/",
      success: requestDevice,
      dataType:'json'
    });
}

//this requests an individual device's metadata
function requestDevice(data){
  $("#devices").empty();

  for (var i in data){
    $.ajax({
      method:"GET",
      url:API+"/devices/"+i+"/",
      success: createList,
      dataType:'json'
    });
  }
}

//this creates an object for each device, and stores it in our deviceList object
function createList(data){
  $.ajax({ //send off a request for a new game, telling the server our answer to the current one
      method:"POST",
      url:"/createList/",
      data: JSON.stringify(data), //send the json object we got from the server
      success: add,
      dataType:'json'
  });
}

//this adds the new device to our local deviceList, and appends it to the document
function add(data){
  deviceList.push(data);

  $(".deviceNumber").html(deviceList.length);

  if ((data.deviceNum % 4) == 0) {
    $("#allDevices").append("<tr></tr>");
  }

  $("#dropdownButtons").append("<a href='#' onClick='showDeviceInfo("+ data.deviceNum +")'>" + data.name +"</a>");

  var cell = "<td><a href='#' onClick='showDeviceInfo("+ data.deviceNum +")'><img width='50%' src='./Images/" + data.deviceType +".png' /><div id='deviceInfo'><h4><b>" + data.name + "</b></h4> </a> <p>" + data.description +"</p></div></td>";
  $("#allDevices tr:eq("+ parseInt(data.deviceNum/4) +")").append(cell);

  if (currentPage != -1){ //prevents messing the page up when polling
    showDeviceInfo(currentPage);
  }
}

//this shows an individual device's page to the user
function showDeviceInfo(num) {
  currentPage = num;
  $("#device").empty();
  $("#summary").hide();
  $("#device").show();
  $("#problems").hide();
  $("#history").hide();

  var deviceInfo = "<div id='pageTitle'><h1> Devices </h1></div><h2>"+ deviceList[num].name +"</h2> <h4>"+ deviceList[num].description +"</h4> <img width='20%' class='deviceImage' src='./Images/" + deviceList[num].deviceType +".png' /> <p class='ipAdd'>"+ deviceList[num].interfaces[0].ipAddress +"</p> <table class='deviceInformation'> <tr> <td> " + deviceList[num].interfaces[0].bytesReceived + " </td> <td> " + deviceList[num].interfaces[0].bytesSent  + " </td> <td>" + deviceList[num].interfaces[0].packetsLost +"</td> <td>"+ deviceList[num].interfaces[0].packetLossRate  +"%</td></tr> <tr> <td> Bytes Recieved </td> <td> Bytes Sent </td> <td> Packets Lost </td> <td> Packet Lost Rate </td> </tr></table><table class='deviceInformation'> <tr> <td>"+ deviceList[num].lastSeen +"</td> <td>"+ deviceList[num].interfaces[0].gateway +"</td> <td>" + deviceList[num].interfaces[0].macAddress +"</td></tr> <tr> <td> Last Update </td> <td> Gateway </td> <td> Mac Address </td> </tr></table><hr/><div id='devices'></div><p></p>";
  $("#device").append(deviceInfo);
  displayList(deviceList[num]);
}

//this appends a single device's information to the document
function displayList(data){

  for (var i in data){ //for each (i : data[i]) in data
    formattedData = "";
    if (i == "name" || i == "description" || i == "ipAddress" || i == "alarms" || i == "deviceNum" || i == "deviceType" || i == "lastSeen" || i == "uptime" || i == "interfaces" || i == "document" || i == "dhcpClients") continue;
    if (data[i] !== null && typeof(data[i]) === "object" && data[i].length !== 0){ //initial data is an array (never appears as Obj)
      formattedData += "<br>";
      for (var j = 0; j<data[i].length; j++){ //for (each j : data[i][j]) in data[i]
        if (typeof(data[i][j]) === "object"){ //this is an object in an array
          formattedData+= "<br>";
          for (var k in data[i][j]){ //for (each k : data[i][j][k]) in data[i][j]
            formattedData += k + " : " + data[i][j][k] + "<br>";
          }
          //formattedData = formattedData.substring(0, formattedData.length-10);
          formattedData+= "<br>";
        }
      }
    }
    else{ //data[i] was not an object, display it regularly
      formattedData = data[i];
    }
    var newData = $("<h5 data-item='"+i+"'>" + i + " : " + formattedData + "</h5>");
    $("#devices").append(newData);
  }
}

//this shows the summary page when summary button is clicked
function showSummary(){
  currentPage = -1;
  $("#device").hide();
  $("#summary").show();
  $("#problems").hide();
  $("#history").hide();
}

function showProblems(){
  var badPacketRates = [];
  var suspiciousDevices = [];
  var validDevices = [];

  for(var j in deviceList){
      if(deviceList[j].deviceType == "router") {
      for (var r in deviceList[j].dhcpClients){
        validDevices.push(deviceList[j].dhcpClients[r].ip_address);
      }

      validDevices.push(deviceList[j].interfaces[0].ipAddress);
    }
  }

  $("#problems").empty();
  $("#history").hide();
  $("#device").hide();
  $("#summary").hide();
  $("#problems").show();

  var problemsInfo = "<div id='pageTitle'><h1> Problems </h1></div>";

  for(var i in deviceList){
    var isValidDevice = false;

    if (deviceList[i].interfaces[0].packetLossRate > 0.002) {
      badPacketRates[{
        name: deviceList[i].name,
        packetLossRate: deviceList[i].interfaces[0].packetLossRate
      }];
    }

    for(var w in validDevices){
      if(deviceList[i].interfaces[0].ipAddress == validDevices[w]){
        isValidDevice = true;
      }
    }

    if(!isValidDevice){
      suspiciousDevices.push({
        name: deviceList[i].name,
        ipAddress: deviceList[i].interfaces[0].ipAddress
      });
    }
  }

  if (badPacketRates != 0 && suspiciousDevices != 0) {
    problemsInfo += "<h3> Packet Loss Rate </h3><table class='problemsTable'><tr>";
    for (var x in badPacketRates) {
      problemsInfo += "<td style='background-color:red; padding:40px;'> Bad Packet Rate: <br/>" + badPacketRates[x].name + "<br/>" + badPacketRates[x].packetLossRate +"</td>";
    }
    for (var t in suspiciousDevices){
      problemsInfo += "<td style='background-color:red; padding:40px;'> Suspicious Device: <br/>" +suspiciousDevices[t].name + "<br />" + suspiciousDevices[t].ipAddress +"</td>";
    }
    problemsInfo += "</tr></table>";
  } else if(badPacketRates == 0 && suspiciousDevices == 0) {
    problemsInfo += "<table class='problemsTable'><tr><td class='noIssues'> Packet Loss Rates </td><td class='noIssues'> No Suspicious Devices </td></tr></table>";
  } else if (badPacketRates == 0 && suspiciousDevices != 0) {
    problemsInfo += "<table class='problemsTable'><tr><td class='noIssues'> Packet Loss Rates </td></tr><tr>";
    
    for (var q in suspiciousDevices){
      problemsInfo += "<td style='background-color:red; padding:40px;'>Suspicious Device: <br/>"+ suspiciousDevices[q].name + "<br/>" + suspiciousDevices[q].ipAddress +"</td>";
    }

    problemsInfo += "</tr></table>";

  } else if (badPacketRates != 0 && suspiciousDevices == 0) {
    problemsInfo += "<table class='problemsTable'><tr>";
    
    for (var x in badPacketRates) {
      problemsInfo += "<td style='background-color:red; padding:40px;'>Bad Packet Rate: <br />" + badPacketRates[x].name + "<br/>" + badPacketRates[x].packetLossRate +"</td>";
    }

    problemsInfo += "</tr><tr><td class='noIssues'> No Suspicious Devices </td></tr></table>";
  }

  $("#problems").append(problemsInfo);
}

//this function displays the device history
function showHistory(data){
  $("#history").empty();
  $("#device").hide();
  $("#summary").hide();
  $("#problems").hide();
  $("#history").show();

  var historyInfo = "<div><h1> History </h1></div>";
  $("#history").append(historyInfo);
  for (var i=0; i<data.length; i++){
    $("#history").append("<h3>Device List: " + i + " </h3>")
    for (var j=0; j<data[i].length; j++){
        displayList(data[i][j]);
    }
  }
}

//this is the click handler for the history button
function historyHandler(){
  $.ajax({
    method:"GET",
    url:"/history/",
    success: showHistory,
    dataType:'json'
  });
}
