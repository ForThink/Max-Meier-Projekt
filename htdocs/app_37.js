document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
document.getElementById("homebtn").addEventListener("click", (ev)=>{
    ev.preventDefault();
    window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`
})
document.getElementById("logoutbtn").addEventListener("click", (ev)=>{
    ev.preventDefault();
    fetch("/users/logout", {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
    }).then(()=>{
        window.location="/login.html"
    })
})
let edit = false;
const {admin} = JSON.parse(localStorage.getItem("userData"));
const subpanehead = (text, id)=> `<div style="text-align:lift">
<label id="title_${id}"  style="font-size:24px;margin:10px;" class="text">${text}</label>
<input type="text" style="display: none;" id="title_${id}_input"/>
</div>
`
const textel = (text, imglnk, id)=> `<div class="img">
<img id="img_${id}" src="${imglnk}" style="width: 30px; height: 30px; margin: 5px;" class="rounded-circles" alt="Cinque Terre">
<input type="text" style="display: none;" placeholder="image url" id="img_${id}_input"/>
<label id="text_${id}"  style="font: size 20px;margin:10px;" class="text">${text}</label>
<input type="text" placeholder="text" style="display: none;" id="text_${id}_input"/>
</div>
`

const subpane = (title, elements, id)=>`
<div>
${subpanehead(title, id)}
${(()=>{let rs = ""; elements.forEach(({text, image}, index)=>{rs+=textel(text, image, id+index)}); return rs;})()}
</div>
`
const defaultPage = {
    panes:[
        {
            title:"Titel1",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        },
        {
            title:"Titel2",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        },
        {
            title:"Titel3",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        },
        {
            title:"Titel4",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        }
    ]
}
const fromload = ({content})=>{
    content.forEach(({id, value})=>{
        const item = document.getElementById(id);
        if (id.includes("img")){
            item.src=value;
        }else{
            item.innerHTML=value;
        }
    })
}
if(admin){
    const adminb = document.getElementById("admin_edit");
    adminb.setAttribute("style", "");
    adminb.addEventListener("click", (ev)=>{
        ev.preventDefault();
        const edititems = document.getElementsByTagName("input");
        if (edit){
            const wrt = [];            
            for(let i = 0; i < edititems.length; i++){
                wrt.push({id: edititems[i].id.replace("_input", ""), value: edititems[i].value!=""?edititems[i].value:edititems[i].id.includes("img")?document.getElementById(edititems[i].id.replace("_input", "")).src:document.getElementById(edititems[i].id.replace("_input", "")).innerHTML})
            }
            fetch("/text",
            {
                method:"POST",
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id:"overview",
                    content:wrt
                })
            }
            ).then((response)=>{
                if(response.status<400){
                    response.json().then(fromload, console.log);
                }
                for (let i = 0; i < edititems.length; i++){
                    edititems[i].setAttribute("style", "display: none;")
                }
            }, console.log);
        }else{
           for (let i = 0; i < edititems.length; i++){
               edititems[i].setAttribute("style", "");
           }
        }
        edit=!edit;
    })
   }   
const buildPage = (info={})=>{
    let res = {panes:[]};
    for (let i = 0; i < defaultPage.panes.length; i++){
        const pane = {elemente: []};
        if(info.panes&&info.panes[i]){
            pane.title=info.panes[i].title||defaultPage.panes[i].title;
            if(info.panes[i].elemente){
                for(let k = 0; k < defaultPage.panes[i].elemente.length; k++){
                    element = {
                        text: info.panes[i].elemente[k].text||defaultPage.panes[i].elemente[k].text,
                        image: info.panes[i].elemente[k].image||defaultPage.panes[i].elemente[k].image,
                    };
                    pane.elemente.push(element);
                }
            }else{
                pane.elemente = defaultPage.panes[i].elemente
            }
        }else{
            pane.title= defaultPage.panes[i].title;
            pane.elemente = defaultPage.panes[i].elemente;
        }
        res.panes.push(pane);
    }
    document.getElementById("tpane").innerHTML="";
    res.panes.forEach((pane, index)=>{
        document.getElementById("tpane").innerHTML+=subpane(pane.title, pane.elemente, index)
    })
}
buildPage()
fetch("/text?id=overview").then((response)=>{
    if(response.status<400){
        response.json().then(fromload
        , console.log);
    }else{
        
    }
})
