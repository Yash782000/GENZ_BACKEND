const nodemailer = require("nodemailer");
const MailGen = require("mailgen");



const sendEmail = async(subject,send_to,template,replay_to,cc)=>{
    console.log("hy mail");
    console.log(template);
    //create email transporter
    const transport = nodemailer.createTransport({
       service:"gmail",
       host:process.env.EMAIL_HOST,
       port:587,
       auth:{
           user:process.env.EMAIL_USER,
           pass:process.env.EMAIL_PASSWORD,
       },
       debug: true
    })
    console.log("hy email 2")
    //create template with mailGen
    const mailGenerator = new MailGen({
        theme: 'salted',
        product: {
            // Appears in header & footer of e-mails
            name: 'Genz Store',
            link: 'http://localhost:3000'
            
        }
    });
    console.log("hy email3")
    const emailTemplate = mailGenerator.generate(template);
    require("fs").writeFileSync("preview.html",emailTemplate,'utf-8');
    
    //options for sending an email
    const options = {
        from:process.env.EMAIL_USER,
        to:send_to,
        replyTo:replay_to,
        subject,
        html:emailTemplate,
        cc,
    }
    console.log("how are you")
    console.log(options)
    //send email
    transport.sendMail(options,function(err,info){
        if(err){
            console.log("ht err")
            console.log(err);
        }else{
            console.log("by err");
            console.log(info);
        }       
    })
}

module.exports = sendEmail;