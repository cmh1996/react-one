import jsonp from '../jsonp'; 
import {get} from '../get'; 
import {post} from '../post'; 

//获得已收藏歌单
export function getCollectedSonglist(userId) {
	const res = get('/privateApi/music/collectedSonglist?userId='+userId);
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


//判断歌单是否已经收藏
export function judgeHasCollected(userId,songlistId) {
	const res = get('/privateApi/music/judgeSonglist?userId='+userId+'&songlistId='+songlistId);
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

//切换收藏
export function toggleCollect(data) {
    const result = post('/privateApi/music/toggleCollect',data);
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

/*全部：10000000*//*流行：11*//*粤语：166*//*韩语168*//*轻音乐15*//*爵士：21*//*学习：101*//*治愈:116*//*安静:122*//*睡前：78*//*中国风145*/
//获取歌单汇总
export function getSongList(id=10000000,start=0,end=20){
	return new Promise((resolve,reject)=>{
		jsonp('/api/music/songList',{
	    	id:id,
	    	start:start,
	    	end:end
	    },{param:'jsonpCallback',name:'getPlaylist'})
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

//获取歌单详情
export function getSongListDetail(id){
	return new Promise((resolve,reject)=>{
		jsonp('/api/music/songList/detail',{
	    	id:id,
	    },{param:'jsonpCallback',name:'playlistinfoCallback'})
	    .then((res)=>{
	    	if(res.code===0){
	        	resolve(res.cdlist[0]);
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
	})
}