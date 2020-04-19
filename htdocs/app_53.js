document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
const lsg=54;
params.likert=1;
const adminSave = document.getElementById("adminSave");
if(admin){
    adminSave.setAttribute("style", "");
    adminSave.addEventListener("click", (ev)=>{
        ev.preventDefault();
        if(!working){
            working=true;
            let onedone = false;
            let fetchmes = "";
            gatherData("rquestions1").then((res)=>{
                if(onedone){
                    showError(res)
                }else{
                    onedone = true;
                    fetchmes = res;
                }
            }, (res)=>{
                if(onedone){
                    showError(res)
                    working = false;
                }else{
                    onedone = true;
                    fetchmes = res;
                }
            });
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
                    if(qid!=undefined){
                        question.qid=qid;
                    }
                    questions[params.progress]=question;
                    localStorage.setItem(params.main+params.modulename, JSON.stringify(questions))
                })
            }
            if(onedone){
                showError(fetchmes)
                working = false;
            }else{
                onedone = true;
            }
        }, ()=>{
            if(onedone){
                showError("something went horribly wrong")
                working = false;
            }else{
                onedone = true;
            }
        })
        }
        
    })
}
getData("rquestions1");
const answer = {}
const now = Date.now();
const sendAnswer = ()=>{
    answer.qid = JSON.parse(localStorage.getItem("rquestions"))[0].qid;
    answer.selected = selections;
    answer.timeSpan = Date.now()-now;
    fetch("/questions/answer", {
        method:"POST",
        headers: {
            "Authorization":`Bearer ${localStorage.getItem("token")}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify(answer)
    }).then((response)=>{
        params.main="statQuestions";
        params.progress=0;
        if(response.status<400){
            response.json().then((json)=>{
                localStorage.setItem("userData", JSON.stringify(json.user));
                window.location=`/${lsg}.html?q=${JSON.stringify(params)}`
            })
        }else if(admin){
            window.location=`/${lsg}.html?q=${JSON.stringify(params)}`
        }
    })
}
const stretchFactor =1;
