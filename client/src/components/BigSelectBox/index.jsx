import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
块状分类select组件
props:{
    firstRenderItem（初次渲染select的item）： [index]
    items（items）：[{title:''}]
    selectHandle(index)     （选择item触发的函数）
}
*/

class BigSelectBox extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curItem:this.props.firstRenderItem || 0,
        }
    }

    //选择
    selectSubPage(index){
        this.setState({
            curItem:index
        });
        this.props.selectHandle(index);
    }

    render(){
        return(
            <ul className="bigSelectBox clear">
                {
                    this.props.items.map((item,index)=>{
                        return(
                            <li 
                                className={this.state.curItem===index?'selected':''} 
                                key={index} 
                                onClick={this.selectSubPage.bind(this,index)}
                            >
                            {item.title}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

}

export default BigSelectBox;