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
const container = document.getElementById("container");
const {xp} = JSON.parse(localStorage.getItem("userData"));
let total = 0;
const today = [0, undefined];
const yesterday = [0, undefined];
const twdag = [0, undefined];
const trdag = [0, undefined];
const fdag=[0, undefined];
let sock = 0;
(xp||[]).forEach((day) => {
    tday = 0;
    day.xp.forEach(({right})=>{
        if(right){
            tday++;
        }
    })
    total+=tday;
    switch(Math.floor((Date.now()-Date.parse(day.date))/(24*60*60*1000))){
        case 0: today[0] = tday; break;
        case 1: yesterday[0] = tday; break;
        case 2: twdag[0] = tday; break;
        case 3: trdag[0] = tday; break;
        case 4: fdag[0]=tday; break;
        default: sock+=tday; break;
    }
});
today[1]=new Date().getDay();
yesterday[1]=(today[1]-1)<0?(today[1]+6):today[1]-1;
twdag[1]=(today[1]-2)<0?(today[1]-1+6):(today[1]-2);
trdag[1]=(today[1]-3)<0?(today[1]-2+6):(today[1]-3);
fdag[1]=(today[1]-4)<0?(today[1]-3+6):(today[1]-4);
const numtoday = (num)=>{
    switch(num){
        case 0: return "SO";
        case 1: return "MO";
        case 2: return "DI";
        case 3: return "MI";
        case 4: return "DO";
        case 5: return "FR";
        case 6: return "SA";
    }
}
const width = window.innerWidth>500?200:window.innerWidth*0.4;
const height = (day)=>{
    const h = width-25;
    const range = total - sock;
    return h*(1 - day[0]/(range>0?range:1));
}
let content = `
<label style="margin-bottom:5px">Insgesamt: ${total}&nbsp;&nbsp;Heute:${today[0]}</label>
<svg width="${width}" height ="${width}">
    <line x1="${5*width/40}" x2="${5*width/40}" y1="${width-25}" y2="${0}" style="stroke:rgb(0,0,0);stroke-width:1;"/>
    <line x1="${5*width/40}" x2="${width}" y1="${width-25}" y2="${width-25}" style="stroke:rgb(0,0,0);stroke-width:1;"/>
    <text x="${width/50}" y="${3*width/50}" style="fill:black;font-size: ${width/15}px; font-weight: bold" >XP</text>
    <text x="${width/50}" y="${(width-25)/4}" style="fill:black;font-size: ${width/15}px;" >${Math.round((total-sock)/4*3+sock)}</text>
    <text x="${width/50}" y="${(width-25)/2}" style="fill:black;font-size: ${width/15}px;" >${Math.round((total-sock)/4*2+sock)}</text>
    <text x="${width/50}" y="${3*(width-25)/4}" style="fill:black;font-size: ${width/15}px;" >${Math.round((total-sock)/4+sock)}</text>
    <text x="${width/50}" y="${width-25}" style="fill:black;font-size: ${width/15}px;" >${sock}</text>
    <text y="${0.97*width}" x="${(width-25)/4}" style="fill:black;font-size: ${width/15}px;" >${numtoday(trdag[1])}</text>
    <text y="${0.97*width}" x="${(width-25)/2}" style="fill:black;font-size: ${width/15}px;" >${numtoday(twdag[1])}</text>
    <text y="${0.97*width}" x="${3*(width-25)/4}" style="fill:black;font-size: ${width/15}px;" >${numtoday(yesterday[1])}</text>
    <text y="${0.97*width}" x="${width-25}" style="fill:black;font-size: ${width/15}px;" >${numtoday(today[1])}</text>
    <line x1="${5*width/40}" x2="${(width-25)/4}" y1="${width-25}" y2="${height(trdag)}" style="stroke:rgb(0,0,0);stroke-width:1;"/>
    <line x1="${(width-25)/4}" x2="${(width-25)/2}" y1="${height(trdag)}" y2="${height(twdag)}" style="stroke:rgb(0,0,0);stroke-width:1;"/>
    <line x1="${(width-25)/2}" x2="${3*(width-25)/4}" y1="${height(twdag)}" y2="${height(yesterday)}" style="stroke:rgb(0,0,0);stroke-width:1;"/>
    <line x1="${3*(width-25)/4}" x2="${width-25}" y1="${height(yesterday)}" y2="${height(today)}" style="stroke:rgb(0,0,0);stroke-width:1;"/>
    </svg>`
container.innerHTML=content;
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
