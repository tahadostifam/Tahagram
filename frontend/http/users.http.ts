import axios from "axios"
import { HttpCallbackBase } from "./base"
import configs from "~/configs/configs"

export interface IUserSigninSuccess extends HttpCallbackBase {
    
}

export interface IUserSigninError extends HttpCallbackBase {
    message: string,
    status: number
}

export default class UsersHttp {
    SigninAction(email: string) {
        return new Promise((resolve: (callback: IUserSigninSuccess) => void, reject: (callback: IUserSigninError) => void) => {
            axios.post(`${configs.http_url}/users/signin`, {
                email
            }).then((cb) => {
                if (cb.status === 200 && cb.data.message === "verific email sent") {
                    resolve(cb.data as IUserSigninSuccess)
                }
            }).catch((cb) => {
                const callbackData: IUserSigninError = {
                    message: cb.data.message,
                    status: 1
                }
                reject(callbackData);
            })
        })
    }
}