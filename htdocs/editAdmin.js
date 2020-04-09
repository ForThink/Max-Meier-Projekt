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
    
    editor.setAttribute("style", editor.getAttribute("style").replace("display: none;", "")||"");
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
        }
    };
    for(let img of document.getElementsByTagName("img")){
        if(img.id){
            img.addEventListener("click", (ev)=>{
                select(img, SelectedElement);
                select(addFile, selectedEditor)
                reveal(selectedEditor[0]);
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
        }
    }
    editConfirm.addEventListener("click", (ev)=>{
        ev.preventDefault();
        if(selectedEditor[0]===addFile){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedEditor[0].files[0]);
            fileReader.onloadend = (ev)=>{
                SelectedElement[0].src=ev.target.result;
            }
        }else{
            SelectedElement[0][SelectedElement[1]||"innerHTML"]=selectedEditor[0][selectedEditor[1]||"value"];
            selectedEditor[0][selectedEditor[1]||"value"]="";
        }
        hide(selectedEditor[0]);
    })
}