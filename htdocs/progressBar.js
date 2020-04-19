const {group} = JSON.parse(localStorage.getItem("userData"));
document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
    window.location=`/3${3+group}.html`
});
document.getElementById("progressBar").setAttribute("style", `height: 25px; width: ${window.innerWidth/10*(params.progress+1)}px`);
