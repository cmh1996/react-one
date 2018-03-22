import { get } from '../get'; 
import jsonp from '../jsonp'; 

//音乐获取首页推荐数据
export function getMusicRecommend() {
    const res = get('/api/music/recommend');
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
	    	resolve(json.data);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}


//音乐获取首页mv推荐数据
export function getMVRecommend() {
	return new Promise((resolve,reject)=>{
		jsonp('https://c.y.qq.com/v8/fcg-bin/getmv_by_tag',{
	    	g_tk:'534876682',
			hostUin:0,
			format:'jsonp',
			inCharset:'utf8',
			outCharset:'utf8',
			notice:0,
			platform:'yqq',
			needNewCode:0,
			cmd:'shoubo',
		  	lan:'all',
	    },{param:'jsonpCallback'})
	    .then((res)=>{
	    	if(res.code===0){
	        	resolve(res.data);
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
	})
}


//音乐获取新专辑推荐数据
export function getNewAlbum() {
    const res = get('/api/music/newAlbum');
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
	    	resolve(json.new_album.data);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}


//获取音乐头条新闻
export function getMusicNewsRecommend() {
	return new Promise((resolve,reject)=>{
		jsonp('http://3g.163.com/touch/reconstruct/article/list/BD2AC4LMwangning/0-10.html',{},{param:'callback',name:'artiList'})
	    .then((res)=>{
	    	resolve(res.BD2AC4LMwangning);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
	})
}

//获取音乐头条新闻
export function getMusicNews(start=0,end=10) {
	return new Promise((resolve,reject)=>{
		jsonp('http://3g.163.com/touch/reconstruct/article/list/BD2AC4LMwangning/'+start+'-'+end+'.html',{},{param:'callback',name:'artiList'})
	    .then((res)=>{
	    	resolve(res.BD2AC4LMwangning);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
	})
}


