const jables = require("jables-multiproc");
const fs = require("fs");
const tar = require("tar-fs");
//replace exampledomain with whatever you please, but for readability's sake, it should be the main domain you are backending for
const secdatpath = "./.secdat";
const location = "./udb/";
const {sign, verify, setup} = require("verlikify");
setup("./.RSA");
jables.setup({location, secDatFileLoc:secdatpath}).then(()=>{
    getUsers().then((users)=>{
        const adresses = [];
        jables.deleteVersion({location, definition: users.filter(({confirmed, joined, email})=>{
            if(adresses.includes(email)){
                return true;
            }else{
                adresses.push(email);
            }
            const now = Date.now();
            const then = Date.parse(joined);
            return !confirmed&&(joined==undefined||isNaN(then)||now-then>60*60*2*1000)
        }).map(({uid})=>updateObject(userBase, {uid}))}).then(console.log, console.log)
        
    }, console.log)    
});
const updateObject = (original, update)=>{
    const merge = {};
    Object.keys(original).forEach((key)=>{
        merge[key]=original[key];
    });
    Object.keys(update).forEach((key)=>{
        merge[key]=update[key];
    })
    return merge;
}
const searchArray = (searchkey, searchvalue, array)=>{
    if(array.length>0){
    let search = array.map((item)=>item);
    let bound = Math.round(search.length/2);
    while(search.length>1){
        if (searchvalue<search[bound][searchkey]){
            search.splice(bound, search.length-bound);
        }else{
            search.splice(0, bound);
        }
        bound=Math.round(search.length/2);
    }
    return {before: searchvalue!=search[0][searchkey]?searchvalue<search[0][searchkey]:undefined , i: array.indexOf(search[0])}
    }
    return {before: true, i: 0}
    }
