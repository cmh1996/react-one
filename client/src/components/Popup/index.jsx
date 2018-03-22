import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize} from '../../util/util';

import './style.less';

/*
全屏弹窗组件（强耦合，要改进）
props:{
  show（显示与否）：[bol]
  items（内容区items）：[{citysName:''}]
  selected（当前选中item名字）：[str]
  contentHandle()（点击内容区触发函数）
  cancelHandle()（取消触发函数）
  confirmHandle()（确认触发函数）
}
*/

class Popup extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            opacity:0
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                opacity:1
            })
        },0)
    }

    cancelHandle(){
        this.props.cancelHandle();
    }

    confirmHandle(){
        this.props.confirmHandle();
    }

    render(){
        let popupClass = this.props.show?'popup show':'popup hide';
        const width = getClientSize().width+'px';
        const height = getClientSize().height+'px';
        return(
            <div className={popupClass} style={{opacity:this.state.opacity,width:width,height:height}}>
                <div className="content" onClick={this.props.contentHandle}>
                {   
                    this.props.items?
                    this.props.items.map((item,index)=>{
                        return(
                            <span key={index} className={this.props.selected===item.citysName?'popupItem selected':'popupItem'}>
                            {item.citysName}
                            </span>
                        )
                    })
                    :
                    this.props.children
                }
                </div>
                <div className="btn">
                    <span className="cancelBtn" onClick={this.cancelHandle.bind(this)}>
                        <i className="iconfont icon-close"/>
                    </span>
                    <span className="confirmBtn" onClick={this.confirmHandle.bind(this)}>
                        <i className="iconfont icon-right"/>
                    </span>
                </div>
            </div>
        )
    }
}

export default Popup;