document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
document.getElementById("homebtn").addEventListener("click", (ev)=>{
    ev.preventDefault();
    window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`
})
document.getElementById("logoutbtn").addEventListener("click", (ev)=>{
    ev.preventDefault();
    fetch("/users/logout", {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
    }).then(()=>{
        window.location="/login.html"
    })
})
getData(params.main)
if(admin){
    let adminbtn= document.getElementById("adminEdit");
    adminbtn.setAttribute("style", "display: unset;");
    adminbtn.addEventListener("click", (ev)=>{
        ev.preventDefault();
        gatherData(params.main)
    })
}
