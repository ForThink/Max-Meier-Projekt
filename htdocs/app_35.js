document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
document.getElementById("homebtn").addEventListener("click", (ev)=>{
    ev.preventDefault();
    window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`
})
document.getElementById("rmad").addEventListener("click", (ev)=>{
    document.getElementById("apan").setAttribute("style", "animation: fadeout 1s linear")
    setTimeout(()=>{
        document.getElementById("apan").setAttribute("style", "display: none;")
        document.getElementById("contentPanel").setAttribute("style", "animation: fadein 1s linear");
    },950)
})
for (let i = 33; i < 37; i++){
    const el = document.getElementById(`${i}html`);
    if(el&&JSON.parse(localStorage.getItem("userData")).admin){
        el.setAttribute("style", "");
    }
}
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
const {xp, logdates} = JSON.parse(localStorage.getItem("userData"));
let aplicado = 0;
logdates.forEach((date) => {    
    const d1 = new Date(date[1])-0||Date.now();
    const d2 = new Date(date[0])-0;
    if(!isNaN(d1)&&!isNaN(d2)){
        aplicado+=d1-d2;
    }
    
});
aplicado = Math.floor(Math.log2(aplicado/(1000*60*30)));
let inteligente = 0;
let estudioso = 0;
const statsq = JSON.parse(localStorage.getItem("statQuestions")).map(({qid})=>qid);
(xp||[]).forEach((day)=>{
    day.xp.forEach(({qid, right})=>{
        if(!statsq.includes(qid)){
            estudioso++;
            if(right){
                inteligente++;
            }
        }
    })
})
const level = (inteligente, estudioso)=>{
    return (isNaN(inteligente/estudioso)||inteligente/estudioso<0.55||estudioso<10)?0:Math.ceil((inteligente/estudioso-0.55)/0.15);
}
window.level = level;
document.getElementById("aplicado").innerHTML=`Level ${aplicado<0?0:aplicado<3?aplicado:3}`;
document.getElementById("inteligente").innerHTML=`Level ${level(inteligente, estudioso)}`
document.getElementById("estudioso").innerHTML=`Level ${estudioso<10?0:estudioso<30?1:estudioso<60?2:3}`
if(admin){
    const editAdmin = document.getElementById("edit_admin");
    editAdmin.setAttribute("style", "");
    editAdmin.addEventListener("click", (ev)=>{
        ev.preventDefault();
        gatherData("Umgebung");
    }
    )
}
getData("Umgebung");
