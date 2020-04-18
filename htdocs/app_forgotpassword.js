document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
document.getElementById("resetPW").addEventListener("click", (ev)=>{
    ev.preventDefault();
    const email = document.getElementById("email_addy").value;
    fetch("/users/pwd", {
        method:"POST",
        body:JSON.stringify({email}),
        headers:{
            "Content-Type":"application/json"
        }
    }).then((response)=>{
        if(response.status<400){
            window.location="/login.html";
        }else{
            response.json().then((json)=>{
                document.getElementById("error").innerHTML=json;
            }, console.log)
        }
        
    })
})