const {group} = JSON.parse(localStorage.getItem("userData"));
document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
    window.location=`/3${3+group}.html`
});
const params = JSON.parse(new URLSearchParams(window.location.search).get("q"));
console.log(params);
document.getElementById("progressBar").setAttribute("style", `height: 25px; width: ${window.innerWidth/10*params.progress}px`);
const question = JSON.parse(localStorage.getItem(params.main+params.modulename))[params.progress]||{};
const adminSave = document.getElementById("adminSave");
if(admin){
    adminSave.setAttribute("style", "");
    adminSave.addEventListener("click", (ev)=>{
        ev.preventDefault();
        gatherData(params.main+params.modulename+params.progress);
    })
}
getData(params.main+params.modulename+params.progress);