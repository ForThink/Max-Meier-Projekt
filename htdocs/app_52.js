const {xp} = JSON.parse(localStorage.getItem("userData"));
if(admin){
    const adminEdit=document.getElementById("adminSave");
    adminEdit.setAttribute("style", "");
    adminEdit.addEventListener("click", (ev)=>{
        ev.preventDefault();
        gatherData("description"+params.likert);
    })
}else if(params.likert==1&&xp&&xp.length>0){
    window.location=`54.html?q=${JSON.stringify({progress: 0, likert: 1, main:"statQuestions", moduleName:""})}`
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
fetch("/questions?tags=rquestions").then((response)=>{
    if(response.status<400){
        response.json().then((json)=>{
            localStorage.setItem("rquestions", JSON.stringify(json));
        })
    }
})
const stretchFactor = 1;