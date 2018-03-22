import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import SmallTitleBar from '../../../../../../components/SmallTitleBar';

import './style.less';

class MatchAnalysis extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        return(
            <div className="matchAnalysisPage">
                {
                    Object.keys(this.props.data).length!==0?
                    <div className="matchAnalysis">
                        <section className="battleHistory">
                            <SmallTitleBar title="对赛往绩"/>
                            {
                                this.props.data.battle_history.list.length>0?
                                <div className="battle">
                                    <div className="battleCount">
                                        <span>{this.props.data.team_A}</span>
                                        <span>{'近'+this.props.data.battle_history.list.length+'场交锋纪录'}</span>
                                        <span>{this.props.data.team_B}</span>
                                    </div>
                                    <div className="battleBar">
                                       <div className="aWinBar" style={{width:this.props.data.battle_history.percent.win+'%'}}>{this.props.data.battle_history.team_A.win+'胜'}</div> 
                                       <div className="drawBar" style={{width:this.props.data.battle_history.percent.draw+'%'}}>{this.props.data.battle_history.team_A.draw+'平'}</div> 
                                       <div className="bWinBar" style={{width:this.props.data.battle_history.percent.lose+'%'}}>{this.props.data.battle_history.team_A.lose+'胜'}</div> 
                                    </div>
                                    <table className="battleMatches">
                                        <thead><tr><th>日期</th><th>赛事</th><th>主队</th><th>比分</th><th>客队</th></tr></thead>
                                        <tbody>
                                        {
                                            this.props.data.battle_history.list.map((item,index)=>{
                                                return(
                                                    <tr key={'battle'+index} className="battleMatch">
                                                        <td>{item.date}</td>
                                                        <td>{item.competition}</td>
                                                        <td>{item.team_A_name}</td>
                                                        <td className="battleScore" style={{backgroundColor:item.color==='win'?'#ea2726':item.color==='draw'?'#49c867':item.color==='lose'?'#1d9ff9':''}}>{item.score}</td>
                                                        <td>{item.team_B_name}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>:''
                            }
                        </section>
                        <section className="teamRanking">
                            <SmallTitleBar title="积分榜"/>
                            {
                                this.props.data.league_table?
                                <div className="teamRankingList">
                                    <div className="teamName">
                                        <img src={this.props.data.team_A_logo} alt="logo"/>
                                        <span>{this.props.data.team_A}</span>
                                    </div>
                                    <table className="teamRankingData">
                                        <thead><tr><th>全场</th><th>赛</th><th>胜</th><th>平</th><th>负</th><th>得</th><th>失</th><th>积分</th><th>排名</th><th>胜率</th></tr></thead>
                                        <tbody>
                                            <tr className="teamRankingDataItem">
                                                <td>{this.props.data.league_table.team_A.total.name}</td>
                                                <td>{this.props.data.league_table.team_A.total.matches_total}</td>
                                                <td>{this.props.data.league_table.team_A.total.matches_won}</td>
                                                <td>{this.props.data.league_table.team_A.total.matches_draw}</td>
                                                <td>{this.props.data.league_table.team_A.total.matches_lost}</td>
                                                <td>{this.props.data.league_table.team_A.total.goals_pro}</td>
                                                <td>{this.props.data.league_table.team_A.total.goals_against}</td>
                                                <td>{this.props.data.league_table.team_A.total.points}</td>
                                                <td>{this.props.data.league_table.team_A.total.rank}</td>
                                                <td>{this.props.data.league_table.team_A.total.win_rate}</td>
                                            </tr>
                                            <tr className="teamRankingDataItem">
                                                <td>{this.props.data.league_table.team_A.home.name}</td>
                                                <td>{this.props.data.league_table.team_A.home.matches_total}</td>
                                                <td>{this.props.data.league_table.team_A.home.matches_won}</td>
                                                <td>{this.props.data.league_table.team_A.home.matches_draw}</td>
                                                <td>{this.props.data.league_table.team_A.home.matches_lost}</td>
                                                <td>{this.props.data.league_table.team_A.home.goals_pro}</td>
                                                <td>{this.props.data.league_table.team_A.home.goals_against}</td>
                                                <td>{this.props.data.league_table.team_A.home.points}</td>
                                                <td>{this.props.data.league_table.team_A.home.rank}</td>
                                                <td>{this.props.data.league_table.team_A.home.win_rate}</td>
                                            </tr>
                                            <tr className="teamRankingDataItem">
                                                <td>{this.props.data.league_table.team_A.away.name}</td>
                                                <td>{this.props.data.league_table.team_A.away.matches_total}</td>
                                                <td>{this.props.data.league_table.team_A.away.matches_won}</td>
                                                <td>{this.props.data.league_table.team_A.away.matches_draw}</td>
                                                <td>{this.props.data.league_table.team_A.away.matches_lost}</td>
                                                <td>{this.props.data.league_table.team_A.away.goals_pro}</td>
                                                <td>{this.props.data.league_table.team_A.away.goals_against}</td>
                                                <td>{this.props.data.league_table.team_A.away.points}</td>
                                                <td>{this.props.data.league_table.team_A.away.rank}</td>
                                                <td>{this.props.data.league_table.team_A.away.win_rate}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="teamName">
                                        <img src={this.props.data.team_B_logo} alt="logo"/>
                                        <span>{this.props.data.team_B}</span>
                                    </div>
                                    <table className="teamRankingData">
                                        <thead><tr><th>全场</th><th>赛</th><th>胜</th><th>平</th><th>负</th><th>得</th><th>失</th><th>积分</th><th>排名</th><th>胜率</th></tr></thead>
                                        <tbody>
                                            <tr className="teamRankingDataItem">
                                                <td>{this.props.data.league_table.team_B.total.name}</td>
                                                <td>{this.props.data.league_table.team_B.total.matches_total}</td>
                                                <td>{this.props.data.league_table.team_B.total.matches_won}</td>
                                                <td>{this.props.data.league_table.team_B.total.matches_draw}</td>
                                                <td>{this.props.data.league_table.team_B.total.matches_lost}</td>
                                                <td>{this.props.data.league_table.team_B.total.goals_pro}</td>
                                                <td>{this.props.data.league_table.team_B.total.goals_against}</td>
                                                <td>{this.props.data.league_table.team_B.total.points}</td>
                                                <td>{this.props.data.league_table.team_B.total.rank}</td>
                                                <td>{this.props.data.league_table.team_B.total.win_rate}</td>
                                            </tr>
                                            <tr className="teamRankingDataItem">
                                                <td>{this.props.data.league_table.team_B.home.name}</td>
                                                <td>{this.props.data.league_table.team_B.home.matches_total}</td>
                                                <td>{this.props.data.league_table.team_B.home.matches_won}</td>
                                                <td>{this.props.data.league_table.team_B.home.matches_draw}</td>
                                                <td>{this.props.data.league_table.team_B.home.matches_lost}</td>
                                                <td>{this.props.data.league_table.team_B.home.goals_pro}</td>
                                                <td>{this.props.data.league_table.team_B.home.goals_against}</td>
                                                <td>{this.props.data.league_table.team_B.home.points}</td>
                                                <td>{this.props.data.league_table.team_B.home.rank}</td>
                                                <td>{this.props.data.league_table.team_B.home.win_rate}</td>
                                            </tr>
                                            <tr className="teamRankingDataItem">
                                                <td>{this.props.data.league_table.team_B.away.name}</td>
                                                <td>{this.props.data.league_table.team_B.away.matches_total}</td>
                                                <td>{this.props.data.league_table.team_B.away.matches_won}</td>
                                                <td>{this.props.data.league_table.team_B.away.matches_draw}</td>
                                                <td>{this.props.data.league_table.team_B.away.matches_lost}</td>
                                                <td>{this.props.data.league_table.team_B.away.goals_pro}</td>
                                                <td>{this.props.data.league_table.team_B.away.goals_against}</td>
                                                <td>{this.props.data.league_table.team_B.away.points}</td>
                                                <td>{this.props.data.league_table.team_B.away.rank}</td>
                                                <td>{this.props.data.league_table.team_B.away.win_rate}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>:''
                            }
                        </section>
                        <section className="recentRecord">
                            <SmallTitleBar title="近期战绩"/>
                            {
                                this.props.data.recent_record?
                                <div className="recentRecordContent">
                                    <div className="teamName">
                                        <img src={this.props.data.team_A_logo} alt="logo"/>
                                        <span>{this.props.data.team_A}</span>
                                    </div>
                                    <table className="battleMatches">
                                        <thead><tr><th>日期</th><th>赛事</th><th>主队</th><th>比分</th><th>客队</th></tr></thead>
                                        <tbody>
                                        {
                                            this.props.data.recent_record.team_A.map((item,index)=>{
                                                return(
                                                    <tr key={'recentA'+index} className="battleMatch">
                                                        <td>{item.date}</td>
                                                        <td>{item.competition}</td>
                                                        <td>{item.team_A_name}</td>
                                                        <td className="battleScore" style={{backgroundColor:item.color==='win'?'#ea2726':item.color==='draw'?'#49c867':item.color==='lose'?'#1d9ff9':''}}>{item.score}</td>
                                                        <td>{item.team_B_name}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                    <div className="teamName">
                                        <img src={this.props.data.team_B_logo} alt="logo"/>
                                        <span>{this.props.data.team_B}</span>
                                    </div>
                                    <table className="battleMatches">
                                        <thead><tr><th>日期</th><th>赛事</th><th>主队</th><th>比分</th><th>客队</th></tr></thead>
                                        <tbody>
                                        {
                                            this.props.data.recent_record.team_B.map((item,index)=>{
                                                return(
                                                    <tr key={'recentA'+index} className="battleMatch">
                                                        <td>{item.date}</td>
                                                        <td>{item.competition}</td>
                                                        <td>{item.team_A_name}</td>
                                                        <td className="battleScore" style={{backgroundColor:item.color==='win'?'#ea2726':item.color==='draw'?'#49c867':item.color==='lose'?'#1d9ff9':''}}>{item.score}</td>
                                                        <td>{item.team_B_name}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>:''
                            }
                        </section>
                    </div>
                    :<div className="noInfo">暂无分析信息</div>
                }
            </div>
        )
    }
}

export default MatchAnalysis;