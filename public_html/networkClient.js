const API = "http://cuhackathon-challenge.martellotech.com";
var deviceList = []; //this will hold all 14 (or so) objects

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
  requestDevices();
  setTimeout(poll,60000);
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

function add(data){
  deviceList.push(data);

  $(".deviceNumber").html(deviceList.length);

  if ((data.deviceNum % 4) == 0) {
    $("#allDevices").append("<tr></tr>");
  }

  $("#dropdownButtons").append("<a href='#' onClick='showDeviceInfo("+ data.deviceNum +")'>" + data.name +"</a>");

  var cell = "<td><a href='#' onClick='showDeviceInfo("+ data.deviceNum +")'><img width='50%' src='./Images/" + data.deviceType +".png' /><div id='deviceInfo'><h4><b>" + data.name + "</b></h4> </a> <p>" + data.description +"</p></div></td>";
  $("#allDevices tr:eq("+ parseInt(data.deviceNum/4) +")").append(cell);
}

function showDeviceInfo(num) {
  $("#device").empty();
  $("#summary").hide();
  $("#device").show();

  var deviceInfo = "<div id='pageTitle'><h1> Devices </h1></div><h2>"+ deviceList[num].name +"</h2> <h4>"+ deviceList[num].description +"</h4> <img width='20%' class='deviceImage' src='./Images/" + deviceList[num].deviceType +".png' /> <p class='ipAdd'>"+ deviceList[num].ipAddress +"</p> <table class='deviceInformation'> <tr> <td> " + deviceList[num].bytesReceived + " </td> <td> " + deviceList[num].bytesSent  + " </td> <td>" + deviceList[num].packetsLost +"</td> <td>"+ deviceList[num].packetLossRate  +"%</td></tr> <tr> <td> Bytes Recieved </td> <td> Bytes Sent </td> <td> Packets Lost </td> <td> Packet Lost Rate </td> </tr></table><table class='deviceInformation'> <tr> <td>"+ deviceList[num].lastSeen +"</td> <td>"+ deviceList[num].gateway +"</td> <td>" + deviceList[num].macAddress +"</td></tr> <tr> <td> Last Update </td> <td> Gateway </td> <td> Mac Address </td> </tr></table><div id='devices'></div><p></p>";
  $("#device").append(deviceInfo);

  displayList(deviceList[num]);
}

function displayList(data){
  for (var i in data){ //for each (i : data[i]) in data
    if (i == "name" || i == "description" || i == "ipAddress" || i == "alarms" || i == "deviceNum" || i == "deviceType" || i == "bytesReceived" || i == "bytesSent" || i == "packetLossRate" || i == "packetsLost" || i == "lastSeen" || i == "uptime" || i == "netmask" || i == "macAddress" || i == "gateway") continue;
    formattedData = "";
    if (data[i] !== null && typeof(data[i]) === "object" && data[i].length !== 0){ //initial data is an array (never appears as Obj)
      formattedData += "[<br>&nbsp&nbsp";
      for (var j = 0; j<data[i].length; j++){ //for (each j : data[i][j]) in data[i]
        if (typeof(data[i][j]) === "object"){ //this is an object in an array
          formattedData+= "{<br>&nbsp&nbsp&nbsp&nbsp";
          for (var k in data[i][j]){ //for (each k : data[i][j][k]) in data[i][j]
            formattedData += k + " : " + data[i][j][k] + "<br>&nbsp&nbsp&nbsp&nbsp";
          }
          formattedData = formattedData.substring(0, formattedData.length-10);
          formattedData+= "}<br>";
        }
      }
      formattedData += "]";
    }
    else{ //data[i] was not an object, display it regularly
      formattedData = data[i];
    }
    var newData = $("<p data-item='"+i+"'>" + i + " : " + formattedData + "</p>");
    $("#devices").append(newData);
  }
}

function showSummary(){
  $("#device").hide();
  $("#summary").show();
}
