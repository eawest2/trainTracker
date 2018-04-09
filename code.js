// Initialize Firebase
    
    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyAQQ2PPouKPOWc7Z6hcvwrbYeuRFjA8LoA",
    authDomain: "traintracker-12d5c.firebaseapp.com",
    databaseURL: "https://traintracker-12d5c.firebaseio.com",
    projectId: "traintracker-12d5c",
    storageBucket: "traintracker-12d5c.appspot.com",
    messagingSenderId: "244575605748"
    };
    firebase.initializeApp(config);
    
    // Create a variable to reference the database.
    var database = firebase.database();



    //Global variable storage

        //current time in minutes
        var currentTime = 0;
        //working traverse variable
        var currentTraverse = 0;
        //working hours
        var workingArrival = 0;
        //working initial departure;
        var workingDeparture = 0;

        //time placeholder for conversion
        var time = 0;


    //function delcaration

        //update currentTime

        function currentTimeCalc (){

            var hours = moment().hours()
            var minutes = moment().minutes()

            var convertHours = hours * 60;
            var calculate = convertHours + minutes;

            currentTime = calculate;


        };

        

        //Submit button event listener

        $("#submit").on("click", function(event) {
            event.preventDefault();
        
            trainName = $("#train-name").val().trim();
            trainDestination = $("#train-destination").val().trim();
            trainDeparture = $("#train-departure").val().trim();
            trainTraverse = $("#train-traverse").val().trim();
        
            // Code for the push
            database.ref().push({
        
                name: trainName,
                destination: trainDestination,
                departure: trainDeparture,
                traverse: trainTraverse,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            document.getElementById("train-name").value = "";
            document.getElementById("train-destination").value = "";
            document.getElementById("train-departure").value = "";
            document.getElementById("train-traverse").value = "";

            });

        //perform conversion for math for arrival times
        function arrivalTime () {

            if (currentTime > workingDeparture){
                workingArrival = 0;
                var arrival = (currentTime % currentTraverse)
                workingArrival = currentTraverse - arrival
            }
            else if (currentTime < workingDeparture) {
                workingArrival = 0
                var pendingDeparture = workingDeparture - currentTime
                workingArrival = pendingDeparture

            };
            
        };
        

        //onChildAdded event listener

        database.ref().on("child_added", function(childSnapshot) {

            // Log everything that's coming out of snapshot
            console.log(childSnapshot.val().name);
            console.log(childSnapshot.val().destination);
            console.log(childSnapshot.val().departure);
            console.log(childSnapshot.val().traverse);
            console.log(childSnapshot.val().dateAdded);

            //run conversion function

            currentTimeCalc();

            currentTraverse = 0;
            workingDeparture = 0;
            time = 0;

            currentTraverse = childSnapshot.val().traverse;
            time = childSnapshot.val().departure;
            
            convertMilitary();

            arrivalTime();

            // full list of items to the well
            $("#train-tracker").append("<tr>" + 
            "<td>" + childSnapshot.val().name +"</td>" +
            "<td>" + childSnapshot.val().destination + "</td>" +
            "<td>" + childSnapshot.val().departure + "</td>" +
            "<td>" + childSnapshot.val().traverse + " minutes </td>" +
            "<td>" + Math.floor(workingArrival/60) + " hours " + workingArrival%60 + " minutes </td>" + "</tr>");
        
            // Handle the errors
            }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
            });

            //Convert time from military to minutes

            function convertMilitary () {
                var hourMinutes = Math.floor(time/100)*60;
                var minutes = time%100;
                var rawMinutes = minutes + hourMinutes;
                console.log(rawMinutes)

                workingDeparture = rawMinutes;
        };

        

    //initialize
    currentTimeCalc();

    console.log(currentTime);