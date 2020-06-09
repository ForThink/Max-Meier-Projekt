const token = localStorage.getItem("token");
let contentpage = document.getElementById("content")
const groups = ["Control", "Leaderboard", "Badges", "Points"];
const users = {};
const questions = {};
let selecteduser = undefined;
let selectedAnswers = undefined;
let selectedQuestion = undefined;
fetch("/users?token="+token).then((response)=>{
    if(response.status<400){
        response.json().then((json)=>{
            json.forEach((data)=>{
                if(data.xp){
                    if(users[groups[data.group]]){
                        users[groups[data.group]][data.uid]=new user(data);
                    }else{
                        const item = {};
                        item[data.uid]=new user(data);
                        users[groups[data.group]]=item;
                    }
                }
                
            })
            fetch("/questions").then((response)=>{
                if(response.status<400){
                    response.json().then((json)=>{
                        const exclude = [];
                        json.forEach((data)=>{
                            data.tags.forEach((tag)=>{
                                if(tag==="rquestions"||tag==="stat"){
                                    exclude.push(data.qid);
                                }
                                if(questions[tag]){
                                    questions[tag][data.qid]=new question(data);
                                }else{
                                    const item = {};
                                    item[data.qid]=new question(data)
                                    questions[tag]=item;
                                }
                            })
                        })
                        contentpage.innerHTML=`
                        <select id="Gruppe">
                            <option>Gruppe wählen</option>
                        </select>
                        <select id="Spieler">
                        </select>
                        <select id="Fragenkategorie" style="display: none">
                            <option>Fragenkategorie auswählen</option>
                            ${Object.keys(questions).map((key)=>"<option>"+key+"</option>").join("\r\n")}
                        </select>
                        <select style="display:none;" id="Fragenkatalog"></select>
                        <div id="SpielerInfo"></div>
                        <div id="Frage"></div>`
                        const GruppeAuswahl = document.getElementById("Gruppe");
                        const SpielerAuswahl = document.getElementById("Spieler");
                        const Fragenkatalog = document.getElementById("Fragenkatalog");
                        const FragenKategorie = document.getElementById("Fragenkategorie");
                        const Frage = document.getElementById("Frage")
                        GruppeAuswahl.innerHTML+=Object.keys(users).map((key)=>`<option>${key}</option>`).join("\r\n");
                        GruppeAuswahl.addEventListener("change", (ev)=>{
                            if(ev.target.value==="Gruppe wählen"){
                                SpielerAuswahl.innerHTML="";
                            }else{
                                SpielerAuswahl.innerHTML=`<option>Spieler wählen</option>\r\n${Object.keys(users[ev.target.value]).map((uid)=>"<option>"+uid+"</option>").join("\r\n")}`
                            }
                        })
                        SpielerAuswahl.addEventListener("change", (ev)=>{
                            if(ev.target.value===""||ev.target.value==="Spieler wählen"){
                                selecteduser=undefined;
                                FragenKategorie.setAttribute("style", "display: none")
                                Frage.setAttribute("style", "display: none");
                            }else{
                                selecteduser=users[GruppeAuswahl.value][ev.target.value];
                                document.getElementById("SpielerInfo").innerHTML=SpielerInfo(exclude);
                                FragenKategorie.setAttribute("style", "")
                                Frage.setAttribute("style", "");
                            }
                        })
                        FragenKategorie.addEventListener("change", (ev)=>{
                            Fragenkatalog.innerHTML="<option>Frage auswählen</option>"
                            if(ev.target.value==="Fragenkategorie auswählen"){
                                Fragenkatalog.setAttribute("style", "display: none");
                            }else{
                                Fragenkatalog.setAttribute("style", "")
                                selectedAnswers = selecteduser.Antworten(questions[ev.target.value])
                                console.log(selectedAnswers)
                                Object.keys(selectedAnswers).forEach((question)=>{
                                    const option = document.createElement("option");
                                    option.innerHTML=question;
                                    Fragenkatalog.appendChild(option);
                                })
                                Fragenkatalog.addEventListener("change", (ev)=>{
                                    if(ev.target.value==="Frage auswählen"){
                                        selectedQuestion=undefined
                                    }else{
                                        selectedQuestion=ev.target.value
                                    }
                                    questionElement(exclude).then((jsx)=>{
                                        Frage.innerHTML=jsx;
                                    }, (err)=>{
                                        Frage.innerHTML=err;
                                    })
                                })
                            }
                        })
                    }, ()=>{
                        contentpage.innerHTML+="\r\ncan't parse response";
                    })
                }else{
                    contentpage.innerHTML+="\r\ncan't get questions"
                }
            })
        }, ()=>{
            contentpage.innerHTML="can't parse response";
        })
    }else{
        contentpage.innerHTML="can't fetch user data"
    }
})
const user = function({rounds, logdates, admin, xp}){
    this.rounds = rounds;
    this.logdates = logdates;
    this.admin = admin;
    this.xp = xp;
    this.Antworten = (Fragen)=>{
        const responses = {};
        Object.keys(Fragen).forEach((key)=>{
            if(this.xp){
                this.xp.forEach(({date, xp})=>{
                    xp.forEach(({qid, right, selected, timeSpan})=>{
                        if(parseInt(key)==qid){
                            const {title, answers, page} = Fragen[key];
                            const selectedAnswers = []
                            selected.forEach((index)=>{
                                selectedAnswers.push(index);
                            })
                            if(responses[title]){
                                if(responses[title][date]){
                                    responses[title][date].push({selectedAnswers, right, timeSpan})
                                }else{
                                    responses[title][date]=[{selectedAnswers, right, timeSpan}]
                                }
                            }else{
                                const item = {qid, textmark: Object.keys(Fragen).indexOf(`${qid}`), page:page||"52"};
                                item[date] = [{selectedAnswers, right, timeSpan}];
                                responses[title]=item;
                            }
                        }
                    })                
                })
            }
            
        })
        return responses;  
    }
    this.Gesamtpunktzahl = (exclude)=>{
        let total = [0, 0];
        if(this.xp){
            this.xp.forEach(({xp})=>{
                xp.forEach(({qid, right})=>{
                    if(!exclude||!exclude.includes(qid)){
                        total[1]++;
                        if(right){
                            total[0]++;
                        }
                    }
                })
            })
        }
        return total;
    }
}
const question = function({title, answers, page}){
    this.title=title;
    this.answers=answers;
    this.page=page
}
const SpielerInfo = (exclude)=>{
    let totaltLogTime = 0;
    selecteduser.logdates.forEach(([begin, end])=>{
        if(end){
            totaltLogTime+=Date.parse(end)-Date.parse(begin);
        }
    })
    return (`
    <label>Admin: ${selecteduser.admin}</label>
    <label>Gesamtzeit im Spiel: ${Math.round(totaltLogTime/60000)}m ${((totaltLogTime/60000)%1*60).toFixed(1)}s </label>
    <label>Gesamtpunktzahl: ${selecteduser.Gesamtpunktzahl(exclude).join("/")}</label>`)
}
const questionElement = (exclude)=>new Promise((res, rej)=>{
    const tag = document.getElementById("Fragenkategorie").value;
    const squestion = selectedAnswers[selectedQuestion]
    fetch(`/text?id=${tag}${tag==="rquestions"?1:selectedAnswers[selectedQuestion].textmark}`).then((response)=>{
        if(response.status<400){
            response.json().then((json)=>{
                const answermap = [];
                switch(squestion.page){
                    case "44":
                        json.content.filter(({id})=>id.includes("acc")&&!id.includes("label")).forEach((item)=>{
                            answermap.push(`<img src="${item.content}" height="100" width="100" style="margin: 3px;"/>`)
                        })
                    break;
                    case "54": 
                        for (let i = 0; i < 7; i++){
                            answermap.push(`<label>${i+1}</label>`);
                        }
                    break;
                    default: 
                        json.content.filter(({id})=>id.includes("sel")).forEach((item)=>{
                            answermap.push(...item.content.split("</option>").map((answer)=>answer.replace("<option>", "")).filter((answer)=>answer.length>0).map((answer)=>`<label ${item.style.includes("display: none")||item.style.includes("display:none")?'style="display: none;"':""}>${answer}</label>`))
                        })
                    break;
                }
                let Versuche = 0;
                Object.keys(squestion).filter((key)=>key!=="textmark"&&key!=="page"&&key!=="qid").forEach((key)=>{
                    Versuche+=squestion[key].length;
                })
                res(`<div>
                    <label>Versuche: ${Versuche}</label>
                    ${Object.keys(squestion).filter((key)=>key!=="textmark"&&key!=="page"&&key!=="qid").map((key)=>`<div><label>${key}</label>${squestion[key].map((date)=>answered(date, answermap, exclude.includes(squestion.qid))).join("\r\n")}</div>`).join("\r\r\n")}
                </div>`)
            })
        }else{
            rej(response.status)
        }
    }, rej)
    
})
const answered = (date, answermap, exclude)=>{
    return `<div style="display: flex; flex-direction: column;">${!exclude?"<label>"+(date.right?"richtig":"falsch")+" beantwortet</label>":""}
        <label>Dauer: ${(date.timeSpan/1000).toFixed(1)}</label>
        ${date.selectedAnswers.map((answer)=>answermap[answer]).join("\r\n")}
    </div>`
}