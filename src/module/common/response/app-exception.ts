abstract  class APPException extends Error{
public statusCode:number;
    constructor(message:string, statusCode:number, cause?:unknown){
        super(message,{cause});
        this.statusCode =statusCode;
    }
}

export class NotFoundExpection extends  APPException {
    constructor(message:string, cause?:unknown){
        super(message,400,cause)
    }
}

export class ConflictExpection extends  APPException {
    constructor(message:string, cause?:unknown){
        super(message,409,cause)
    }
}

export class UnauthorizeExpection extends  APPException {
    constructor(message:string, cause?:unknown){
        super(message,401,cause)
    }
}

export class ForbiddenExpection extends  APPException {
    constructor(message:string, cause?:unknown){
        super(message,403,cause)
    }
}

export class BadRequestExpection extends  APPException {
    constructor(message:string, cause?:unknown){
        super(message,400,cause)
    }
}