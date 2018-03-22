import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {setNickname,setSex,setHeadimg,setPwd} from '../../../../fetch/home/user';

import SubHeader from '../../../../components/SubHeader';
import ListItem from '../../../../components/ListItem';
import Button from '../../../../components/Button';
import TextInput from '../../../../components/TextInput';
import MiniPopup from '../../../../components/MiniPopup';

import styles from './style.less';

@inject ('userStore','stateStore')
@observer class Data extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            popupShow:''
        }
    }

    navTo(route){
        this.props.history.push(route);
    }

    togglePopup(popup){
        this.setState({
            popupShow:popup
        })
    }

    logout(){
        localStorage.removeItem('token');
        window.location.reload(true);
    }

    changeNickname(){
        const newNickName = this.refs.textInput.refs.textInput.value;
        if(newNickName===''){
            this.props.stateStore.setTips('fail','输入框不能为空');
            return;
        }
        this.setState({
            popupShow:''
        })
        const res = setNickname({
            id:this.props.userStore.user.id,
            nickname:newNickName
        });
        res
        .then((nickname)=>{
            this.props.userStore.setUser({nickname:nickname});
            this.props.stateStore.setTips('success','更新成功','2rem');
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e);
        })
    }

    changeSex(index){
        const res = setSex({
            id:this.props.userStore.user.id,
            sex:index
        });
        res
        .then((sex)=>{
            this.props.userStore.setUser({sex:sex});
            this.props.stateStore.setTips('success','更新成功','2rem');
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e);
        })
    }

    changeHeadimg(){
        const newHeadimg = this.refs.textInput.refs.textInput.value;
        if(newHeadimg===''){
            this.props.stateStore.setTips('fail','路径不能为空');
            return;
        }
        this.setState({
            popupShow:''
        })
        const res = setHeadimg({
            id:this.props.userStore.user.id,
            headimg:newHeadimg
        });
        res
        .then((headimg)=>{
            this.props.userStore.setUser({headimg:headimg});
            this.props.stateStore.setTips('success','更新成功','2rem');
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e);
        })
    }

    changePwd(){
        const oldPwd = this.refs.old.refs.textInput.value;
        const newPwd = this.refs.new.refs.textInput.value;
        if(oldPwd==='' || newPwd===''){
            this.props.stateStore.setTips('fail','输入框不能为空');
            return;
        }
        this.setState({
            popupShow:''
        })
        const res = setPwd({
            id:this.props.userStore.user.id,
            oldPwd:oldPwd,
            newPwd:newPwd
        });
        res
        .then(()=>{
            this.props.stateStore.setTips('success','更改密码成功','2rem');
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e);
        })
    }

    render(){
        return(
            <div className="personalData">
                <SubHeader title="修改资料" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <div className="baseData">
                    <div className="dataImg">
                        <img src={this.props.userStore.user.headimg} alt="头像"/>
                    </div>
                    <span className="userID">{this.props.userStore.user.email}</span>
                </div>
                <ul className="dataList">
                    <ListItem type="normal" title="昵称" value={this.props.userStore.user.nickname} liClickHandle={this.togglePopup.bind(this,'name')}/>
                    <ListItem type="options" title="性别" firstRenderOption={this.props.userStore.user.sex} options={['保密','男','女']} selectHandle={this.changeSex.bind(this)}/>
                    <ListItem type="normal" title="城市" value={this.props.userStore.user.city} liClickHandle={this.navTo.bind(this,'/personal/data/city')}/>
                    <ListItem type="normal" title="更换头像" value='' liClickHandle={this.togglePopup.bind(this,'headimg')}/>
                    <ListItem type="normal" title="修改密码" value='' liClickHandle={this.togglePopup.bind(this,'password')}/>
                </ul>
                <div className="btnBox">
                    <Button id="dataLogoutBtn" value="退出登录" btnClickHandle={this.togglePopup.bind(this,'logout')}/>
                </div>
                {
                    this.state.popupShow==='name'?
                    <MiniPopup title="修改昵称" hide={this.togglePopup.bind(this,'')}>
                        <TextInput ref="textInput" placeholder="请输入新的昵称" maxLen="20"/>
                        <Button type="deep" size="big" value="确定" btnClickHandle={this.changeNickname.bind(this)}/>
                    </MiniPopup>:''
                }
                {
                    this.state.popupShow==='headimg'?
                    <MiniPopup title="修改头像" hide={this.togglePopup.bind(this,'')}>
                        <TextInput ref="textInput" placeholder="请输入新头像的图片路径"/>
                        <Button type="deep" size="big" value="确定" btnClickHandle={this.changeHeadimg.bind(this)}/>
                    </MiniPopup>:''
                }
                {
                    this.state.popupShow==='password'?
                    <MiniPopup title="修改密码" hide={this.togglePopup.bind(this,'')}>
                        <TextInput ref="old" type="password" placeholder="请输入现在的密码"/>
                        <TextInput ref="new" type="password" placeholder="请输入新的密码"/>
                        <Button type="deep" size="big" value="确定" btnClickHandle={this.changePwd.bind(this)}/>
                    </MiniPopup>:''
                }
                {
                    this.state.popupShow==='logout'?
                    <MiniPopup title="退出登录" hide={this.togglePopup.bind(this,'')}>
                        <p>确定退出当前账号吗？</p>
                        <div className="miniPopupBtnBox">
                            <Button value="确定" btnClickHandle={this.logout.bind(this)}/>
                            <Button value="取消" btnClickHandle={this.togglePopup.bind(this,'')}/>
                        </div>
                    </MiniPopup>:''
                }
            </div>
        )
    }

}

export default Data;