/* ===============================
   CONFIG
================================ */


const API = "https://employee-backend-qvmq.onrender.com";


/* ===============================
   LOGIN
================================ */
async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if(!email || !password){
        msg.innerText = "Enter all fields";
        return;
    }

    try{

        const res = await fetch(API + "login.php", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        /* Failed login counter */
        if(!localStorage.failedAttempts){
            localStorage.failedAttempts = 0;
        }

        if(data.status === "success"){

            localStorage.currentUser = JSON.stringify(data.user);
            localStorage.failedAttempts = 0;

            /* Log activity */
            logActivity("Login Success");

            if(data.user.role === "admin")
                location="admin.html";
            else
                location="dashboard.html";

        } else {

            localStorage.failedAttempts++;

            if(localStorage.failedAttempts >= 3){
                alert("⚠ Suspicious Login Detected!");
                logActivity("Suspicious Login Attempt");
            }

            msg.innerText = data.message;
        }

    }catch(err){
        msg.innerText="Server error";
        console.error(err);
    }
}


/* ===============================
   VERIFY SESSION
================================ */
function checkAuth(){

    const user = JSON.parse(localStorage.currentUser || "null");

    if(!user){
        location="login.html";
        return;
    }

    document.getElementById("welcome").innerText =
        "Welcome " + user.name + " (" + user.role + ")";

    logActivity("Visited Dashboard");
}


/* ===============================
   LOGOUT
================================ */
async function logout(){

    const user = JSON.parse(localStorage.currentUser || "null");

    if(user){
        await logActivity("Logout");
    }

    localStorage.removeItem("currentUser");
    location="login.html";
}


/* ===============================
   LOG ACTIVITY (Backend)
================================ */
async function logActivity(action){

    const user = JSON.parse(localStorage.currentUser || "null");
    if(!user) return;

    try{
        await fetch(API + "log.php",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({
                user_id:user.id,
                action:action
            })
        });
    }catch(err){
        console.log("Log failed");
    }
}


/* ===============================
   LOAD USERS (ADMIN)
================================ */
async function loadUsers(){

    const user = JSON.parse(localStorage.currentUser || "null");
    if(!user || user.role !== "admin"){
        alert("Access denied");
        location="login.html";
        return;
    }

    const res = await fetch(API + "getUsers.php");
    const data = await res.json();

    const table = document.getElementById("usersTable");

    let html = `
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
    </tr>
    `;

    data.forEach(u=>{
        html += `
        <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
        </tr>
        `;
    });

    table.innerHTML = html;

    logActivity("Viewed Users");
}


/* ===============================
   LOAD LOGS (ADMIN)
================================ */
async function loadLogs(){

    const user = JSON.parse(localStorage.currentUser || "null");
    if(!user || user.role !== "admin"){
        alert("Access denied");
        location="login.html";
        return;
    }

    const res = await fetch(API + "getLogs.php");
    const data = await res.json();

    const table = document.getElementById("logsTable");

    let html = `
    <tr>
        <th>User</th>
        <th>Action</th>
        <th>Time</th>
    </tr>
    `;

    data.forEach(log=>{
        html += `
        <tr>
            <td>${log.name}</td>
            <td>${log.action}</td>
            <td>${log.created_at}</td>
        </tr>
        `;
    });

    table.innerHTML = html;

    logActivity("Viewed Logs");
}


/* ===============================
   CREATE USER (ADMIN)
================================ */
async function createUser(){

    const name = document.getElementById("newName").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("newRole").value;

    const res = await fetch(API + "createUser.php",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ name,email,password,role })
    });

    const data = await res.json();

    alert(data.message);

    logActivity("Created User");

    loadUsers();
}