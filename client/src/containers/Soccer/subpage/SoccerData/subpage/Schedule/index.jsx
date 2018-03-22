import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';

class Schedule extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            curSelectList:[],
            firstRender:true
        }
    }

    componentWillReceiveProps(nextprops){
        if(this.props.selectData.length>0){
            if(this.state.firstRender || this.props.selectData[0].round_id!==nextprops.selectData[0].round_id){
                let list = [];
                let groupsIndex;
                let curGroupRound;
                let groupWholeRound;
                nextprops.selectData.map((item,index)=>{
                    if(item.gameweekTotalsNum==='0'){
                        list.push({stage:item.round_id,round:0})
                    }else{
                        groupsIndex = index;
                        curGroupRound = Number(item.activeNums);
                        groupWholeRound = Number(item.gameweekTotalsNum);
                        Array.from({length:groupWholeRound}).map((numItem,numIndex)=>{
                            list.push({stage:item.round_id,round:numIndex+1})
                        })
                    }
                });
                //如果是当前在小组赛的
                if(groupsIndex===nextprops.curIndex){
                    this.setState({
                        curSelectList:list,
                        curIndex:nextprops.curIndex+curGroupRound-1,
                        firstRender:false
                    },()=>{
                        this.optionsVal();
                    })
                }
                //已经过了小组赛的
                else if(groupsIndex<nextprops.curIndex){
                    this.setState({
                        curSelectList:list,
                        curIndex:nextprops.curIndex+groupWholeRound-1,
                        firstRender:false
                    },()=>{
                        this.optionsVal();
                    })
                }
                else{
                    this.setState({
                        curSelectList:list,
                        curIndex:nextprops.curIndex,
                        firstRender:false
                    },()=>{
                        this.optionsVal();
                    })
                }
            }
        }
    }

    //给options的value循环赋值，更改默认选中
    optionsVal(){
        const select = this.refs.select;
        const options = select.childNodes; 
        for(let i=0;i<options.length;i++){
            options[i].setAttribute('value',i);
        }
        this.refs.select.value = this.state.curIndex;
    }

    //通过上一轮下一轮来选择
    selectRound(direction){
        if(direction==='prev'){
            if(this.state.curIndex===0){
                return;
            }else{
                this.setState({
                    curIndex:--this.state.curIndex
                },()=>{
                    this.refs.select.value = this.state.curIndex;
                    this.props.selectRoundHandle(this.state.curSelectList[this.state.curIndex].stage,
                                             this.state.curSelectList[this.state.curIndex].round)
                })
            }
        }else if(direction==='next'){
            if(this.state.curIndex===this.state.curSelectList.length-1){
                return;
            }else{
                this.setState({
                    curIndex:++this.state.curIndex
                },()=>{
                    this.refs.select.value = this.state.curIndex;
                    this.props.selectRoundHandle(this.state.curSelectList[this.state.curIndex].stage,
                                             this.state.curSelectList[this.state.curIndex].round)
                })
            }
        }
    }

    //通过下拉选框选择
    selectRoundByOptions(e){
        const mySelectedIndex = e.target.selectedIndex;
        this.setState({
            curIndex:mySelectedIndex
        },()=>{
            this.props.selectRoundHandle(this.state.curSelectList[this.state.curIndex].stage,
                                     this.state.curSelectList[this.state.curIndex].round)
        });
    }

    navTo(id){
        this.props.history.push('/soccer/matchData/'+id)
    }

    render(){
        return(
            <div className="schedulePage">
                {
                    this.props.data?
                    <div>
                        <div className="selectStage">
                            <span onClick={this.selectRound.bind(this,'prev')}>上一轮</span>
                            <select onChange={this.selectRoundByOptions.bind(this)} ref="select">
                                {   
                                    this.props.selectData.length===1?
                                    Array.from({length:Number(this.props.selectData[0].gameweekTotalsNum)}).map((item,index)=>{
                                        return(
                                            <option key={'select'+index} stage={this.props.selectData[0].round_id} round={index+1}>
                                                {'第'+(index+1)+'轮'}
                                            </option>
                                        )
                                    })
                                    :
                                    this.props.selectData.map((item,index)=>{
                                        if(item.gameweekTotalsNum!=='0'){
                                            return(
                                                Array.from({length:Number(item.gameweekTotalsNum)}).map((numItem,numIndex)=>{
                                                    return(
                                                        <option key={'selects'+numIndex} stage={item.round_id} round={numIndex+1}>
                                                            {item.name+'第'+(numIndex+1)+'轮'}
                                                        </option>
                                                    )
                                                })
                                            )
                                        }else{
                                            return(
                                                <option key={'select'+index} stage={item.round_id} round='0'>
                                                    {item.name}
                                                </option>
                                            )
                                        }
                                    })
                                }
                            </select>
                            <span onClick={this.selectRound.bind(this,'next')}>下一轮</span>
                        </div>
                        <table className="dataDetail">
                            <tbody>{
                                this.props.data.map((item,index)=>{
                                    return(
                                        <tr key={item.match_id} onClick={this.navTo.bind(this,item.match_id)}>
                                            <td>{item.date_utc}</td>
                                            <td className="alignRight">{item.team_A_name}<img src={'http://img.dongqiudi.com/data/pic/'+item.team_A_id+'.png'}/></td>
                                            {
                                              item.fs_A?
                                              <td>{item.fs_A+':'+item.fs_B}</td>
                                              :
                                              <td>VS</td>
                                            }
                                            <td className="alignLeft"><img src={'http://img.dongqiudi.com/data/pic/'+item.team_B_id+'.png'}/>{item.team_B_name}</td>
                                        </tr>
                                    )
                                })
                            }</tbody>
                        </table>
                    </div>
                    :''
                }
            </div>
        )
    }
}

export default withRouter(Schedule);