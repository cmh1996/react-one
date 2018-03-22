import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getMatchSituation,getMatchLineup,getMatchAnalysis,getMatchHighlights} from '../../../../fetch/soccer/matchData';
import {getClientSize} from '../../../../util/util';

import MatchSituation from './subpage/MatchSituation';
import MatchLineup from './subpage/MatchLineup';
import MatchAnalysis from './subpage/MatchAnalysis';
import MatchHighlights from './subpage/MatchHighlights';

import TagHeader from '../../../../components/TagHeader';
import SubHeader from '../../../../components/SubHeader';

import styles from './style.less';

@inject('stateStore')
@observer class MatchData extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            baseInfo:{},
            matchTime:'',
            situationInfo:{},
            lineupInfo:{},
            analysisInfo:{},
            highlightsInfo:{},
            situationHasLoaded:false,
            lineupHasLoaded:false,
            analysisHasLoaded:false,
            highlightsHasLoaded:false,
        };
        this.clientHeight = getClientSize().height+'px';
    }

    componentDidMount(){
        this.switchMatchDataType(0);
    }   

    switchMatchDataType(index){
        this.props.stateStore.setLoading(true);
        document.documentElement.scrollTop = document.body.scrollTop =0;
        const matchid = this.props.match.params.matchid;
        this.setState({
            curIndex:index
        })

        let res;
        //赛况
        if(index===0){
            if(this.state.situationHasLoaded){
                this.props.stateStore.setLoading(false);
                return;
            }
            res = getMatchSituation(matchid);
            res
            .then((json)=>{
                this.setState({
                    baseInfo:json.match,
                    matchTime:json.show_time_day+' '+json.show_time_min,
                    situationInfo:json.info,
                    situationHasLoaded:true
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','获取赛况详情出错，请刷新重试');
            })
        }
        //阵容
        else if(index===1){
            if(this.state.lineupHasLoaded){
                this.props.stateStore.setLoading(false);
                return;
            }
            res = getMatchLineup(matchid);
            res
            .then((json)=>{
                if(json.info instanceof Array || json.info==null){
                    this.setState({
                        lineupInfo:{},
                        lineupHasLoaded:true
                    },()=>{
                        this.props.stateStore.setLoading(false);
                    })
                }else{
                    this.setState({
                        lineupInfo:json,
                        lineupHasLoaded:true
                    },()=>{
                        this.props.stateStore.setLoading(false);
                    })
                }
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','获取比赛阵容出错，请刷新重试');
            })
        }
        //分析
        else if(index===2){
            if(this.state.analysisHasLoaded){
                this.props.stateStore.setLoading(false);
                return;
            }
            res = getMatchAnalysis(matchid);
            res
            .then((json)=>{
                this.setState({
                    analysisInfo:json.info,
                    analysisHasLoaded:true
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','获取比赛分析出错，请刷新重试');
            })
        }
        //集锦
        else if(index===3){
            if(this.state.highlightsHasLoaded){
                this.props.stateStore.setLoading(false);
                return;
            }
            res = getMatchHighlights(matchid);
            res
            .then((json)=>{
                if(json.info.status==='Fixture'){
                    this.setState({
                        lineupInfo:{},
                        highlightsHasLoaded:true
                    },()=>{
                        this.props.stateStore.setLoading(false);
                    })
                }else{
                    this.setState({
                        highlightsInfo:json.info,
                        highlightsHasLoaded:true
                    },()=>{
                        this.props.stateStore.setLoading(false);
                    })
                }
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','获取比赛集锦出错，请刷新重试');
            })
        }
    }

    render(){
        return(
            <div className="matchDataPage" style={{minHeight:this.clientHeight}}>
                <div className="matchDataHeader">
                    <SubHeader title=" "/>
                    {
                        Object.keys(this.state.baseInfo).length!==0?
                        <div className="baseInfo">
                            <div className="teamBaseInfo">
                                <img src={this.state.baseInfo.team_A.logo} alt="球队logo"/>
                                <span>{this.state.baseInfo.team_A.name}</span>
                            </div>
                            <div className="matchBaseInfo">
                                <span>{this.state.matchTime+' '+this.state.baseInfo.competition.short_name}</span>
                                <span className="score">
                                    {
                                        this.state.baseInfo.team_A.score?
                                        this.state.baseInfo.team_A.score+'-'+this.state.baseInfo.team_B.score:'VS'
                                    }
                                </span>
                                <span>{this.state.baseInfo.status==='Played'?'已结束':this.state.baseInfo.status==='Fixture'?'未开始':'进行中'}</span>
                            </div>
                            <div className="teamBaseInfo">
                                <img src={this.state.baseInfo.team_B.logo} alt="球队logo"/>
                                <span>{this.state.baseInfo.team_B.name}</span>
                            </div>
                        </div>:''
                    }
                </div>
                <TagHeader
                    firstRenderItem={0}
                    items={[{title:'赛况'},
                            {title:'阵容'},
                            {title:'分析'},
                            {title:'集锦'}]}
                    selectHandle={this.switchMatchDataType.bind(this)}
                    selectedColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                {
                    this.state.curIndex===0?
                    <MatchSituation data={this.state.situationInfo}/>:
                    this.state.curIndex===1?
                    <MatchLineup data={this.state.lineupInfo}/>:
                    this.state.curIndex===2?
                    <MatchAnalysis data={this.state.analysisInfo}/>:
                    this.state.curIndex===3?
                    <MatchHighlights data={this.state.highlightsInfo}/>:''
                }
            </div>
        )
    }

}

export default MatchData;