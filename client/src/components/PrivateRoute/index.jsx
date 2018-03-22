import React from 'react';
import {Route,Redirect} from 'react-router-dom';

import {getLocalItem} from '../../util/util';

/*
权限route组件
props:{ 
  path（路径）
  component（组件）
}
*/
export default class PrivateRoute extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        auth : false,     // 表示是否认证通过
        hasAuthed: false,  // 表示是否向服务器发送过认证请求
      };
    }
    
    componentDidMount() {
       if(getLocalItem('token')) {
           this.setState({auth:true, hasAuthed: true});
        }else {
           this.setState({auth:false, hasAuthed: true});
        }
    }
    
    render() {
        return(
            this.state.hasAuthed?
            this.state.auth?
            <Route path={this.props.path} component={this.props.component} />
            :
            <Redirect to={{
                pathname: '/login',
            }}/>
            :
            null
        )
     }
}




