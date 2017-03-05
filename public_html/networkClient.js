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

  if ((data.deviceNum % 3) == 0) {
    $("#allDevices").append("<tr></tr>");
  }

<<<<<<< HEAD
  var cell = "<td><img width='50%' src='./Images/" + data.deviceType +".png' /><div id='deviceInfo'><p><b>" + data.name + "</b></p> <p>" + data.description +"</p></div></td>";
  $("#allDevices tr:eq("+ parseInt(data.deviceNum/3) +")").append(cell);
=======
  var cell = "<td><img width='50%' src='./Images/" + data.deviceType +".png' /><div id='deviceInfo'><h4><b>" + data.name + "</b></h4> <p>" + data.description +"</p></div></td>";
  console.log(data.deviceNum);
  $("#allDevices tr:eq("+ parseInt(data.deviceNum/4) +")").append(cell);
>>>>>>> 499e8d03d4921c37bbf80310892b1b96b008d88e
}
