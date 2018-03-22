import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import LoginComponent from './subpage/LoginComponent';
import SignUpComponent from './subpage/SignUpComponent';

import {getClientSize} from '../../../util/util';

const clientSize = getClientSize();
const styles = {
    Login:{
        width:clientSize.width,
        height:clientSize.height,
        overflow:'hidden'
    },
    content:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        color:'white',
        background:'rgba(0,0,0,0)',
        zIndex:'10',
    },
    loginHeader:{
        width:'100%',
        height:'2rem',
        textAlign:'right',
        lineHeight:'2rem',
        paddingRight:'0.8rem'
    },
    bg:{
        zIndex:-1,
        position:'absolute',
        top:0,
        left:0,
        width:clientSize.width,
        height:clientSize.height,
        WebkitFilter: 'blur(0.2rem)',
        MozFilter: 'blur(0.2rem)',
        MsFilter: 'blur(0.2rem)',    
        filter: 'blur(0.2rem)', 
    }
}

class Login extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            showPage:'login'
        }
    }

    togglePage(page){
        this.setState({
            showPage:page
        })
    }

    goback(){
        this.props.history.goBack();
    }

    render(){
        return(
            <div style={styles.Login}>
                <div style={styles.content}>
                    <div style={styles.loginHeader}>
                        <i className="iconfont icon-close" onClick={this.goback.bind(this)}/>
                    </div>
                    {
                        this.state.showPage==='login'?
                        <LoginComponent togglePage={this.togglePage.bind(this)}/>
                        :
                        <SignUpComponent togglePage={this.togglePage.bind(this)}/>
                    }
                </div>
                <img 
                    style={styles.bg} 
                    src="http://ww4.sinaimg.cn/bmiddle/69641508ly1fjwydauuk8j20yi1pchdw.jpg"
                />
            </div>
        )
    }
}

export default Login;