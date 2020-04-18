const {group} = JSON.parse(localStorage.getItem("userData"));
document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
    window.location=`/3${3+group}.html`;
});
const adminbtn = document.getElementById("adminEdit");
getData(params.main+params.modulename)
const dot = document.getElementById(params.modulename);
if(dot){
    dot.setAttribute("style", "background-color: #4CAF50")
}
adminbtn.addEventListener("click", (ev)=>{
    ev.preventDefault();
    gatherData(params.main+params.modulename)
})
if(admin){
    adminbtn.setAttribute("style", "");
}
fetch(`/questions?tags=${params.main+params.modulename}`).then((response)=>{
    if(response.status<400){
        response.json().then((json)=>{
            localStorage.setItem(params.main+params.modulename, JSON.stringify(json));
        }, console.log);
    }else{
        localStorage.setItem(params.main+params.modulename, "[]");
    }
})
document.getElementById("start").addEventListener("click", (ev)=>{
    ev.preventDefault();
    fetch("/questions/startRound", {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({module: params.main+params.modulename})
    }).then((response)=>{
        if(admin||response.status<400){
            response.json().then((token)=>{
                if(response.status<400){
                    localStorage.setItem("token", token);
                }
                params.progress=1;
                window.location="/"+((JSON.parse(localStorage.getItem(params.main+params.modulename))[0]||{page: 41}).page||41)+".html?q="+JSON.stringify(params);
            })
        }
    })
})