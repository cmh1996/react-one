import originJSONP from 'jsonp'

export default function(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
    return new Promise((resolve, reject) => {
        let trueUrl;
        if (__DEV__) {
            trueUrl = url;
        }else{
            trueUrl = 'http://localhost:3000'+url;
        }
        originJSONP(trueUrl, option, (err, data) => {
            if (!err) {
                resolve(data);
            } else { 
                reject(err);
            }
        })
    })
}

// 拼接参数到url上
function param(data) {
    let url = '';
    for (let key in data) {
        let val = data[key] !== undefined ? data[key] : '';
        url += `&${key}=${encodeURIComponent(val)}`;
    }
    return url ? url.substring(1) : '';
}