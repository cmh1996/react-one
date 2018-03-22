import { post } from '../post';
import { get } from '../get';

//新建日程
export function addSchedule(data) {
    const result = post('/privateApi/schedule/post',data);
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

//删除日程
export function deleteSchedule(data) {
    const result = post('/privateApi/schedule/delete',data);
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

//获得某个用户的日程
export function getSchedule(id) {
    const result = get('/privateApi/schedule/getList?id='+id);
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

//切换完成与未完成
export function toggleDone(data) {
    const result = post('/privateApi/schedule/toggleDone',data);
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

//编辑日程
export function editSchedule(data) {
    const result = post('/privateApi/schedule/edit',data);
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