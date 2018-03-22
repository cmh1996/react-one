import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';

import FormValidator from '../../../../components/FormValidator';

import {setLocalItem} from '../../../../util/util';
import {login} from '../../../../fetch/home/login';
import {getUserData} from '../../../../fetch/home/user';


@inject('stateStore','userStore')
@observer class LoginComponent extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            loginEmail:'',
            loginPwd:'',
        };
        this.styles = {
            body:{
                marginTop:'4rem',
                width:'12rem',
            },
            form:{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
            },
            inputBox:{
                width:'100%',
                height:'3rem',
                borderBottom:'1px solid rgba(255,255,255,0.7)',
                fontSize:'0.7rem',
            },
            label:{
                width:'3rem',
                height:'100%',
                display:'inline-block',
                lineHeight:'2.6rem',
                fontSize:'0.6rem',
            },
            input:{
                background:'rgba(0,0,0,0)',
                width:'8.8rem',
                border:'none',
                color:'white',
                height:'100%',
                fontSize:'0.6rem'
            },
            bigBtn:{
                width:'100%',
                marginTop:'1rem',
                height:'2rem',
                background:'rgba(0,0,0,0)',
                border:'1px solid white',
                color:'white',
                borderRadius:'0.2rem',
                fontSize:'0.6rem'
            },
            info:{
                marginTop:'2rem',
                textAlign:'center'
            },
            infoMessage:{
                fontSize:'0.6rem'
            },
            smallBtn:{
                width:'3rem',
                height:'1.5rem',
                marginLeft:'0.6rem',
                background:'rgba(0,0,0,0)',
                border:'1px solid white',
                color:'white',
                borderRadius:'0.2rem',
                fontSize:'0.6rem'
            },
        }
    }

    togglePage(page){
        this.props.togglePage(page);
    }

    setVal(type,e){
        this.setState({
            [type]:e.target.value
        })
    }

    login(){
        const email = this.refs.email.value;
        const pwd = this.refs.pwd.value;
        //错误的数量大于0或者输入框为空，就不提交了
        const errNum = document.querySelectorAll(".FormValidatorErrTips").length;
        if(errNum>0 || email==='' || pwd===''){
            return;
        }
        this.props.stateStore.setLoading(true);
        const res = login({
            email:email,
            pwd:pwd
        });
        res
        .then((token)=>{ 
            this.props.stateStore.setLoading(false);
            setLocalItem('token',token);
            this.props.history.push('/');
            window.location.reload(true);
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail',e);
        })
    }

    render(){
        return(
            <div style={this.styles.body}>
                <div style={this.styles.form}>
                    <FormValidator val={this.state.loginEmail} rules={{type: 'email', required:true}}>
                        <div style={this.styles.inputBox}>
                            <span style={this.styles.label}>邮箱</span>
                            <input style={this.styles.input} type="text" ref="email" placeholder="请输入您的邮箱" onBlur={this.setVal.bind(this,'loginEmail')}/>
                        </div>
                    </FormValidator>
                    <FormValidator val={this.state.loginPwd} rules={{required:true}}>
                        <div style={this.styles.inputBox}>
                            <span style={this.styles.label}>密码</span>
                            <input style={this.styles.input} type="password" ref="pwd" placeholder="请输入您的密码" onBlur={this.setVal.bind(this,'loginPwd')}/>
                        </div>
                    </FormValidator>
                    <button style={this.styles.bigBtn} onClick={this.login.bind(this)}> 
                        登 录
                    </button>
                </div>
                <div style={this.styles.info}>
                    <span style={this.styles.infoMessage}>还没有账号？</span>
                    <button style={this.styles.smallBtn} onClick={this.togglePage.bind(this,'signup')}>去注册</button>
                </div>
            </div>
        )
    }
}
export default withRouter(LoginComponent);