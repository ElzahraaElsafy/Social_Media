import { ILogin, ISignup } from "./dots/auth.dto";
import { UserHydrated } from "../../DB/models/user.model";
import { BadRequestExpection, NotFoundExpection } from "../common/response/app-exception";
import { UserRepository } from "../../DB/repo/user.repo";
import { compare, hash } from "../common/utils/hash"; // adjust path to wherever these actually live
import { encrypt } from "../common/utils/encrypt"; // adjust path to wherever this actually lives
import { generateotp } from "../common/utils/generate_otp";
import { otpTemplate } from "../common/utils/otp.temp";
import {emailEmitter} from "../common/utils/email-event";
import redisServiceModule from "../common/utils/Services/redis_sevices";
import { string } from "zod";
import TokenService from "../common/utils/Services/tokenServices"

const { forgetotpKey, forgetotpCounterKey } = redisServiceModule as any;

class AuthServices {
  private userRepo: UserRepository;
  private TokenService :any;
private redisService:any;
  constructor() {
    this.userRepo = new UserRepository();
    this.redisService = redisServiceModule;
    this.TokenService =TokenService;
  }

  async login(data: ILogin) {
    const { email, password } = data;
    console.log("User is Login");

    const user = await this.userRepo.findOne({
      filter: { email },
      options: { lean: false },
    });

    if (!user) {
      throw new NotFoundExpection("User is Not Found");
    }

    // compare password
    if (!(await compare({ plaintext: password, hashtext: user.password }))) {
      throw new BadRequestExpection("Invalid Email or Password");
    }

    return { user };
  }

  async signup(data: ISignup) {
    const { email, password } = data;
    console.log("User is SignUp Successfully");

    const existUser: UserHydrated | null = await this.userRepo.findOne({
      filter: { email },
    });

    if (existUser) {
      throw new NotFoundExpection("User already exists");
    }

    if (data.phone) {
      data.phone = encrypt({ text: data.phone });
    }

    data.password = await hash({ plaintext: password });

    const user = await this.userRepo.create({
      ...data,
      phone: data.phone ?? "",
    });

    const otp =await generateotp(); 
      
  await this.redisService.set({
    key:this.redisService.otpKey(user.email),
    ttl: 120,
    val:await hash({ plaintext: `${otp}` }),
  });

  await this.redisService.set({
    key: this.redisService.forgetotpCounterKey(user.email),
    ttl: 60 * 5,
    val:await hash({plaintext:`${otp}`}),
  });

      emailEmitter.emit("sendEmail",async()=>{
    await sendEmail ({
    to :user.email,
    subject : "Confirm Email",
    html: otpTemplate({
      otp,
      username :user.fname,
      title:"Confirm email otp",
    }),
     
   });
  });
    return { user };
  }
}

const authService = new AuthServices();
export default authService;