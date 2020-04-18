const answer = {qid: question.qid}
const now = Date.now();
const sendAnswer = ()=>{
    answer.selected = selections;
    answer.timeSpan = Date.now()-now;
    fetch("/questions/answer", {
        method:"POST",
        headers: {
            "Authorization":`Bearer ${localStorage.getItem("token")}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify(answer)
    }).then((response)=>{
        if(response.status<400){
            response.json().then((json)=>{
                localStorage.setItem("userData", JSON.stringify(json.user));
                params.last = json.right;
                if(params.right==undefined){
                    params.right=0;
                }
                if(json.right){
                    params.right++;
                }
                window.location=`/${lsg}.html?q=${JSON.stringify(params)}`
            })
        }else if(admin){
            window.location=`/${lsg}.html?q=${JSON.stringify(params)}`
        }
    })
}