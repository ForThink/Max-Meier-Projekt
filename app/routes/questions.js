const route = require("express").Router();
const jables = require("../jableshandler");
const token = require("../token");

route.get("/", (req, res, next)=>{
    jables.getQuestions(req.query.tags?req.query.tags.split(","):[]).then((questions)=>{
        res.status(200).json(questions);
    }, ({error, message})=>{
        res.status(404).json("No questions to show yet");
    })
})
route.post("/", token.checkAdminToken, (req, res, next)=>{
    const {title, answers, tags, page} = req.body;
    if (!Array.isArray(answers)){
        return res.status(406).json("answers must be arranged in an array");
    }
    if (typeof(title)!=="string"){
        return res.status(406).json("title must be a string")
    }
    answers.forEach(({text, correct})=>{
        if (text===undefined||correct===undefined||typeof(text)!=="string"||typeof(correct)!=="boolean"){
            return res.status(406).json("answers must correspond to the interface {text: string, correct: boolean}")
        }
    })
    jables.newQuestion({title, answers, tags, page}).then(({qid})=>{
        res.status(201).json({qid});
    }, ({error, message})=>{
        res.status(error).json(message);
    })
})
route.patch("/", token.checkAdminToken, (req, res, next)=>{
    jables.patchQuestion(req.body).then(()=>{
        res.status(201).json("question successfully changed");
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.post("/answer", token.checkToken, (req, res, next)=>{
    const {qid, selected, timeSpan} = req.body;
    const {uid} = req.userData;
    jables.answerQuestion({qid, selected, uid, timeSpan}).then((correct)=>{
        res.status(200).json(correct);
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.post("/order", token.checkAdminToken, (req, res, next)=>{
    jables.setQuestionOrder(req.body).then(()=>{
        res.status(201).json("order successfully set");
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.get("/order", (req, res, next)=>{
    if (req.query.v!=undefined){
        jables.getQuestionOrder(req.query).then((order)=>{
            res.status(200).json(order);
        },
        ({error, message})=>{
            res.status(error).json(message);
        })
    }else{
        jables.getActiveOrder().then((order)=>{
            res.status(200).json(order);
        },
        ({error, message})=>{
            res.status(error).json(message);
        })
    }
    
})
route.post("/startRound", token.checkToken, (req, res, next)=>{
    jables.getUser(req.userData).then(({rounds})=>{
        if(!rounds){
            jables.patchUser({uid: req.userData.uid, rounds: [{module: req.body.module, tries: 1}]}).then(()=>{
                res.status(200).json(token.createToken(req.userData));
            })
        }else{
            const {i, before} = jables.searchArray("module", req.body.module, rounds);
            if(before===undefined){
                let allow = rounds[i].tries<3;
                if(allow){
                    rounds[i].tries++;
                    jables.patchUser({uid: req.userData.uid, rounds}).then(()=>{
                        res.status(200).json(token.createToken(req.userData));
                    }, ({error, message})=>{
                        res.status(error).json(message);
                    })
                }else{
                    res.status(403).json("kann jede Lektion nur 3 mal prüfen")
                }
            }else{
                rounds.splice(before?i:i+1, 0, {module: req.body.module, tries: 1});
                jables.patchUser({uid: req.userData.uid, rounds}).then(()=>{
                    res.status(200).json(token.createToken(req.userData));
                }, ({error, message})=>{
                    res.status(error).json(message);
                })
            }
        }
    })
})
module.exports=route;