import { get } from '../get'; 

//足球比赛赛况数据
export function getMatchSituation(matchid) {
    const res = get('/api/soccerMatchData/situation/?matchid='+matchid);
    return new Promise((resolve,reject)=>{
    	res
		.then((res)=>{
			if(res.status===200){
	        	resolve(res.json());
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//足球比赛阵容数据
export function getMatchLineup(matchid) {
    const res = get('/api/soccerMatchData/lineup/?matchid='+matchid);
    return new Promise((resolve,reject)=>{
    	res
		.then((res)=>{
			if(res.status===200){
	        	resolve(res.json());
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//足球比赛分析数据
export function getMatchAnalysis(matchid) {
    const res = get('/api/soccerMatchData/analysis/?matchid='+matchid);
    return new Promise((resolve,reject)=>{
    	res
		.then((res)=>{
			if(res.status===200){
	        	resolve(res.json());
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//足球比赛集锦数据
export function getMatchHighlights(matchid) {
    const res = get('/api/soccerMatchData/highlights/?matchid='+matchid);
    return new Promise((resolve,reject)=>{
    	res
		.then((res)=>{
			if(res.status===200){
	        	resolve(res.json());
			}else{
				reject(res.status);
			}
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}