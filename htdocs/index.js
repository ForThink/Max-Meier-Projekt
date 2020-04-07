const mainframe = document.getElementById("mainframe")
mainframe.setAttribute("width", window.innerWidth);
mainframe.setAttribute("height", window.innerHeight);
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
                mainframe.setAttribute("src", "54.html?q={\"progress\":1}");
            }
            
        })
    }, console.log)
}else{
    const src = (html||"login")+".html?q="+q||"";
    mainframe.setAttribute("src", src);
}
