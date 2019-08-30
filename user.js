const firebaseConfig = {
    apiKey: "AIzaSyCe0_GXWbvKkQFMG1bk0ypLFW_2c0ABDUE",
    authDomain: "sepprototype.firebaseapp.com",
    databaseURL: "https://sepprototype.firebaseio.com",
    projectId: "sepprototype",
    storageBucket: "",
    messagingSenderId: "447104585999",
    appId: "1:447104585999:web:67eec155bfb03862"
};

let user_id = undefined;
let user_name = undefined;

let next_id = undefined;
let last_id = undefined;

let worst_id = undefined;
let worst_time = undefined;

let now_id = undefined;
let now_name = undefined;
let now_status = 0;

let start_status = 0;
let empty = undefined;
//
const now_user_input = document.getElementById("now_user_input");
const next_user_input = document.getElementById("next_user_input");
const more_user_input = document.getElementById("more_user_input");
const remain_user_input = document.getElementById("remain_user_input");
//
const want = document.getElementById('want');
const add = document.getElementById('add');
const subtract = document.getElementById('subtract');

const want2 = document.getElementById('want2');
//
const ctx = document.getElementById('my_canvas').getContext('2d');
const start = Math.PI*3/2;
const cw = ctx.canvas.width;
const r = cw/2;
const strokeWeight = r;
let diff;
const remainSec = 60;
//
const noSleep = new NoSleep();
//
let datatable = undefined;


window.onload = function(){
    user_id = getQueryStringObject().id;
    user_name = getQueryStringObject().name;
}

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
google.charts.load("current", {packages:['corechart']});
firebase.database().ref().child('data').once('value').then(function(snapshot) {
    datatable = [];
    datatable.push(["Element", "Time", { role: "style" }]);
    for (let key in snapshot.val()){
        if (key%2 ==1){
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"gold"]);
        } else{
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"silver"]);
        }
        
    }
    google.charts.setOnLoadCallback(drawChart);     
});
firebase.database().ref().child('order').on('value', function(snapshot) {
    let name_order = [];
    let id_order = [];
	for (let key in snapshot.val()) {
        name_order.push(snapshot.val()[key].name);
        id_order.push(snapshot.val()[key].id);
	}
    last_id = id_order[id_order.length-1];
    now_id = id_order[0];
    if (name_order[0] != undefined){
        now_user_input.innerHTML = `${name_order[0]}`;
    } else{
        now_user_input.style.color = "#000000"
        now_user_input.innerHTML = `없음`;
    }
    if (name_order[1] != undefined){
        if (id_order[1] == user_id){
            next_user_input.style.color = "#00b800"
        } else{
            next_user_input.style.color = "#000000"
        }
        next_user_input.innerHTML = `${name_order[1]}`;
    } else{
        next_user_input.style.color = "#000000"
        next_user_input.innerHTML = `없음`;
    }
    if (name_order[2] != undefined){
        if (id_order[2] == user_id){
            more_user_input.style.color = "#00b800"
        } else{
            more_user_input.style.color = "#000000"
        }
        more_user_input.innerHTML = `${name_order[2]}`;
    } else{
        more_user_input.style.color = "#000000"
        more_user_input.innerHTML = `없음`;
    }
    if (id_order.length > 3){
        remain_user_input.innerHTML = `+ ${id_order.length-3}`;
    } else{
        remain_user_input.innerHTML = `+ 0`;
    }
    let i = 1;
    while(i < id_order.length){
        if (id_order[i] == user_id){
            $(".second_second").show();
            your_order_input.innerHTML = i-1;
            break;
        }
        i ++;
    }
    if (i == id_order.length){
        $(".second_second").hide();
    }
    if (id_order[0] == user_id){
        firebase.database().ref().child('start_status').once('value').then(function(snapshot){
            if (snapshot.val().status == 0){
                $("#on").show();
                $("#off").hide();
                $("#want2").hide();
                $("my_canvas").hide();
                firebase.database().ref().child('start_status').set({
                    status: 1
                });
            }
        });
        
    }
});

