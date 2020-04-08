const {admin, group} = JSON.parse(localStorage.getItem("userData"));
document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
    window.location=`/3+${3+group}.html`;
});
const params = JSON.parse(new URLSearchParams(window.location.search).get("q"));
let edit = false;
const adminbtn = document.getElementById("adminEdit");
const modulTitel = document.getElementById("modulTitel");
const modulTitelInput = document.getElementById("modulTitelInput");
const modulUntertitel = document.getElementById("modulUntertitel");
const modulUntertitelInput = document.getElementById("modulUntertitelInput");
const modulBeschreibung = document.getElementById("modulBeschreibung");
const modulBeschreibungInput = document.getElementById("modulBeschreibungInput");
const modulePageFill= ({title=modulTitel.innerHTML, untertitel=modulUntertitel.innerHTML, beschreibung=modulBeschreibung.innerHTML})=>{
    modulTitel.innerHTML=title;
    modulUntertitel.innerHTML=untertitel;
    modulBeschreibung.innerHTML=beschreibung;
}
document.getElementById("mainModule").innerHTML=params.main;
fetch("/text?id="+params.main+params.modulename).then((response)=>{
    if(response.status<400){
        response.json().then(({content})=>{
            modulePageFill(content);
        })
    }
}, console.log)
const dot = document.getElementById(params.modulename);
if(dot){
    dot.setAttribute("style", "background-color: #4CAF50")
}
adminbtn.addEventListener("click", (ev)=>{
    ev.preventDefault();
    if(edit){
        fetch("/text", {
           method:"POST",
           headers:{
               "Authorization":`Bearer ${localStorage.getItem("token")}`,
               "Content-Type":"application/json"
           },
           body:JSON.stringify({
               id:params.main+params.modulename,
               content: {
                  title: modulTitelInput.value!=""?modulTitelInput.value:modulTitel.innerHTML,
                  untertitel: modulUntertitelInput.value!=""?modulUntertitelInput.value:modulUntertitel.innerHTML,
                  beschreibung: modulBeschreibungInput.value!=""?modulBeschreibungInput.value:modulBeschreibung.innerHTML 
               }
            }) 
        }).then((response)=>{
            if(response.status<400){
                response.json().then(({content})=>{
                    modulTitel.innerHTML=content.title;
                    modulUntertitel.innerHTML=content.untertitel;
                    modulBeschreibung.innerHTML=content.beschreibung;
                }) 
            }
            modulBeschreibungInput.setAttribute("style", "display: none");
            modulTitelInput.setAttribute("style", "display: none");
            modulUntertitelInput.setAttribute("style", "display: none");
        })
    }else{
        modulBeschreibungInput.setAttribute("style", "");
        modulTitelInput.setAttribute("style", "");
        modulUntertitelInput.setAttribute("style", "");
    }
    edit=!edit;
})
if(admin){
    adminbtn.setAttribute("style", "");
}