import { get } from '../get'; 

//音乐获取榜单首页汇总数据
export function getBillboard() {
    const res = get('/api/music/billboard');
    return new Promise((resolve,reject)=>{
    	res
		.then((res)=>{
			if(res.status===200){
	        	return res.json();
			}else{
				reject(res.status);
			}
	    })
	    .then((json)=>{
	    	resolve(json.data.topList);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//音乐获取榜单详情数据
export function getBillboardDetail(id=4) {
    const res = get('/api/music/billboard/detail?id='+id);
    return new Promise((resolve,reject)=>{
    	res
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
    })
}