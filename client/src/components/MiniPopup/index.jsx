import React from 'react';
import {createPortal} from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize} from '../../util/util';

import './style.less';

/*
小弹窗组件（因为要居中，所以依赖于util的获取屏幕宽高函数）
props:{
  title（弹窗标题）: [str] 
  hide()（关闭弹窗函数）
  子元素是弹窗内容
}
*/

const clientSize = getClientSize();

class MiniPopup extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            miniPopupClass:'miniPopup before',
            pos:'0'
        }
        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);
    }

    componentDidMount(){
        setTimeout(()=>{ 
            this.setState({
                miniPopupClass:'miniPopup after',
                pos:'4rem'
            })
        },0)
    }

    hide(){
        this.setState({
            miniPopupClass:'miniPopup before',
            pos:'-4rem'
        })
        setTimeout(()=>{
            this.props.hide();
        },300)
    }

    stop(e){
        e.stopPropagation();
    }

    componentWillUnmount(){
        window.document.body.removeChild(this.node);
    }

    render(){
        const width = clientSize.width+'px';
        const height = clientSize.height+'px';
        return createPortal(
            <div className={this.state.miniPopupClass} style={{width:width,height:height}} onClick={this.hide.bind(this)}>
                <div 
                    className="miniPopupContent" 
                    onClick={this.stop.bind(this)} 
                    style={{transform:'translate3d(0,'+this.state.pos+',0)'}}
                >
                    <div className="miniPopupHead">
                        <span className="miniPopupTitle">{this.props.title}</span>
                        <i className="iconfont icon-close" onClick={this.hide.bind(this)}/>
                    </div>
                    <div className="miniPopupBody">
                        {this.props.children}
                    </div>
                </div>
            </div>,
            this.node
        )
    }

}

export default MiniPopup;