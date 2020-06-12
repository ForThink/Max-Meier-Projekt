const route = require("express").Router();
const jables = require("../jableshandler");
const token = require("../token");
const fs = require("fs");
const connection = fs.existsSync("./connection")?JSON.parse(fs.readFileSync("./connection")):{protocol: "http", host:"localhost", port:"3000"}
const passwordRecovery = fs.readFileSync("./passwordRecovery.html")
const welcomePage = fs.readFileSync("./welcomePage.html")
const emailgen = require("../emailgen");
const mailer = require("nodemailer").createTransport(require("../../mailcfg.json"));
route.get("/", token.checkAdminToken, (req, res, next)=>{
    jables.getUsers().then((users)=>{
        users.forEach((user)=>{
            user.password = undefined;
        })
        res.status(200).json(users);
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.post("/pwd", (req, res, next)=>{
    jables.getUser(req.body).then(({uid})=>{
            mailer.sendMail({
                from: "Revolutionizing Accounting Education <noreply@ubt.de>",
                to: req.body.email,
                subject: "Passwort Wiederherstellung",
                html: emailgen.recover(`${connection.protocol}://${connection.host}:${connection.port}/users/recoverpw?token=${token.createToken({uid, recover:true}, 2*60*60)}`)
            }).then(()=>{
                res.status(200).json("please check your mail")
            },
            ()=>{
                res.status(500).json("there was en error sending the mail")
            })
        },
        ()=>{
            res.status(401).json(`${req.body.email} is not registered with us`)
        } 
    )
    
})
route.post("/signup", (req, res, next)=>{
    jables.newUser(req.body).then((uid)=>{
        mailer.sendMail({
            from: "Revolutionizing Accounting Education <noreply@ubt.de>",
            to: req.body.email,
            subject: "Anmeldungsbestätigung",
            html: uid!=0?emailgen.confirm(`${connection.protocol}://${connection.host}:${connection.port}/users/confirm?token=${token.createToken({uid, confirm:true}, 24*60*60)}`):"Welcome, Admin!"
            }).then(()=>{
                res.status(200).json("please check your mail")
            },
            ()=>{
                res.status(500).json("there was en error sending the mail")
            }
        )
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.post("/login", (req, res, next)=>{
    jables.login(req.body).then((user)=>{
        const {uid, admin, confirmed} = user;
        user.password = undefined;
        if(confirmed){
            res.status(200).json({token: token.createToken({uid, admin}, admin?7200:1800), userData: user});
        }else{
            res.status(403).json("please confirm your email address")
        }
        
    },
    ({error, message})=>{
        res.status(error).json(message);
    }
    )
})
route.post("/logout", token.checkToken, (req, res, next)=>{
    jables.logout(req.userData).then(()=>{
        res.status(200).json("logout successfull");
    },
    ({error, message})=>{
        res.status(error).json(message);
    })
})
route.post("/admin", token.checkAdminToken, (req, res, next)=>{
    jables.setAdmin(req.body).then(()=>{
        res.status(201).json("sucessfully changed admin priviledges")
    },
    ({error, message})=>{
        res.status(error).json(message)
    })
})
route.get("/recoverpw", (req, res, next)=>{
    res.status(200).write(passwordRecovery)
    res.end();
})
route.post("/setpw", token.checkToken, (req, res, next)=>{
    const {uid} = req.userData;
    jables.patchUser({uid, password: req.body.password}).then(()=>{
        res.status(201).json("password sucessfully changed");
    },
    ({error, message})=>{
        res.status(error).json(message)
    })
})
route.get("/confirm", token.checkToken, (req, res, next)=>{
    jables.confirm(req.userData).then(()=>{
        res.status(200).write(welcomePage);
        res.end();
    },
    ({error, message})=>{
        res.status(error).json(message)
    })
})
route.get("/csv", token.checkAdminToken, (req, res, next)=>{
    jables.createCSV(parseInt(req.query.uid), res)
})
module.exports=route;