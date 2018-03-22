import { get } from '../get'; 
import jsonp from '../jsonp';

//音乐获取热搜词数据
export function getHotKey() {
    const res = get('/api/music/search/hot');
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
	    	resolve(json.data.hotkey);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}


//音乐获取搜索单曲
export function getSearchSong(word,pageno=1) {
    const res = get('/api/music/search/song?word='+word+'&pageno='+pageno);
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

//音乐获取搜索专辑
export function getSearchAlbum(word,pageno=1) {
    const res = get('/api/music/search/album?word='+word+'&pageno='+pageno);
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

//音乐获取搜索MV
export function getSearchMV(word,pageno=1) {
    const res = get('/api/music/search/mv?word='+word+'&pageno='+pageno);
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

//音乐获取搜索歌单
export function getSearchSonglist(word,pageno=1) {
	return new Promise((resolve,reject)=>{
		jsonp('/api/music/search/songlist',{
	    	word:word, 
	    	pageno:pageno
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

//音乐获取匹配词
export function getSearchMatchWords(word) {
    const res = get('/api/music/search/matchWords?word='+word);
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
	    	if(Object.keys(json.data).length===0){
	    		resolve({
	    			songList:[],
		    		albumList:[],
		    		mvList:[],
		    		singerList:[],
	    		});
	    	}else{
		    	let data = {
		    		songList:json.data.song.itemlist || [],
		    		albumList:json.data.album.itemlist || [],
		    		mvList:json.data.mv.itemlist || [],
		    		singerList:json.data.singer.itemlist || [],
		    	}
		    	resolve(data);
	    	}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}