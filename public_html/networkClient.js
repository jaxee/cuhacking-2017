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

//$.isArray(Obj) -> returns true or false
//this creates a text/html display of each device and its metadata
function displayList(data){
  $("#devices").append($("<h2> Device " + deviceNum + ":</h2>"));
  $("#devices").append($("<tr id = dev" + deviceNum + "></tr>"));
  for (var i in data){ //for each (i : data[i]) in data
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
    $("#devices tr:eq("+deviceNum+")").append(newData);
  }
  deviceNum++;

  $("#devices").append("<h2> " + data.name + "<h2>");
  $("#devices").append("<p>" + data.description + "</p>");
  $("#devices").append("\n"); 

  $.ajax({ //send off a request for a new game, telling the server our answer to the current one
      method:"POST",
      url:"/getType/",
      data: JSON.stringify(data), //send the json object we got from the server
      success: showHomeInfo,
      dataType:'json'
  });
}

<<<<<<< HEAD
function showHomeInfo(data) {
   console.log(deviceNum);
   $(".deviceNumber").html(deviceNum);

  $("#allDevices").append("<li><div id='deviceIcon'><img width='50%' src='./Images/"+data.type+".png'/></div><div id='deviceInfo'><h4><b>" + data.name + "</b></h4><p>" + data.description +"</p<</div></li>"); 
}
=======
//this creates an object for each device, and stores it in our deviceList object
function createList(data){
  newDevice = {};
  for (var i in data){ //for each (i : data[i]) in data
    if (data[i] !== null && typeof(data[i]) === "object" && data[i].length !== 0){ //initial data is an array (never appears as Obj)
      for (var j = 0; j<data[i].length; j++){ //for (each j : data[i][j]) in data[i]
        if (typeof(data[i][j]) === "object"){ //this is an object in an array
          for (var k in data[i][j]){ //for (each k : data[i][j][k]) in data[i][j]
            newDevice[k] = data[i][j][k];
          }
        }
      }
    }
    else{ //data[i] was not an object, store it regularly
      newDevice[i] = data[i];
    }
  }
  deviceList[deviceNum] = newDevice; //store this device in the list
  deviceNum++;
}
>>>>>>> 54272457601e1b3ac251a2410596114291ec1481
