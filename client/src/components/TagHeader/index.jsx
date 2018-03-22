import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
 
import './style.less';

/*
头部内容切换导航组件
props:{
    firstRenderItem（初次渲染select的item）： [index]
    items（items）：[{title:''}]
    selectHandle(index)     （选择item触发的函数）
    bgColor（背景音乐）
    selectedColor（选中时的颜色）
}
*/

class TagHeader extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curItem:this.props.firstRenderItem || 0,
        }
    }

    //选择子页面
    selectSubPage(index){
        this.setState({
            curItem:index
        });
        this.props.selectHandle(index);
    }

    render(){
        const spJustifyContent = this.props.items.length>8?'flex-start':'space-around';
        return(
            <div className="tagHeader" style={{backgroundColor:this.props.bgColor?this.props.bgColor:'white'}}>
                <div className="center" style={{justifyContent:spJustifyContent}}>
                    {
                        this.props.items.map((item,index)=>{
                            return(
                                <span 
                                    style={{
                                        color:this.state.curItem===index?this.props.selectedColor:'#7d7d7d',
                                        borderBottom:this.state.curItem===index?`0.06rem solid ${this.props.selectedColor}`:'none'
                                    }}
                                    key={index} 
                                    onClick={this.selectSubPage.bind(this,index)}>{item.title}</span>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

export default TagHeader;