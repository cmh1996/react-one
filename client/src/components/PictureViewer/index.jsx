import React from 'react';
import {createPortal} from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,perRem} from '../../util/util';

import './style.less';

/*
图片查看器组件
props:{
  imgs（图片src数组）：['src','src']
  firstIndex（第一张渲染的图片的index）：[num]
  hideHandle（隐藏触发函数）
}
*/
const clientSize = getClientSize();
class PictureViewer extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:this.props.firstIndex,
            firstTapX:0,
            left:-(this.props.firstIndex*clientSize.width),
            animateTime:0.3,
            opacity:0,
        }
        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                opacity:1
            })
        },0)
    }

    hidenHandle(){
        this.setState({
            opacity:0
        })
        setTimeout(()=>{
            this.props.hideHandle();
        },200)
    }

    touchStartHandle(e){
        this.setState({
            firstTapX:e.touches[0].pageX,
            beforePos:this.state.left,
            animateTime:0,
        })
    }

    touchMoveHandle(e){
        this.setState({
            left:this.state.beforePos+(e.touches[0].pageX-this.state.firstTapX),
        })
    }

    touchEndHandle(e){
        const pageX = e.changedTouches[0].pageX;
        //向左划到足够的距离
        if(pageX-this.state.firstTapX<(-clientSize.width/4)){
            const beforeIndex = this.state.curIndex+1;
            this.setState({
                animateTime:0.3,
                curIndex:Math.min(beforeIndex,this.props.imgs.length-1)
            },()=>{
                this.setState({
                    left:-clientSize.width*this.state.curIndex
                })
            });
            return;
        }
        //向右划到足够的距离
        else if(pageX-this.state.firstTapX>(clientSize.width/4)){
            this.setState({
                animateTime:0.3,
                curIndex:Math.max(--this.state.curIndex,0)
            },()=>{
                this.setState({
                    left:-clientSize.width*this.state.curIndex
                })
            });
            return;
        }
        //都不够
        else{
            this.setState({
                animateTime:0.3,
                left:-clientSize.width*this.state.curIndex
            })
            return;
        }
    }

    render(){
        return createPortal(
           <div className="PictureViewer" style={{width:clientSize.width,height:clientSize.height,opacity:this.state.opacity}}>
                <div className="viewerHeader">
                    <span className="pictureNum">{(this.state.curIndex+1)+'/'+this.props.imgs.length}</span>
                    <span className="closeBtn" onClick={this.hidenHandle.bind(this)}><i className="iconfont icon-close"/></span>
                </div>
                <div className="content" style={{height:clientSize.height-(1.8*perRem)}}>
                    <div className="viewport">
                        <ul className="imgList"
                            ref="imgList"
                            onTouchStart={this.touchStartHandle.bind(this)}
                            onTouchMove={this.touchMoveHandle.bind(this)}
                            onTouchEnd={this.touchEndHandle.bind(this)}
                            style={{width:clientSize.width*this.props.imgs.length,
                                    left:this.state.left,
                                    transition:`left ${this.state.animateTime}s`}}
                        >
                            {
                                this.props.imgs.map((item,index)=>{
                                    return(
                                        <li className="imgItem" key={'viewerPicture'+index} style={{width:clientSize.width}}>
                                            <img src={item} alt="图片"/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
           </div>,
            this.node
        )
    }

}

export default PictureViewer;