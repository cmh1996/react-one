import { get } from '../get';
import { post } from '../post';

export function getUserData(id) {
    const result = get('/api/user/data?id='+id);
    return new Promise((resolve,reject)=>{
    	result
    	.then((res)=>{
    		if(res.status===200){
	        	return res.json();
			}else{
				reject(res.status);
			}
    	})
    	.then((json)=>{
    		if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
    	})
    	.catch((e)=>{
    		reject(e.toString());
    	})
    });
}

export function setNickname(data) {
    const result = post('/privateApi/user/setNickname',data);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.nickname);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function setSex(data) {
    const result = post('/privateApi/user/setSex',data);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.sex);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function setHeadimg(data) {
    const result = post('/privateApi/user/setHeadimg',data);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.headimg);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function setPwd(data) {
    const result = post('/privateApi/user/setPwd',data);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve();
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function searchUser(keyWord) {
    const result = get('/api/user/search?keyWord='+keyWord);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function getFollow(id) {
    const result = get('/api/user/follow?id='+id);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function getFans(id) {
    const result = get('/api/user/fans?id='+id);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function followUser(data) {
    const result = post('/privateApi/user/followUser',data);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.message);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function cancelFollowUser(data) {
    const result = post('/privateApi/user/cancelFollowUser',data);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.message);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}


export function getLetter(id) {
    const result = get('/privateApi/user/letters?id='+id);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function getComment(id) {
    const result = get('/privateApi/user/comments?id='+id);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function getLike(id) {
    const result = get('/privateApi/user/likes?id='+id);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

export function getChatLog(mainId,otherId) {
    const result = get('/privateApi/user/chatLog?mainId='+mainId+'&otherId='+otherId);
    return new Promise((resolve,reject)=>{
        result
        .then((res)=>{
            if(res.status===200){
                return res.json();
            }else{
                reject(res.status);
            }
        })
        .then((json)=>{
            if(json.code===0){
                resolve(json.data);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}
