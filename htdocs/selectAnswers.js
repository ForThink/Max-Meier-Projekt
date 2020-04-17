const beantworten = document.getElementById("beantworten");
const selections = [];
beantworten.addEventListener("click", (ev)=>{
    selections.splice(0, selections.length);
    ev.preventDefault();
    let totalAnswers = 0;
    for (let sel of document.getElementsByTagName("select")){
        selections.push(sel.selectedIndex+totalAnswers);
        totalAnswers+=sel.children.length;
    }
    sendAnswer();
})