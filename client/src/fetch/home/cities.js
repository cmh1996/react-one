import { get } from '../get';
import { post } from '../post';

export function getCitiesData() {
    const result = get('/api/cities');
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
    		resolve(json);
    	})
    	.catch((e)=>{
    		reject(e.toString());
    	})
    });
}

export function setCity(data) {
    const result = post('/privateApi/user/setCity',data);
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
                resolve(json.city);
            }else{
                reject(json.message);
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}