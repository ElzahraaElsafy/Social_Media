export const otpTemplate =({otp,username,title}:{
    otp:number,
    username:string,
    title:string,
})=>`
    <!DOCTYPE html>
    <html>
        <body>
            <h2>${title}</h2>
            <p>${username} your verification Code is :</p>
            <h1
            style="
            letter-spacing:8px;
            color:#007bff;
            "
            >
            ${otp}
            </h1>
            <p> This Code expires in 10 m .</p>
        </body>
        </html>
`;