firebase.database().ref().child('mst_time').on('value', function(snapshot) {
    let hours = Math.floor((snapshot.val().time % (60 * 60 * 24)) / (60*60));
    let minutes = Math.floor((snapshot.val().time % (60 * 60)) / (60));
    let seconds = Math.floor((snapshot.val().time % (60)) / 1);
    let m = hours + ":" + minutes + ":" + seconds ; 
    document.getElementById("total_time_input").innerHTML = m;
});

firebase.database().ref().child('arc_time').on('value', function(snapshot) {
    if (snapshot.val().time > 0){
        let minutes = Math.floor((snapshot.val().time % (60 * 60)) / 60);
        let seconds = Math.floor(snapshot.val().time % 60);
        let m = minutes + ":" + seconds ; 
        document.getElementById("user_blue_time").innerHTML = m;
        document.getElementById("user_blue_time").style.color = '#000000';

        diff = ((snapshot.val().time/remainSec)*Math.PI*2*10).toFixed(2);
        ctx.clearRect(0,0,cw,cw);
        ctx.lineWidth = strokeWeight;
        ctx.fillStyle = "#09F";
        ctx.strokeStyle = "#09F";
        ctx.beginPath();
        ctx.arc(r, r, r - strokeWeight/2, start, diff/10+start, false);
        ctx.stroke();
    } else {
        let red_indicator = snapshot.val().time * (-1);
        let minutes = Math.floor((red_indicator % (60 * 60)) / 60);
        let seconds = Math.floor(red_indicator % 60);
        let m = "- " + minutes + ":" + seconds ; 
        document.getElementById("user_blue_time").innerHTML = m;
        document.getElementById("user_blue_time").style.color = '#ff0000';

        diff = ((red_indicator/remainSec)*Math.PI*2*10).toFixed(2);
        ctx.clearRect(0,0,cw,cw);
        ctx.lineWidth = strokeWeight;
        ctx.fillStyle = "#f00";
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.arc(r, r, r - strokeWeight/2, start-diff/10, start,  false);
        ctx.stroke();
    }
});

firebase.database().ref().child('start_status').on('value', function(snapshot){
    if (snapshot.val().status == 2){
        $("#want2").show();
        $("#user_blue_time").show();
        $("#my_canvas").show();
    } else if (snapshot.val().status == 0){
        $("#user_blue_time").hide();
        $("#my_canvas").hide();
        $("#on").hide();
        $("#off").show();
    } else if (snapshot.val().status == 1){
        $("#user_blue_time").hide();
        $("#my_canvas").hide();
    }
});

firebase.database().ref().child('data').on('value', function(snapshot) {
    datatable = [];
    datatable.push(["Element", "Time", { role: "style" }]);
    for (let key in snapshot.val()){
        if (key%2 ==1){
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"gold"]);
        } else{
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"silver"]);
        }
        
    }
    google.charts.setOnLoadCallback(drawChart); 
});


want.addEventListener('click', function() {
    // if(worst_id == user_id){
    //     firebase.database().ref('/order/!a').set({
    //         id: user_id,
    //         name: user_name
    //     });
    // }
    if (last_id != user_id){
        firebase.database().ref('/order').push({
            id: user_id,
            name: user_name
        });
    }
});

add.addEventListener('click', function() {
    if (now_id != user_id){
        firebase.database().ref('/add').push({
            id: user_id,
        });
    }
  });

subtract.addEventListener('click', function() {
    if (now_id != user_id){
        firebase.database().ref('/subtract').push({
            id: user_id,
        });
    }
});

want2.addEventListener('click', function() {
    $("#on").hide();
    $("#off").show();
    firebase.database().ref().child('start_status').set({
        status: 0
    });
});

function drawChart() {
    var data = google.visualization.arrayToDataTable(datatable);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                    { calc: "stringify",
                        sourceColumn: 1,
                        type: "string",
                        role: "annotation" },
                    2]);

    var options = {
    title: "Density of Precious Metals, in g/cm^3",
    width: 1000,
    height: 600,
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
    chart.draw(view, options);
}

//

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}