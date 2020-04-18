document.getElementById("naechsteFrage").addEventListener("click", (ev)=>{
    ev.preventDefault();
    if(params.progress<10){
        const questions = JSON.parse(localStorage.getItem(params.main+params.modulename));
        const nextPage = (questions[params.progress]||{page: 41}).page;
        params.progress++;
        window.location=`${nextPage}.html?q=${JSON.stringify(params)}`
    }else{
        window.location=`40.html${window.location.search}`
    }
})
if(admin){
    const adminSave = document.getElementById("adminSave");
    adminSave.setAttribute("style", "");
    adminSave.addEventListener("click", (ev)=>{
        ev.preventDefault();
        gatherData(params.main+params.modulename+params.progress+"Sol");
    })
}
getData(params.main+params.modulename+params.progress+"Sol")
document.getElementById("main").setAttribute("style", `background-color: ${params.last===true?"green":"red"};${document.getElementById("main").getAttribute("style")}`)