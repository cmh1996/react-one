import React from 'react';
import {withRouter} from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import PersonalSide from '../PersonalSide';

import './style.less';

/*
主页面头部组件（里面放了个侧边抽屉组件，不够抽象，要改进）
props:{
  items（中间项）: [{title:'',route:''}] 
  personalList（抽屉列表）: [{title:'',icon:'',route:''}]       
  value（右边文字）：[str]    
  icon（右边天气图标）：['图标ownClass名字']  
  temperature（右边天气度数文字）：['str']
  showPersonalHandle()（点击触发弹出侧边栏函数）
  hidePersonalHandle()（点击触发隐藏侧边栏函数）
  bgColor（背景颜色）
}
*/

class MainHeader extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            personalShow:false
        }
    }

    //跳转路由
    navTo(page){
        this.props.history.push(page); 
    }

    //展示个人侧边栏
    showPersonal(){
        //personal显示时设置nav的zindex为-1，消失时设为10
        this.props.showPersonalHandle();
        this.setState({
            personalShow:true
        })
    }

    //隐藏个人侧边栏
    hidePersonal(){
        //personal显示时设置nav的zindex为-1，消失时设为10
        this.props.hidePersonalHandle();
        this.setState({
            personalShow:false
        })
    }

    render(){
        const curPath = this.props.history.location.pathname;
        return(
            <div className="mainHeader" style={{backgroundColor:this.props.bgColor}}>
                <div className="left">
                    <i className="iconfont icon-people_fill" onClick={this.showPersonal.bind(this)}></i>
                </div>
                <div className="center">
                    {
                        this.props.items.map((item,index)=>{
                            return(
                                <span 
                                    className={curPath.indexOf(item.route)>-1?'selected':''} 
                                    key={index} 
                                    onClick={this.navTo.bind(this,item.route)}>{item.title}</span>
                            )
                        })
                    }
                </div>
                <div className="right">
                    <div className="weather" onClick={this.navTo.bind(this,'/weather')}>
                        <span className="icon"><i className={"iconfont "+this.props.icon}></i></span>
                        <span className="tem">{this.props.temperature + '℃'}</span>
                    </div>
                </div>
                {
                    this.state.personalShow?
                    <PersonalSide
                        personalList={this.props.personalList}
                        hidePersonal={this.hidePersonal.bind(this)}/>
                    :''
                }
            </div>
        )
    }

}

export default withRouter(MainHeader);