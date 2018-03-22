import {observable,action,useStrict,computed} from 'mobx';

useStrict(true);

export default class soccerStore{
	//各板块新闻资讯数据
	@observable headline=[];
	@observable hot=[];
	@observable deep=[];
	@observable England=[];
	@observable Spain=[];
	@observable Italy=[]; 
	@observable Germany=[];
	@observable China=[];

	//各赛事比赛数据
	@observable importantMatch={};
	@observable EnglandMatch={};
	@observable SpainMatch={};
	@observable ItalyMatch={};
	@observable GermanyMatch={};
	@observable ChinaMatch={};
	@observable EuropeMatch={};
	@observable FranceMatch={};

	//各赛事积分榜、射手榜、助攻榜、当前轮次、赛程数据
	@observable EnglandData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable SpainData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable ItalyData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable GermanyData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable ChinaData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable FranceData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable EuropeData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable EuropeSecondData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable AsiaData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};
	@observable EnglandSecondData={
		teamRanking:{},
		goalRanking:[],
		assistRanking:[],
		curRound:{
			stage:0,
			round:0,
			stageList:[],
			curStageIndex:0
		},
		schedule:[]
	};

	//当前的新闻类型、赛事、数据类型
	@observable curNewsType='headline';
	@observable curMatchType='important';
	@observable curDataType='England';

	//按顺序保存着每个类型新闻的loadmore次数
	@observable loadCount = [1,1,1,1,1,1,1,1];	

	//获取当前新闻类型、赛事、数据类型的index
	@computed get curNewsTypeIndex() {
		switch(this.curNewsType){
			case 'headline':
				return 0;
				break;
			case 'hot':
				return 1;
				break;
			case 'deep':
				return 2;
				break;
			case 'England':
				return 3;
				break;
			case 'Spain':
				return 4;
				break;
			case 'Italy':
				return 5;
				break;
			case 'Germany':
				return 6;
				break;
			case 'China':
				return 7;
				break;
			default:
				return 0;
		}
    }
    @computed get curMatchTypeIndex() {
		switch(this.curMatchType){
			case 'important':
				return 0;
				break;
			case 'England':
				return 1;
				break;
			case 'Spain':
				return 2;
				break;
			case 'Italy':
				return 3;
				break;
			case 'Germany':
				return 4;
				break;
			case 'China':
				return 5;
				break;
			case 'Europe':
				return 6;
				break;
			case 'France':
				return 7;
				break;
			default:
				return 0;
		}
    }
    @computed get curDataTypeIndex() {
		switch(this.curDataType){
			case 'England':
				return 0;
				break;
			case 'Spain':
				return 1;
				break;
			case 'Italy':
				return 2;
				break;
			case 'Germany':
				return 3;
				break;
			case 'China':
				return 4;
				break;
			case 'France':
				return 5;
				break;
			case 'Europe':
				return 6;
				break;
			case 'EuropeSecond':
				return 7;
				break;
			case 'Asia':
				return 8;
				break;
			case 'EnglandSecond':
				return 9;
				break;
			default:
				return 0;
		}
    }


	//保存当前新闻类型、赛事、数据类型
	@action setCurNewsType = (newsType)=>{
		this.curNewsType = newsType;
	}
	@action setCurMatchType = (matchType)=>{
		this.curMatchType = matchType;
	}
	@action setCurDataType = (dataType)=>{
		this.curDataType = dataType;
	}

	//设置每个类型新闻的loadmore次数，如果传入参数为true，那就归1，否则+1
	@action setLoadCount = (newsTypeIndex,clear=false)=>{
		if(clear){
			this.loadCount[newsTypeIndex] = 1;
		}else{
			this.loadCount[newsTypeIndex] += 1;
		}
	}

    //缓存新闻
	@action setNewsCache = (newsType,data,clear=false)=>{
		if(clear){
			this[newsType] = [].concat(...data);
		}else{
			this[newsType] = this[newsType].concat(...data);
		}
	}

	//缓存赛事
	@action saveMatchCache = (matchType,data)=>{
		this[matchType+'Match'] = data;
	}

	//缓存赛事数据
	@action saveDataCache = (matchType,dataType,data)=>{
		this[matchType+'Data'][dataType] = data;
	}
}