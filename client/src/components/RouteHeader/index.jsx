import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';

import './style.less';

/*
头部路由导航组件
props:{
  items（导航项）：[{title:'',route:''}]
  selectedColor（选中的颜色）
}
*/

class RouteHeader extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
    }

    //选择子页面
    selectSubPage(route){
        this.props.history.push(route);
    }

    componentDidMount(){
        
    }

    render(){
        const curPath = this.props.history.location.pathname;
        return(
            <div className="routeHeader">
                <div className="center">
                    {
                        this.props.items.map((item,index)=>{
                            return(
                                <span
                                    style={{
                                        color:curPath===item.route?this.props.selectedColor:'#7d7d7d',
                                        borderBottom:curPath===item.route?`0.06rem solid ${this.props.selectedColor}`:'none'
                                    }}
                                    key={index} 
                                    onClick={this.selectSubPage.bind(this,item.route)}>{item.title}</span>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

export default withRouter(RouteHeader);