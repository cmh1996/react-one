import { get } from '../get'; 

//音乐获取专辑首页汇总数据
/*typeId:
{"id":"0","name":"全部"},
{"id":"1","name":"流行"},
{"id":"2","name":"古典"},
{"id":"3","name":"爵士"},
{"id":"36","name":"摇滚"},
{"id":"22","name":"电子"},
{"id":"27","name":"拉丁"},
{"id":"21","name":"轻音乐"},
{"id":"39","name":"世界音乐"},
{"id":"34","name":"嘻哈"},
{"id":"37","name":"原声"},
{"id":"19","name":"乡村"},
{"id":"20","name":"舞曲"},
{"id":"33","name":"R&B"},
{"id":"23","name":"民谣"},
{"id":"28","name":"金属"}
*/
export function getAlbum(typeId=0,pageNum=0) {
    const res = get('/api/music/album?typeId='+typeId+'&pageNum='+pageNum);
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
	    	resolve(json.data.albumlist);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//音乐获取专辑详情数据
export function getAlbumDetail(albumId) {
    const res = get('/api/music/album/detail?albumId='+albumId);
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