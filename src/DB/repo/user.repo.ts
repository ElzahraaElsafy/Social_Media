import {UserHydrated,User} from "../../DB/models/user.model";
import { IUser } from "../../module/common/interfaces/user.interface";
import {Model} from "mongoose" ;
import { BaseRepository } from "./base.repo";
export  class UserRepository extends BaseRepository<IUser>{
    constructor(){
        super(User)
    }
    
}