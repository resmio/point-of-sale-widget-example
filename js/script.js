var chosentime = "";
var length = 0;
var chosenID = 0;
var mydata;
var customerName;
var email;
var phone;
var checksum;
var priceChange;
var chosenPeopleNumber = 0;
var date;
var postdata;
var allPlaces = 0;
var resmio_id = 'the-fish';

/*
 * Shows element by id
 * @param id The id of the element to show
 */
function show(id) {
  var show = document.getElementById(id);
  show.style.display = "inline-block";
}

/*
 * Hides element by id
* @param id The id of the element to hide
 */
function hide(id) {
  var hide = document.getElementById(id);
  hide.style.display = "none";
}

/*
 * Makes the GET requests for the availabilities,
 * calls loadTime() if it succeedes,
 * shows an error message if it fails.
 */
function loadjson(){
  var contentType ="application/x-www-form-urlencoded; charset=utf-8";

  if(window.XDomainRequest) //for IE8,IE9
  contentType = "text/plain";

  $.ajax({
    url:"https://api.resmio.com/v1/facility/"+resmio_id+"/availability/",
    type:"GET",
    dataType:"jsonp",
    contentType: contentType,
    success:function(data)
    {
      mydata = data;
      console.log(data);
      loadTime();
    },
    error:function(jqXHR,textStatus,errorThrown)
    {
      alert("You can not send Cross Domain AJAX requests: "+errorThrown);
    }
  });
}

/*
 * Disables the "Guests" and "Guests-Info" buttons,
 * shows the times-container and hides all not needed divs,
 * sets the time button as active,
 * creates each time button if there are free places available,
 * calls chooseTime().
 */
function loadTime(){
  document.getElementById("people").disabled = true;
  document.getElementById("confirm").disabled = true;
  document.getElementById("confirm").innerHTML = "<p class='index'>3</p><p class='step'>Guests Info</p>";

  hide("guests");
  hide("book");
  hide("loading");
  hide("success");
  hide("confirmation");
  hide("no-availabilities");

  show("time-container");

  document.getElementById("time").setAttribute("class", "btn btn-warning");
  document.getElementById("people").setAttribute("class", "btn btn-default");
  document.getElementById("confirm").setAttribute("class", "btn btn-default");
  document.getElementById("time-table").innerHTML = "";
  chosentime = "";
  length = 0;
  chosenPeopleNumber = 0;
  chosenID = 0;
  allPlaces = 0;

  length = mydata.objects.length;
  for (i = 0; i < length; i++) {

    var time =  mydata.objects[i].local_time_formatted;
    var peopleNumber = mydata.objects[i].available;
    allPlaces += peopleNumber;


    if(peopleNumber > 0){
      var node = document.createElement("button");
      node.setAttribute("id", "t"+i);
      document.getElementById("time-table").appendChild(node);
      var hour = document.createElement("p");
      hour.setAttribute("id", "h"+i);
      hour.innerHTML = (time);
      document.getElementById("t"+i).appendChild(hour);
      var text = document.createElement("p");
      if(peopleNumber <=1){
        text.innerHTML = (peopleNumber + " free place");
      }else{
        text.innerHTML = (peopleNumber + " free places");
      }
      document.getElementById("t"+i).appendChild(text);
      chooseTime(i);
    }
  }

  document.getElementById("all-places").innerHTML = ("A total of " + allPlaces + " places available");

  if(document.getElementById("time-table").getElementsByTagName("button").length<=0){
    hide("time-container");
    show("no-availabilities");
    document.getElementById("people").disabled = true;
    document.getElementById("confirm").disabled = true;
  }

}

/*
 * Selects the chosen time and calls loadGuests()
 */
function chooseTime(i){
  var chosenlink = document.getElementById("t"+i);
  chosenlink.onclick = function(){
    chosentime = document.getElementById("h"+i).innerHTML;
    chosenID = i;
    date = mydata.objects[i].date;
    checksum = mydata.objects[i].checksum;
    priceChange = mydata.objects[i].price_change;
    loadGuests();
  }
}

/*
 * Shows the guests container and hides all not needed divs,
 * disables the "Guests-Info" button,
 * sets the "Guests" button as active,
 * creates each guests number button from 1 to the biggest number of available guests,
 * calls chooseGuests().
 */
