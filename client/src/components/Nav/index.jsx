import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import NavItem from '../NavItem';

import './style.less';

/*
底部导航容器组件（里面放着NavItem组件）
props:{
  zIndex（z-index）: [num]    （主要是为了解决抽屉弹出隐藏时底部导航条的显示问题）
  selected（当前选中的选项名字）： [str]
  items（navItem）：[{title:"",iconName:"",route:""}]  （传给navItem组件）
  selectColor（选中颜色）
}
*/

class Nav extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.refs.nav.style.zIndex = nextProps.zIndex;
    }

    render(){
        return(
            <ul className="nav" ref="nav">
                {
                    this.props.items.map((item,index)=>{
                        return(
                            <NavItem 
                                selected={this.props.selected===item.title?true:false}
                                title={item.title} 
                                iconName={item.iconName} 
                                route={item.route} 
                                key={index}
                                selectColor={this.props.selectColor}/>
                        )
                    })
                }
            </ul>
        )
    }
}

export default Nav;