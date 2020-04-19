document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});

document.getElementById("loginButton").addEventListener("click", (ev)=>{
    ev.preventDefault();
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    fetch("/users/login", {
        method:"POST",
        body:JSON.stringify({email, password}),
        headers:{
            "Content-Type":"application/json"
        }
    }).then((response)=>{
        response.json().then((json)=>{
            if(response.status<400){
                if(document.getElementById("remember").checked==true){
                    localStorage.setItem("lastUser",JSON.stringify({email, password}));
                }else{
                    localStorage.removeItem("lastUser");
                }
                localStorage.setItem("token", json.token);
                localStorage.setItem("userData", JSON.stringify(json.userData));
                window.location="/52.html?q="+JSON.stringify({main: "rquestions", modulename:"", progress:0, likert: 1})
            }else{
                document.getElementById("error").innerHTML=json;
            }
        }, console.log)
    }, console.log)
})