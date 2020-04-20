const adminSave = document.getElementById("adminSave");
if(admin){
    adminSave.setAttribute("style", "");
    adminSave.addEventListener("click", (ev)=>{
        ev.preventDefault();
        if(!working){
            working = true;
            let onedone = false;
            let fetchmes = "";
        
        let allowedanswersnumber = 0;
        for(let select of document.getElementsByTagName("select")){
            if(select.id&&select.id!=="adminQuestionSelect"){
                allowedanswersnumber+=select.children.length;
            }
        }
        while (!window.location.pathname.includes("44.html")&&question.answers.length>allowedanswersnumber){
            question.answers.pop();
        }
        question.page=window.location.pathname.replace(".html", "").replace("/", "");
        gatherData(params.main+params.modulename+params.progress).then((res)=>{
            if(onedone){
                showError(res)
                working=false;
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
                    if(qid){
                        question.qid=qid;
                        while(questions.length<params.progress){
                            questions.push(undefined);
                        }
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
        }).catch(()=>{
            if(onedone){
                showError("something went horribly wrong")
                working = false;
            }else{
                onedone = true;
            }
        })
        }else{
            showError("ich bin noch nicht fertig gedulde dich bitte")
        }
        
    })
}
getData(params.main+params.modulename+params.progress);