import {observable,action,useStrict,computed} from 'mobx';

useStrict(true);

export default class newsStore{
	@observable hot=[];
	@observable society=[];
	@observable entertainment=[];
	@observable sports=[];
	@observable military=[];
	@observable technology=[];
	@observable economics=[];

	@observable curNewsType='hot';

	@observable loadCount = [1,1,1,1,1,1,1];	//按顺序保存着每个类型新闻的loadmore次数

	@computed get curNewsTypeIndex() {
		switch(this.curNewsType){
			case 'hot':
				return 0;
				break;
			case 'society':
				return 1;
				break;
			case 'entertainment':
				return 2;
				break;
			case 'sports':
				return 3;
				break;
			case 'military':
				return 4;
				break;
			case 'technology':
				return 5;
				break;
			case 'economics':
				return 6;
				break;
			default:
				return 0;
		}
    }

	@action setNewsCache = (newsType,data,clear=false)=>{
		if(clear){
			this[newsType] = [].concat(...data);
		}else{
			this[newsType] = this[newsType].concat(...data);
		}
	}

	@action setCurNewsType = (newsType)=>{
		this.curNewsType = newsType;
	}

	//设置每个类型新闻的loadmore次数，如果传入参数为true，那就归1，否则+1
	@action setLoadCount = (newsTypeIndex,clear=false)=>{
		if(clear){
			this.loadCount[newsTypeIndex] = 1;
		}else{
			this.loadCount[newsTypeIndex] += 1;
		}
	}
}