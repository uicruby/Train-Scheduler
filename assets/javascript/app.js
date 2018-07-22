// reference to firebase database
var trainData = "https://train-schedule-c29df.firebaseio.com/";
var dataRef = new Firebase(trainData);

$(document).ready(function () {
    // var trainData = "https://train-schedule-c29df.firebaseio.com/";
    // var dataRef = new Firebase(trainData);

    $('#add').on('click', function (e) {
        //prevent page to refresh
        e.preventDefault();
        
        //set values to all variables
        var name = $('#name').val().trim();
        var destination = $('#destination').val().trim();
        var frequency = $('#frequency').val().trim();
        var firstTrain = $('#first-train-time').val().trim();
        var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
        var currentTime = moment();
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
        var timeRemaining = timeDiff % frequency;
        var minutesToTrain = frequency - timeRemaining;
        var nextTrain = moment().add(minutesToTrain, "minutes");
        var nextFormat = moment(nextTrain).format("hh:mm");
        
        //  to test variable values
        console.log(name);
        console.log(destination);
        console.log(frequency);
        console.log(firstTrain);

        //creating object for holding data
        var newTrain = {
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            nextFormat: nextFormat,
            minutesToTrain: minutesToTrain
        }

        //push data to firebase
        dataRef.push(newTrain);

        //will clear all textboxes
        $('#name').val("");
        $("#destination").val("");
        $("#first-train-time").val("");
        $("#frequency").val("");
    });

    dataRef.on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        // taking values from database and store them on variables
        var tName=childSnapshot.val().name;
        var tDest=childSnapshot.val().destination;
        var tFreq=childSnapshot.val().frequency;
        var fTrain=childSnapshot.val().firstTrain;
        var nextTrainFormat=childSnapshot.val().nextFormat;
        var minToTrain=childSnapshot.val().minutesToTrain;
        
        //creating a new row and appending values of variables  
        var newRow=$('<tr>').append(
            $('<td>').text(tName),
            $('<td>').text(tDest),
            $('<td>').text(tFreq),
            $('<td>').text(nextTrainFormat),
            $('<td>').text(minToTrain)
        );
        //append new row to table
        $(".train-schedule > tbody").append(newRow);
    });
});