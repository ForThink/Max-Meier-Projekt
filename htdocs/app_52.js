if(admin){
    const adminEdit=document.getElementById("adminSave");
    adminEdit.setAttribute("style", "");
    adminEdit.addEventListener("click", (ev)=>{
        ev.preventDefault();
        gatherData("description"+params.likert);
    })
}
getData("description"+params.likert);
document.getElementById("naechsteFrage").addEventListener("click", (ev)=>{
    ev.preventDefault();
    if(params.likert===1){
        window.location=`53.html${window.location.search}`;
    }else{
        window.location=`54.html?q=${JSON.stringify({likert: params.likert, progress: (params.likert-1)*24})}`
    }
})
const stretchFactor = 0.8;