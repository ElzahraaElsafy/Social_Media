import { HydratedDocument, model, Schema } from "mongoose";
import {Role,Gender,System} from "../../module/common/enums";
import {IUser} from "../../module/common/interfaces/user.interface";

const userSchema = new Schema<IUser>({
fname: {

    type:String,
    trim: true,
    minlength: 3,
    maxlength: 20,
},lname: {
    type :String,
    trim: true,
    minlength: 3,
    maxlength: 20,
},email: {
    type :String,
    trim: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
    required: true,
},password: {
    type :String,
    trim: true,
    minlength: 3,
    maxlength: 60,
    required: true,
},confirmEmail : {
    type :Boolean,
    default: false,
},role :{
type : String,
enum : Object.values(Role),
default : Role.USER,
},gender :{
    type :String,
    enum : Object.values(Gender),
    default : Gender.MALE,
},age :{
    type :Number,
    min : 18,
    max : 60,
},phone :{
    type :String,
    trim: true,
    minlength: 3,
    maxlength: 20,
    required: true,
},
address :{
    city : String,
    country : String,
},provider :{
    type : String,
    enum : Object.values(System),
    default : System.SYSTEM,
},profileImage:{
 type : String,
},
coverImage :{
    type :[String],
},isActive :{
    type : Boolean,

},status :{
    type :String,   // for banned users
},
changeCreditional : Date,
oldPasswords :{
    type :[String],

}
},{
    timestamps : true,
    collection : "users",
    optimisticConcurrency : true,
    versionKey : "version",
    strict : true,  // allow only field in schema
    toJSON : { virtuals : true, getters : true},
    toObject : { virtuals : true, getters : true},

});

//fullname
userSchema
.virtual("fullname")
.get(function(){
    return this.fname + " " + this.lname;
})
.set(function(val){
    this.fname =val.split(" ")[0] || " ";
    this.lname =val.split(" ")[1] || " "; 
});
export const User = model<IUser>("User",userSchema);

export type UserHydrated = HydratedDocument<IUser> ;
// export default User;