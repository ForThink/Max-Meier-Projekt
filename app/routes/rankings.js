const route = require("express").Router();
const jables = require("../jableshandler");

route.get("/xp", (req, res, next)=>{
    let all = req.query.all||0;
    const exclude = [];
    const tags = req.query.tags?req.query.tags.split(","):[];
    jables.getUsers().then((users)=>{
        if (tags.length){
            jables.getQuestions({tags}).then((questions)=>{
                question = questions.map(({qid})=>qid);
                res.status(200).json(users.map((item)=>{
                    let total = 0;
                    if (item.xp){
                        item.xp.forEach((day)=>{
                            day.xp.filter(({qid})=>{
                                const rs = !exclude.includes(qid)&&questions.includes(qid)
                                if(rs&&!all){
                                    exclude.push(qid);   
                                }
                                return rs;
                            }).forEach((xp)=>{
                                if (xp.right){
                                    total++;
                                }
                            })
                        })
                    }
                    return item.confirmed&&!item.admin?{uid: item.uid, xp: total}:undefined;
                  }).filter((item)=>item!=undefined).sort((a, b)=>b.xp-a.xp).map(({uid})=>uid))
            }, ({error, message})=>{
                res.status(error).json(message);
            })
        }else{
            res.status(200).json(users.map((item)=>{
                let total = 0;
                if (item.xp){
                    item.xp.forEach((day)=>{
                        day.xp.forEach(({qid, right}) => {
                            if (right&&!exclude.includes(qid)){
                                total++;
                            }
                            if(!all&&!exclude.includes(qid)){
                                exclude.push(qid);
                            }
                        });
                    })
                }
                return item.confirmed&&!item.admin?{uid: item.uid, xp: total}:undefined;
              }).filter((item)=>item!=undefined).sort((a, b)=>b.xp-a.xp).map(({uid})=>uid))
        }
    }, ({error, message})=>{
        res.status(error).json(message);
    })
})
module.exports=route;