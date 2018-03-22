import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';

import './style.less';

/*
还没登录而显示的组件
props:{ 
}
*/

class NotLogin extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
    }

    navTo(){
        this.props.history.push('/login');
    }

    render(){
        return(
           <div className="NotLogin">
                <p>快快登录发现更多新功能吧~</p>
                <button onClick={this.navTo.bind(this)}>登录/注册</button>
           </div>
        )
    }

}

export default withRouter(NotLogin);