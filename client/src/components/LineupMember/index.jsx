import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
阵容球员组件
props:{
  right（right值）: [str]    (因为是绝对定位)
  bottom（bottom值）: [str]    (因为是绝对定位) 
  left（left值）: [str]    (因为是绝对定位)
  top（top值）: [str]    (因为是绝对定位) 
  color（背景颜色）:[str]   
  num（显示的数字）:[str || num]     
  text（底部文字）:[str] 
}
*/

class LineupMember extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
    }

    render(){
        return(
           <div className="LineupMember" style={{top:this.props.top,left:this.props.left,right:this.props.right,bottom:this.props.bottom}}>
                <span className="num" style={{backgroundColor:this.props.color}}>{this.props.num}</span>
                <span className="text">{this.props.text}</span>
           </div>
        )
    }

}

export default LineupMember;