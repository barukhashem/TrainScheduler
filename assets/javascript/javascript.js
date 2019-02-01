// PSEUDOCODING:

// Create a train schedule that incorporates Firebase to host arrival and departure data.

// This schedule will provide current information about various trains (i.e, their arrival times and minutes remaining until they arrive) by retrieving and manipulating this information with Moment.js.

// INSTRUCTIONS:

// 1. Initialize Firebase.
// 2. Create button for adding new trains, then update the html + update the database.
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the minutes remaining until the trains arrive. Use the difference between the train start time and the current time.
// Use moment.js formatting to set difference in hours/minutes.
// 5. Calculate total time.

// 1. This initializes Firebase:
var config = {
    apiKey: "AIzaSyD-AD6yff4srG2XfjO-q28PWKiTW_5VCTE",
    authDomain: "train-schedule-42cf9.firebaseapp.com",
    databaseURL: "https://train-schedule-42cf9.firebaseio.com",
    projectId: "train-schedule-42cf9",
    storageBucket: "train-schedule-42cf9.appspot.com",
    messagingSenderId: "371801119544"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. This creates the button for adding trains:
$("#submit").on("click", function (event) {

    // This prevents the form from refreshing itself when the button is clicked:
    event.preventDefault();

    // This grabs the user input according the following assigned variables:
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = moment($("#start-time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    // This creates a local "temporary" object for containing train data:
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    };

    // This uploads train data to the database:
    database.ref().push(newTrain);

    // This logs the data to the console:
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    // This creates an alert that the train was successfully added:
    alert("The train was successfully added.");

    // This clears all the data in the text box fields:
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-time-input").val("");
    $("#frequency-input").val("");
});

// 3. This creates a Firebase event for adding a train to the database and a row in the html when the user adds an entry:
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // This stores everything into a variable:
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;

    trainStart = moment.unix(trainStart).format("HH:mm");

    var trainFrequency = childSnapshot.val().frequency;

    // This logs the train data to the console:
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStart);
    console.log(trainFrequency);

    // This creates a variable for the calculateTimes function:
    var times = calculateTimes(trainFrequency, trainStart);

    // This creates a new row in the train schedule:
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(times.nextTrain),
        $("<td>").text(times.minutesTillTrain),
    );

    // This appends the new row to the train schedule:
    $("#train-schedule").append(newRow);
});

// This function calculates the remaining minutes:
function calculateTimes(frequency, startTime) {
    var tFrequency = frequency;

    // Example time is 3:30 AM:
    var firstTime = startTime;

    // First Time (pushed back 1 year to make sure it comes before current time):
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Difference between the times:
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder):
    var tRemainder = diffTime % tFrequency;

    // Minutes until the next train:
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next train:
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");

    // return [tMinutesTillTrain, nextTrain];
    return {
        minutesTillTrain: tMinutesTillTrain,
        nextTrain: nextTrain
    }
}