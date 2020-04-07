document.getElementById("main").addEventListener("submit", (ev)=>{
    ev.preventDefault();
});
const params = JSON.parse(new URLSearchParams(window.location.search).get("q"));
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
let editing = false;
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
        if(lastAnswered>-1&&lastAnswered>params.progress&&lastAnswered<23){
            window.location=`/54.html?q={"progress":${lastAnswered+1}}`
        }else if (lastAnswered>22){
            const {group} = user;
            window.location=`/3${3+group}.html`
        }
    }
    const question = questions[params.progress-1]||{title:`question_${params.progress-1}`, answers:[]};
    document.getElementById("title").innerHTML=question.title;
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
if(JSON.parse(localStorage.getItem("userData")).admin===true){
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
        if(editing){
            const questions = JSON.parse(localStorage.getItem("statQuestions"));
            
            fetch("/questions", {
                method: questions.length<params.progress?"POST":"PATCH",
                body: JSON.stringify({
                    title: document.getElementById("edit_title").value!=""?document.getElementById("edit_title").value:questions[params.progress-1].title,
                    answers: [],
                    tags: ["stat"],
                    qid: questions[params.progress-1]?questions[params.progress-1].qid:undefined
                }),
                headers: {
                    "Authorization":`Bearer ${localStorage.getItem("token")}`,
                    "Content-Type":"application/json"
                }
            }).then(()=>{
                getStatQuestions().then(()=>{
                    document.getElementById("edit_title").setAttribute("style", "display: none;")
                }, (error)=>{
                    console.log(error);
                    document.getElementById("edit_title").setAttribute("style", "display: none;")
                });
            })
            
        }else{
            document.getElementById("edit_title").setAttribute("style", "display: unset; width: 80%")
        }
        editing=!editing;
        
    })
}
if(params.progress===1){
    getStatQuestions();
}else{
    setQuestionForm();
}
const progressbar = document.getElementById("progressbar");
progressbar.setAttribute("style", `height: 25px; width: ${(document.getElementById("main").clientWidth/24*params.progress)||1}px;`);
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
            body:JSON.stringify({qid: JSON.parse(localStorage.getItem("statQuestions"))[params.progress-1].qid, selected: [checked], uid: JSON.parse(localStorage.getItem("userData")).uid, timeSpan: Date.now()-now}),
            headers: {
                "Authorization":`Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            response.json().then((json)=>{
                localStorage.setItem("userData", JSON.stringify(json));
                if (params.progress<24){
                    window.location="/54.html?q={\"progress\":"+(params.progress+1)+"}"
                }else{
                    window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`
                }
            }
            , console.log)
        }, console.log)
    } else if(JSON.parse(atob(localStorage.getItem("token").split(".")[1])).admin==true){
        if (params.progress<24){
            window.location="/54.html?q={\"progress\":"+(params.progress+1)+"}"
        }else{
            window.location=`/3${3+JSON.parse(localStorage.getItem("userData")).group}.html`
        }
    }
    
})
