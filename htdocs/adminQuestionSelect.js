const aqs = document.getElementById("adminQuestionSelect");
if(admin){
    aqs.setAttribute("style", "");
    const thisSite = parseInt(window.location.pathname.replace(".html", "").replace("/", ""))-40;
    for (let i = 1; i < 8; i++){
    if (i!=thisSite){
        aqs.innerHTML+=`<option>Aufgabentyp ${i}</option>`
    }
}
aqs.addEventListener("change", (ev)=>{
    const selected = ev.target.selectedIndex;
    if(selected<thisSite){
        window.location=`4${selected}.html${window.location.search}`;
    }else{
        window.location=`4${selected+1}.html${window.location.search}`;
    }
})
}
