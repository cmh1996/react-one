import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';
import {Route,Switch} from 'react-router-dom';

import {getMatchesByType} from '../../fetch/soccer/match';

import SoccerNews from 'bundle-loader?lazy&name=app-[name]!./subpage/SoccerNews/SoccerNews';
import Match from 'bundle-loader?lazy&name=app-[name]!./subpage/Match/Match';
import SoccerData from 'bundle-loader?lazy&name=app-[name]!./subpage/SoccerData/SoccerData';
import MatchData from 'bundle-loader?lazy&name=app-[name]!./subpage/MatchData/MatchData';

const SoccerNewsWrapper = props => <Bundle load={SoccerNews}>{(SoccerNewsWrapper)=><SoccerNewsWrapper {...props} />}</Bundle>;
const MatchWrapper = props => <Bundle load={Match}>{(MatchWrapper)=><MatchWrapper {...props} />}</Bundle>;
const SoccerDataWrapper = props => <Bundle load={SoccerData}>{(SoccerDataWrapper)=><SoccerDataWrapper {...props} />}</Bundle>;
const MatchDataWrapper = props => <Bundle load={MatchData}>{(MatchDataWrapper)=><MatchDataWrapper {...props} />}</Bundle>;


import MainHeader from '../../components/MainHeader';
import Nav from '../../components/Nav';
import Bundle from '../../components/Bundle';

@inject('soccerStore','stateStore')
@observer class Soccer extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            items:this.props.stateStore.indexItems,
            ownItems:[
                {title:'新闻',route:'/soccer/news'},
                {title:'赛事',route:'/soccer/match'},
                {title:'数据',route:'/soccer/data'}
            ],            
            navZIndex:10,
            personalList:this.props.stateStore.personalItems,
        }
    }

    componentWillMount(){
        this.props.stateStore.setLoading(true);
        const match = getMatchesByType('important');
        match
        .then((res)=>{
            this.props.soccerStore.saveMatchCache('important',res);
            this.props.stateStore.setLoading(false);
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','暂时无法获得比赛数据');
        })
    }

    //personal显示时设置nav的zindex为0，消失时设为10
    showPersonalHandle(){
        this.setState({
            navZIndex:0
        })
    }
    hidePersonalHandle(){
        this.setState({
            navZIndex:10
        })
    }
    render(){
        const curPath = this.props.history.location.pathname;
        return(
            <div className="soccerPage">
            {
                curPath.indexOf('/soccer/matchData')>-1?
                <Switch>
                    <Route path="/soccer/matchData/:matchid" component={MatchDataWrapper}/>
                </Switch>
                :
                [<MainHeader
                    key='mainheader'
                    personalList={this.state.personalList}
                    showPersonalHandle={this.showPersonalHandle.bind(this)}
                    hidePersonalHandle={this.hidePersonalHandle.bind(this)}
                    items={this.state.ownItems}
                    temperature={this.props.stateStore.weather.temperature}
                    icon={this.props.stateStore.weather.weatherIcon}
                    bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />,
                <Switch key='switch'>
                    <Route path="/soccer/news" component={SoccerNewsWrapper}/>
                    <Route path="/soccer/match" component={MatchWrapper}/>
                    <Route path="/soccer/data" component={SoccerDataWrapper}/>
                </Switch>,
                <Nav zIndex={this.state.navZIndex} selected="足球" items={this.state.items} key='nav' selectColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>]
            }
            </div>
        )
    }
}

export default Soccer;