const mainframe = document.getElementById("mainframe")
window.addEventListener("resize", ()=>{
    mainframe.setAttribute("style", mainframe.getAttribute("style")+`width: ${heightwidth(0)}px ; height: ${heightwidth(1)}px;`)
})
const heightwidth = (index)=>{
    const rs = [0, 0];
    if (window.innerWidth>500){
        rs[0]=500;
        if(window.innerHeight>800){
            rs[1]=800;
        }else{
            rs[1]=window.innerHeight;
        }
    }else{
        rs[0] = window.innerWidth;
        if(window.innerHeight>1.6*window.innerWidth){
            rs[1]=window.innerWidth*1.6;
        }else{
            rs[1]=window.innerHeight;
        }
    }
    return rs[index];
}
mainframe.setAttribute("style", mainframe.getAttribute("style")+`width: ${heightwidth(0)}px ; height: ${heightwidth(1)}px;`)
const params = new URLSearchParams(window.location.search)
const html = params.get("html");
const q = params.get("q");
const lastUser = localStorage.getItem("lastUser");
if (lastUser!=null&&html==null){
    fetch("/users/login", {
        method: "POST",
        body:lastUser,
        headers:{
            "Content-Type":"application/json"
        }
    }).then((response)=>{
        response.json().then((json)=>{
            if(response.status<400){
                localStorage.setItem("token", json.token);
                localStorage.setItem("userData", JSON.stringify(json.userData))
                mainframe.setAttribute("src", "52.html?q="+JSON.stringify({main: "rquestions", modulename:"", progress:1, likert: 1}));
            }else{
              mainframe.setAttribute("src", "login.html");
              localStorage.removeItem("lastUser")  
            }
            
        })
    }, console.log)
}else{
    const src = (html||"login")+".html?q="+q||"";
    mainframe.setAttribute("src", src);
}
fetch("/questions?tags=rquestions").then((response)=>{
    if(response.status<400){
        response.json().then((json)=>{
            localStorage.setItem("rquestions", JSON.stringify(json));
        }, console.log);
    }else{
        localStorage.setItem("rquestions", "[]");
    }
})