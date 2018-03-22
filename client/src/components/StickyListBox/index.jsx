import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
stickyList容器组件
props:{
    fixedTop（容器状态为fixed时距离顶部的高度）： [num]
    normalTop（容器状态为正常显示时距离顶部的高度）：[num]
    height（容器状态为fixed时的高度）：[num]
    loadMore（到达底部触发的函数，通常是loadmore）：[fn]
}
*/

class StickyListBox extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            hasReachTop:false,
            firstTapY:0,
            listBoxOverflow:'hidden',
        }
    }

    touchStartHandle(e){
        if(this.state.hasReachTop){
            this.setState({
                firstTapY:e.touches[0].pageY
            })
        }
    }

    touchMoveHandle(e){
        //如果到达了顶部 
        if(this.refs.stickyListBox.scrollTop===0 && this.refs.stickyListBox.getBoundingClientRect().top<=this.props.fixedTop+5){
            this.setState({
                hasReachTop:true,
            })
        }else{
            this.setState({
                hasReachTop:false,
            })
        }

        if(this.state.hasReachTop && this.state.firstTapY!==0){
            const diffY = e.touches[0].pageY-this.state.firstTapY;
            if(diffY>=10){
                this.setState({
                    listBoxOverflow:'hidden',
                })
            }else{
                this.setState({
                    listBoxOverflow:'scroll',
                })
            }
        }else if(this.refs.stickyListBox.getBoundingClientRect().top>=this.props.normalTop){
            this.setState({
                listBoxOverflow:'hidden',
            })
        }
        else{
            this.setState({
                listBoxOverflow:'scroll',
            })
        }
    }

    scrollHandle(){
        //到达底部时加载更多
        if(this.props.loadMore){
            if(this.refs.stickyListBox.scrollHeight<=this.refs.stickyListBox.scrollTop+this.refs.stickyListBox.clientHeight){
                this.props.loadMore();
            }
        }
    }

    render(){
        return(
             <div 
                className="stickyListBox" 
                ref="stickyListBox" 
                onScroll={this.scrollHandle.bind(this)}
                onTouchStart={this.touchStartHandle.bind(this)}
                onTouchMove={this.touchMoveHandle.bind(this)}
                style={{
                    height:this.props.height,
                    overflowY:this.state.listBoxOverflow,
                    top:this.props.normalTop,
                }}
            >
            {this.props.children}
            </div>
        )
    }
}

export default StickyListBox;