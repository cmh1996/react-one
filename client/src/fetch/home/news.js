import { get } from '../get'; 

export function getNewsByType(type,start,end) {
    const res = get('/api/news/?type='+type+'&start='+start+'&end='+end);
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
	        return json.result;
	    })
	    .then((result)=>{
	    	//遍历新闻数组，只要news类型的
	        const arr = result.filter((item)=>{
	            return item.ctype==='news';
	        });
	        //修改图片地址
	        const afterArr = arr.map((item,index)=>{
	        	if(!item.image || item.image.includes('http')){
	        		return item;
	        	}else{
	        		const imageId = item.image;
	        		item.image = 'http://i1.go2yd.com/image.php?url='+imageId+'&type=thumbnail_324x216';
	        		return item;
	        	}
	        })
	        resolve(afterArr);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}
