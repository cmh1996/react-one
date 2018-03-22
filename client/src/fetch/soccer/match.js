import { get } from '../get'; 

//足球比赛数据
export function getMatchesByType(type) {
	const now = new Date();
	const date = (now.getFullYear())+'-'+(now.getMonth()+1)+'-'+(now.getDate());
    const res = get('/api/soccerMatch/?type='+type+'&date='+date);
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
	    	resolve(json.matches);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}