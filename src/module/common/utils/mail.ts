import  nodemailer from "nodemailer";

// create a transponder using SMTP
export const  sendEmail=async ({
    to="",
    subject,
    text ="Hello From Alzahraa",
    cc = "",
    bcc =" ",
    html="",
    attachments =[],

}:{
  to :string,
  cc?:string,
  bcc :string,
  subject :string,
  html:string,
  text?:string,
  attachments ?:string[],
})=>{
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alzahraahassan135@gmail.com",
    pass: "ifvl uzys hdkw iwuu",
  },
});
try {
  const info = await transporter.sendMail({
    from: 'alzahraahassan135@gmail.com', // sender address
    to, // list of recipients, may be array
    cc,  
    bcc,
    subject: "Hello", // subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // HTML body
    // attachments: [
    //   {
    //     filename:"notes.txt",
    //     path:resolve("./notes.txt"),
    //     contentType:"text/plain",

    //   }
    // ]
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
}