import axios from "axios"
import { HttpCallbackBase } from "./base"
import configs from "~/configs/configs"

export interface ISubmitValidateCodeFormSuccess extends HttpCallbackBase {
    
}

export interface ISubmitValidateCodeFormError extends HttpCallbackBase {
    message: string
}

export interface IUserSigninError extends HttpCallbackBase {
    message: string,
}

export default class UsersHttp {    
    SigninAction(email: string) {
        return new Promise<void>((resolve, reject: (callback: IUserSigninError) => void) => {
            axios.post(`${configs.http_url}/users/signin`, {
                email
            }).then((cb) => {
                if (cb.status === 200 && cb.data.message === "verific email sent") {
                    resolve()
                } else {
                    const callbackData: IUserSigninError = {
                        message: cb.data.message,
                        status: 1
                    }
                    reject(callbackData);
                    console.log(cb.data.message);
                    
                }
            }).catch((cb) => {
                const callbackData: IUserSigninError = {
                    message: cb.data.message,
                    status: 1
                }
                reject(callbackData);
                console.log(cb.data.message); 
            })
        })
    },
    SubmitValidateCodeForm(email: string, verific_code: string) {
        return new Promise((resolve: (callback: ISubmitValidateCodeFormSuccess) => void, reject: (callback: ISubmitValidateCodeFormError) => void) => {
            axios.post(`${configs.http_url}/users/signin_with_code`, {
                email,
                verific_code
            }).then((cb) => {
                // ANCHOR
                if (cb.status === 200 && cb.data.message === "verific email sent") {
                    resolve(cb.data as ISubmitValidateCodeFormSuccess)
                }
                else if (
                    cb.data.message === "bad_verific_code" && 
                    cb.data.message === "verific_code_expired" &&
                    cb.data.message === "verific_code_limit" && 
                    cb.data.message === "maximum_try_count" 
                ) {
                    reject({message: cb.data.message});
                    console.log(cb.data.message);
                }
                
                else {
                    reject({message: cb.data.message});
                    console.log(cb.data.message);
                    
                }
            }).catch((cb) => {
                reject({message: cb.data.message});
                console.log(cb.data.message); 
            })
        })
    }
}