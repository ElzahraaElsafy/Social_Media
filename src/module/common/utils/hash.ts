import bcrypt from "bcrypt";
export const hash=async ({plaintext,salt=4

}:{
    plaintext :string,
    salt? :number,
})=>{
    return await  bcrypt.hash(plaintext, salt)

};

export const compare=async (
    {plaintext,hashtext}
    :{
        plaintext:string;
        hashtext:string ;
    })=>{
     return await bcrypt.compare(plaintext,hashtext);
};