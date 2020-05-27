const token = localStorage.getItem("token");
let contentpage = document.getElementById("content")
const groups = ["Control", "Leaderboard", "Badges", "Points"];
const users = {};
const questions = {};
fetch("/users?token="+token).then((response)=>{
    if(response.status<400){
        response.json().then((json)=>{
            json.forEach((data)=>{
                if(users[groups[data.group]]){
                    users[groups[data.group]][data.uid]=new user(data);
                }else{
                    const item = {};
                    item[data.uid]=new user(data);
                    users[groups[data.group]]=item;
                }
            })
            const rawdata = document.getElementById("rawdata");
            rawdata.href = URL.createObjectURL(new Blob([JSON.stringify(json)]));
            rawdata.setAttribute("style", "")
            fetch("/questions").then((response)=>{
                if(response.status<400){
                    response.json().then((json)=>{
                        json.forEach((data)=>{
                            data.tags.forEach((tag)=>{
                                if(questions[tag]){
                                    questions[tag][data.qid]=new question(data);
                                }else{
                                    const item = {};
                                    item[data.qid]=new question(data)
                                    questions[tag]=item;
                                }
                            })
                            const parts = [];
                            Object.keys(users).forEach((group, i)=>{
                                let percent = i*100/Object.keys(users).length;
                                let text = group.toUpperCase()+"\r\r\r\n";
                                Object.keys(users[group]).forEach((index, i)=>{
                                    percent+=100/(Object.keys(users[group]).length*Object.keys(users).length);
                                    document.getElementById("percent").innerHTML=percent.toFixed(1)+"% geladen";
                                    const {admin, logdates, Antworten, Gesamtpunktzahl} = users[group][index];
                                    let utext = `admin: ${admin}\r\n`;
                                    let logtime = 0;
                                    logdates.forEach((dates)=>{
                                        if(dates.length>1){
                                            const t =Date.parse(dates[1])-Date.parse(dates[0]);;
                                            logtime+=isNaN(t)?0:(t/60000);
                                        }
                                    })
                                    utext+=`gesamte Anmeldezeit: ${logtime.toFixed(2)}m\r\n`;
                                    const exclude = [];
                                    const responses = [];
                                    Object.keys(questions).forEach((tag)=>{
                                        responses.push({tag, antworten: Antworten(questions[tag])})
                                        if(tag==="stat"||tag==="rquestions"){
                                            exclude.push(...Object.keys(questions[tag]));
                                        }
                                    })
                                    const GP = Gesamtpunktzahl(exclude);
                                    utext+=`richtig/gesamt beantwortet: ${GP[0]}/${GP[1]}\r\n`;
                                    responses.forEach(({tag, antworten})=>{
                                        let rtext=tag.toUpperCase()+"\r\n";
                                        Object.keys(antworten).forEach((antwort)=>{
                                           let atext = antwort+"\r\n";
                                           Object.keys(antworten[antwort]).forEach((date)=>{
                                                   const {right, timeSpan, selectedAnswers} = antworten[antwort][date]
                                                   let dtext = `${date}: ${right?"richtig":"falsch"} Antwortzeit:${(timeSpan/1000).toFixed(1)}s\r\nGegeben:`;
                                                   selectedAnswers.forEach((selected)=>{
                                                     dtext+=`\r\n${selected}`
                                                }) 
                                                   atext+=dtext+"\r\n";
                                               })
                                               rtext+=atext+"\r\n";
                                        })
                                        utext+=rtext+"\r\n";
                                    })
                                    text+=utext+"\r\r\n";
                                })
                                parts.push(text);
                            })
                            const dl = document.getElementById("downloadData")
                            dl.href=URL.createObjectURL(new Blob(parts));
                            dl.download=new Date().toDateString()+".txt";
                            dl.setAttribute("style", "");
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
                            const {title, answers} = Fragen[key];
                            const selectedAnswers = []
                            selected.forEach((index)=>{
                                if(answers[index]){
                                    selectedAnswers.push(answers[index].text);
                                }
                            })
                            if(responses[title]){
                                responses[title][date]={selectedAnswers, right, timeSpan}
                            }else{
                                const item = {};
                                item[date] = {selectedAnswers, right, timeSpan};
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
const question = function({title, answers}){
    this.title=title;
    this.answers=answers;
}