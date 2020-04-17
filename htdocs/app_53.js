document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
const lsg=54;
params.likert=1;
const {xp} = JSON.parse(localStorage.getItem("userData"));
if(!admin){
    if(xp&&xp.length>0){
        window.location=`54.html?q=${JSON.parse({progress: 1, likert: 1})}`
    }
}
