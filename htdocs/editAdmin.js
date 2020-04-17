const {admin} = JSON.parse(localStorage.getItem("userData"));
let strg = false;
let shift = false;
const params = JSON.parse(new URLSearchParams(window.location.search).get("q"))||{};
const pdoc = window.parent.document;
pdoc.addEventListener("keydown", (ev)=>{
    if(!strg&&ev.key.toLowerCase()=="control"){
        strg = true;
    }
    if(!shift&&ev.key.toLowerCase()=="shift"){
        shift=true;
    }
})
pdoc.addEventListener("keyup", (ev)=>{
    if(ev.key.toLowerCase()=="control"){
        strg = false;
    }
    if(ev.key.toLowerCase()=="shift"){
        shift=false;
    }
})

const styleEdit = pdoc.getElementById("styleField");
const editField = pdoc.getElementById("editField");
const editInput = pdoc.getElementById("editInput");
const addFile = pdoc.getElementById("addFile");
const editConfirm = pdoc.getElementById("editConfirm");
const editCancel = pdoc.getElementById("editCancel");
const editSelect = pdoc.getElementById("selectEdit");
const checkedChangeHandler = (ev)=>{
    let k = 0;
    while(pdoc.getElementById(`true${k}`)!=null){
        k++;
    }
    console.log(k);
    if(ev.target.checked===true){
        for (let i = 0; i < k; i++){
            const check = pdoc.getElementById(`true${i}`);
            if(check.id!=ev.target.id){
                check.checked=false;
            }
        }
    }
}
const checkedChangeListeners = (l)=>{
    for (let i = 0; i < l; i++){
        pdoc.getElementById(`true${i}`).addEventListener("change", checkedChangeHandler)
    }
}
const question = (JSON.parse(localStorage.getItem(params.main+params.modulename))||[])[params.progress-1]||{title:params.main+"_"+params.modulename+"_"+params.progress, answers:[], tags:[params.main+params.modulename], page:window.location.pathname.replace(".html", "").replace("/", "")};
const spliceAnswers = (selnum, answers, prevlen)=>{
    let startind = 0;
    if(selnum>1){
        for(let i = 1; i < selnum; i++){
            startind+=document.getElementById(`sel${i}`).children.length;
        }
    }
    question.answers.splice(startind, prevlen, ...answers);
    console.log(question);
}
pdoc.getElementById("selectAdd").addEventListener("click", (ev)=>{
    let i = 0;
    while(pdoc.getElementById(`true${i}`)!=null){
        i++;
    }
    pdoc.getElementById("selectOptions").innerHTML+=`<div><input id="true${i}" type="checkbox"><input type="text" id="answer${i}" value=""></div>
    `;
    checkedChangeListeners(i+1);
})
pdoc.getElementById("removeLst").addEventListener("click", (ev)=>{
    const subdivs = pdoc.getElementById("selectOptions").innerHTML.split("<div>");
    pdoc.getElementById("selectOptions").innerHTML="";
    subdivs.splice(0, subdivs.length-1).forEach((subdiv)=>{
        pdoc.getElementById("selectOptions").innerHTML+="<div>"+subdiv;
    })

})

