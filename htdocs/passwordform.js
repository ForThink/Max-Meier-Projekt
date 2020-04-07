const password = document.getElementById("npw");
const rpass = document.getElementById("npww");
const sendb = document.getElementById("absenden");
sendb.onclick=()=>{
    
    if (password.value===rpass.value&&password.value.length>7){
        const token = window.location.href.split("?token=")[1];
        const {uid} = JSON.parse(atob(token.split(".")[1]));
        fetch("/users/setpw", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            },
            body:JSON.stringify({uid, password: password.value})
        })
    }
}