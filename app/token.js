const fs = require("fs");
const jwt = require("jsonwebtoken");
const jables = require("./jableshandler");
const secret = fs.existsSync("./.secdat")?fs.readFileSync("./.secdat").toString("hex"):"0fce8d0d3f7aa33eb1";

module.exports = {
    checkToken:(req, res, next)=>{
        try{
            const token = req.query.token||req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, secret);
            if (decoded.confirm||decoded.recover){
                req.userData=decoded;
                next();
            }else{
                jables.openSession(decoded.uid).then((isopen)=>{
                    if (isopen){
                        req.userData=decoded;
                        next();
                    }else{
                        return res.status(401).json("Login failed");  
                    }
                },({error, message})=>{
                    return res.status(error).json(message);
                }) 
            }
            
                        
        } catch(e){
            return res.status(401).json("Login failed");
        }
    },
    checkAdminToken: (req, res, next)=>{
        try{
            const token = req.query.token||req.headers.authorization.split(" ")[1]
            if(JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).admin){
                const decoded = jwt.verify(token, secret);
                jables.openSession(decoded.uid).then((isopen)=>{
                    if (isopen){
                        req.userData=decoded;
                        next();
                    }else{
                        return res.status(401).json("Login failed");  
                    }
                },({error, message})=>{
                    return res.status(error).json(message);
                }
                )
            }else{
                res.status(403).json("Access Denied");
            }
                        
        } catch(e){
            return res.status(401).json("Login failed");
        }
    },
    createToken:(user, expiresIn=1800)=>
        {
            const {uid, admin, confirm, recover} = user;
        return jwt.sign({uid, admin, confirm, recover}, secret, {
            expiresIn
        })
    },
}