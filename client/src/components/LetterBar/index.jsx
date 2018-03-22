import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
按字母选择的长条bar组件
props:{
  type（类型）: ['inABox',不填]    (如果是inABox，那就触发传进来的backTopHandle();如果不填那就默认滚动到body的顶部。)
  backTopHandle()（inABox时触发的函数）    
}
*/

class LetterBar extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    clickHandle(index){
        this.props.clickHandle(index)
    }

    render(){
        return(
           <ul className="letterBar">
                {
                    this.props.items.map((item,index)=>{
                        return(
                            <li key={'letter'+index} 
                                onClick={this.clickHandle.bind(this,index)}
                                className={this.props.curIndex===index?"letterItem selected":"letterItem"}
                            >
                            {item}
                            </li>
                        )
                    })
                }
           </ul>
        )
    }

}

export default LetterBar;