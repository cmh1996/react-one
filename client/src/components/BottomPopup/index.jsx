import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize} from '../../util/util';

import './style.less';

/*
从页面底部弹出的弹窗组件
props:{
   height：（弹窗高度）
   hideHandle：（触发隐藏函数）
}
*/

class BottomPopup extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            boxBottom:'-'+this.props.height,
            bgOpacity:0,
        };
        this.clientSize = getClientSize();
    }

    stopPropagation(e){
        e.stopPropagation();
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                boxBottom:0,
                bgOpacity:0.5
            })
        },0) 
    }

    hide(){
        this.setState({
            boxBottom:'-'+this.props.height,
            bgOpacity:0
        })
        setTimeout(()=>{
            this.props.hideHandle()
        },200)
    }

    render(){
        return(
           <div className = "bottomPopup" 
                onClick = {this.hide.bind(this)} 
                style = {{
                            width:this.clientSize.width,
                            height:this.clientSize.height,
                            background:`rgba(0, 0, 0, ${this.state.bgOpacity})`
                        }}
            >
                <div 
                    className="popupBox" 
                    onClick={this.stopPropagation.bind(this)} 
                    style={{width:this.clientSize.width,height:this.props.height,bottom:this.state.boxBottom}}
                >
                    <div className="popupContentBox">
                        {this.props.children}
                    </div>
                    <div className="closeBtn" onClick={this.hide.bind(this)}>关闭</div>
                </div>
           </div>
        )
    }

}

export default BottomPopup;