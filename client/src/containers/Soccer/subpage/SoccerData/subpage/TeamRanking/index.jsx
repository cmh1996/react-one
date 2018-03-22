import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class TeamRanking extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        };
    }

    render(){
        return(
            <div className="teamRanking">
                {
                    this.props.data.rankings?
                    this.props.data.groups==='0'?
                    this.props.data.aggrCount==='0'?
                    <table className="dataDetail">
                        <thead>
                            <tr>
                                <th>排名</th>
                                <th className="alignLeft">球队</th>
                                <th>赛</th>
                                <th>胜</th>
                                <th>平</th>
                                <th>负</th>
                                <th>进/失</th>
                                <th>积分</th>
                            </tr>
                        </thead>
                        <tbody>{
                            this.props.data.rankings.map((item,index)=>{
                                return(
                                    <tr key={item.id}>
                                        <td>{item.rank}</td>
                                        <td className="alignLeft"><img src={'http://img.dongqiudi.com/data/pic/'+item.team_id+'.png'}/>{item.club_name}</td>
                                        <td>{item.matches_total}</td>
                                        <td>{item.matches_won}</td>
                                        <td>{item.matches_draw}</td>
                                        <td>{item.matches_lost}</td>
                                        <td>{item.goals_pro+'/'+item.goals_against}</td>
                                        <td>{item.points}</td>
                                    </tr>
                                )
                            })
                        }</tbody>
                    </table>
                    :
                    <table className="dataDetail">
                        <thead>
                            <tr className="groupsTitle"><td>{this.props.data.name}</td></tr>
                        </thead>
                        {
                            this.props.data.rankings.map((item,index)=>{
                                return(
                                    <tbody key={'rate'+index}>
                                          <tr>
                                              <td>总分</td>
                                              <td>{item[0].team_A_name}<img src={'http://img.dongqiudi.com/data/pic/'+item[0].team_A_id+'.png'}/></td>
                                              {
                                                item[0].fs_A?
                                                <td>{item[0].fs_A+':'+item[0].fs_B}</td>
                                                :
                                                <td>VS</td>
                                              }
                                              <td><img src={'http://img.dongqiudi.com/data/pic/'+item[0].team_B_id+'.png'}/>{item[0].team_B_name}</td>
                                          </tr>
                                          <tr>
                                              <td>{item[1].date_utc}</td>
                                              <td>{item[1].team_A_name}<img src={'http://img.dongqiudi.com/data/pic/'+item[1].team_A_id+'.png'}/></td>
                                              {
                                                item[1].fs_A?
                                                <td>{item[1].fs_A+':'+item[1].fs_B}</td>
                                                :
                                                <td>VS</td>
                                              }
                                              <td><img src={'http://img.dongqiudi.com/data/pic/'+item[1].team_B_id+'.png'}/>{item[1].team_B_name}</td>
                                          </tr>
                                          <tr>
                                              <td>{item[2].date_utc}</td>
                                              <td>{item[2].team_A_name}<img src={'http://img.dongqiudi.com/data/pic/'+item[2].team_A_id+'.png'}/></td>
                                              {
                                                item[2].fs_A?
                                                <td>{item[2].fs_A+':'+item[2].fs_B}</td>
                                                :
                                                <td>VS</td>
                                              }
                                              <td><img src={'http://img.dongqiudi.com/data/pic/'+item[2].team_B_id+'.png'}/>{item[2].team_B_name}</td>
                                          </tr>
                                          <tr></tr>
                                    </tbody>
                                )
                            })
                        }
                    </table>
                    :
                    <table className="dataDetail">{
                        this.props.data.rankings.map((item,index)=>{
                            return[
                                <thead key={'head'+item.group_id}>
                                    <tr className="groupsTitle">
                                        <td>{item.name}</td>
                                    </tr>
                                    <tr>
                                        <th>排名</th>
                                        <th className="alignLeft">球队</th>
                                        <th>赛</th>
                                        <th>胜</th>
                                        <th>平</th>
                                        <th>负</th>
                                        <th>进/失</th>
                                        <th>积分</th>
                                    </tr>
                                </thead>,
                                <tbody key={'body'+item.group_id}>{
                                    item.rank_list.map((item,index)=>{
                                        return(
                                            <tr key={item.id}>
                                                <td>{item.rank}</td>
                                                <td className="alignLeft"><img src={'http://img.dongqiudi.com/data/pic/'+item.team_id+'.png'}/>{item.club_name}</td>
                                                <td>{item.matches_total}</td>
                                                <td>{item.matches_won}</td>
                                                <td>{item.matches_draw}</td>
                                                <td>{item.matches_lost}</td>
                                                <td>{item.goals_pro+'/'+item.goals_against}</td>
                                                <td>{item.points}</td>
                                            </tr>
                                        )
                                    })
                                }</tbody>
                            ]
                        })
                    }</table>
                    :''
                }
            </div>
        )
    }
}

export default TeamRanking;