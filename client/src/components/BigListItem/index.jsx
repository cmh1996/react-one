import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
富内容列表项组件
props:{
  img（左侧图片）: [一个图片资源地址]  
  title（头部标题）：[str]
  tips（头部较小的字）：[str]
  rightTips（头部右边是否有tips，有就放在this.props.children）：[bol]
  mainInfo（主体文）：[str]
  subInfo（主体副文）：[str]
  imgItems（副文下面的图片）：['src','src','src']
  items（底部按钮）:[{icon:'icon的ownClass的名字',value:'按钮value',selected:bol}]   （有多少个按钮就写多少个，不能多于三个）
  liClickHandle()（该列表项点击触发事件）
  itemClickHandle0()（底部第一个按钮点击触发事件）   
  itemClickHandle1()（底部第二个按钮点击触发事件）  
  itemClickHandle2()（底部第三个按钮点击触发事件） 
  imgClickHandle ()（左边图片点击触发事件）
  imgItemClickHandle ()（副文下面的图片点击触发事件）
}
*/

class BigListItem extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
    }

    //底部按钮点击触发事件
    itemClickHandle(index,e){
        e.stopPropagation();
        switch(index){
            case 0:
                this.props.itemClickHandle0();
                return;
            case 1:
                this.props.itemClickHandle1();
                return;
            case 2:
                this.props.itemClickHandle2();
                return;
            default:
                return;
        }
    }

    imgClickHandle(e){
        if(this.props.imgClickHandle){
            this.props.imgClickHandle();
        }
        e.stopPropagation();
    }

    imgItemClickHandle(index,imgItems,e){
        if(this.props.imgItemClickHandle){
            this.props.imgItemClickHandle(index,imgItems);
        }
        e.stopPropagation();
    }

    componentDidMount(){
        const mainInfoLink = this.refs.mainInfo.querySelector("a");
        if(mainInfoLink){
            mainInfoLink.addEventListener('click',(e)=>{
                e.stopPropagation();
            },false)
        }
    }

    render(){
        return(
            <li className="bigListItem" onClick={this.props.liClickHandle}>
                <div className="bigListItemLeft">
                    <img onClick={this.imgClickHandle.bind(this)} className="bigListItemImg" src={this.props.img}/>
                </div>
                <div className="bigListItemContent">
                    <div className="bigListItemContentHeader">
                        <span className="bigListItemtitle">{this.props.title}</span>
                        <span className="bigListItemTips">{this.props.tips}</span>
                        {
                            this.props.rightTips?
                            this.props.children:''
                        }
                    </div>
                    <div className="bigListItemContentBody">
                        <p className="bigListItemMainInfo" ref="mainInfo" dangerouslySetInnerHTML={{__html: this.props.mainInfo}}></p>
                        <p className="bigListItemSubInfo">{this.props.subInfo}</p>
                        {
                            this.props.imgItems?
                            <div className="imgBox">{
                            this.props.imgItems.map((item,index)=>{
                                return(
                                    <img onClick={this.imgItemClickHandle.bind(this,index,this.props.imgItems)} key={'bigListItemImg'+index} src={item} alt="img"/>
                                )
                            })
                            }</div>
                            :''
                        }
                    </div>
                    <div className="bigListItemContentFooter">
                    {   
                        this.props.items?
                        this.props.items.map((item,index)=>{
                            return(
                                <span onClick={this.itemClickHandle.bind(this,index)} key={index}>
                                    <i style={{color:item.selected?'red':'#4aa9aa'}} className={"iconfont "+item.icon} />
                                    {item.value}
                                </span>
                            )
                        }):''
                    }
                    </div>
                </div>
            </li>
        )
    }
}

export default BigListItem;