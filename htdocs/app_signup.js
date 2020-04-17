document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
const errorbar = document.getElementById("error");
document.getElementById("register").addEventListener("click", (ev)=>{
    ev.preventDefault();
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const passwordRepeat = document.getElementById("passwordInputRepeat").value;
    let good = true;
    if (email.split("@").length<2){
        good = false;
    }
    if(good&&email.split("@")[1].split(".").length<2){
        good = false;
    }
    if (good&&(password.length<8||passwordRepeat!=password)){
        good = false;
    }
    if(good){
        fetch("/users/signup", {
            method:"POST",
            body:JSON.stringify({email, password}),
            headers: {
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            response.json().then((rm)=>{
                if(response.status<400){
                    window.location="/login.html";
                }else{
                    errorbar.innerHTML=rm;
                }
            }, (rm)=>{errorbar.innerHTML=rm;
            })
        }, (rm)=>{errorbar.innerText=rm})
    }
})