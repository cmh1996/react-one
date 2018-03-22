import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
部分头部组件
props:{
    title（标题文字）： [str]  
    clickHandle（fn）：[点击icon触发事件]
}
*/

class SectionHeader extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        return(
            <div className="sectionHeader">
                <span className="text">{this.props.title}</span>
                <span className="icon" onClick={this.props.clickHandle}>
                    <i className="iconfont icon-enter"/>
                </span>
            </div>
        )
    }
}

export default SectionHeader;