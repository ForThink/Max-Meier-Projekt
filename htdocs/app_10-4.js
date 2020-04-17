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
let edit = false;
const {admin} = JSON.parse(localStorage.getItem("userData"));
fetch("/text?id=datschu", {
    method:"GET",
}).then((response)=>{
    if(response.status<400){
        response.json().then((json)=>{
            document.getElementById("datschuText").innerHTML=json.content
            document.getElementById("datschuEdit").value=json.content
        })
    }
})
if(admin){
    let adminbtn= document.getElementById("adminEdit");
    let editField = document.getElementById("datschuEdit");
    adminbtn.setAttribute("style", "display: unset;");
    adminbtn.addEventListener("click", (ev)=>{
        ev.preventDefault();
        if(edit){
            fetch("/text", {
                method:"POST",
                body:JSON.stringify({
                    id:"datschu",
                    content: editField.value
                }),
                headers:{
                   "Content-Type":"application/json",
                   "Authorization":`Bearer ${localStorage.getItem("token")}` 
                }
            }).then((response)=>{
                if(response.status<400){
                    document.getElementById("datschuText").innerHTML=editField.value
                }
            })
        }else{
            editField.setAttribute("style", `width: 80%; height: ${window.innerHeight*0.6}px;`)
        }
        edit=!edit;
    })
}