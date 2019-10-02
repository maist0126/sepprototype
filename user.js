const firebaseConfig = {
    apiKey: "AIzaSyCe0_GXWbvKkQFMG1bk0ypLFW_2c0ABDUE",
    authDomain: "sepprototype.firebaseapp.com",
    databaseURL: "https://sepprototype.firebaseio.com",
    projectId: "sepprototype",
    storageBucket: "",
    messagingSenderId: "447104585999",
    appId: "1:447104585999:web:67eec155bfb03862"
};

let name_order = undefined;
let id_order = undefined;

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
let reserve_done = false;
//
//
const reserve_on = document.getElementById('reserve_on');
const reserve_off = document.getElementById('reserve_off');
const add = document.getElementById('div1');
const subtract = document.getElementById('subtract');
const quit = document.getElementById('quit');
//
const remainSec = 60;
//
const noSleep = new NoSleep();
//
let userTable = undefined;


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
firebase.database().ref().child('data').once('value').then(function(snapshot) {
    if (document.getElementById('users') != null){
        document.getElementById('users').remove();
    }
    let users = document.createElement('div');
    users.id = 'users';
    users.style.width = `100%`;
    users.style.height = '100%';
    users.style.zIndex = '100';
    document.getElementById('users_wrapper').appendChild(users);

    userTable = [];
    for (let key in snapshot.val()){
        let new_user = document.createElement('div');
        new_user.id = `user${key}`;
        users.appendChild(new_user);
        new_user.style.backgroundColor = snapshot.val()[key].color;
        new_user.style.position = 'absolute';
        new_user.style.textAlign = 'center';
        new_user.style.width = '100px';
        new_user.style.height = '100px';
        new_user.style.borderRadius = '50%';
        new_user.style.top = `${getRandomInt(10, 90)}%`;
        new_user.style.left = `${getRandomInt(85, 95)}%`;
        new_user.style.transform = 'translate(-50%, -50%)';
        new_user.style.zIndex = '100';
        new_user.style.display = 'table';
        new_user.style.fontSize = '20px';
        let name = document.createElement('div');
        new_user.appendChild(name);
        name.style.display = 'table-cell';
        name.style.verticalAlign = 'middle';
        if (key == user_id){
            name.innerHTML = "ME";
            name.style.fontSize = "40px";
            name.style.color = "#fff";
            name.style.fontWeight = "700";
            new_user.style.top = "20%";
            new_user.style.left = "85%";
        } else{
            name.innerHTML = snapshot.val()[key].name;
        }
        userTable.push([snapshot.val()[key].name, snapshot.val()[key].time, snapshot.val()[key].color]);
    }
});
firebase.database().ref().child('data').on('value', function(snapshot) {
    if (document.getElementById('users') != null){
        document.getElementById('users').remove();
    }
    let users = document.createElement('div');
    users.id = 'users';
    document.getElementById('users_wrapper').appendChild(users);

    userTable = [];
    for (let key in snapshot.val()){
        let new_user = document.createElement('div');
        new_user.id = `user${key}`;
        users.appendChild(new_user);
        new_user.style.backgroundColor = snapshot.val()[key].color;
        new_user.style.position = 'absolute';
        new_user.style.textAlign = 'center';
        new_user.style.height = '100px';
        new_user.style.width = '100px';
        new_user.style.borderRadius = '50%';
        new_user.style.top = `${getRandomInt(10, 90)}%`;
        new_user.style.left = `${getRandomInt(85, 95)}%`;
        new_user.style.transform = 'translate(-50%, -50%)';
        new_user.style.zIndex = '100';
        new_user.style.fontSize = '20px';
        new_user.style.display = 'table';
        let name = document.createElement('div');
        new_user.appendChild(name);
        name.style.display = 'table-cell';
        name.style.verticalAlign = 'middle';
        name.innerHTML = snapshot.val()[key].name;
        userTable.push([snapshot.val()[key].name, snapshot.val()[key].time, snapshot.val()[key].color]);
    }
});

