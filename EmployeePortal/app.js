// create default admin if not exists
if(!localStorage.users){
localStorage.users = JSON.stringify([
{email:"admin@company.com",password:"admin123",role:"admin"}
]);
}

// LOGIN
function login(){
let email = document.getElementById("email").value;
let pass = document.getElementById("pass").value;

let users = JSON.parse(localStorage.users);

let user = users.find(u=>u.email===email && u.password===pass);

if(user){
localStorage.currentUser = JSON.stringify(user);
location="dashboard.html";
}else{
document.getElementById("msg").innerText="Invalid credentials";
}
}

// DASHBOARD LOAD
if(location.pathname.includes("dashboard")){
let user = JSON.parse(localStorage.currentUser);

document.getElementById("email").innerText=user.email;
document.getElementById("role").innerText=user.role;

if(user.role==="admin")
document.getElementById("adminPanel").style.display="block";
}

// CREATE USER
function createUser(){
let users = JSON.parse(localStorage.users);

let newUser = {
email:document.getElementById("email").value,
password:document.getElementById("password").value,
role:document.getElementById("role").value
};

users.push(newUser);
localStorage.users = JSON.stringify(users);

alert("User created");
}

// LOAD USERS
function loadUsers(){
let users = JSON.parse(localStorage.users);
let list = document.getElementById("list");

list.innerHTML="";

users.forEach(u=>{
list.innerHTML+=`<li>${u.email} - ${u.role}</li>`;
});
}

// LOGOUT
function logout(){
localStorage.removeItem("currentUser");
location="login.html";
}
