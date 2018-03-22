import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
文本输入框组件
props:{
    type（类型）： ['password,不填']   （password就是密码型，不填就是普通显示性）
    placeholder（placeholder）：[str]
    maxLen（最大长度）
}
*/

class TextInput extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
    	const type = this.props.type==='password'?'password':'text';
        return(
            <input maxLength={this.props.maxLen?this.props.maxLen:''} ref="textInput" className="textInput" type={type} placeholder={this.props.placeholder}/>
        )
    }
}

export default TextInput;