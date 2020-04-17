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
const tabcontent = (ranking)=>{
    console.log(ranking)
    const {uid} = JSON.parse(localStorage.getItem("userData"));
    const tab = document.getElementById("ranktab");
    let tabcontent = "";
    if(ranking.length<10){
        tabcontent = `<table style="border: 1px solid black; border-collapse: collapse">
        ${ranking.map((item, index)=>{return "<tr style=\"background: "+(index%2==0?"white":"grey")+";border: solid 1px black;\"><td style=\"width: 20px;\">"+(index+1)+"</td><td style=\"width: 120px\">"+(item===uid?"DU":("Spieler "+item))+"</td></tr>"})}
      </table>`
    }else{
        const top5 = ranking.splice(0, 5);
        const last5 = ranking.splice(ranking.length-6, 5);
        tabcontent = `<table style="border: 1px solid black; border-collapse: collapse">
        ${top5.map((item, index)=>{return "<tr style=\"background: "+(index%2==0?"white":"grey")+";border: solid 1px black;\"><td style=\"width: 20px;\">"+index+"</td><td style=\"width: 120px\">"+(item===uid?"DU":("Spieler "+item))+"</td></tr>"})}
      </table>
        ${!top5.includes(uid)&&!last5.includes(uid)?'<table style="border: 1px solid black; border-collapse: collapse"><tr><td></td style="width: 20px;">'+(ranking.indexOf(uid)+6)+'<td style="width: 120px">DU</td></tr></table>':""}
      <table style="border: 1px solid black; border-collapse: collapse">
        ${last5.map((item, index)=>{return "<tr style=\"background: "+(index%2==0?"white":"grey")+";border: solid 1px black;\"><td style=\"width: 20px;\">"+(ranking.length+6+index)+"</td><td style=\"width: 120px\">"+(item===uid?"DU":("Spieler "+item))+"</td></tr>"})}
      </table>`
    }
    while(tabcontent.includes(",")){
        tabcontent=tabcontent.replace(",", "")
    }
    tab.innerHTML=tabcontent;
}
fetch("/rankings/xp?all=0").then((response)=>{
    if(response.status<400){
        response.json().then(tabcontent, console.log);
    }
})
document.getElementById("selector").addEventListener("change", (ev)=>{
    let args;
    switch(ev.target.selectedIndex){
        case 0: args = "all=0"; break;
        case 1: args = "all=1"; break;
        case 2: args = "tags=module1&all=0"; break;
        case 3: args = "tags=module1&all=1"; break;
        case 4: args = "tags=module2&all=0"; break;
        case 5: args = "tags=module2&all=1"; break;
    }
    fetch(`/rankings/xp?${args}`).then((response)=>{
        if(response.status<400){
            response.json().then(tabcontent, console.log)
        }


        
    })
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