function loadGuests(){
  hide("time-container");
  hide("confirmation");
  hide("book");
  hide("loading");
  hide("success");
  show("guests");
  document.getElementById("confirm").disabled = true;
  document.getElementById("people").disabled = false;
  document.getElementById("time").setAttribute("class", "btn btn-default");
  document.getElementById("people").setAttribute("class", "btn btn-warning");
  document.getElementById("confirm").setAttribute("class", "btn btn-default");
  document.getElementById("people-table").innerHTML = "";
  document.getElementById("confirm").innerHTML = "<p class='index'>3</p><p class='step'>Guests Info</p>";
  chosenPeopleNumber = 0;

  var peopleNumber = mydata.objects[parseInt(chosenID)].available;
  if(peopleNumber <=1){
    document.getElementById("places").innerHTML = ("There is still " + peopleNumber + " available place at " + chosentime);
  }else{
    document.getElementById("places").innerHTML = ("There are still " + peopleNumber + " available places at " + chosentime);
  }

  if(peopleNumber > 0){
    for (i = 0; i < peopleNumber; i++) {
      var node = document.createElement("button");
      node.setAttribute("id", "p"+i);
      document.getElementById("people-table").appendChild(node);
      var guests = document.createElement("p");
      guests.setAttribute("id", "people"+i);
      document.getElementById("p"+i).appendChild(guests);
      document.getElementById("people"+i).appendChild(document.createTextNode(i+1));
      chooseGuests(i);
    }
  }
}

/*
 * Selects the chosen number of guests and calls loadGuestsInfo()
 * @param i The index of the chosen guest
 */
function chooseGuests(i){
  var chosenlink = document.getElementById("p"+i);
  chosenlink.onclick = function(){
    chosenPeopleNumber = document.getElementById("people"+i).innerHTML;
    loadGuestsInfo();
  }
}

/*
 * Shows the guests info form and hides all not needed divs,
 * sets the "Guests-Info" button as active,
 * updates message with number of available places,
 * makes the "Enter" key go to the next field/button,
 */
function loadGuestsInfo(){
  hide("time-container");
  hide("guests");
  hide("loading");
  hide("success");
  show("confirmation");
  show("book");

  document.getElementById("confirm").disabled = false;
  document.getElementById("book").disabled = false;
  document.getElementById("name").focus();
  document.getElementById("time").setAttribute("class", "btn btn-default");
  document.getElementById("people").setAttribute("class", "btn btn-default");
  document.getElementById("confirm").setAttribute("class", "btn btn-warning");

  if(chosenPeopleNumber <=1){
    document.getElementById("confirm").innerHTML = (chosenPeopleNumber + " person at " + chosentime);
  }else{
    document.getElementById("confirm").innerHTML = (chosenPeopleNumber + " people at " + chosentime);
  }

  $("#name").keyup(function (e) {
    if (e.keyCode == 13) {
        document.getElementById("email").focus();
    }
  });

  $("#email").keyup(function (e) {
    if (e.keyCode == 13) {
      document.getElementById("book").click();
      document.getElementById("book").disabled = true;
      return false;
    }
  });

}

/*
 * Validates Email
 * @param email The email to be validated
 */
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/*
 * Closes the window
 */
function closeWindow(){
  window.open('', '_self', '');
  window.close();
}

/*
 * Makes the POST request,
 * shows a success message if it succeedes,
 * shows an error message if it fails, or the email isn't valid
 */
function postjson(){

  if(validateEmail(document.getElementById("email").value) == true || document.getElementById("email").value == ""){

    hide("confirmation");
    hide("book");
    show("loading");

    if(document.getElementById("email").value == ""){
      email = "noname@example.com";
    }else{
      email = document.getElementById("email").value;
    }
    if(document.getElementById("name").value == ""){
      customerName = "No name";
    }else{
      customerName = document.getElementById("name").value;
    }

    postdata = JSON.stringify({
      "name": customerName,
      "email": email,
      "phone": "0",
      "date": date,
      "num": parseInt(chosenPeopleNumber),
      "checksum": checksum,
      "price_change": priceChange,
      "source": "Cash-System",
    });

    var contentType ="application/json; charset=utf-8";
    var datatype = "json";
    var userName = "hello%40resmio.com"

    $.support.cors = true;

    $.ajax({
      url:"http://api.resmio.com/v1/facility/"+resmio_id+"/bookings",
      type:"POST",
      cache: false,
      dataType: datatype,
      data: postdata,
      contentType: contentType,
    })
    .done(function(data) {
      console.log(data);
      var availability = allPlaces - parseInt(chosenPeopleNumber);
      if(availability<=1){
        document.getElementById("all-places").innerHTML = ("There is still " + availability + " place available");
      }else{
        document.getElementById("all-places").innerHTML = ("A total of " + availability + " places available");
      }
      document.getElementById("book").disabled = true;
      hide("loading");
      show("close");
      show("success");
      document.getElementById("close").focus();
      $("#close").keyup(function (e) {
        if (e.keyCode == 13) {
          $('#close').click();
          return false;
        }
      });

    })
    .fail(function(data, status, message) {
      alert("An error occurred / No free places left");
    });
  }else{
    alert("Please insert a valid email address");
  }
}
