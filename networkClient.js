/*
Author - Matthew Moulton (101010631)
*/
const API = "http://cuhackathon-challenge.martellotech.com";
var deviceNum = 0;

$(document).ready(function() { //this function runs once the page loads!
  requestDevices();
});

//this requests a list of devices from the API
function requestDevices(){
    $.ajax({ //send off a request for a new game, telling the server our answer to the current one
      method:"GET",
      url:API+"/devices/",
      data: "",
      success: requestDevice,
      dataType:'json'
    });
}

//this sets up a list of device objects on the server
function requestDevice(data){
  for (var i in data){
    $.ajax({ //send off a request for a new game, telling the server our answer to the current one
      method:"GET",
      url:API+"/devices/"+i+"/",
      data: "", //send the json object we got from the server
      success: createList,
      dataType:'json'
    });
  }
}

function createList(data){
  $("#devices").append($("<h1> Device " + deviceNum + ":</h1>"));
  $("#devices").append($("<tr id = dev" + deviceNum + "></tr>"));
  for (var i in data){
    var formattedData;
    if (typeof(data[i]) === "object") {
      for (var j in data[i]){
        formattedData = data[i];
      }
    }
    else {
      formattedData = data[i];
    }
    var newData = $("<p data-item='"+i+"'>" + i + " : " + formattedData + "</p>");
    $("#devices tr:eq("+deviceNum+")").append(newData);
  }
  deviceNum++;
}
