const adminSave = document.getElementById("adminSave");
if(admin){
    adminSave.setAttribute("style", "");
    adminSave.addEventListener("click", (ev)=>{
        ev.preventDefault();
        while (question.answers.length>document.getElementsByTagName("select").length-1){
            question.answers.pop();
        }
        question.page=window.location.pathname.replace(".html", "").replace("/", "");
        gatherData(params.main+params.modulename+params.progress);
        fetch("/questions", {
            method:question.qid!=undefined?"PATCH":"POST",
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify(question)
        }).then((response)=>{
            if(response.status<400){
                response.json().then(({qid})=>{
                    const questions = JSON.parse(localStorage.getItem(params.main+params.modulename))||[];
                    if(qid){
                        question.qid=qid;
                        while(questions.length<params.progress-1){
                            questions.push(undefined);
                        }
                    }
                    questions[params.progress-1]=question;
                    localStorage.setItem(params.main+params.modulename, JSON.stringify(questions))
                })
            }
        })
    })
}
getData(params.main+params.modulename+params.progress);