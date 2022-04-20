import axios from 'axios';
import { IUserData } from '../lib/interfaces';
import { HttpCallbackBase } from './base';
import configs from '~/configs/configs';

export interface SigninActionError extends HttpCallbackBase {
  limit_start?: number;
  limit_end?: number;
}

export default class UsersHttp {
  SigninAction(email: string) {
    return new Promise(
      (
        resolve: (callback: HttpCallbackBase) => void,
        reject: (callback: HttpCallbackBase) => void
      ) => {
        axios
          .post(`${configs.http_url}/users/signin`, {
            email,
          })
          .then((cb) => {
            if (cb.status === 200 && cb.data.message === 'verific email sent') {
              resolve({ message: 'success' });
            } else {
              reject(cb.data);
              console.log(cb.data);
            }
          })
          .catch((cb) => {
            reject(cb.response.data);
            console.log(cb.response.data);
          });
      }
    );
  }

  SubmitValidateCodeForm(email: string, verificCode: string) {
    return new Promise(
      (
        resolve: (callback: IUserData) => void,
        reject: (callback: HttpCallbackBase) => void
      ) => {
        axios
          .post(`${configs.http_url}/users/signin_with_code`, {
            email,
            verific_code: verificCode,
          })
          .then((cb) => {
            if (cb.data.message === 'success') {
              resolve(cb.data as IUserData);
            } else if (
              cb.data.message === 'bad_verific_code' &&
              cb.data.message === 'verific_code_expired' &&
              cb.data.message === 'verific_code_limit' &&
              cb.data.message === 'maximum_try_count'
            ) {
              reject(cb.data.message);
              console.log(cb.data.message);
            } else {
              reject(cb.data.message);
              console.log(cb.data.message);
            }
          })
          .catch((cb) => {
            reject(cb.response.data);
            console.log(cb.response.data);
          });
      }
    );
  }
}
