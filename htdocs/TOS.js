fetch("/text?id=datschu").then((response)=>{
    if(response.status<400){
        response.json().then(({content})=>{
            content.forEach(({id, content})=>{
                if(id==="editContent"){
                    document.getElementById("Datschu").innerHTML=content;
                }
            })
        })
    }
})
fetch("/text?id=agb").then((response)=>{
    if(response.status<400){
        response.json().then(({content})=>{
            content.forEach(({id, content})=>{
                if(id==="editContent"){
                    document.getElementById("AGB").innerHTML=content;
                }
            })
        })
    }
})