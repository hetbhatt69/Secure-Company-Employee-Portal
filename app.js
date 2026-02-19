async function login(){

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;
let msg = document.getElementById("msg");

msg.innerText="Checking...";

try{

let res = await fetch("https://employee-backend-qvmq.onrender.com/login.php",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ email, password })
});

let data = await res.json();

if(data.status === "error"){
msg.innerText = data.message;
msg.style.color = "#ff8080";
return;
}

/* SUCCESS LOGIN */
msg.innerText = "Login successful!";
msg.style.color = "#5cff95";

localStorage.setItem("user", JSON.stringify(data.user));

setTimeout(()=>{
window.location="dashboard.html";
},1000);

}
catch(err){
msg.innerText="Server error. Try again.";
msg.style.color="orange";
}
}
