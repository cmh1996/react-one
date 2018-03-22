import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
单行输入框+发送组件
props:{
    placeholder（placeholder）： [str]
    btnValue（按钮val）： [str]
    valueChangeHandle()    （输入框onchange触发函数）
    btnHandleClick()    （按了按钮触发的函数）
}
*/

class SendBox extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        return(
            <div className="sendBox">
                <input
                    ref='input'
                    className="SendBox"
                    placeholder={this.props.placeholder}
                    onChange={this.props.valueChangeHandle}/>
                <button onClick={this.props.btnHandleClick}>{this.props.btnValue}</button>
            </div>
        )
    }
}

export default SendBox;