firebase.database().ref().child('order').on('value', function(snapshot) {
    document.getElementById("user_blue_time").innerHTML = "";
    name_order = [];
    id_order = [];
	for (let key in snapshot.val()) {
        name_order.push(snapshot.val()[key].name);
        id_order.push(snapshot.val()[key].id);
	}
    last_id = id_order[id_order.length-1];
    now_id = id_order[0];

    for (let i = 1; i < userTable.length+1; i++){
        document.getElementById(`user${i}`).style.top = `${getRandomInt(10, 90)}%`;
        document.getElementById(`user${i}`).style.left = `${getRandomInt(85, 95)}%`;
    }

    for (let key_user in id_order){
        if (key_user == 0){
            document.getElementById(`user${id_order[key_user]}`).style.top = "20%";
            document.getElementById(`user${id_order[key_user]}`).style.left = '15%';
        } else if (key_user == 1){
            document.getElementById(`user${id_order[key_user]}`).style.top = '20%';
            document.getElementById(`user${id_order[key_user]}`).style.left = '38%';
        } else if (key_user == 2){
            document.getElementById(`user${id_order[key_user]}`).style.top = '20%';
            document.getElementById(`user${id_order[key_user]}`).style.left = '53%';
        } else if (key_user == 3){
            document.getElementById(`user${id_order[key_user]}`).style.top = '20%';
            document.getElementById(`user${id_order[key_user]}`).style.left = '68%';
        }
    }
    
    if (id_order.length == 0){
        reserve_done = false;
        reserve_on.style.display = 'block';
        reserve_off.style.display = 'none';
    }
    for (let i = 0; i<id_order.length; i++){
        if (id_order[i] == user_id){
            reserve_done = true;
            reserve_on.style.display = 'none';
            reserve_off.style.display = 'block';
            break;
        } 
        reserve_done = false;
        reserve_on.style.display = 'block';
        reserve_off.style.display = 'none';
    }

    let worst = [];
    for (let i = 1; i<userTable.length; i++){
        worst.push({id: i, value: userTable[i][1]});
    }
    // sort by value
    worst.sort(function (a, b) {
        if(a.hasOwnProperty('value')){
            return a.value - b.value;
        }
    });
    worst_id = worst[0].id;
    worst_time = worst[0].value;

    if (id_order[0] == user_id){
        $("#quit").show();
        $("#subtract").hide();
        reserve_on.style.display = 'none';
        reserve_off.style.display = 'none';
        firebase.database().ref().child('start_status').once('value').then(function(snapshot){
            if (snapshot.val().status == 0){
                firebase.database().ref().child('start_status').set({
                    status: 1
                });
                document.getElementById("user_blue_time").innerHTML = "";
            }
        });
    } else{
        document.getElementById('message').style.display = "none";
        $("#quit").hide();
        $("#subtract").show();
    }
});

firebase.database().ref().child('mst_time').on('value', function(snapshot) {
    let hours = Math.floor((snapshot.val().time % (60 * 60 * 24)) / (60*60));
    let minutes = Math.floor((snapshot.val().time % (60 * 60)) / (60));
    let seconds = Math.floor((snapshot.val().time % (60)) / 1);
    let m = hours + ":" + minutes + ":" + seconds ; 
});

firebase.database().ref().child('rem_time').on('value', function(snapshot) {
    if (snapshot.val().time > 0){
        let minutes = Math.floor((snapshot.val().time % (60 * 60)) / 60);
        let seconds = Math.floor(snapshot.val().time % 60);
        let m = minutes + ":" + seconds ; 
        document.getElementById("user_blue_time").innerHTML = m;
        document.getElementById("user_blue_time").style.color = '#ffffff';

    } else {
        let red_indicator = snapshot.val().time;
        let minutes = Math.floor((red_indicator % (60 * 60)) / 60);
        let seconds = Math.floor(red_indicator % 60);
        let m = "- " + minutes + ":" + seconds; 
        document.getElementById("user_blue_time").innerHTML = m;
        document.getElementById("user_blue_time").style.color = '#ff0000';

    }
});


firebase.database().ref().child('subtract').on('value', function(snapshot) {
    if (now_id == user_id){
        for (let key in snapshot.val()){
            console.log("충분히 들었어요");
            firebase.database().ref('/help/'+snapshot.val()[key].id).set({
                status: 1  
            });
        }
        document.getElementById('message').style.display = "block";
        firebase.database().ref().child('subtract').set(null);
    }
});

firebase.database().ref().child('add').on('value', function(snapshot) {
    for (let key in snapshot.val()){
        document.getElementById('clap').style.display = "block";
        setTimeout(function(){document.getElementById('clap').style.display = "none";},500);
        console.log("좋아요");
    }
    firebase.database().ref().child('subtract').set(null);
});

reserve_on.addEventListener('click', function() {
    if (!reserve_done){
        firebase.database().ref('/order').push({
            id: user_id,
            name: user_name
        });
        reserve_on.style.display = 'none';
        reserve_off.style.display = 'block';
    }
});

reserve_off.addEventListener('click', function() {
    for (let i = 1; i < id_order.length; i++){
        if (id_order[i] == user_id){
            firebase.database().ref().child('order').once('value').then(function(snapshot){
                firebase.database().ref().child('order/' + Object.keys(snapshot.val())[i]).remove();
            });
            document.getElementById(`user${user_id}`).style.left = '85%';
            reserve_off.style.display = 'none';
            reserve_on.style.display = 'block';
        }
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

quit.addEventListener('click', function() {
    if (now_id == user_id){
        firebase.database().ref().child('start_status').set({
            status: 0
        });
    }
    
});

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(500); // 진동을 울리게 한다. 1000ms = 1초
    }
    else {
    }
}
function vibrate_stop() {
    navigator.vibrate(0);
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

//
// document.getElementById("button3").addEventListener('click', function () {
//     document.getElementById('user3').style.top = '20%';
//     document.getElementById('user3').style.left = '68%';
// });

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
