import { get } from '../get'; 
import jsonp from '../jsonp';

//音乐获取mv榜单数据
/*全部all，内地mainland,港台hktw,欧美euus，韩国kr，日本jp*/
export function getMVRanking(type='all') {
	return new Promise((resolve,reject)=>{
		jsonp('/api/music/mv/ranking',{
	    	type:type
	    },{param:'jsonpCallback',name:'MusicJsonCallback'})
	    .then((res)=>{
	    	if(res.code===0){
	        	resolve(res.data.list);
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
	})
}

//音乐获取mv今日看点数据
export function getMVNews() {
    const res = get('/api/music/mv/news');
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
	    	resolve(json.getlist.data.feeds);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//音乐获取mv各类型数据
/*
id是mv类型：0全部、3影视原声，9舞蹈，13演唱会,14颁奖礼，40创意，41搞笑，50剧情，51清新，52民族风，53演奏,16动漫
type是1最新或2最热，
pageno是页码数
*/
export function getMVByType(id=0,type=1,pageno=0) {
    const res = get('/api/music/mv/type?id='+id+'&type='+type+'&pageno='+pageno);
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

//获取mv详情
export function getMVDetail(id){
    const res = get('/api/music/mv/detail?id='+id);
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
