  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAonW-4g7HGjBqhEh9WWlCcsn46vhJAiNQ",
    authDomain: "train-scheduler-2779e.firebaseapp.com",
    databaseURL: "https://train-scheduler-2779e.firebaseio.com",
    projectId: "train-scheduler-2779e",
    storageBucket: "train-scheduler-2779e.appspot.com",
    messagingSenderId: "761804100897"
  };
  firebase.initializeApp(config);
var database = firebase.database();

// On click, grab user inputs for train info
$("#submit-btn").on("click", function () {
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = $("#firstTrain").val().trim();
  var frequency = $("#frequency").val().trim();

  // (?)holds train data in local temporary object
  var newTrain = {
    name: trainName,
    destination: destination,
    furstTrain: firstTrain,
    frequency: frequency
  };
  // upload train data to database
  trainData.ref().push(newTrain);
  // clear input field text boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");

  // (?)determine when next train arrives
  return false;
});
// create firebase event for adding trains to the database and a row in the html when a user adds an entry 
trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {
  // store things into variable
  var tName = childSnapshot.val().trainName;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().freqency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(momemnt(), trainTime);
  var tMinutes;
  var tArrival;
  // if first train is later than current time, set arrival to the first train's time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    // calculate minutes till arrival (take current time in unix subtract firstTrain time, and find modulus between the difference and frequency)
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFreqency - tRemainder;
    // to calculate arrival time, add tMinutes to the current time
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
  }
  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
    tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");

});