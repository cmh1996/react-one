import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize} from '../../util/util';

import './style.less';

/*
成功或失败的消息提示组件
props:{
    type（类型）： ['success','fail']
    successTop（成功提示离顶部的距离）：[str]
    content（消息内容）：[str]
}
*/

const clientWidth = getClientSize().width;
class Tips extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.timer1=null;
        this.timer2=null;
        this.timer3=null;
        this.timer4=null;
    }

    componentDidUpdate(){
        if(this.props.type==='success'){
            this.timer1 = setTimeout(()=>{
                this.refs.successTips.style.opacity = 0.95;
                this.refs.successTips.style.zIndex = 100;
            },20);
            this.timer2 = setTimeout(()=>{
                this.refs.successTips.style.opacity = 0;
                this.refs.successTips.style.zIndex = -1;
            },2000);
        }else if(this.props.type==='fail'){
            this.timer3 = setTimeout(()=>{
                this.refs.failTips.style.opacity = 0.95;
                this.refs.failTips.style.zIndex = 100;
            },20);
            this.timer4 = setTimeout(()=>{
                this.refs.failTips.style.opacity = 0;
                this.refs.failTips.style.zIndex = -1;
            },2000)
        }
    }

    componentWillUnmount(){
        clearTimeout(this.timer1);
        this.timer1 = null;
        clearTimeout(this.timer2);
        this.timer2 = null;
        clearTimeout(this.timer3);
        this.timer3 = null;
        clearTimeout(this.timer4);
        this.timer4 = null;
    }

    render(){
        const successDisplay = this.props.type==="success"?'block':'none';
        const failDisplay = this.props.type==="fail"?'block':'none';
        const successStyle={
            display:successDisplay,
            top:this.props.successTop
        }
        return(
                this.props.type?
                <div>
                    <div className="successTips" ref="successTips" style={successStyle}>
                        {this.props.content || '加载成功'}
                    </div>
                    <div className="failTips" style={{display:failDisplay}} ref="failTips">
                        <span>
                            {this.props.content || '请求出错，请稍后再试'}
                        </span>
                    </div>
                </div>
                :<div></div>
        )
    }
}

export default Tips;