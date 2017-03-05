const API = "http://cuhackathon-challenge.martellotech.com";
var deviceNum = 0;
var deviceList = []; //this will hold all 14 (or so) objects

$(document).ready(function(){ //this function runs once the page loads!
  requestDevices();
});

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

function getType(data){
  console.log("get types");
  $.ajax({ //send off a request for a new game, telling the server our answer to the current one
      method:"POST",
      url:"/getType/",
      data: JSON.stringify(data), //send the json object we got from the server
      success: setType,
      dataType:'json'
  });
}

function setType(data) {
  console.log(data);
}

function showHomeInfo(data) {
  $(".deviceNumber").html(deviceNum);

  $("#allDevices").append("<li><div id='deviceIcon'><img width='50%' src='./Images/"+data.type+".png'/></div><div id='deviceInfo'><h4><b>" + data.name + "</b></h4><p>" + data.description +"</p<</div></li>");
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
}
