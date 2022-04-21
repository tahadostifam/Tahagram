/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios'
import configs from '~/configs/configs'

axios.defaults.withCredentials = true

export default class UsersHttp {
  SigninAction(email) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${configs.http_url}/users/signin`, {
          email,
        })
        .then((cb) => {
          if (cb.status === 200 && cb.data.message === 'verific email sent') {
            resolve({ message: 'success' })
          } else {
            reject(cb.data)
            console.error(cb.data)
          }
        })
        .catch((cb) => {
          reject(cb.response.data)
          console.error(cb.response.data)
        })
    })
  }

  SubmitValidateCodeForm(email, verificCode) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${configs.http_url}/users/signin_with_code`, {
          email,
          verific_code: verificCode,
        },)
        .then((cb) => {
          console.log(cb);
          if (cb.data.message === 'success') {
            console.log(cb);
            // const dataToCallback = {
            // }
            // resolve(dataToCallback);
            resolve(cb);
          } else if (
            cb.data.message === 'verific code is not valid' &&
            cb.data.message === 'verific code expired' &&
            cb.data.message === 'verific_code_limit' &&
            cb.data.message === 'maximum verific code try count'
          ) {
            reject({ message: cb.data.message })
            console.error(cb.data.message)
          } else {
            reject({ message: cb.data.message })
            console.error(cb.data.message)
          }
        })
        .catch((cb) => {
          console.log(cb);
          reject(cb.response.data)
          console.error(cb.response.data)
        })
    })
  }
}
