import { post } from '../post';

//登录
export function login(info) {
    const result = post('/api/user/login',info);
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
                resolve(json.token);
            }else{
                reject(json.message);
            }
        })
    	.catch((e)=>{
    		reject(e.toString());
    	})
    });
}

//注册
export function signup(info) {
    const result = post('/api/user/signup',info);
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
            //成功注册
            if(json.code===0){
                resolve(json.token)
            }else{
                reject(json.message)
            }
        })
    	.catch((e)=>{
    		reject(e.toString());
    	})
    });
}