const error = pdoc.getElementById("error");
const showError= (errortext)=>{
    error.innerHTML=errortext;
    error.setAttribute("style", "color: red; max-width: 80%")
    setTimeout(()=>{
        error.innerHTML = "";
        error.setAttribute("style", "display: none;")
    }, 5000)
}
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
    hide(editInput);
    hide(editField);
    hide(addFile);
    hide(editSelect);
    select(editor, selectedEditor);
    editor.setAttribute("style", editor.getAttribute("style").replace("display: none;", ""));
    styleEdit.setAttribute("style", styleEdit.getAttribute("style").replace("display: none;", ""));
    if(editor===editSelect){
        const options = [];
        for (let option of SelectedElement[0].children){
            options.push(option.innerHTML);
        }
        pdoc.getElementById("selectOptions").innerHTML = "";
        options.forEach((option, index)=>{
            pdoc.getElementById("selectOptions").innerHTML += `<div><input id="true${index}" type="checkbox"><input type="text" id="answer${index}" value="${option}"></div>
            `;
        })
        checkedChangeListeners(options.length)
    }else{
        editor.value=editor==addFile?"":(SelectedElement[0][SelectedElement[1]||"innerHTML"])
    }
    styleEdit.value = (SelectedElement[0].getAttribute("style")||"").replace("background-color: #eeeecc;", "").replace("opacity: 0.7;", "");
    editConfirm.setAttribute("style", "");
    editCancel.setAttribute("style", "");
}
const hide = (editor)=>{
    if(!editor.getAttribute("style").includes("display: none;")){
        editor.setAttribute("style", "display: none;"+editor.getAttribute("style"));
    }
    editConfirm.setAttribute("style", "display: none;");
    editCancel.setAttribute("style", "display: none;");
    selectedEditor[0]=undefined;
    selectedEditor[1]=undefined;
}
hide(editInput);
hide(editField);
hide(addFile);
hide(styleEdit);
hide(editSelect);
if(admin){
    for(let label of document.getElementsByTagName("label")){
        if(label.id){
            label.addEventListener("click", ()=>{
                select(label, SelectedElement);
                reveal(editInput);
              })
            label.addEventListener("mouseenter", (ev)=>{
                const style = (ev.target.getAttribute("style")||"").split(";");
                let BackgroundColor;
                style.forEach((obj)=>{
                    if(obj.split(":")[0].trim()==="background-color"){
                        BackgroundColor=obj.split(":")[1];
                    } 
                })
                if(!BackgroundColor){
                    ev.target.setAttribute("style", "background-color: #eeeecc;"+(ev.target.getAttribute("style")||""))
                }
            })
            label.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", (ev.target.getAttribute("style")||"").replace("background-color: #eeeecc;", ""));
            })
        }
    };
    for(let h of document.getElementsByTagName("h1")){
        if(h.id){
            h.addEventListener("click", (ev)=>{
                select(h, SelectedElement);
                reveal(editInput);
            })
            h.addEventListener("mouseenter", (ev)=>{
                const style = (ev.target.getAttribute("style")||"").split(";");
                let BackgroundColor;
                style.forEach((obj)=>{
                    if(obj.split(":")[0].trim()==="background-color"){
                        BackgroundColor=obj.split(":")[1];
                    } 
                })
                if(!BackgroundColor){
                    ev.target.setAttribute("style", "background-color: #eeeecc;"+(ev.target.getAttribute("style")||""))
                }
            })
            h.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", (ev.target.getAttribute("style")||"").replace("background-color: #eeeecc;", ""));
            })
        }
    }
    for(let h of document.getElementsByTagName("h2")){
        if(h.id){
            h.addEventListener("click", (ev)=>{
                select(h, SelectedElement);
                reveal(editInput);                
            })
            h.addEventListener("mouseenter", (ev)=>{
                const style = (ev.target.getAttribute("style")||"").split(";");
                let BackgroundColor;
                style.forEach((obj)=>{
                    if(obj.split(":")[0].trim()==="background-color"){
                        BackgroundColor=obj.split(":")[1];
                    } 
                })
                if(!BackgroundColor){
                    ev.target.setAttribute("style", "background-color: #eeeecc;"+(ev.target.getAttribute("style")||""))
                }
            })
            h.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", (ev.target.getAttribute("style")||"").replace("background-color: #eeeecc;", ""));
            })
        }
    }
    
    for(let img of document.getElementsByTagName("img")){
        if(img.id){
            img.addEventListener("click", (ev)=>{
                select(img, SelectedElement, "src");
                if(selectedEditor[0]===addFile){
                    reveal(editInput)
                }else{
                    reveal(addFile);
                    showError("click again to input a link source instead of selecting an image")
                }
                })
            img.addEventListener("mouseenter", (ev)=>{
                ev.target.setAttribute("style","opacity: 0.7;"+(ev.target.getAttribute("style")||""));
            })
            img.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", (ev.target.getAttribute("style")||"").replace("opacity: 0.7;", ""))
            })
        }
    }
    for(let p of document.getElementsByTagName("p")){
        if(p.id){
            p.addEventListener("click", (ev)=>{
                select(p, SelectedElement);
                reveal(editField);
                })
            p.addEventListener("mouseenter", (ev)=>{
                ev.target.setAttribute("style", "background-color: #eeeecc;"+(ev.target.getAttribute("style")||""))
            })
            p.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", (ev.target.getAttribute("style")||"").replace("background-color: #eeeecc;", ""))
            })
        }
    }
    for(let div of document.getElementsByTagName("div")){
        if(div.id&&div.id.includes("edit")){
            div.addEventListener("click", (ev)=>{
                select(div, SelectedElement);
                reveal(editField);
                })
            div.addEventListener("mouseenter", (ev)=>{
                ev.target.setAttribute("style", "background-color: #eeeecc;"+(ev.target.getAttribute("style")||""))
            })
            div.addEventListener("mouseleave", (ev)=>{
                ev.target.setAttribute("style", (ev.target.getAttribute("style")||"").replace("background-color: #eeeecc;", ""))
            })
        }
        for(let button of document.getElementsByTagName("button")){
            if(button.id&&!button.id.includes("admin")){
                button.addEventListener("mouseenter", (ev)=>{
                        if(!strg){
                            select(button, SelectedElement);
                            reveal(editInput);
                        }
                    })
            }
        }
        for(let sel of document.getElementsByTagName("select")){
            if(sel.id&&!sel.id.includes("admin")){
                sel.addEventListener("mouseenter", (ev)=>{
                    if(!strg){
                        select(sel, SelectedElement);
                        reveal(editSelect);
                    }
                })
            }
        }
    }
    const confirmClickHandler = (ev)=>{
        ev.preventDefault();
        if(selectedEditor[0]===addFile){
            if(selectedEditor[0].files[0]&&selectedEditor[0].files[0].size<20490){
                const fileReader = new FileReader();
                fileReader.readAsDataURL(selectedEditor[0].files[0]);
                fileReader.onloadend = (ev)=>{
                SelectedElement[0].src=ev.target.result;
                addFile.files[0]=undefined;
            }
            }else{
                showError("Images can be max 20kb in size!")
            }
            
        }else if(selectedEditor[0]===editSelect){
            let i = 0;
            const prevlen = SelectedElement[0].children.length
            SelectedElement[0].innerHTML="";
            const answers = [];
            while (pdoc.getElementById(`true${i}`)!=null){
                SelectedElement[0].innerHTML+=`<option>${pdoc.getElementById("answer"+i).value}</option>`;
                answers.push({text: pdoc.getElementById(`answer${i}`).value, correct:pdoc.getElementById(`true${i}`).checked})
                i++;
            }
            spliceAnswers(parseInt(SelectedElement[0].id.replace("sel", "")), answers, prevlen);
        }else{
            SelectedElement[0][SelectedElement[1]||"innerHTML"]=selectedEditor[0][selectedEditor[1]||"value"];
        }
        
        SelectedElement[0].setAttribute("style", styleEdit.value)
        selectedEditor[0][selectedEditor[1]||"value"]="";
        hide(selectedEditor[0]);
        hide(styleEdit);
    }
    editConfirm.addEventListener("click", confirmClickHandler)
    editInput.addEventListener("keyup", (ev)=>{
        if(!shift&&ev.key==="Enter"){
            confirmClickHandler(ev);
        }
    })
    editField.addEventListener("keyup", (ev)=>{
        if(!shift&&ev.key==="Enter"){
            confirmClickHandler(ev);
        }
    })
    editCancel.addEventListener("click", (ev)=>{
        ev.preventDefault();
        if(selectedEditor[0]==addFile){
            selectedEditor[0].files[0]=undefined;
        }
        selectedEditor[0][selectedEditor[1]||"value"]="";
        hide(selectedEditor[0]);
        hide(styleEdit);
    })
}
const gatherData = (id)=>{
    const data = [];
    for (let label of document.getElementsByTagName("label")){
        if(label.id){
            data.push({id: label.id, attr: "innerHTML", content: label.innerHTML});
        }
    }
    for (let h of document.getElementsByTagName("h1")){
        if(h.id){
            data.push({id: h.id, attr: "innerHTML", content: h.innerHTML});
        }
    }
    for (let p of document.getElementsByTagName("p")){
        if(p.id){
            data.push({id: p.id, attr: "innerHTML", content: p.innerHTML});
        }
    }
    for (let img of document.getElementsByTagName("img")){
        if(img.id){
            data.push({id: img.id, attr: "src", content: img.src});
        }
    }
    for (let button of document.getElementsByTagName("button")){
        if(button.id){
            data.push({id: button.id, attr: "innerHTML", content: button.innerHTML});
        }
    }
    for (let div of document.getElementsByTagName("div")){
        if(div.id&&div.id.includes("edit")){
            data.push({id: div.id, attr: "innerHTML", content: div.innerHTML});
        }
    }
    for (let select of document.getElementsByTagName("select")){
        if(select.id&&!select.id.includes("admin")){
            data.push({id: select.id, attr: "innerHTML", content: select.innerHTML} )
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
const getData = (id)=>new Promise((res, rej)=>{
    fetch("/text?id="+id).then((response)=>{
        if(response.status<400){
            response.json().then(({content})=>{
                content.forEach(({id, attr, content})=>{
                    const item = document.getElementById(id);
                    if(item){
                        item[attr]=content;
                    }
                })
                res();
            }, rej)
        }else{
            rej();
        }
    }, rej)
})