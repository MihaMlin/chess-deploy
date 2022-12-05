import nodemailer from "nodemailer";
import keys from "./keys.json" assert { type: "json" };

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: "rpo.chess2022@gmail.com",
        pass: keys.gmail_app_pass
    }
});

export const create_token = () => {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var token = "";

    for (var i = 0; i < 30; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }

    return token;
}

export const send_confirm_email = (user_email, username, email_token) => {
    var message = {
        from: '"rpo-chess" <rpo.chess2022@gmail.com>',
        to: user_email,
        subject: "Potrditev registracije",
        html: `
            Pozdravljeni <b>${ username }</b>,
            <br><br>
            ta e-naslov je bil uporabljen za registracijo na <b>chess-rpo</b>. Da lahko pričnete z igranjem, morate potrditi račun, z klikom na to <a href="http://localhost:5000/confirm/${ email_token }">povezavo</a>.
            <br><br>
            Če se niste registrirali Vi, lahko ta mail ignorirate.
            <br><br>
            Veselo igranje :D`
    };

    transporter.sendMail(message, function(error, info){
        if(error){
            return console.log(error);
        }
    
        console.log("Message sent: " + info.response);
    });
};
