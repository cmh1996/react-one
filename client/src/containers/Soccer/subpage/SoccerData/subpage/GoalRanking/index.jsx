import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class GoalRanking extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        return(
            <div className="goalRanking">
            {
                this.props.data?
                <table className="dataDetail">
                    <thead>
                        <tr>
                            <th>排名</th>
                            <th className="alignLeft">球员</th>
                            <th className="alignLeft">球队</th>
                            <th>进球</th>
                        </tr>
                    </thead>
                    <tbody>{
                        this.props.data.map((item,index)=>{
                            return(
                                <tr key={item.person_id}>
                                    <td>{index+1}</td>
                                    <td className="alignLeft">
                                        <img src={'http://img.dongqiudi.com/data/personpic/'+item.person_id+'.png'} alt="头像"/>
                                        {item.name}
                                    </td>
                                    <td className="alignLeft">{item.team_name}</td>
                                    <td>{item.count}</td>
                                </tr>
                            )
                        })
                    }</tbody>
                </table>
                :''
            }
            </div>
        )
    }
}

export default GoalRanking;