import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
轮播组件
props:{
    width（宽度）:[str]
    height（高度）:[str]
    num（children数目）：[num]
}
*/

class Swiper extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            beforePauseTranslateLeft:-this.props.width,
            translateLeft:-this.props.width,
            transitionTime:0.3,
            startX:0,
            curIndex:0,
        };
        this.timer = null;
        this.imgNum = Number(this.props.num);
    }

    autoSlide(intervalTime=3000){
        this.timer = setTimeout(()=>{
            //如果到了最后一张，就偷渡到第一张
            if(this.state.translateLeft-this.props.width<=((this.imgNum+1)*(-this.props.width))){
                this.setState({
                    translateLeft:0,
                    transitionTime:0,
                    curIndex:-1
                })
                this.autoSlide(0);
            }else{
                this.setState({
                    translateLeft:this.state.translateLeft-this.props.width,
                    transitionTime:0.3,
                    curIndex:++this.state.curIndex
                })      
                this.autoSlide();
            }
        },intervalTime);
    }

    componentDidMount(){
        this.autoSlide();
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
        this.timer = null;
    }

    touchStart(e){
        e.stopPropagation();
        clearTimeout(this.timer);
        let touch = e.touches[0];
        this.setState({
            startX:touch.pageX,
            beforePauseTranslateLeft:this.state.translateLeft,
            transitionTime:0,
        });
    }

    touchMove(e){
        e.stopPropagation();
        let touch = e.touches[0];
        let curTouchX = touch.pageX;
        let diffX = Number(curTouchX-this.state.startX);
        let offsetX = this.state.beforePauseTranslateLeft+diffX;

        this.setState({
            translateLeft:offsetX,
            transitionTime:0,
        });
    }

    touchEnd(e){
        let touch = e.changedTouches[0];
        let endX = touch.pageX;
        //右划足够的距离了就滚到上一张
        if(endX-this.state.startX>80){
            //如果到了第一张，就偷渡到最后一张
            if(this.state.beforePauseTranslateLeft===(-this.props.width)){
                this.setState({
                    translateLeft:0,
                    transitionTime:0.3,
                    curIndex:(this.imgNum-1)
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            translateLeft:-this.props.width*this.imgNum,
                            transitionTime:0,
                        })
                    },300);
                })
            }else{
                this.setState({
                    transitionTime:0.3
                },()=>{
                    this.setState({
                        translateLeft:this.state.beforePauseTranslateLeft+this.props.width,
                        curIndex:--this.state.curIndex
                    },()=>{
                        this.autoSlide();
                    });   
                })
            }
        }
        //左划足够的距离了就滚到下一张
        else if(endX-this.state.startX<-80){
            //如果到了最后一张了，就偷渡到第一张
            if(this.state.beforePauseTranslateLeft===(-this.props.width*this.imgNum)){
                this.setState({
                    translateLeft:this.state.beforePauseTranslateLeft-this.props.width,
                    transitionTime:0.3,
                    curIndex:0
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            translateLeft:-this.props.width,
                            transitionTime:0,
                        },()=>{
                            this.autoSlide();
                        })
                    },300);
                })
            }else{
                this.setState({
                    transitionTime:0.3,
                },()=>{
                    this.setState({
                        translateLeft:this.state.beforePauseTranslateLeft-this.props.width,
                        curIndex:++this.state.curIndex
                    },()=>{
                        this.autoSlide();
                    });
                })
            }
        }
        //其余的不变
        else{
            this.setState({
                translateLeft:this.state.beforePauseTranslateLeft,
                transitionTime:0.3,
            },()=>{
                this.autoSlide();
            });
        }
    }

    render(){
        return(
            <div className="swiper" style={{height:this.props.height,width:this.props.width}}>
                <ul className="swiperContent"
                    ref="list"
                    style={{
                            width:(this.imgNum+2)*this.props.width,
                            left:this.state.translateLeft+'px',
                            transition:'left '+this.state.transitionTime+'s',
                           }}
                    onTouchStart={this.touchStart.bind(this)}
                    onTouchMove={this.touchMove.bind(this)}
                    onTouchEnd={this.touchEnd.bind(this)}
                >
                    {
                        React.Children.map(this.props.children,(item,index)=>{
                            if(index===this.imgNum-1){
                                return(
                                    <li className="swiperItem" key='-1' style={{width:this.props.width}}>{item}</li>
                                )   
                            }
                        })
                    }
                    {
                        React.Children.map(this.props.children,(item,index)=>{
                            return(
                                <li className="swiperItem" key={index} style={{width:this.props.width}}>{item}</li>
                            )
                        })
                    }
                    {
                        React.Children.map(this.props.children,(item,index)=>{
                            if(index===0){
                                return(
                                    <li className="swiperItem" key={this.imgNum-1} style={{width:this.props.width}}>{item}</li>
                                )   
                            }
                        })
                    }
                </ul>
                <div className="bottomPointBox">
                    {   
                        React.Children.map(this.props.children,(item,index)=>{
                            if(this.state.curIndex===index){
                                return(
                                    <span className='bottomPoint selected' key={index}></span>
                                )
                            }else{
                                return(
                                    <span className='bottomPoint' key={index}></span>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Swiper;