import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getCurRoundByType,getTeamRankingByType,getGoalRankingByType,getAssistRankingByType,getScheduleByType} from '../../../../fetch/soccer/data';

import TeamRanking from './subpage/TeamRanking';
import GoalRanking from './subpage/GoalRanking';
import AssistRanking from './subpage/AssistRanking';
import Schedule from './subpage/Schedule';

import TagHeader from '../../../../components/TagHeader';

import styles from './style.less';

@inject('stateStore','soccerStore')
@observer class SoccerData extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curRankTypeIndex:0,
            teamRankingData:{},
            goalRankingData:[],
            assistRankingData:[],
            scheduleData:[],
            matchStageList:[],
            curStageIndex:0
        };
        this.selectItem = [
            {
                name:'积分'
            },{
                name:'射手榜'
            },{
                name:'助攻榜'
            },{
                name:'赛程'
            }];
        this.dataChannel = ['England','Spain','Italy','Germany','China','France','Europe','EuropeSecond','Asia','EnglandSecond'];
    }

    componentDidMount(){
        this.renderTeamRanking();
    }   

    //切换赛事
    switchDataChannel(index){
        this.props.soccerStore.setCurDataType(this.dataChannel[index]);
        if(this.state.curRankTypeIndex===0){
            this.renderTeamRanking();
        }else if(this.state.curRankTypeIndex===1){
            this.renderGoalRanking();
        }else if(this.state.curRankTypeIndex===2){
            this.renderAssistRanking();
        }else if(this.state.curRankTypeIndex===3){
            this.renderSchedule();
        }
    }

    //切换排行类型
    selectRankType(e){
        const index = Number(e.target.getAttribute('index'));
        if(index===0){
            this.renderTeamRanking();
        }else if(index===1){
            this.renderGoalRanking();
        }else if(index===2){
            this.renderAssistRanking();
        }else if(index===3){
            this.renderSchedule();
        }
        this.setState({
            curRankTypeIndex:index
        })
    }

    //获取当前轮次
    getCurRound(){
        return new Promise((resolve,reject)=>{
            const curDataType = this.props.soccerStore.curDataType;
            if(this.props.soccerStore[curDataType+'Data'].curRound.stage===0){
                const res = getCurRoundByType(curDataType);
                res.then((res)=>{
                    this.props.soccerStore.saveDataCache(curDataType,'curRound',res);
                    this.setState({
                        matchStageList:res.stageList,
                        curStageIndex:res.curStageIndex
                    },()=>{
                        resolve();
                    })
                })
                .catch((e)=>{
                    this.props.stateStore.setTips('fail','当前轮次获取异常');
                    reject();
                })
            }
            //如果mobx中该类型新闻已经有数据了，那就从里面取
            else{
                this.setState({
                    matchStageList:this.props.soccerStore[curDataType+'Data'].curRound.stageList,
                    curStageIndex:this.props.soccerStore[curDataType+'Data'].curRound.curStageIndex
                },()=>{
                    resolve();
                })
            }
        })  
    }

    //获取积分榜数据
    renderTeamRanking(){
        this.props.stateStore.setLoading(true);
        const curDataType = this.props.soccerStore.curDataType;
        if(Object.keys(this.props.soccerStore[curDataType+'Data'].teamRanking).length===0){
            const res = getTeamRankingByType(curDataType);
            res.then((res)=>{
                this.props.soccerStore.saveDataCache(curDataType,'teamRanking',res);
                this.setState({
                    teamRankingData:res,
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络异常，请稍后再试');
            })
        }
        //如果mobx中该类型新闻已经有数据了，那就从里面取
        else{
            this.setState({
                teamRankingData:this.props.soccerStore[curDataType+'Data'].teamRanking
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        }
    }

    //获取射手榜数据
    renderGoalRanking(){
        this.props.stateStore.setLoading(true);
        const curDataType = this.props.soccerStore.curDataType;
        if(this.props.soccerStore[curDataType+'Data'].goalRanking.length===0){
            const res = getGoalRankingByType(curDataType);
            res.then((res)=>{
                this.props.soccerStore.saveDataCache(curDataType,'goalRanking',res);
                this.setState({
                    goalRankingData:res,
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络异常，请稍后再试');
            })
        }
        //如果mobx中该类型新闻已经有数据了，那就从里面取
        else{
            this.setState({
                goalRankingData:this.props.soccerStore[curDataType+'Data'].goalRanking
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        }
    }

    //获取助攻榜数据
    renderAssistRanking(){
        this.props.stateStore.setLoading(true);
        const curDataType = this.props.soccerStore.curDataType;
        if(this.props.soccerStore[curDataType+'Data'].assistRanking.length===0){
            const res = getAssistRankingByType(curDataType);
            res.then((res)=>{
                this.props.soccerStore.saveDataCache(curDataType,'assistRanking',res);
                this.setState({
                    assistRankingData:res,
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络异常，请稍后再试');
            })
        }
        //如果mobx中该类型新闻已经有数据了，那就从里面取
        else{
            this.setState({
                assistRankingData:this.props.soccerStore[curDataType+'Data'].assistRanking
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        }
    }

    //获取赛程数据
    renderSchedule(changedStage,changedRound){
        this.props.stateStore.setLoading(true);
        const curDataType = this.props.soccerStore.curDataType;

        //人为改变轮数的
        if(arguments.length>0){
            const res = getScheduleByType(changedStage,changedRound);
            res.then((res)=>{
                this.setState({
                    scheduleData:res,
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络异常，请稍后再试');
            })
        }
        //自动渲染当前轮次的
        else{
            this.getCurRound()
            .then(()=>{
                let stage = this.props.soccerStore[curDataType+'Data'].curRound.stage;
                let round = this.props.soccerStore[curDataType+'Data'].curRound.round;
                if(this.props.soccerStore[curDataType+'Data'].schedule.length===0){
                    const res = getScheduleByType(stage,round);
                    res.then((res)=>{
                        this.props.soccerStore.saveDataCache(curDataType,'schedule',res);
                        this.setState({
                            scheduleData:res,
                        },()=>{
                            this.props.stateStore.setLoading(false);
                        })
                    })
                    .catch((e)=>{
                        this.props.stateStore.setLoading(false);
                        this.props.stateStore.setTips('fail','网络异常，请稍后再试');
                    })
                }
                else{
                    this.setState({
                        scheduleData:this.props.soccerStore[curDataType+'Data'].schedule
                    },()=>{
                        this.props.stateStore.setLoading(false);
                    })
                }
            }) 
        }
    }

    render(){
        return(
            <div className="soccerDataPage">
                <TagHeader
                    firstRenderItem={this.props.soccerStore.curDataTypeIndex}
                    items={[{title:'英超'},
                            {title:'西甲'},
                            {title:'意甲'},
                            {title:'德甲'},
                            {title:'中超'},
                            {title:'法甲'},
                            {title:'欧冠'},
                            {title:'欧联'},
                            {title:'亚冠'},
                            {title:'英冠'}]}
                    selectHandle={this.switchDataChannel.bind(this)}
                    selectedColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                <ul className="rankSelectBox" onClick={this.selectRankType.bind(this)}>
                    {
                        this.selectItem.map((item,index)=>{
                            return(
                                <li 
                                    index={index}
                                    key={'select'+index}
                                    style={{
                                        backgroundColor: this.state.curRankTypeIndex===index?this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor:'white',
                                        color:this.state.curRankTypeIndex===index?'white':'#7d7d7d',
                                        borderColor: this.state.curRankTypeIndex===index?this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor:'#dddddd',
                                    }}
                                >
                                {item.name}
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="content">
                {
                    this.state.curRankTypeIndex===0?
                    <TeamRanking data={this.state.teamRankingData}/>:
                    this.state.curRankTypeIndex===1?
                    <GoalRanking data={this.state.goalRankingData}/>:
                    this.state.curRankTypeIndex===2?
                    <AssistRanking data={this.state.assistRankingData}/>:
                    this.state.curRankTypeIndex===3?
                    <Schedule 
                        data={this.state.scheduleData} 
                        selectData={this.state.matchStageList} 
                        curIndex={this.state.curStageIndex}
                        selectRoundHandle={this.renderSchedule.bind(this)}
                    />:''
                }
                </div>
            </div>
        )
    }

}

export default SoccerData;