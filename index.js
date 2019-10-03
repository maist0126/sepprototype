const firebaseConfig = {
    apiKey: "AIzaSyCe0_GXWbvKkQFMG1bk0ypLFW_2c0ABDUE",
    authDomain: "sepprototype.firebaseapp.com",
    databaseURL: "https://sepprototype.firebaseio.com",
    projectId: "sepprototype",
    storageBucket: "",
    messagingSenderId: "447104585999",
    appId: "1:447104585999:web:67eec155bfb03862"
};

let user_count = 0;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('user_count').once('value').then(function(snapshot) {
    user_count = snapshot.val();
});

function create() {
    firebase.database().ref().child('user_count').once('value').then(function(snapshot) {
        user_count = snapshot.val();
        let user_nickname = document.getElementById("name").value;
        user_count = user_count + 1;
        firebase.database().ref().child('user_count').set(user_count);
        firebase.database().ref('/data/'+user_count).set({
            name: user_nickname,
            color: getRandomColor(),
            time: 0,
            penalty: 0 
        });
        location.href = `./user.html?id=${user_count}&name=${user_nickname}`;
    });
}

function getRandomColor() {
    var o_letters = '89ABCDEF';
    var e_letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        if (i%2 == 0){
            color += o_letters[Math.floor(Math.random() * 8)];
        } else{
            color += e_letters[Math.floor(Math.random() * 16)];
        }
    }
    return color;
  }

function reset() {
    firebase.database().ref().set(null);
    firebase.database().ref().child('user_count').set(0);
    firebase.database().ref().child('start_status').set({
        status: 0
    });
}