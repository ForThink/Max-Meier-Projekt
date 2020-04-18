if (admin){
    for (let input of document.getElementsByTagName("input")){
        if (input.type==="checkbox"&&input.id){
            input.setAttribute("style", "");
            const index = parseInt(input.id.replace("a", ""))-1;
            console.log(index, question.answers);
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
            ev.target.setAttribute("style", `filter: brightness(1.25); ${ev.target.getAttribute("style")}`);
        }else if (selections.includes(index)){
            selections.splice(selections.indexOf(index), 1);
            ev.target.setAttribute("style", ev.target.getAttribute("style").replace('filter: brightness(1.25);', ''));
        }
        console.log(selections, index);
    })
}
const stretchFactor = 0.8;