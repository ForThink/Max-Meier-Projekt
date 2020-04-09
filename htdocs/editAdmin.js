const {admin} = JSON.parse(localStorage.getItem("userData"));
const pdoc = window.parent.document;
const editField = pdoc.getElementById("editField");
const editInput = pdoc.getElementById("editInput");
const addFile = pdoc.getElementById("addFile");
const editCheckBox = pdoc.getElementById("editCheckBox");
const editConfirm = pdoc.getElementById("editConfirm");
const editCancel = pdoc.getElementById("editCancel");
const SelectedElement = [];
const selectedEditor = [];
const select = (element, list, arg)=>{
    if (list.length){
        list.splice(0, list.length, element);
    }else{
        list.push(element);
    }
    if(arg){
        list.push(arg);
    }
}
const reveal = (editor)=>{
    
    editor.setAttribute("style", editor.getAttribute("style").replace("display: none;", ""));
    console.log(editor);
    editConfirm.setAttribute("style", "");
    editCancel.setAttribute("style", "");
}
const hide = (editor)=>{
    editor.setAttribute("style", "display: none;"+editor.getAttribute("style"));
    editConfirm.setAttribute("style", "display: none;");
    editCancel.setAttribute("style", "display: none;");
}
if(admin){
    for(let label of document.getElementsByTagName("label")){
        if(label.id){
            label.addEventListener("click", ()=>{
              select(label, SelectedElement);
              select(editInput, selectedEditor);
              reveal(selectedEditor[0]);
            })
            label.addEventListener("mouseenter", (ev)=>{
                const style = ev.target.getAttribute("style").split(";");
                let BackgroundColor;
                style.forEach((obj)=>{
                    if(obj.split(":")[0].trim()==="background-color"){
                        BackgroundColor=obj.split(":")[1];
                    } 
                })
                if(!BackgroundColor){
                    ev.target.setAttribute("style", "background-color: #eeeecc;"+ev.target.getAttribute("style"))
                }
            })
            label.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", ev.target.getAttribute("style").replace("background-color: #eeeecc;", ""));
            })
        }
    };
    for(let img of document.getElementsByTagName("img")){
        if(img.id){
            img.addEventListener("click", (ev)=>{
                select(img, SelectedElement);
                select(addFile, selectedEditor)
                reveal(selectedEditor[0]);
            })
            img.addEventListener("mouseenter", (ev)=>{
                ev.target.setAttribute("style","opacity: 0.7;"+ev.target.getAttribute("style"))
            })
            img.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", ev.target.getAttribute("style").replace("opacity: 0.7;", ""))
            })
        }
    }
    for(let p of document.getElementsByTagName("p")){
        if(p.id){
            p.addEventListener("click", (ev)=>{
                select(p, SelectedElement);
                select(editField, selectedEditor);
                reveal(selectedEditor[0]);
            })
            p.addEventListener("mouseenter", (ev)=>{
                ev.target.setAttribute("style", "background-color: #eeeecc;"+ev.target.getAttribute("style"))
            })
            p.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", ev.target.getAttribute("style").replace("background-color: #eeeecc;", ""))
            })
        }
    }
    for(let div of document.getElementsByTagName("div")){
        if(div.id&&div.id.includes("edit")){
            div.addEventListener("click", (ev)=>{
                select(div, SelectedElement);
                select(editField, selectedEditor);
                reveal(selectedEditor[0]);
            })
            div.addEventListener("mouseenter", (ev)=>{
                ev.target.setAttribute("style", "background-color: #eeeecc;"+ev.target.getAttribute("style"))
            })
            div.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", ev.target.getAttribute("style").replace("background-color: #eeeecc;", ""))
            })
        }
    }
    editConfirm.addEventListener("click", (ev)=>{
        ev.preventDefault();
        if(selectedEditor[0]===addFile){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedEditor[0].files[0]);
            fileReader.onloadend = (ev)=>{
                SelectedElement[0].src=ev.target.result;
                selectedEditor[0].files[0]=undefined;
            }
        }else{
            SelectedElement[0][SelectedElement[1]||"innerHTML"]=selectedEditor[0][selectedEditor[1]||"value"];
        }
        selectedEditor[0][selectedEditor[1]||"value"]="";
        hide(selectedEditor[0]);
    })
    editCancel.addEventListener("click", (ev)=>{
        ev.preventDefault();
        if(selectedEditor[0]==addFile){
            selectedEditor[0].files[0]=undefined;
        }
        selectedEditor[0][selectedEditor[1]||"value"]="";
        hide(selectedEditor[0])
    })
}
const gatherData = (id)=>{
    const data = [];
    for (let label of document.getElementsByTagName("label")){
        if(label.id){
            data.push({id: label.id, attr: "innerHTML", content: label.innerHTML});
        }
    }
    for (let p of document.getElementsByTagName("p")){
        if(p.id){
            data.push({id: p.id, attr: "innerHTML", content: p.innerHTML});
        }
    }
    for (let img of document.getElementsByTagName("img")){
        if(img.id){
            data.oush({id: img.id, attr: "src", content: img.src});
        }
    }
    for (let div of document.getElementsByTagName("div")){
        if(div.id&&div.id.includes("edit")){
            data.oush({id: div.id, attr: "innerHTML", content: div.src});
        }
    }
    fetch("/text", {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({id, content: data})
    })
}
const getData = (id)=>{
    fetch("/text?id="+id).then((response)=>{
        if(response.status<400){
            response.json().then(({content})=>{
                content.forEach(({id, attr, content})=>{
                    document.getElementById(id)[attr]=content
                })
            })
        }
    })
}