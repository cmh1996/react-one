import jsonp from '../jsonp'; 
import base64 from 'base-64';
import utf8 from 'utf8'; 

//获取歌词
export function getSongLyric(id){
	return new Promise((resolve,reject)=>{
		jsonp('/api/music/lyric',{
	    	id:id,
	    },{param:'jsonpCallback',name:'MusicJsonCallback_lrc'})
	    .then((res)=>{
	    	if(res.code===0){
				const rawLyric = base64.decode(res.lyric);
	    		const bytes = utf8.decode(rawLyric);

	    		let lyricRawArr = bytes.split('\n');
	    		let lyricArr = [];
	    		lyricRawArr.map((item,index)=>{
	    			let time = item.substr(1,8);
	    			let text = item.substring(10);
	    			let obj = {
	    				time:time,
	    				text:text
	    			};
	    			lyricArr.push(obj)
	    		})
	    		//不是纯音乐
	    		if(lyricArr.length>5){
	    			lyricArr = lyricArr.splice(5)
	    		}
	        	resolve(lyricArr);
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
	})
}