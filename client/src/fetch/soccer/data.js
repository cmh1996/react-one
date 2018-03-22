import { get } from '../get'; 

//足球获取当前轮次数据
export function getCurRoundByType(type) {
    const res = get('/api/soccerData/curRound/?type='+type);
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
	    	let stage = json.activeRound;
	    	let curList = json.roundList.find((item)=>{
	    		return item.round_id===stage;
	    	})
	    	let round = curList.activeNums;
	    	let stageList=[];
	    	json.roundList.map((item,index)=>{
	    		stageList.push(item);
	    	});
	    	let curStageIndex = json.roundList.findIndex((item)=>{
	    		return item.round_id===stage;
	    	})
	    	let res = {
	    		stage:stage,
	    		round:round,
	    		stageList:stageList,
	    		curStageIndex:curStageIndex
	    	};
	    	resolve(res);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//足球积分榜数据
export function getTeamRankingByType(type) {
    const res = get('/api/soccerData/teamRanking/?type='+type);
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
	    	resolve(json[0]);
	    })
	    .catch((e)=>{
	    	reject(e.toString());
	    })
    })
}

//射手榜数据
export function getGoalRankingByType(type) {
    const res = get('/api/soccerData/goalRanking/?type='+type);
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

//助攻榜数据
export function getAssistRankingByType(type) {
    const res = get('/api/soccerData/assistRanking/?type='+type);
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

//赛程数据
export function getScheduleByType(stage,round) {
    const res = get('/api/soccerData/schedule/?stage='+stage+'&round='+round);
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