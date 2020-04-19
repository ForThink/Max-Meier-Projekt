if (admin){
    if(question.answers.length!=3){
        question.answers=[{text: "1", correct: false}, {text: "2", correct: false}, {text: "3", correct: false}]
    }
    for (let input of document.getElementsByTagName("input")){
        if (input.type==="checkbox"&&input.id){
            input.setAttribute("style", "");
            const index = parseInt(input.id.replace("a", ""))-1;
            input.checked=(question.answers[index]||{correct:false}).correct;
            input.addEventListener("change", (ev)=>{
                question.answers[index].correct=ev.target.checked;
            })
        }
    }
}
const selections = [];
const lsg = 49;
for (let img of document.getElementsByTagName("img")){
    img.addEventListener("click", (ev)=>{
        const index = parseInt(ev.target.id.replace("acc", ""))-1;
        if(!selections.includes(index)){
            selections.push(index);
            ev.target.setAttribute("style", `animation: mark 1s linear; ${ev.target.getAttribute("style")}`)
            setTimeout(()=>{
                ev.target.setAttribute("style", `border: 9px solid lawngreen; height: 118px; width: 118px; ${ev.target.getAttribute("style").replace("animation: mark 1s linear; ", "")}`)
            }, 950)
        }else if (selections.includes(index)){
            selections.splice(selections.indexOf(index), 1);
            ev.target.setAttribute("style", `animation: unmark 1s linear; ${ev.target.getAttribute("style").replace("border: 9px solid lawngreen; height: 118px; width: 118px; ", "")}`)
            setTimeout(()=>{
                ev.target.setAttribute("style", `${ev.target.getAttribute("style").replace("animation: unmark 1s linear; ", "")}`)
            }, 950)
        }
    })
}
const stretchFactor = 0.8;