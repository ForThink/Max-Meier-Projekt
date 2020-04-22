const {rounds} = JSON.parse(localStorage.getItem("userData"));
const previousModuleDone = (id)=>{
    const modules = rounds?rounds.length:0;
    const trans = id.split("-");
    const prog = (parseInt(trans[0].replace("Modul", ""))-1)*3+parseInt(trans[1].replace("mod", ""))-2;
    return admin||modules>prog;
}
const standardStyles = {};
const mouseEnter = (ev)=>{
    if(previousModuleDone(ev.target.id)){
        ev.target.setAttribute("style", "background-color: #4CAF50")}
    }
const mouseLeave = (ev)=>{
    ev.target.setAttribute("style", standardStyles[ev.target.id])}
const click = (ev)=>{
    ev.preventDefault();
    if(previousModuleDone(ev.target.id)){
        const mm = ev.target.id.split("-");
        const params = {main: mm[0], modulename:mm[1]};
        window.location="/39.html?q="+JSON.stringify(params);    
    }
    }
const setStartStyle = (id)=>{
    const element = document.getElementById(id);
    if(navigator.userAgent.includes("Mobil")&&previousModuleDone(id)){
        standardStyles[id]=`animation: highlight 2s ease-in-out ${Object.keys(standardStyles).length/10}s infinite`
    }else{
        standardStyles[id]="background-color: #ABEE5E"
    }
    element.setAttribute("style", standardStyles[id]);
    element.addEventListener("mouseenter", mouseEnter);
    element.addEventListener("mouseleave", mouseLeave);
    element.addEventListener("click", click);
}
setStartStyle("Modul1-mod1");
setStartStyle("Modul1-mod2");
setStartStyle("Modul1-mod3");
setStartStyle("Modul2-mod1");
setStartStyle("Modul2-mod2");
setStartStyle("Modul2-mod3");