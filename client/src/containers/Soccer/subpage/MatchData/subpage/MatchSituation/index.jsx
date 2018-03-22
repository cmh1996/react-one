import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {perRem} from '../../../../../../util/util';
import {withRouter} from 'react-router-dom';

import SmallTitleBar from '../../../../../../components/SmallTitleBar';
import NewsListItem from '../../../../../../components/NewsListItem';

import './style.less';

class MatchSituation extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidUpdate(){
        this.drawLine();
    }

    componentDidMount(){
        this.drawLine();
    }

    drawLine(){
        //设置中线长度
        if(this.refs.eventList){
            const lis = this.refs.eventList.childNodes;
            const lastLi = lis[lis.length-2];
            this.refs.midLine.style.height = lastLi.offsetTop+(3*perRem)+'px';
        }
    }

    navTo(id){
        const url = 'http://www.dongqiudi.com/share/article/'+id+'?id='+id+'&type=undefined&refer=m_website';
        const targetUrl = encodeURIComponent(url);
        this.props.history.push('/article/detail/'+targetUrl);
    }

    render(){
        //遍历事件对象，push到数组中
        let eventsList = [];
        if(Object.keys(this.props.data).length!==0){
            if(this.props.data.events){
                for(let key of Object.keys(this.props.data.events)){
                    eventsList.push(this.props.data.events[key]);
                }
            }
        }
        return(
            <div className="matchSituationPage">
                {
                    Object.keys(this.props.data).length!==0?
                    <div className="matchSituation">
                    {
                        this.props.data.events?
                        <div className="matchEvent">
                            <div className="teamInfo">
                                <div>{this.props.data.statistics.team_A.name}<img src={this.props.data.statistics.team_A.logo} alt="logo"/></div>
                                <div><img src={this.props.data.statistics.team_B.logo} alt="logo"/>{this.props.data.statistics.team_B.name}</div>
                            </div>
                            <ul className="eventList" ref="eventList">
                                <i className="iconfont icon-miaobiao topIcon"></i>
                                <span className="midLine" ref='midLine'></span>
                                {
                                    eventsList.map((item,index)=>{
                                        return(
                                            <li className="event clear" key={'events'+index}>
                                                <span className="eventTime">{item.minute}</span>
                                                {
                                                    item.teamAEvents.length>0?
                                                    <ul className="teamAContent">
                                                    {
                                                        item.teamAEvents.map((item,index)=>{
                                                            return(
                                                                <li className="eventItem" key={'teamA'+index}>
                                                                    {item.person}
                                                                    <img src={item.event_pic}/>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                    </ul>:''
                                                }
                                                {
                                                    item.teamBEvents.length>0?
                                                    <ul className="teamBContent">
                                                    {
                                                        item.teamBEvents.map((item,index)=>{
                                                            return(
                                                                <li className="eventItem" key={'teamB'+index}>
                                                                    <img src={item.event_pic}/>
                                                                    {item.person}
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                    </ul>:''
                                                }
                                            </li>
                                        )
                                    })
                                }
                                <i className="iconfont icon-shaozi bottomIcon"></i>
                            </ul>
                            <ul className="figureNode">
                                <li><img src="http://img.dongqiudi.com/soccer/data/logo/event/G.png"></img>进球</li>
                                <li><img src="http://img.dongqiudi.com/soccer/data/logo/event/PG.png"></img>点球</li>
                                <li><img src="http://img.dongqiudi.com/soccer/data/logo/event/PM.png"></img>点球未进</li>
                                <li><img src="http://img.dongqiudi.com/soccer/data/logo/event/OG.png"></img>乌龙球</li>
                                <li><img src="http://img.dongqiudi.com/soccer/data/logo/event/AS.png"></img>助攻</li>
                            </ul>
                        </div>:''
                    }
                    {
                        this.props.data.statistics?
                        <section className="statistics">
                            <SmallTitleBar title="技术统计"/>
                            <div className="teamInfo">
                                <div>{this.props.data.statistics.team_A.name}<img src={this.props.data.statistics.team_A.logo} alt="logo"/></div>
                                <div><img src={this.props.data.statistics.team_B.logo} alt="logo"/>{this.props.data.statistics.team_B.name}</div>
                            </div>
                            <ul className="statisticsInfo">
                            {
                                this.props.data.statistics.list.map((item,index)=>{
                                    return(
                                        <li key={'statistics'+index}>
                                            <span className="AVal">{item.team_A.value}</span>
                                            <div className="slot">
                                                <div 
                                                className={item.team_A.per>=item.team_B.per?'slotContent slotA win':'slotContent slotA lose'} 
                                                style={{width:item.team_A.per+'%'}}
                                                ></div>
                                            </div>
                                            <span className="midText">{item.type}</span>
                                            <div className="slot">
                                                <div 
                                                className={item.team_B.per>item.team_A.per?'slotContent slotB win':'slotContent slotB lose'} 
                                                style={{width:item.team_B.per+'%'}}>
                                                </div>
                                            </div>
                                            <span className="BVal">{item.team_B.value}</span>
                                        </li>
                                    )
                                })
                            }
                            </ul>
                        </section>:''
                    }
                    {
                        this.props.data.relateArticle?
                        <section className="relatedNews">
                             <SmallTitleBar title="相关新闻"/>
                             <ul className="relatedNewsList">
                                {
                                    this.props.data.relateArticle.map((item,index)=>{
                                        return(
                                            <NewsListItem
                                                liClickHandle={this.navTo.bind(this,item.id)}
                                                title={item.title}
                                                desc={item.description}
                                                tips1={'评论 '+item.commentsTotal}
                                                img={item.thumb}
                                                key={item.id}
                                            />
                                        )
                                    })
                                }
                             </ul>
                        </section>
                        :<div className="noInfo">暂无相关信息</div>
                    }
                    </div>
                    :
                    <div className="noInfo">暂无比赛信息</div>
                }
            </div>
        )
    }
}

export default withRouter(MatchSituation);