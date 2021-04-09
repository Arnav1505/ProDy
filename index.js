firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // try{
    //   var pos = (doc.data().position);
    // }
    // catch(Exception){
    //   return;
    // }

    var user = firebase.auth().currentUser;

    if(user != null){
      var pos;
      db.collection('employees').doc(user.uid).get().then(doc =>{
        try{
          pos = doc.data().position;
        }
        catch(err){
          pos = 1;
        }
        // var pos = 1;
        if(pos==1){
          manager();
        }
        else{
          employee();
        }
      })
    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("sign_up").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("manager-login").style.display = "none";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function signup(){
    document.getElementById("user_div").style.display = "none";
    document.getElementById("sign_up").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("manager-login").style.display = "none";


}

function create(){

  var email = document.getElementById("newemail_field").value;
  var pass = document.getElementById("newpassword_field").value;
  var pos = document.getElementById("newpos_field").value;

  firebase.auth().createUserWithEmailAndPassword(email, pass).then((cred) => {
    // Signed in 
    var user = cred.user;
    db.collection('employees').doc(cred.user.uid).set({
        email: email,
        id: cred.user.uid,
        position: pos,
        tasks: ["task 1","task 2","task 3"],
    })
    location.reload();
    // ...
    if(pos==1){
      manager();
    }
    else{
      console.log("EMPLOYEE");
      employee();
    }
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
}

function logout(){
  firebase.auth().signOut();
}

function employee(){
  //employee page
  document.getElementById("user_div").style.display = "block";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("sign_up").style.display = "none";
  document.getElementById("manager-login").style.display = "none";
  console.log("Employee");
}


function manager(){
  //manager page
  console.log("Manager");
  document.getElementById("user_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("sign_up").style.display = "none";
  document.getElementById("manager-login").style.display = "block";
  db.collection('employees').where("position","==","0").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    var list = document.getElementById('employee-details');
    changes.forEach(change => {
      var data = change.doc.data();
      let tasks = data.tasks;
      let index = 0;
      const li_parent = document.createElement('li');
      li_parent.appendChild(document.createTextNode(data.email));
      const li_child = document.createElement('ol');
      while(index<tasks.length){
        const li = document.createElement('li');
        li.innerHTML = tasks[index];
        let butn = document.createElement('button');
        butn.innerHTML = "-";
        butn.className = "delete-button";
        butn.style.width = "2px";
        butn.style.height = "2px";
        butn.value = index;
        butn.onclick = function(){
          var ele = db.collection('employees').doc(""+data.id+"");
          let t = [];
          let k =0;
          while(k<tasks.length){
            if(k == this.value){
              console.log("Continue");
              k++;
              continue;
            }
            t.push(tasks[k]);
            k++;
          }
          console.log(t);
          ele.update({
            tasks: t
          });
          li.style.display = "none"
        };
        li.appendChild(butn);
        li_child.appendChild(li);
        index++;
      }
      let button = document.createElement('button');
      button.innerHTML = "Add Task";
      button.className = "inner-button";
      button.onclick = function(){
        console.log(data);
      };
      li_parent.appendChild(document.createTextNode(data.tasks[0]))
      li_parent.appendChild(li_child);
      li_parent.appendChild(button);
      list.appendChild(li_parent);
    })
  })
}