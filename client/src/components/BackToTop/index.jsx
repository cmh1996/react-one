import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
回到顶部组件
props:{
  type（类型）: ['inABox',不填]    (如果是inABox，那就触发传进来的backTopHandle();如果不填那就默认滚动到body的顶部。)
  backTopHandle()（inABox时触发的函数）    
}
*/

class BackToTop extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
    }

    backToTop(){
        if(this.props.type==='inABox'){
            this.props.backTopHandle();
        }else{
            document.documentElement.scrollTop = document.body.scrollTop =0;
        }
    }

    render(){
        return(
           <div className="backToTop" onClick={this.backToTop.bind(this)}>
                <i className="iconfont icon-arrows-4-7" />
           </div>
        )
    }

}

export default BackToTop;