import { post } from '../post';
import { get } from '../get';

//发动态
export function postDynamic(info) {
    const result = post('/privateApi/dynamic/post',info);
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

//获得某个用户的动态页数据
export function getPersonalDynamic(selfId,curId) {
    const result = get('/api/dynamic/personal?selfId='+selfId+'&curId='+curId);
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

//获得关注的人的最新动态
export function getLatestDynamic(id) {
    const result = get('/privateApi/dynamic/latest?id='+id);
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
            if(json.code===0 && json.data){
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

//点赞或取消点赞
export function toggleLike(data) {
    const result = post('/privateApi/dynamic/toggleLike',data);
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

//获得动态详情
export function getDynamicDetail(id) {
    const result = get('/api/dynamic/detail?id='+id);
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

//发送评论
export function sendComment(data) {
    const result = post('/privateApi/dynamic/sendComment',data);
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
                reject('发送失败');
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}

//删除动态
export function deleteDynamic(data){
    const result = post('/privateApi/dynamic/deleteDynamic',data);
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
                reject();
            }
        })
        .catch((e)=>{
            reject(e.toString());
        })
    });
}