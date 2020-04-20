const subpanehead = (text, id)=> `<div style="text-align:lift">
<label id="title_${id}"  style="font-size:24px;margin:10px;" class="text">${text}</label>
</div>
`
const textel = (text, imglnk, id)=> `<div class="img">
<img id="img_${id}" src="${imglnk}" style="width: 30px; height: 30px; margin: 5px;" class="rounded-circles" alt="Cinque Terre">
<label id="text_${id}"  style="font: size 20px;margin:10px;" class="text">${text}</label>
</div>
`

const subpane = (title, elements, id)=>`
<div>
${subpanehead(title, id)}
${(()=>{let rs = ""; elements.forEach(({text, image}, index)=>{rs+=textel(text, image, id+""+index)}); return rs;})()}
</div>
`
const defaultPage = {
    panes:[
        {
            title:"Titel1",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        },
        {
            title:"Titel2",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        },
        {
            title:"Titel3",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        },
        {
            title:"Titel4",
            elemente:[
                {text:"text1", image:"/img/vv.jpg"},
                {text:"text2", image:"/img/vv.jpg"},
                {text:"text3", image:"/img/vv.jpg"},
                {text:"text4", image:"/img/vv.jpg"},
                {text:"text5", image:"/img/vv.jpg"},
                {text:"text6", image:"/img/vv.jpg"},
                {text:"text7", image:"/img/vv.jpg"},
                {text:"text8", image:"/img/vv.jpg"},
            ]
        }
    ]
}
const buildPage = (info={})=>{
    let res = {panes:[]};
    for (let i = 0; i < defaultPage.panes.length; i++){
        const pane = {elemente: []};
        if(info.panes&&info.panes[i]){
            pane.title=info.panes[i].title||defaultPage.panes[i].title;
            if(info.panes[i].elemente){
                for(let k = 0; k < defaultPage.panes[i].elemente.length; k++){
                    element = {
                        text: info.panes[i].elemente[k].text||defaultPage.panes[i].elemente[k].text,
                        image: info.panes[i].elemente[k].image||defaultPage.panes[i].elemente[k].image,
                    };
                    pane.elemente.push(element);
                }
            }else{
                pane.elemente = defaultPage.panes[i].elemente
            }
        }else{
            pane.title= defaultPage.panes[i].title;
            pane.elemente = defaultPage.panes[i].elemente;
        }
        res.panes.push(pane);
    }
    document.getElementById("tpane").innerHTML="";
    res.panes.forEach((pane, index)=>{
        document.getElementById("tpane").innerHTML+=subpane(pane.title, pane.elemente, index)
    })
}
buildPage()
