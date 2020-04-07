document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
const params = JSON.parse(new URLSearchParams(window.location.search).get("q"));
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
        response.json().then(console.log, console.log)
    })
})