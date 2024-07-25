import CryptoJS from "crypto-js";
import { LoginRegisterService } from '@/utils/api'

export const isTelephoneExists = async (telephone) =>{
   //发起axios请求
   const params = {
    "account": telephone
   }
   const res = await LoginRegisterService.isTelephoneExists(params)
   return res.data.data
}

export const aesMinEncrypt = (key, iv, word)=>{
    const _word = CryptoJS.enc.Utf8.parse(word),
        _key = CryptoJS.enc.Utf8.parse(key),
        _iv = CryptoJS.enc.Utf8.parse(iv)
    const encrypted = CryptoJS.AES.encrypt(
        _word, _key, 
        {
            iv: _iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
    return encrypted.toString()
}

export const getUser = ()=>{
    let tokenString = localStorage.getItem('msToken')
    if(tokenString==null) return null
    let user = JSON.parse(decodeURIComponent(escape(window.atob(tokenString.split('.')[1]))))
    //console.log(user)
    return user
}

export const transferNum= (num)=>{
    num = Number(num);
    return num>=10000?(num/10000).toFixed(2)+'w':num; 
}