import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';

import FormValidator from '../../../../components/FormValidator';

import {setLocalItem,getClientSize} from '../../../../util/util';
import {signup} from '../../../../fetch/home/login';
import {getUserData} from '../../../../fetch/home/user';

@inject('stateStore','userStore')
@observer class SignUpComponent extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            signUpEmail:'',
            nickname:'',
            signUpPwd:'',
            confirmSignUpPwd:'',
            confirmPwdErr:false,
        };
        this.styles = {
            body:{
                marginTop:'2rem',
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
            transLayer:{
                width:getClientSize().width,
                height:getClientSize().height,
                position:'fixed',
                top:0,
                left:0,
                zIndex:10,
                display:'none',
            }
        }
    }

    togglePage(page){
        this.props.togglePage(page);
    }

    setVal(type,e){
        //如果是密码的话
        if(type==='confirmSignUpPwd'){
            //两次输入不一致
            if(this.state.signUpPwd!==e.target.value){
                this.setState({
                    [type]:e.target.value,
                    confirmPwdErr:true
                })
            }else{
                this.setState({
                    [type]:e.target.value,
                    confirmPwdErr:false
                })
            }
        }
        else if(type==='signUpPwd'){
            //两次输入不一致
            if(this.state.confirmSignUpPwd!==e.target.value){
                this.setState({
                    [type]:e.target.value,
                    confirmPwdErr:true
                })
            }else{
                this.setState({
                    [type]:e.target.value,
                    confirmPwdErr:false
                })
            }
        }
        else{
            this.setState({
                [type]:e.target.value
            })
        }
    }

    signup(){
        const email = this.refs.email.value;
        const nickname = this.refs.nickname.value;
        const confirmPwd = this.refs.confirmPwd.value;
        const pwd = this.refs.pwd.value;
        //错误的数量大于0或者输入框为空，就不提交了
        const errNum = document.querySelectorAll(".FormValidatorErrTips").length;
        if(errNum>0 || email==='' || pwd==='' || nickname==='' || confirmPwd===''){
            return;
        }
        this.props.stateStore.setLoading(true);
        const res = signup({
            email:email,
            nickname:nickname,
            pwd:pwd
        });
        res
        .then((token)=>{
            this.props.stateStore.setLoading(false);
            setLocalItem('token',token);

            this.props.stateStore.setTips('success','成功注册！正在为您跳转到首页...','2rem');
            this.refs.transLayer.style.display = 'block';
            setTimeout(()=>{
            this.props.history.push('/');
            window.location.reload(true);
            },2000)
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
                    <FormValidator val={this.state.signUpEmail} rules={{type: 'email', required:true}}>
                        <div style={this.styles.inputBox}>
                            <span style={this.styles.label}>邮箱</span>
                            <input style={this.styles.input} type="text" ref="email" placeholder="请输入您要注册的邮箱" onBlur={this.setVal.bind(this,'signUpEmail')}/>
                        </div>
                    </FormValidator>
                    <FormValidator val={this.state.nickname} rules={{required:true,maxLen:20}}>
                        <div style={this.styles.inputBox}>
                            <span style={this.styles.label}>昵称</span>
                            <input style={this.styles.input} maxLength="21" type="text" ref="nickname" placeholder="请输入您要注册的昵称" onBlur={this.setVal.bind(this,'nickname')}/>
                        </div>
                    </FormValidator>
                    <FormValidator val={this.state.signUpPwd} rules={{required:true}}>
                        <div style={this.styles.inputBox}>
                            <span style={this.styles.label}>密码</span>
                            <input style={this.styles.input} type="password" ref="pwd" placeholder="请输入您的密码" onBlur={this.setVal.bind(this,'signUpPwd')}/>
                        </div>
                    </FormValidator>
                    <FormValidator val={this.state.confirmSignUpPwd} rules={{required:true}} delayValidate={{hasErr:this.state.confirmPwdErr,tips:'两次密码不一致~'}}>
                        <div style={this.styles.inputBox}>
                            <span style={this.styles.label}>确认密码</span>
                            <input style={this.styles.input} type="password" ref="confirmPwd" placeholder="请再次输入您的密码" onBlur={this.setVal.bind(this,'confirmSignUpPwd')}/>
                        </div>
                    </FormValidator>
                    <button style={this.styles.bigBtn} onClick={this.signup.bind(this)}> 
                        注 册
                    </button>
                </div>
                <div style={this.styles.info}>
                    <span style={this.styles.infoMessage}>已经有账号？</span>
                    <button style={this.styles.smallBtn} onClick={this.togglePage.bind(this,'login')}>去登录</button>
                </div>
                <div ref="transLayer" style={this.styles.transLayer}></div>
            </div>
        )
    }
}
export default withRouter(SignUpComponent);