document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
const now = Date.now();
for (let i = 0; i < 7; i++){
    const cb = document.getElementById(`cb_${i}`);
    cb.addEventListener("change", (ev)=>{
        if(ev.target.checked){
            for (let k = 0; k < 7; k++){
                const cb_1 = document.getElementById(`cb_${k}`);
                if (cb_1.id!=cb.id){
                    cb_1.checked=false;
                }
            }
        }
    })
}
const skipthreshold = (params.likert||1)*24-1;
const setQuestionForm=()=>{
    const user = JSON.parse(localStorage.getItem("userData"));
    const questions = JSON.parse(localStorage.getItem("statQuestions"))||[];
    if(!user.admin){
        let lastAnswered = -1;
        questions.forEach(({qid})=>{
            user.xp.forEach((date)=>{
                if(date.xp.map(({qid})=>qid).includes(qid)){
                    lastAnswered++;
                }
            })
        })
        if(lastAnswered>-1&&lastAnswered>params.progress&&lastAnswered<skipthreshold){
            params.progress = lastAnswered+1;
            window.location=`/54.html?q=${JSON.stringify(params)}`
        }else if (lastAnswered>skipthreshold-1){
            const {group} = user;
            window.location=`/3${3+group}.html`
        }else if(questions[params.progress]){
            getData(`stat${params.progress}`)
        }
    }else{
        getData(`stat${params.progress}`)
    }
}
const getStatQuestions = ()=> new Promise((res, rej)=>{
    fetch("/questions?tags=stat", {
        method:"GET"
    }).then((response)=>{
        if(response.status<400){
            response.json().then((json)=>{
                localStorage.setItem("statQuestions", JSON.stringify(json));
                setQuestionForm();
                res();
            })
        }else{
            localStorage.setItem("statQuestions", "[]");
            setQuestionForm();
            res();
        }
    }, rej)
})
if(admin){
    const skip = document.getElementById("admin_skip");
    skip.setAttribute("style", "display: unset;")
    skip.addEventListener("click", (ev)=>{
        ev.preventDefault();
        window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`;
    })
    const adminButton = document.getElementById("admin_button");
    adminButton.setAttribute("style", "display: unset;")
    adminButton.addEventListener("click", (ev)=>{
        
        ev.preventDefault();
        if(!working){
            let onedone = false;
            let fetchmes = "";
            const questions = JSON.parse(localStorage.getItem("statQuestions"));
        gatherData(`stat${params.progress}`).then((res)=>{
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
        question.title=document.getElementById("title").innerHTML;
        question.tags=["stat"];
        fetch("/questions", {
            method: question.qid!=undefined?"PATCH":"POST",
            body: JSON.stringify(question),
            headers: {
                "Authorization":`Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
            }).then((response)=>{
                if(response.status<400){
                    response.json().then(({qid})=>{
                        if(qid){
                            question.qid=qid;
                        }
                        let index = -1;
                        questions.forEach(({qid}, ind)=>{
                            if(qid==question.qid){
                                index=ind
                            }
                        })
                        if(index==-1){
                            questions.push(question);
                        }else{
                            questions[index] = question;
                        }
                        localStorage.setItem("statQuestions", JSON.stringify(questions))
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
            
        }
        
        })
}
if(params.progress===0){
    getStatQuestions();
}else{
    setQuestionForm();
}
const progressbar = document.getElementById("progressbar");
const progress = params.progress-(params.likert-1)*24+1
progressbar.setAttribute("style", `height: 25px; width: ${document.getElementById("main").clientWidth/24*progress}px;`);
document.getElementById("nextQuestion").addEventListener("click", (ev)=>{
    ev.preventDefault();
    let checked;
    for (let i = 0; i < 7; i++){
        if(document.getElementById(`cb_${i}`).checked){
            checked = i;
        }
    }
    if (checked!=undefined){
        fetch("/questions/answer", {
            method:"POST",
            body:JSON.stringify({qid: JSON.parse(localStorage.getItem("statQuestions"))[params.progress].qid, selected: [checked], uid: JSON.parse(localStorage.getItem("userData")).uid, timeSpan: Date.now()-now}),
            headers: {
                "Authorization":`Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            response.json().then((json)=>{
                localStorage.setItem("userData", JSON.stringify(json.user));
                if (params.progress<(params.likert||1)*24){
                    params.progress++;
                    window.location=`/54.html?q=${JSON.stringify(params)}`;
                }else{
                    window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`
                }
            }
            , console.log)
        }, console.log)
    } else if(JSON.parse(atob(localStorage.getItem("token").split(".")[1])).admin==true){
        if (params.progress<skipthreshold){
            params.progress++;
            window.location="/54.html?q="+JSON.stringify(params);
        }else{
            window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`
        }
    }
    
})
