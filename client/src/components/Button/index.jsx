import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
按钮组件
props:{
  type（按钮颜色类型）: ['deep',不填]     （deep就是深色，不填就是白色）
  size（按钮大小）：['big',不填]     （big的话就占父容器的90%，不填就占父容器的35%）
  value（按钮value）：[str]       （按钮文字）
  btnClickHandle()（该按钮点击触发事件）
}
*/

class Button extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        const btnClass1 = this.props.type==='deep'?"button buttonDeep ":"button ";
        const btnClass2 = this.props.size==='big'?"buttonBig":"";
        const btnClass = btnClass1+btnClass2;
        return(
            <button className={btnClass} onClick={this.props.btnClickHandle}>
                {this.props.value}
            </button>
        )
    }
}

export default Button;