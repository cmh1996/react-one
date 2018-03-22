import { get } from '../get'; 

//足球新闻（page要小于等于13）
export function getSoccerNewsByType(type,page) {
    const res = get('/api/soccerNews/?type='+type+'&page='+page);
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
	    	const articles = json.list.articles;
	    	if(articles.length>0){
	        	resolve(articles);
	    	}else{
	    		reject('暂时没有新数据')
	    	}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}
