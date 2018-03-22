import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
小列表项组件
props:{
  img（列表项左侧图片）: [图片地址]     
  title（列表标题）：[str]    
  info（列表正文）：[str]  
  titleTips(标题栏是否有其他元素，有就调用时放在props.children中)：[bol]
  type（列表项类型）: ['normal','options']     （normal就是右边是文字，options就是右边是可选项）     
  value（右边文字）：[str]    
  noArrow（右边是否有箭头）：[bol]  
  options（右边选项）：['可选项val']
  firstRenderOption（第一次渲染选中的按钮）:[num]
  liClickHandle()（列表项点击触发事件）
  selectHandle() （选择选项触发的事件）
}
*/

class ListItem extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            optionSelected:this.props.firstRenderOption
        }
    }

    optionHandle(index,e){
        this.setState({
            optionSelected:index
        },()=>{
            this.props.selectHandle(index)
        })
    }

    render(){
        return(
            <li className="listItem" onClick={this.props.liClickHandle}>
                <div className="listItemLeft">
                    {
                        this.props.img?
                        <img className="listItemImg" src={this.props.img}/>:''
                    }
                    <div className="listItemContent">
                        <span className="title">
                            {this.props.title}
                            {
                                this.props.titleTips?
                                this.props.children:''
                            }
                        </span>
                        {
                            this.props.info?
                            <p className="info">{this.props.info}</p>   
                            :''
                        }
                    </div>
                </div>
                {
                    this.props.type==='normal'?
                    <span className="value">
                        {this.props.value}
                        {
                            this.props.noArrow?
                            '':<i className="iconfont icon-enter" />
                        }
                    </span>
                    :
                    this.props.type==='options'?
                    <div className="optionsBox">
                        {
                            this.props.options.map((item,index)=>{
                                return(
                                    <span className={this.state.optionSelected===index?"option selected":"option"} 
                                          key={index}
                                          onClick={this.optionHandle.bind(this,index)}>
                                        {item}
                                    </span>
                                )
                            })
                        }
                    </div>
                    :''
                }
            </li>
        )
    }
}

export default ListItem;