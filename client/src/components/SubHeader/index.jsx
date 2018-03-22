import React from 'react';
import {withRouter} from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
子页面标题组件
props:{
    title（标题）： [str]
    bgColor(背景颜色)
}
*/

class SubHeader extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
    }

    back(e){
        this.props.history.goBack();
        e.stopPropagation();
    }

    goToHome(e){
        this.props.history.push('/home');
        e.stopPropagation();
    }

    render(){
        return(
            <div className="SubHeader" style={{backgroundColor:this.props.bgColor}}>
              <div className="left">
                <i className="iconfont icon-return" onClick={this.back.bind(this)}></i>
              </div>
              <div className="title">
                {this.props.title}
              </div>
              <div className="right">
                <i className="iconfont icon-homepage_fill" onClick={this.goToHome.bind(this)}></i>
              </div>
            </div>
        )
    }

}

export default withRouter(SubHeader);