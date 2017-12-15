// Initialize Firebase
var config = {
  apiKey: "AIzaSyAnJgn9qMd4nnsCe14YjdHMwPIaMRo4YQQ",
  authDomain: "employeesheet-4f891.firebaseapp.com",
  databaseURL: "https://employeesheet-4f891.firebaseio.com",
  projectId: "employeesheet-4f891",
  storageBucket: "employeesheet-4f891.appspot.com",
  messagingSenderId: "313994607792"
};
firebase.initializeApp(config);
var database = firebase.database();

var employeesRef = database.ref("/employeeData");

var name = "name";
var role = "employee";
var startDate = "";
var rate = 0;
var months = 0;
var total = 0;

$(document).ready(function () {
  $('#submit-btn').on('click', function (event) {
    event.preventDefault()

    getparams();
    database.ref("/employeeData").push({
        employeeName: name,
        employeeRole: role,
        employeeStartDate: startDate,
        employeeMonths: JSON.stringify(months),
        employeeRate: rate,
      })
  })
})

database.ref("/employeeData").on("child_added", function (childSnapshot) {
    
      // If Firebase has a highPrice and highBidder stored (first case)
      if (childSnapshot.child("employeeName").exists() && childSnapshot.child("employeeRole").exists()) {
        console.log(childSnapshot.val());
        // Set the local variables for highBidder equal to the stored values in firebase.
        name = childSnapshot.val().employeeName;
        role = childSnapshot.val().employeeRole;
        startDate = childSnapshot.val().employeeStartDate;
        months = childSnapshot.val().employeeMonths;
        rate = childSnapshot.val().employeeRate;
        
        calculateRate();
        addEmployee(name, role, startDate, months, rate, total);
      }
});


function addEmployee (name, role, startDate, months, rate, total) {
  

  var employeeRow = $('<tr>')
  var employeeName = $('<td>' + name + '</td>')
  var employeeRole = $('<td>' + role + '</td>')
  var employeeStartDate = $('<td>' + startDate + '</td>')
  var employeeMonths = $('<td>' + months + '</td>')
  var employeeRate = $('<td>' + rate + '</td>')
  var employeeTotalBilled = $('<td>' + total + '</td>')

  employeeRow.append(employeeName)
  employeeRow.append(employeeRole)
  employeeRow.append(employeeMonths)
  employeeRow.append(employeeRate)
  employeeRow.append(employeeTotalBilled)

  $('#employee-info').append(employeeRow)
}

function getparams () {
  name = $('#name').val().trim()
  role = $('#role').val().trim()
  startDate = $('#start-date').val().trim()
  rate = $('#rate').val().trim()
}

function calculateRate() {
  var today = moment();

  months = JSON.stringify(moment(today).diff(startDate, 'months'));
  total = JSON.stringify(months * rate);
}
