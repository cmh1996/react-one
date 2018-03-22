import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';

import './style.less';

/*
底部导航项组件
props:{
  selected（是否被选中）: [bol]    （外层Nav控制）
  route（跳转到的路由）： [str]
  iconName（icon）：[str] 
  title（名字）：[str] 
  selectColor（选中颜色）
}
*/

class NavItem extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        	isSelected:this.props.selected
        }
    }

    jumpTo(route){
    	this.props.history.push(route);
    }

    render(){
        return(
            <li onClick={this.jumpTo.bind(this,this.props.route)} className="navItem">
            	<i className={"iconfont "+this.props.iconName} style={{color:this.props.selected?this.props.selectColor:'#adadab'}}></i>
            	<span style={{color:this.props.selected?this.props.selectColor:'#adadab'}}>{this.props.title}</span>
            </li>
        )
    }

}

export default withRouter(NavItem);