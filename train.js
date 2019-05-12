
$("document").ready(function(){
    src="https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js"
    
    //<!-- TODO: Add SDKs for Firebase products that you want to use
       //  https://firebase.google.com/docs/web/setup#config-web-app -->//

   
      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyB08iW_fkBw_GkdG90HedE26GhI7VNe_g8",
        authDomain: "trainschedule-21cc6.firebaseapp.com",
        databaseURL: "https://trainschedule-21cc6.firebaseio.com",
        projectId: "trainschedule-21cc6",
        storageBucket: "trainschedule-21cc6.appspot.com",
        messagingSenderId: "713989575518",
        appId: "1:713989575518:web:9adc8f3467c5b576"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
       
        var database= firebase.dataBase();

//button to submit the info from user
$("#trainInfoBtn").on("click", function(event){
    event.preventDefault();//no button reset

    //set variables of user input
    var trainName =
    $("#name").val().trim();
    var destination = $("#dest").val().trim();

    //converts user input to usable information

    var firstTime = moment($("#firstTime").val().trim(),
    "hh:mm").subtract(1,"years").format("X");

    var frequency = $("#freq").val().trim();

    //current time
    var currentTime = moment();
    console.long("Current Time: " + moment(currentTime).format("hh:mm"));

        //brings all new train info

        var newTrain = {
            train: trainName,
            trainGoing: destination,
            trainComing: firstTime,
            everyXMin: frequency
        };

        //uploading newTrain to firebase
        database.ref().push(newTrain);
        //*push* adds info in database.*set* overwrites existing
        //MediaDeviceInfo
        
        //clear elements 

        $("#name").val("");
        $("#dest").val("");
        $("firstTime").val("");
        $("#freq").val("");


        return false;
    });

    database.ref().on("child_added", function(childSnapshot,preChildKey){
        //console.log(childSnapshot.val());

        var trainName =
        childSnapshot.val().train;
        var destination =
        childSnapshot.val().trainGoing;
        var firstTime =
        childSnapshot.val().trainComing;
        var frequency = childSnapshot.val().everyXMin;


        //tidy up first train time 
        var trainTime = moment.unix(firstTime).format("hh:mm");
        //math to figure out time diff between trains
        var difference= moment().diff(moment(trainTime),"minutes");

        //time apart
        var trainRemain = difference % frequency;
        //min till arrive
        var minUntil = frequency - trainRemain;

        //NEXT

        var nextArrival = moment().add(minUntil,"minutes").format('hh:mm');

        //adding info to Dom Table

        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +  frequency + "</td><td>" + nextArrival + "</td><td>" +minUntil + "</td><tr>");

    });

})
