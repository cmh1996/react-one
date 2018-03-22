import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
小标题组件
props:{
    title（小标题）： [str]
    align（对齐方式）：['left','center','right']
}
*/

class SmallTitleBar extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        let align = '';
        switch(this.props.align){
            case 'left':
                align = 'flex-start';
                break;
            case 'center':
                align = 'center';
                break;
            case 'right':
                align = 'flex-end';
                break;
            default:
                align = 'flex-start';
        }
        return(
            <div className="SmallTitleBar" style={{justifyContent:align}}>
                <span>{this.props.title}</span>
            </div>
        )
    }
}

export default SmallTitleBar;