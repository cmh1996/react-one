import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getMatchesByType} from '../../../../fetch/soccer/match';

import TagHeader from '../../../../components/TagHeader';
import SmallTitleBar from '../../../../components/SmallTitleBar';

import styles from './style.less';

const matchType = ['important','England','Spain','Italy','Germany','China','Europe','France'];
@inject('stateStore','soccerStore')
@observer class Match extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            matchData:{},
        }
    }

    componentDidMount(){
        this.props.stateStore.setLoading(true);
        this.renderList();
    } 

    switchMatchType(index){
        this.props.stateStore.setLoading(true);
        this.props.soccerStore.setCurMatchType(matchType[index]);
        
        this.setState({
            matchData:{},
        })
        this.renderList();
    }

    //判断mobx中有没有缓存数据，有就直接上缓存，没有就fetch
    renderList(){
        const curMatchType = this.props.soccerStore.curMatchType;

        //如果已经在父组件取到了重要比赛的数据，那就直接渲染（因为在父组件已经取过一次）
        if(curMatchType==='important' && Object.keys(this.props.soccerStore.importantMatch).length>0){
            this.setState({
                matchData:this.props.soccerStore.importantMatch
            },()=>{
                this.props.stateStore.setLoading(false);
            });
        }
        //如果不是那种情况，那就发起请求去取
        else{
            //如果当前类型比赛列表为空，那就去fetch，然后保存到mobx中
            if(Object.keys(this.props.soccerStore[curMatchType+'Match']).length===0){
                const res = getMatchesByType(curMatchType);
                res.then((res)=>{
                    this.props.stateStore.setLoading(false);
                    this.props.soccerStore.saveMatchCache(curMatchType,res);
                    this.setState({
                        matchData:res,
                    },()=>{
                        //滚动到现在的比赛
                    })
                })
                .catch((e)=>{
                    this.props.stateStore.setLoading(false);
                    this.props.stateStore.setTips('fail','网络异常，请稍后再试');
                })
            }
            //如果mobx中该类型新闻已经有数据了，那就从里面取
            else{
                this.props.stateStore.setLoading(false);
                this.setState({
                    matchData:this.props.soccerStore[curMatchType+'Match']
                },()=>{
                    //滚动到现在的比赛
                })
            }
        }
    }

    navToMatchDetail(id){
        this.props.history.push('/soccer/matchData/'+id);
    }

    render(){
        let matchTimeList=[];
        for(let key of Object.keys(this.state.matchData)){
            matchTimeList.push(key);
        }
        return(
            <div className="matchPage">
                <TagHeader
                    firstRenderItem={this.props.soccerStore.curMatchTypeIndex}
                    items={[{title:'重要'},
                            {title:'英超'},
                            {title:'西甲'},
                            {title:'意甲'},
                            {title:'德甲'},
                            {title:'中超'},
                            {title:'欧冠'},
                            {title:'法甲'}]}
                    selectHandle={this.switchMatchType.bind(this)}
                    selectedColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                <ul className="matchList">
                    {
                        matchTimeList.map((item,index)=>{
                            return(
                                <div className="dayMatchList" key={index}>
                                    <SmallTitleBar title={item} align='center'/>
                                    {
                                        this.state.matchData[item].map((item,index)=>{
                                        return(
                                            <li className="matchItem" key={item.id} onClick={this.navToMatchDetail.bind(this,item.id)}>
                                                <div className="teamA">
                                                    <img src={item.team_A.logo}/>
                                                    <span className="teamName">{item.team_A.name}</span>
                                                </div> 
                                                <div className="matchContent">
                                                    <span className="matchType">{item.local_time+' '+item.competition.short_name}</span>
                                                    <span className="matchResult">
                                                        {
                                                            item.team_A.score?
                                                            item.team_A.score+'-'+item.team_B.score:'VS'
                                                        }
                                                    </span>
                                                    <span className="matchState">{item.status==='Played'?'已结束':item.status==='Fixture'?'直播信息待更新':'进行中'}</span>
                                                </div> 
                                                <div className="teamB">
                                                    <img src={item.team_B.logo}/>
                                                    <span className="teamName">{item.team_B.name}</span>
                                                </div> 
                                            </li>
                                        )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

}

export default Match;