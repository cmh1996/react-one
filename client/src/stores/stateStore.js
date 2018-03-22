import {observable,action,useStrict} from 'mobx';
import {getLocalItem,setLocalItem} from '../util/util';
import jwt from 'jsonwebtoken';

const rawToken = getLocalItem('token');
const token = rawToken?jwt.verify(rawToken,'chambers'):'';

useStrict(true);

export default class stateStore{
	@observable isLoading=true;

	@observable tips={
		tipsType:'',
        tipsContent:'', 
        tipsSuccessTop:'',
        tipsShowCount:0,
	};

	@observable indexItems = [
        {title:"首页",iconName:"icon-homepage_fill",route:"/home"},
        {title:"微博",iconName:"icon-sina",route:"/weibo"},
        {title:"音乐",iconName:"icon-music1",route:"/music"},
        {title:"足球",iconName:"icon-soccer",route:"/soccer"},
    ];


    @observable personalItems = [
        {title:'个人资料',icon:'icon-people_fill',route:'/personal/data'},
        {title:'好友列表',icon:'icon-businesscard_fill',route:'/personal/friends/'+token},
        {title:'添加好友',icon:'icon-search',route:'/personal/addFriends'},
        {title:'消息列表',icon:'icon-message_fill',route:'/personal/messages'},
        {title:'我的日程',icon:'icon-icon_qifeishijian_normal',route:'/personal/timetable'},
        {title:'音乐盒',icon:'icon-music',route:'/music/player'},
        {title:'更换皮肤',icon:'icon-fenlei',route:'/personal/skin'},
    ];

    @observable themeColor = [
        //深蓝夜空
        {
            mainColor:'#144459',
            shallowColor:'#2a8e9d'
        },
    	//紫霞
    	{
    		mainColor:'#2f334d',
    		shallowColor:'#655c71'
    	},
        //秋漠
        {
            mainColor:'#2e1c2a',
            shallowColor:'#7c5038'
        },
        //绿
        {
            mainColor:'#023838',
            shallowColor:'#519581'
        },
        //星空
        {
            mainColor:'#132a38',
            shallowColor:'#344a52'
        },
    ];

    @observable curThemeIndex = getLocalItem('curThemeIndex')?getLocalItem('curThemeIndex'):0;

	@observable weather={
		temperature:0,
        weatherIcon:'',
        pm25:'',
        quality:'',
        type:'',
        lowTem:'',
        highTem:'',
        wind:'',
        dayData:[],
	};

	@observable scrollTop = {
		WeiboHot:0,
	}

	@action setTheme = (index)=>{
		this.curThemeIndex = index;
        setLocalItem('curThemeIndex',index);
	}

	//page是该组件的名字
	@action setScrollTop = (page,scrollTop)=>{
		this.scrollTop[page] = Number(scrollTop)
	}

	@action setTips = (type,content,top='4rem')=>{
		this.tips={
			tipsType:type,
			tipsContent:content,
			tipsSuccessTop:top,
			tipsShowCount:++this.tips.tipsShowCount,
		}
	}

	@action setLoading = (loadingState)=>{
		this.isLoading = loadingState;
	}

	@action setWeather = (newWeather)=>{
		this.weather = Object.assign({},this.weather,newWeather);
	}
}