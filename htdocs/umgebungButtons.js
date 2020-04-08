const mouseEnter = (ev)=>{
    ev.target.setAttribute("style", "background-color: #4CAF50")}
const mouseLeave = (ev)=>{
    ev.target.setAttribute("style", "background-color: #ABEE5E")}
const click = (ev)=>{
    ev.preventDefault();
    const mm = ev.target.id.split("-");
    const params = {main: mm[0], modulename:mm[1]};
    window.location="/39.html?q="+JSON.stringify(params);
}
const m11 = document.getElementById("Modul1-mod1");
const m12 = document.getElementById("Modul1-mod2");
const m13 = document.getElementById("Modul1-mod3");
const m21 = document.getElementById("Modul2-mod1");
const m22 = document.getElementById("Modul2-mod2");
const m23 = document.getElementById("Modul2-mod3");
m11.addEventListener("mouseenter", mouseEnter);
m11.addEventListener("mouseleave", mouseLeave);
m11.addEventListener("click", click);
m12.addEventListener("mouseenter", mouseEnter);
m12.addEventListener("mouseleave", mouseLeave);
m12.addEventListener("click", click);
m13.addEventListener("mouseenter", mouseEnter);
m13.addEventListener("mouseleave", mouseLeave);
m13.addEventListener("click", click);
m21.addEventListener("mouseenter", mouseEnter);
m21.addEventListener("mouseleave", mouseLeave);
m21.addEventListener("click", click);
m22.addEventListener("mouseenter", mouseEnter);
m22.addEventListener("mouseleave", mouseLeave);
m22.addEventListener("click", click);
m23.addEventListener("mouseenter", mouseEnter);
m23.addEventListener("mouseleave", mouseLeave);
m23.addEventListener("click", click);