module.exports = {
    recover:(relp)=>{
        return `<div>
            <a href="${relp}">Klicken Sie hier, um ein neues Passwort zu vergeben</a>
        </div>`;
    },
    confirm:(relp)=>{
        return `<div>
            <a href="${relp}">Klicken Sie hier, um Ihr Konto zu aktivieren</a>
        </div>`;
    }
}