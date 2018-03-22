import { get } from '../get'; 

//歌手汇总数据（华语：cn，韩国：k，日本：j，欧美：eu，男：man，女：woman，组合：team）
export function getSinger(nationality='all',sex='all') {
    const res = get('/api/music/singer?nationality='+nationality+'&sex='+sex);
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
	    	const list = json.data.list;

	    	//把其他字符换成‘#’
	    	const reg= /^[A-Z]$/;
	    	list.map((item,index)=>{
	    		if(!reg.test(item.Findex)){
	    			item.Findex = '#';
	    		}
	    	});

	    	//按字母排序
	    	list.sort((a,b)=>{
	    		const val1 = a.Findex;
	    		const val2 = b.Findex;
	    		if(val1=='#'){
	    			return 1;
	    		}
	    		if (val1 < val2) {
		            return -1;
		        } else if (val1 > val2) {
		            return 1;
		        } else {
		            return 0;
		        }
	    	})

	    	//字母数组
	    	let letterArr = [];
            list.map((item,index)=>{
                letterArr.push(item.Findex);
            })
            const letterSet = new Set(letterArr);
            letterArr = Array.from(letterSet);

            //每个字母的第一次出现位置的数组
            let positionList = [];
            letterArr.map((letterItem,index)=>{
            	let t = list.findIndex((listItem,index)=>{
	            	return listItem.Findex===letterItem
	            });
	            positionList.push(t);
            })

            const data = {
            	singerList:list,
            	letterList:letterArr,
            	positionList:positionList
            };
	    	resolve(data);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//歌手详情歌曲、资料
export function getSingerSong(id,start=0,num=5) {
    const res = get('/api/music/singer/song?id='+id+'&start='+start+'&num='+num);
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

//歌手详情专辑
export function getSingerAlbum(id,start=0,num=5) {
    const res = get('/api/music/singer/album?id='+id+'&start='+start+'&num='+num);
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
	    	resolve(json.data || {});
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//歌手详情mv
export function getSingerMV(id,start=0,num=5) {
    const res = get('/api/music/singer/mv?id='+id+'&start='+start+'&num='+num);
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
	    	resolve(json.data || {});
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}