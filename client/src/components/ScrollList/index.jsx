import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,perRem} from '../../util/util';

import Loading from '../Loading';

import './style.less';

/*
列表容器组件（可以上拉加载更多，下拉刷新）
props:{
    type（类型）：['inPageScroll',不填]
    fixedTopHeight（页面中头部固定部分的高度）：[num]
    fixedBottomHeight（页面中底部固定部分的高度）：[num]
    refreshEnd（是否刷新结束）： [bol]
    isLoadingMore（是否在加载更多）： [bol]
    listHeight（容器固定高度）： [str]
    pullDownHandle()    （下拉刷新触发函数）
    pullUpHandle()    （上拉加载更多触发函数）
    hasScrollSomeDistanceHandle()    （已经滑动到离顶部一定距离触发函数，主要用于显示回到顶部组件）
    nearTopHandle()    （快到顶部触发函数，主要用于隐藏回到顶部组件）
}
*/

const clientHeight = getClientSize().height;
const loadingHeight = 3*perRem;

class ScrollList extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            hasReachTop:true,       //是否已经到达顶部
            pullDownDistance:0,     //下拉刷新手指滑动的距离
            firstTouchPageY:0,  //第一次触碰的Y位置
            hasPullDownEnough:false,    //下拉到了刷新点
            isPressing:false,   //下拉过程中是否按着
            visibleHeight:0,    //scrollbox可视区域高度
        };
        this.documentScrollFn = ()=>{
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const boxTop = this.refs.box.getBoundingClientRect().top-this.props.fixedTopHeight;
            if(scrollTop<boxTop){
                this.refs.box.style.overflow = 'hidden';
            }else{
                this.refs.box.style.overflow = 'scroll';
            }
        };
    }

    touchStart(e){
        let touch = e.touches[0];
        let scrollTop = this.refs.box.scrollTop;

        //如果scrollTop为0，表明列表已经到达顶部，然后记录下手指第次一触碰的位置

        if(scrollTop<=0){
            this.setState({
                hasReachTop:true,
                firstTouchPageY:Number(touch.pageY)
            })
        }
        //如果scrollTop大于0，表明列表不在顶部
        else if(scrollTop>0){
            this.setState({
                hasReachTop:false,
            })
        }
    }

    touchMove(e){
        e.stopPropagation();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const box = this.refs.box;
        let touch = e.touches[0];
        let touchMoveY = Number(touch.pageY - this.state.firstTouchPageY);

        //当且仅当列表在顶部时才触发下拉刷新
        if(this.state.hasReachTop===true ){
            //记录下手指滑动的Y距离
            //上划
            if(touchMoveY<0){
                box.style.overflow = 'scroll';
                if(this.props.type==='inPageScroll'){
                    this.documentScrollFn();
                }
                box.style.height = this.props.listHeight;
                this.setState({
                    hasReachTop:false,
                })
            }
            //下拉
            else{
                box.style.overflow = 'hidden';
                if(this.props.type==='inPageScroll'){
                    if(scrollTop>0){
                        return;
                    }
                    box.style.height = this.state.visibleHeight;
                }else{
                    box.style.height = clientHeight+'px';
                }
                this.setState({
                    pullDownDistance:touchMoveY+'px',
                    isPressing:true,
                })


                //如果手指滑动Y距离大于等于在顶部隐藏的loading的高度，那就证明足够可以触发下拉刷新了
                if(touchMoveY>=loadingHeight){
                    this.setState({
                        hasPullDownEnough:true
                    })
                }
                //否则就还没可以
                else{
                    this.setState({
                        hasPullDownEnough:false
                    })
                }
            } 
        }
    }

    touchEnd(e){
        const box = this.refs.box;
        box.style.overflow = 'scroll';
        if(this.props.type==='inPageScroll'){
            this.documentScrollFn();
        }
        box.style.height = this.props.listHeight;

        //当且仅当列表在顶部时才响应下拉刷新
        if(this.state.hasReachTop===true){
            //如果松开手指时，已经足够触发了，那就触发
            if(this.state.hasPullDownEnough){
                this.setState({
                    pullDownDistance:loadingHeight+'px',
                    isPressing:false,
                })
                this.props.pullDownHandle();
            }
            //如果松开手指时，还不够触发，那就还原
            else{
                this.setState({
                    pullDownDistance:0,
                    isPressing:false,
                })
            }
        }
    }

    componentDidMount(){
        if(this.props.type==='inPageScroll'){
            this.refs.box.style.overflow = 'hidden';
            document.addEventListener('scroll',this.documentScrollFn,false);
            this.setState({
                visibleHeight:(clientHeight-this.refs.box.getBoundingClientRect().top-this.props.fixedBottomHeight)+'px',
            })
        }
    }

    componentWillUnmount(){
        document.removeEventListener('scroll',this.documentScrollFn,false);
    }


    scrollHandle(){
        let scrollTop = this.refs.box.scrollTop;
        this.checkBottomDistance();
        if(scrollTop>500){
            this.props.hasScrollSomeDistanceHandle();
        }else{
            this.props.nearTopHandle();
        }
    }

    //检测离底部的距离，快到底部时触发pullUpHandle
    checkBottomDistance(){
        let scrollTop = this.refs.box.scrollTop;
        let listHeight = this.refs.scrollList.scrollHeight;
        if(listHeight-scrollTop<700){
            if(this.props.isLoadingMore){
                return;
            }else{
                this.props.pullUpHandle();
            }
        }
    }

    //组件接收到新的参数时
    componentWillReceiveProps(nextProps){
        //如果父组件说已经好了，那就还原
        if(nextProps.refreshEnd){
            this.setState({
                pullDownDistance:0,
                hasPullDownEnough:false
            })
        }
        //进入了加载中的状态
        else{
        }
    }

    componentWillUpdate(nextProps,nextState){
        if(nextProps.type==='inPageScroll' && nextState.visibleHeight===0){
            this.setState({
                visibleHeight:(clientHeight-this.refs.box.getBoundingClientRect().top-nextProps.fixedBottomHeight)+'px',
            })
        }
    }

    componentDidUpdate(){
    }

    render(){
        let listStyle = {
            transform:'translate3d(0,'+this.state.pullDownDistance+',0)',
        }
        let divStyle = {
            height:this.props.listHeight,
            zIndex:this.state.zIndex
        }
        return(
            <div className="scrollListBox"
                 ref="box"
                 onScroll={this.scrollHandle.bind(this)}
                 style={divStyle}
            >
                {
                    !this.state.hasPullDownEnough?
                    <div className="hideArea"><i className="iconfont icon-arrows-copy-copy"/>下拉刷新</div>
                    :
                    this.state.isPressing?
                    <div className="hideArea"><i className="iconfont icon-arrows-4-7"/>释放刷新</div>
                    :
                    this.props.refreshEnd?
                    '':<Loading/>
                }
                <ul className="scrollList"
                    ref="scrollList"
                    style={listStyle}
                    onTouchStart={this.touchStart.bind(this)}
                    onTouchMove={this.touchMove.bind(this)}
                    onTouchEnd={this.touchEnd.bind(this)}
                >
                    {this.props.children}
                    <div className="footer">正在加载中……</div>
                </ul>
            </div>
        )
    }
}

export default ScrollList;