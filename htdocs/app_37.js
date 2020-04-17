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
if(admin){
    const adminb = document.getElementById("admin_edit");
    adminb.setAttribute("style", "");
    adminb.addEventListener("click", (ev)=>{
        gatherData("overview")
    })
   }   
getData("overview")
