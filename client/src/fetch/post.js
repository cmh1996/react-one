import 'whatwg-fetch'
import 'es6-promise'
import {getLocalItem} from '../util/util';

// 将对象拼接成 key1=val1&key2=val2&key3=val3 的字符串形式
function obj2params(obj) {
    var result = '';
    var item;
    for (item in obj) {
        result += '&' + item + '=' + encodeURIComponent(obj[item]);
    }

    if (result) {
        result = result.slice(1);
    }

    return result;
}

// 发送 post 请求
export function post(url, paramsObj) {
    let trueUrl;
    if (__DEV__) {
        trueUrl = url;
    }else{
        trueUrl = 'http://localhost:3000'+url;
    }
    var result = fetch(trueUrl, {
        method: 'POST',
        //credentials: 'include',
        headers: {
            //'Origin':'http://localhost:8080',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':getLocalItem('token')?'Bearer '+getLocalItem('token'):''
        },
        body: obj2params(paramsObj)
    });
    return result;
}
