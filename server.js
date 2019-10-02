const firebaseConfig = {
    apiKey: "AIzaSyCe0_GXWbvKkQFMG1bk0ypLFW_2c0ABDUE",
    authDomain: "sepprototype.firebaseapp.com",
    databaseURL: "https://sepprototype.firebaseio.com",
    projectId: "sepprototype",
    storageBucket: "",
    messagingSenderId: "447104585999",
    appId: "1:447104585999:web:67eec155bfb03862"
};

let start_status = 0;
let stop_status = 1;
let rem = undefined;
let arc = undefined;
let remainTime = 0;
let archiveTime = 0;
//
let now_id = undefined;
let now_name = undefined;
//
let mst = undefined;
let meetingTime = 0;
let meeting_start = 0;
//
let next_user_true = 0;
let userTable = 0;
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('order').on('value', function(snapshot) {
    let name_order = [];
    let id_order = [];
	for (let key in snapshot.val()) {
        name_order.push(snapshot.val()[key].name);
        id_order.push(snapshot.val()[key].id);
	}
    now_id = id_order[0];
    now_name = name_order[0];

    if (id_order[1] != undefined){
        next_user_true = 1;
        firebase.database().ref('/data/'+now_id).once('value').then(function(snapshot){
            //시작 전 딜레이
            if (start_status == 2){
                clearInterval(arc);
                remainTime = 60 - snapshot.val().penalty;
                firebase.database().ref().child('rem_time').set({
                    time: remainTime
                });
                start_status = 1;
                stop_status = 0;
                rem=setInterval('rem_time()',1000);
                firebase.database().ref().child('start_status').set({
                    status: 2
                });
            }
        });
    } else{
        next_user_true = 0;
    }
});

firebase.database().ref().child('data').on('value', function(snapshot) {
    userTable = [];
    for (let key in snapshot.val()){
        userTable.push(snapshot.val()[key].color);
    }
});

firebase.database().ref().child('start_status').on('value', function(snapshot) {
    if (snapshot.val().status == 1){
        if (start_status == 0){
            if (meeting_start == 0){
                mst=setInterval('mst_time()',1000);
                meeting_start = 1;
            }
            firebase.database().ref('/data/'+now_id).once('value').then(function(snapshot){
                //시작 전 딜레이
                if (next_user_true == 1){
                    remainTime = 60 - snapshot.val().penalty;
                    archiveTime = snapshot.val().time;
                    firebase.database().ref().child('rem_time').set({
                        time: remainTime
                    });
                    start_status = 1;
                    stop_status = 0;
                    rem=setInterval('rem_time()',1000);
                    firebase.database().ref().child('start_status').set({
                        status: 2
                    });
                } else if (next_user_true == 0){
                    archiveTime = snapshot.val().time;
                    start_status = 2;
                    stop_status = 0;
                    arc=setInterval('arc_time()',1000);
                }
            });
        }
    } else if (snapshot.val().status == 0){
        if (stop_status == 0){
            start_status = 0;
            stop_status = 1;
            clearInterval(arc);
            clearInterval(rem);
            if (remainTime > 0){
                firebase.database().ref('/data/'+now_id).set({
                    name: now_name,
                    penalty: 0,
                    time: archiveTime,
                    color: userTable[now_id-1]
                });
            } else {
                remainTime = remainTime * (-1);
                firebase.database().ref('/data/'+now_id).set({
                    name: now_name,
                    penalty: remainTime,
                    time: archiveTime,
                    color: userTable[now_id-1]
                });
            }
            document.getElementById('timer').innerHTML = "기믹 서버입니다.";
            firebase.database().ref().child('rem_time').set({
                time: 0
            });
            firebase.database().ref().child('order').once('value').then(function(snapshot){
                firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).remove();
            });
        }  
    }
});

function rem_time() {
    if (remainTime < -30){
        start_status = 0;
        stop_status = 1;
        clearInterval(rem);
        remainTime = remainTime * (-1);
        firebase.database().ref('/data/'+now_id).set({
            name: now_name,
            penalty: remainTime,
            time: archiveTime,
            color: userTable[now_id-1]
        });
        firebase.database().ref().child('rem_time').set({
            time: remainTime
        });
        document.getElementById('timer').innerHTML = "기믹 서버입니다.";
        firebase.database().ref().child('order').once('value').then(function(snapshot){
            firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).remove();
        });
        firebase.database().ref().child('start_status').set({
            status: 0
        });
    }
    firebase.database().ref().child('rem_time').set({
        time: remainTime
    });
    document.getElementById('timer').innerHTML = remainTime;
    remainTime = remainTime - 1;
    archiveTime = archiveTime + 1;
}

function mst_time(){
    meetingTime = meetingTime + 1;
    firebase.database().ref().child('mst_time').set({
        time: meetingTime
    });
}
function arc_time(){
    archiveTime = archiveTime + 1;
}