const {group, rounds} = JSON.parse(localStorage.getItem("userData"));
document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
    if(params.modulename==="mod3"&&(admin||rounds.filter(({module})=>module===params.main+params.modulename)[0].tries===1)){
        window.location=`/52.html?q={"likert":${parseInt(params.main.replace("Modul", ""))+1}}`
    }else{
        window.location=`/3${3+group}.html`;
    }
});
if(admin){
    const adminbtn = document.getElementById("adminEdit");
    adminbtn.setAttribute("style", "");
    adminbtn.addEventListener("click", (ev)=>{
        ev.preventDefault();
        gatherData(params.main+params.modulename+"End");
    })
}
const {right} = params;
const replacew_x = ()=>{
    document.getElementById("modulBeschreibung").innerHTML = document.getElementById("modulBeschreibung").innerHTML.replace("w_x", right)
}
getData(params.main+params.modulename+"End").then(replacew_x, replacew_x)
if(right>5){
    document.getElementById(params.modulename).setAttribute("style", "background-color: #4CAF50")
}
