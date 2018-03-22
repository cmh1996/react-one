import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,perRem} from '../../../../../../util/util';

import SmallTitleBar from '../../../../../../components/SmallTitleBar';
import LineupMember from '../../../../../../components/LineupMember';

import './style.less';

class MatchLineup extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.clientSize = getClientSize();
        this.PositionY = new Map([
                            ['GK','1%'],
                            ['D1','8.5%'],
                            ['D2','17%'],
                            ['DM','18%'],
                            ['M','27%'],
                            ['AM','34%'],
                            ['A','42%']
                        ]);
        this.PositionX = new Map([
                            ['R','0'],
                            ['CR','20%'],
                            ['C','36.5%'],
                            ['CL','53%'],
                            ['L','73%']
                        ]);
    }

    componentDidMount(){
        this.drawLineup();
    }

    componentDidUpdate(){
        this.drawLineup();
    }

    //正选阵容图
    drawLineup(){
        //一个半场分为纵向7层，横向分为5层
        if(this.refs.lineupCanvas){
            const canvas = this.refs.lineupCanvas;
            const ctx = canvas.getContext('2d');
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const innerGap = canvasWidth/28;

            //画背景
            ctx.beginPath();
            ctx.fillStyle = '#54c06f';
            ctx.fillRect(0,0,canvasWidth,canvasHeight);
            ctx.closePath();

            //重新定义原点到innerRect
            ctx.translate(innerGap,innerGap);
            const innerWidth = canvasWidth-2*innerGap;
            const innerHeight = canvasHeight-2*innerGap;

            //设置正选成员容器
            this.refs.mainMembers.style.width = innerWidth+'px';
            this.refs.mainMembers.style.height = innerHeight+'px';
            this.refs.mainMembers.style.top = ((1.2*perRem)+innerGap)+'px';
            this.refs.mainMembers.style.left = innerGap+'px';

            //画球场线
            //外沿线
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(innerWidth,0);
            ctx.lineTo(innerWidth,innerHeight);
            ctx.lineTo(0,innerHeight);
            ctx.lineTo(0,0);
            ctx.stroke();
            ctx.closePath();
            //中场线
            ctx.beginPath();
            ctx.moveTo(0,innerHeight/2);
            ctx.lineTo(innerWidth,innerHeight/2);
            ctx.stroke();
            ctx.closePath();
            //龙门线1
            ctx.beginPath();
            ctx.moveTo(innerWidth/4,0);
            ctx.lineTo(innerWidth/4,innerHeight/7);
            ctx.lineTo((3*innerWidth)/4,innerHeight/7);
            ctx.lineTo((3*innerWidth)/4,0);
            ctx.stroke();
            ctx.closePath();
            //龙门线2
            ctx.beginPath();
            ctx.moveTo(innerWidth/4,innerHeight);
            ctx.lineTo(innerWidth/4,(6*innerHeight)/7);
            ctx.lineTo((3*innerWidth)/4,(6*innerHeight)/7);
            ctx.lineTo((3*innerWidth)/4,innerHeight);
            ctx.stroke();
            ctx.closePath();
            //中圈
            ctx.beginPath();
            ctx.arc(innerWidth/2,innerHeight/2,innerWidth/6,0,2*Math.PI);
            ctx.stroke();
            ctx.closePath();

        }
        
    }

    render(){
        let AMembers = [];
        let BMembers = [];
        //正选阵容数据
        if(Object.keys(this.props.data).length!==0){
            if(this.props.data.info.lineup[0].team_A.position_x){
                this.props.data.info.lineup.map((item,index)=>{
                    let AMember = {
                        top:this.PositionY.get(item.team_A.position_x),
                        left:this.PositionX.get(item.team_A.position_y),
                        right:'auto',
                        bottom:'auto',
                        color:'#f99c35',
                        num:item.team_A.shirtnumber,
                        text:item.team_A.person
                    };
                    let BMember = {
                        right:this.PositionX.get(item.team_B.position_y),
                        bottom:this.PositionY.get(item.team_B.position_x),
                        top:'auto',
                        left:'auto',
                        color:'#14446A',
                        num:item.team_B.shirtnumber,
                        text:item.team_B.person
                    };
                    AMembers.push(AMember);
                    BMembers.push(BMember);
                })
            }
        }
        return(
            <div className="matchLineupPage">
                {
                    Object.keys(this.props.data).length!==0?
                    <div className="MatchLineup">
                        <div className="mainLineup">
                            <SmallTitleBar title="正选阵容"/>
                            {
                                this.props.data.info.lineup[0].team_A.position_x?
                                [
                                    <canvas key="lineupCanvas" id="lineupCanvas" ref="lineupCanvas" width={this.clientSize.width+'px'} height={(28*perRem)+'px'}/>,
                                    <div key="mainMembers" className="mainMembers" ref="mainMembers">
                                        {
                                            AMembers.map((item,index)=>{
                                                return(
                                                    <LineupMember
                                                        key={'mainA'+index}
                                                        right={item.right}
                                                        bottom={item.bottom}
                                                        left={item.left}
                                                        top={item.top}
                                                        color={item.color}
                                                        num={item.num}
                                                        text={item.text}
                                                    />
                                                )
                                            })
                                        }
                                        {
                                            BMembers.map((item,index)=>{
                                                return(
                                                    <LineupMember
                                                        key={'mainB'+index}
                                                        right={item.right}
                                                        bottom={item.bottom}
                                                        left={item.left}
                                                        top={item.top}
                                                        color={item.color}
                                                        num={item.num}
                                                        text={item.text}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                ]
                                :
                                <ul className="mainNames">
                                    <li>
                                        <div className="subMember"><span> </span>{this.props.data.match.team_A.name}</div>
                                        <div className="subMember"><span> </span>{this.props.data.match.team_B.name}</div>
                                    </li>
                                    {
                                        this.props.data.info.lineup.map((item,index)=>{
                                            return(
                                                <li key={'mmain'+index}>
                                                    <div className="subMember"><span>{item.team_A.shirtnumber}</span>{item.team_A.person}</div>
                                                    <div className="subMember"><span>{item.team_B.shirtnumber}</span>{item.team_B.person}</div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            }
                            
                        </div> 
                        <section className="subLineup">
                            <SmallTitleBar title="替补阵容"/>
                            <ul className="subNames">
                                <li>
                                    <div className="subMember"><span> </span>{this.props.data.match.team_A.name}</div>
                                    <div className="subMember"><span> </span>{this.props.data.match.team_B.name}</div>
                                </li>
                                {
                                    this.props.data.info.sub.map((item,index)=>{
                                        return(
                                            <li key={'sub'+index}>
                                                <div className="subMember"><span>{item.team_A.shirtnumber}</span>{item.team_A.person}</div>
                                                <div className="subMember"><span>{item.team_B.shirtnumber}</span>{item.team_B.person}</div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </section>
                        {

                        }
                    </div>
                    :<div className="noInfo">暂无阵容信息</div>
                }
            </div>
        )
    }
}

export default MatchLineup;