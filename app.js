async function login(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if(!email || !password){
        msg.innerText="Enter all fields";
        return;
    }

    try{
        const res = await fetch("https://employee-backend-qvmq.onrender.com/login.php",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email:email,
                password:password
            })
        });

        const data = await res.json();
        console.log(data); // DEBUG

        if(data.status==="success"){
            location="dashboard.html";
        }else{
            msg.innerText=data.message;
        }

    }catch(err){
        msg.innerText="Server error";
        console.log(err);
    }
}
