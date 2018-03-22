import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
图文封面项组件
props:{
  img（列表项图片）: [图片地址]     
  leftTips（左下角文字）：[str]    
  text1（底部的一行的文字）：[arr] 
  text2（底部的两行的文字）：[arr] 
  clickHandle（点击触发函数）:[fn]
}
*/

class CoverItem extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    clickHandle(){
        if(this.props.clickHandle){
            this.props.clickHandle();
        }
    }

    render(){
        return(
            <li className="coverItem" onClick={this.clickHandle.bind(this)}>
                <div className="coverItemImg">
                    <img src={this.props.img} alt='封面图'/>
                    {
                        this.props.leftTips?
                        <span className="leftTips">
                            <i className="iconfont icon-music1"/>
                            {this.props.leftTips}
                        </span>:''
                    }
                    <i className="iconfont icon-bofang rightTips"/>
                </div>
                {   
                    this.props.text2?
                    this.props.text2.map((item,index)=>{
                        return(
                            <p className="bottomText" key={'text2'+index}>
                                {item}
                            </p>
                        )
                    }):''
                }
                {   
                    this.props.text1?
                    this.props.text1.map((item,index)=>{
                        return(
                            <p className="bottomText bottomText1" key={'text1'+index}>
                                {item}
                            </p>
                        )
                    }):''
                }
            </li>
        )
    }
}

export default CoverItem;