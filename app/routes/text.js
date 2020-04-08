const route = require("express").Router();
const jables = require("../jableshandler");
const token = require("../token");
route.get("/", (req, res, next)=>{
    jables.getText({id: req.query.id}).then((text)=>{
        res.status(200).json(text);
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.post("/", token.checkAdminToken, (req, res, next)=>{
    jables.writeText(req.body).then(()=>{
        res.status(201).json(req.body);
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.get("/list", (req, res, next)=>{
    jables.getTextList(req.query).then((list)=>{
        res.status(200).json(list);
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
module.exports=route;