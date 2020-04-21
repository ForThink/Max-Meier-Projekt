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
    if(aplicado<6&&!isNaN(d1)&&!isNaN(d2)&&(d1-d2)>=1000*60*30){
        aplicado++;
    }
});
let inteligente = 0;
let estudioso = 0;
const checked = [];
const estudiosointeligente = (modulename)=>{
    console.log(estudioso, inteligente)
    console.log(modulename);
    const mod1m1= JSON.parse(localStorage.getItem(modulename))||[];
    let intelligent = 0;
    let studious = 0;
    mod1m1.forEach(({qid})=>{
        xp.forEach(({xp})=>{
            xp.forEach((item)=>{
                if(!checked.includes(qid)&&item.qid==qid){
                    checked.push(qid);
                    studious++;
                    if(item.right){
                        intelligent++;
                    }
                }
            })
        })
    })
    if(intelligent>7){
        inteligente++;
    }
    if(studious==10){
        estudioso++;
    }
}
estudiosointeligente("Modul1mod1");
estudiosointeligente("Modul1mod2");
estudiosointeligente("Modul1mod3");
estudiosointeligente("Modul2mod1");
estudiosointeligente("Modul2mod2");
estudiosointeligente("Modul2mod3");
const level = (stat)=>{
    let level = 0;
    while(level*(level+1)<2*stat){
        level++
    }
    return level;
}
document.getElementById("aplicado").innerHTML=`Level ${level(aplicado)}`;
document.getElementById("inteligente").innerHTML=`Level ${level(inteligente)}`
document.getElementById("estudioso").innerHTML=`Level ${level(estudioso)}`
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