const userBase = {path: "users", indexKey:"uid"};
const getUser = ({email, uid})=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition: userBase}).then((Obj)=>{
        const {Versions} = JSON.parse(Obj);
        let searchterm = "uid";
        let searchcontent = uid;
        if (uid==undefined){
            Versions.sort(({email: a}, {email: b})=>a<b?-1:1);
            searchterm = "email";
            searchcontent = email;
        }
        const {i, before} = searchArray(searchterm, searchcontent, Versions)
        if (before==undefined){
            res(Versions[i]);
        }else{
            rej({error: 404, message: "can't find user"});
        }
        
    },
    ()=>{
        res(false);
    })
})
const newUser = ({email, password})=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition: userBase}).then((Obj)=>{
        const {Versions} = JSON.parse(Obj);
        const uid = Versions[Versions.length-1].uid+1;
        Versions.sort(({email: a}, {email: b})=>a<b?-1:1);
        const {before} = searchArray("email", email.toLowerCase(), Versions);
        if(before!=undefined){
                jables.writeDefinition({location, definition: updateObject(userBase, {email, password: sign(password), uid, admin: false, confirmed: false, joined: new Date().toUTCString()})}).then(()=>{
                    setTimeout(()=>{
                        getUser({uid: Versions.length}).then(({confirmed})=>{
                            if(!confirmed){
                                jables.deleteVersion({location, definition: [updateObject(userBase, {uid})]}).then(console.log, console.log)
                            }
                        })
                    },2*60*60*1000)
                    res(uid)
                }, rej)
        }else{
            rej({error: 401, message:"not allowed"})
        }
    }, ()=>{
        
            jables.writeDefinition({location, definition: updateObject(userBase, {email: email.toLowerCase(), password: sign(password), uid: 0, admin: true, confirmed: true, joined: new Date().toUTCString()})}).then(()=>{
                res(0);
            }, rej)
        
    })
})
const login = ({email, password})=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition: userBase}).then((Obj)=>{
        const {Versions} = JSON.parse(Obj);
        Versions.sort((a, b)=>a.email<b.email?-1:1);
        const {i, before} = searchArray("email", email, Versions);
        if (before===undefined&&Versions[i].confirmed){
                if(verify(Versions[i].password, password)){
                    if (Versions[i].logdates!=undefined){
                        if (Versions[i].logdates[Versions[i].logdates.length-1].length===1){
                            Versions[i].logdates[Versions[i].logdates.length-1][0]=new Date().toUTCString();
                        }else{
                            Versions[i].logdates.push([new Date().toUTCString()]);
                        }
                    }else{
                        Versions[i].logdates = [[new Date().toUTCString()]];
                        Versions[i].group = Math.floor(Math.random()*4);
                    }
                    jables.writeDefinition({location, definition: updateObject(userBase, Versions[i])})
                    res(Versions[i]);
                }else{
                    rej({error:401, message:"login failed"});
                }
            
        }else{
            rej({error: 401, message:"login failed"});
        }
    }, rej)
})
const logout = ({uid})=>new Promise((res, rej)=>{
    jables.getDefinitionProperty({location, definition: updateObject(userBase, {uid, property: "logdates"})}).then((logdates)=>{
        if (logdates[logdates.length-1].length===1){
            logdates[logdates.length-1].push(new Date().toUTCString());
            jables.writeDefinition({location, definition: updateObject(userBase, {uid, logdates})}).then(res, rej);
        }else{
            rej({error: 406, message: "Session already logged out"});
        }
        
    }, rej)
})
const tagcompare = (querytags, itemtags=[])=>{
    let rs = false;
    (querytags.tags||querytags||[]).forEach((tag)=>{
        if(itemtags.includes(tag)){
            rs = true;
        }
    })
    return rs;
}
const setAdmin = ({uid, admin})=>jables.writeDefinition({location, definition: updateObject(userBase, {uid, admin})})
const questionBase = {path:"questions", indexKey:"qid"};
const getQuestions = (tags=[]) => new Promise((res, rej)=>{
    jables.getDefinition({location, definition: questionBase}).then((Obj)=>{
        res(JSON.parse(Obj).Versions.filter((item)=>tags.length==0?true:tagcompare(tags, item.tags)));
    }, rej)
})
const newQuestion = ({title, answers, tags, page})=>new Promise((res, rej)=>{
    getQuestions().then((Versions)=>{
        if(searchArray("title", title, Versions.sort(({title: a}, {title: b})=>a<b?-1:1)).before!==undefined){
            jables.writeDefinition({location, definition: updateObject(questionBase, {title, answers, qid: Versions.length, tags, page})}).then(()=>{
                res({qid: Versions.length});
            }, rej)
        }else{
            rej({error: 406, message:"question with this title already exists"})
        }
    },
    ()=>{
        jables.writeDefinition({location, definition: updateObject(questionBase, {title, answers, qid: 0, tags})}).then(()=>{
            res({qid: 0})
        },rej)
    })
})
const patchUser = (user)=>new Promise((res, rej)=>{
    if (user.password){
        user.password = sign(user.password);
        jables.writeDefinition({location, definition: updateObject(userBase, user)}).then(res, rej);
    }else{
        jables.writeDefinition({location, definition: updateObject(userBase, user)}).then(res, rej);
    }
    })
const giveXP = ({uid, qid, right, timeSpan, selected})=>new Promise((res, rej)=>{
    getUser({uid}).then((user)=>{
        if (user.xp!=undefined){
            const last = user.xp[user.xp.length-1];
            if (last.date===new Date().toDateString()){
                last.xp.push({qid, right, timeSpan, selected})
            }else{
                user.xp.push({date: new Date().toDateString(), xp:[{qid, right, timeSpan, selected}]});
            }
        }else{
            user.xp=[{date: new Date().toDateString(), xp:[{qid, right, timeSpan, selected}]}]
        }
        jables.writeDefinition({location, definition: updateObject(userBase, user)}).then(()=>{
            user.password=undefined;
            res(user);
        }, rej)
    }, rej)
})
const getUsers = ()=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition: userBase}).then((Obj)=>{
        res(JSON.parse(Obj).Versions);
    },
    rej)
})
const confirm = ({uid})=>new Promise((res, rej)=>{
    getUser({uid}).then(({confirmed})=>{
        if(confirmed==false){
            jables.writeDefinition({location, definition: updateObject(userBase, {uid, confirmed: true})}).then(()=>{
                res()
            },
            rej)
        }else{
            rej({error: 401, message: "login failed"});
        }
    },
    rej)
})
const textBase = {path: "text", indexKey:"id"};
const writeText = ({content, id, uid, tag}) =>jables.writeDefinition({location, definition:updateObject(textBase, {tag, id, content, lastChange: new Date().toUTCString(), changedBy: uid})})
const getText = ({id})=>id!=undefined?jables.getDefinitionProperties({location, definition: updateObject(textBase, {id})}):new Promise((res, rej)=>{
    jables.getDefinition({location, definition: textBase}).then((Obj)=>{
        res(JSON.parse(Obj).Versions);
    }, rej)
})
const openSession = (uid)=>new Promise((res, rej)=>{
    jables.getDefinitionProperty({location, definition: updateObject(userBase, {uid, property:"logdates"})}).then((logdates)=>{
        if (logdates[logdates.length-1].length===1){
            res(true);
        }else{
            res(false);
        }
    }, rej)
})
const answerQuestion = ({qid, uid, selected, timeSpan})=>new Promise((res, rej)=>{
    getQuestions([]).then((questions)=>{
        const {i, before} = searchArray("qid", qid, questions);
        if (before===undefined){
            const rightAnswers = questions[i].answers.filter(({correct})=>correct);
            let right = rightAnswers.length===selected.length;

            if (right){
                selected.forEach((index)=>{
                    if(!questions[i].answers[index].correct){
                        right = false;
                    }
                })
            }            
            giveXP({uid, qid, right, timeSpan, selected}).then((user)=>{res({user, right})}, rej)
        }else{
            rej({error: 404, message:`${qid} doesn't exist`})
        }
    }, rej);
})
const patchQuestion = ({qid, title, answers, tags, page})=>new Promise((res, rej)=>{
    let base;
    let rejected = false;
    if(qid!=undefined){
        base = updateObject(questionBase, {qid});
    }else{
        rejected = true;
        rej({error: 406, message:"qestion id required to find and change question"})
    }
    if (!rejected&&title){
        if(typeof(title)==="string"&&title!=""){
            base=updateObject(base, {title});
        }else{
            rejected=true;
            rej({error: 409, message:"title must be non-empty string"})
        } 
    }
    if(!rejected&&answers){
        if(Array.isArray(answers)){
            answers.forEach(({text, correct})=>{
                if(typeof(text)!=="string"||typeof(correct)!=="boolean"||text===""){
                    rejected = true;
                }
            })
            if(rejected){
                rej({error: 409, message:"answers must conform to the interface {text:string, correct:boolean}; text must not be empty"})
            }else{
                base=updateObject(base, {answers});
            }
        }else{
            rejected = true;
            rej({error: 409, message:"answers must be an array"})
        }
    }
    if(!rejected&&page!=undefined){
        if(typeof(page)==="number"||parseInt(page)!=NaN){
            base=updateObject(base, {page})
        }else{
            rejected=true;
            rej({error: 409, message:"page must be a number"})
        }
    }
    if(!rejected&&tags){
        if(Array.isArray(tags)){
            tags.forEach((tag)=>{
                if(typeof(tag)!=="string"||tag===""){
                    rejected=true;
                }
            })
            
        }else{
            rejected=true;
        }
        if(rejected){
            rej({error: 409, message:"tags must be an array of non-empty strings"});
        }else{
            base=updateObject(base, {tags});
        }
    }
    if(!rejected){
        jables.writeDefinition({location, definition:updateObject(questionBase, base)}).then(res, rej);
    }
    
})
const setQuestionOrder = ({order})=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition:{path: "order", indexKey: "v"}}).then((Obj)=>{
        const Versions = JSON.parse(Obj).Versions;  
        Versions.push({v: Versions.length, order, active: true})      
        jables.writeDefinition({location, definition: Versions.map((item, index)=>updateObject(item, {path: "order", indexKey: "v", active: index==(Versions.length-1)}))}).then(res, rej);  
    },()=>{
        jables.writeDefinition({location, definition: {path: "order", indexKey:"v", v: 0, order, active: true}}).then(res, rej);
    })
})
const getQuestionOrder = ({v})=>new Promise((res, rej)=>{
    jables.getDefinitionProperties({location, definition: {path: "order", v}}).then(({order})=>{
        res(order);
    },
    rej)
})
const setActiveOrder = ({v})=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition: {path: "order", indexKey: "v"}}).then((Obj)=>{
        jables.writeDefinition({location, definition: JSON.parse(Obj).Versions.map((item)=>updateObject({path:"order", indexKey: "v", active: item.v===v}))}).then(res, rej);
    }, rej)
})
const getActiveOrder = ()=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition:{path:"order", indexKey: "v"}}).then((Obj)=>{
        const {Versions} =  JSON.parse(Obj);
        res(Versions[searchArray("active", true, Versions).i]);
    }, rej)
})
const getTextList = ({tag})=>new Promise((res, rej)=>{
    jables.getDefinition({location, definition: textBase}).then((Obj)=>{
        res(JSON.parse(Obj).Versions.filter((item)=>tag==undefined||item.tag==tag).map(({id, lastChange, changedBy})=>({id, lastChange, changedBy})))
    }, rej)
})
const createCSV = (uid, res)=>{
    getUser({uid}).then((user)=>{
        const csvobj = {email: user.email, uid, group: user.group}
        const tags = {}
        getQuestions().then((questions)=>{
            questions.forEach((question)=>{
                if(tags[question.tags[0]]){
                    tags[question.tags[0]].push(question.qid)
                }else{
                    tags[question.tags[0]]=[question.qid];
                }
                user.xp.forEach(({xp})=>{
                    xp.filter(({qid})=>qid===question.qid).forEach(({right, timeSpan, selected})=>{
                        if(csvobj[question.qid]){
                            csvobj[question.qid].push({right, timeSpan, selected})
                        }else{
                            csvobj[question.qid]=[{right, timeSpan, selected}]
                        }
                    })
                })
            })
            const template = ["email", "uid", "group"];
        Object.keys(tags).forEach((tag)=>{
            tags[tag].forEach((qid)=>{
                template.push(`timeSpan::${qid}`);
                if(tag!=="rquestions"&&tag!=="stat"){
                    template.push(`right::${qid}`)
                }else{
                    template.push(`selected::${qid}`)
                }
            })
        })
        const round1 = [];
        const round2 = [];
        const round3 = [];
        template.forEach((item)=>{
            if(isNaN(parseInt(item.split("::")[1]))){
                round1.push(csvobj[item])
                round2.push("");
                round3.push("");
            }else{
                const question = csvobj[parseInt(item.split("::")[1])]
                if(question!=undefined){
                    const key2 = item.split("::")[0].trim();
                    round1.push(Array.isArray(question[0][key2])?question[0][key2].join("&"):question[0][key2]);
                    round2.push(question[1]&&question[1][key2]!=undefined?question[1][key2]:"")
                    round3.push(question[2]&&question[2][key2]!=undefined?question[2][key2]:"")
                }else{
                    round1.push("");
                    round2.push("");
                    round3.push("");
                }
            }
        })
        if(!fs.existsSync(__dirname+"/csv")){
            fs.mkdirSync(__dirname+"/csv");
        }
        fs.writeFileSync(__dirname+"/csv/template"+uid+".csv", template.map((item)=>item.replace("::", "")).join(","));
        fs.writeFileSync(__dirname+"/csv/round1"+uid+".csv", round1.join(","));
        fs.writeFileSync(__dirname+"/csv/round2"+uid+".csv", round2.join(","));
        fs.writeFileSync(__dirname+"/csv/round3"+uid+".csv", round3.join(","));
        res.status(200);
        const ball = tar.pack(__dirname+"/csv").pipe(res);
        ball.on("finish", ()=>{
            res.end();
            fs.rmdirSync(__dirname+"/csv", {recursive:true})
        })
        
        }, ({error, message})=>{
            res.status(error).json(message)
        })
    }, ({error, message})=>{
        res.status(error).json(message)
    })
}
const createCSVs = (uids, res)=>{
    if(!fs.existsSync(__dirname+"/csv")){
        fs.mkdirSync(__dirname+"/csv");
    }
    getUsers().then((users)=>{
        getQuestions().then((questions)=>{
            const tags = {}
            questions.forEach((question)=>{
                if(tags[question.tags[0]]){
                    tags[question.tags[0]].push(question.qid)
                }else{
                    tags[question.tags[0]]=[question.qid];
                }
                
            })
            const template = ["email", "uid", "group"];
            Object.keys(tags).forEach((tag)=>{
            tags[tag].forEach((qid)=>{
                template.push(`timeSpan::${qid}`);
                if(tag!=="rquestions"&&tag!=="stat"){
                    template.push(`right::${qid}`)
                }else{
                    template.push(`selected::${qid}`)
                }
            })
            })
            fs.writeFileSync(__dirname+"/csv/template.csv", template.map((item)=>item.replace("::", "")).join(","));
            users.filter(({uid, xp})=>xp!=undefined&&(uids==undefined||uids.split(",").map(parseInt).includes(uid))).forEach((user)=>{
                const csvobj = {email: user.email, uid:user.uid, group: user.group}
                user.xp.forEach(({xp})=>{
                    xp.forEach(({qid, right, timeSpan, selected})=>{
                        if(csvobj[qid]){
                            csvobj[qid].push({right, timeSpan, selected})
                        }else{
                            csvobj[qid]=[{right, timeSpan, selected}]
                        }
                    })
                })
                const round1 = [];
        const round2 = [];
        const round3 = [];
        template.forEach((item)=>{
            if(isNaN(parseInt(item.split("::")[1]))){
                round1.push(csvobj[item])
                round2.push("");
                round3.push("");
            }else{
                const question = csvobj[parseInt(item.split("::")[1])]
                if(question!=undefined){
                    const key2 = item.split("::")[0].trim();
                    round1.push(Array.isArray(question[0][key2])?question[0][key2].join("&"):question[0][key2]);
                    round2.push(question[1]&&question[1][key2]!=undefined?question[1][key2]:"")
                    round3.push(question[2]&&question[2][key2]!=undefined?question[2][key2]:"")
                }else{
                    round1.push("");
                    round2.push("");
                    round3.push("");
                }
            }
        })
        fs.writeFileSync(__dirname+"/csv/round1"+user.uid+".csv", round1.join(","));
        fs.writeFileSync(__dirname+"/csv/round2"+user.uid+".csv", round2.join(","));
        fs.writeFileSync(__dirname+"/csv/round3"+user.uid+".csv", round3.join(","));
            })
            res.status(200);
        const ball = tar.pack(__dirname+"/csv").pipe(res);
        ball.on("finish", ()=>{
            res.end();
            fs.rmdirSync(__dirname+"/csv", {recursive:true})
        })
        
        }, ({error, message})=>{
            res.status(error).json(message)
        })
    })
}
module.exports = {
    searchArray,
    newUser,
    login,
    logout,
    setAdmin,
    getQuestions,
    newQuestion,
    getUser,
    patchUser,
    giveXP,
    getUsers,
    confirm,
    writeText,
    getText,
    openSession,
    answerQuestion,
    getQuestionOrder,
    setQuestionOrder,
    setActiveOrder,
    getActiveOrder,
    getTextList,
    patchQuestion,
    createCSV,
    createCSVs
}