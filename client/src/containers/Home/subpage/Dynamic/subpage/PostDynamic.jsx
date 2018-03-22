import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import MiniPopup from '../../../../../components/MiniPopup';
import Button from '../../../../../components/Button';

import {postDynamic} from '../../../../../fetch/home/dynamic';

import {getClientSize,perRem} from '../../../../../util/util';

import styles from './style.less';

@inject('stateStore','userStore')
@observer class PostDynamic extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            popupShow:''
        }
    }

    togglePopup(popup){
        this.setState({
            popupShow:popup
        })
    }

    postConfirm(){
        const text = this.refs.dynamicContent.value;
        if(text==='' || text.trim().length===0){
            alert('输入内容不能为空');
            this.setState({
                popupShow:''
            });
            return;
        }

        const res = postDynamic({
            id:this.props.userStore.user.id,
            content:text
        });
        res
        .then((msg)=>{
            this.props.userStore.saveDynamics([]);
            this.props.stateStore.setTips('success',msg,'2rem');
            this.props.history.goBack();
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e);
        })
    }

    render(){
        return(
            <div className="postDynamicPage" style={{height:getClientSize().height}}>
                <header className="headeBar">
                    <span className="leftIcon" onClick={()=>{this.props.history.goBack()}}><i className="iconfont icon-return"/></span>
                    <img src={this.props.userStore.user.headimg}/>
                    <span className="rightIcon" onClick={this.togglePopup.bind(this,'send')}>发送</span>
                </header>
                <textarea
                    autoFocus
                    ref="dynamicContent"
                    name="dynamicContent"
                    maxLength="140"
                    placeholder="说点什么吧~"
                    style={{height:getClientSize().height-2*perRem}}/>
                {
                    this.state.popupShow==='send'?
                    <MiniPopup title="发送" hide={this.togglePopup.bind(this,'')}>
                        <p>确定发送吗？</p>
                        <div className="miniPopupBtnBox">
                            <Button value="确定" btnClickHandle={this.postConfirm.bind(this)}/>
                            <Button value="取消" btnClickHandle={this.togglePopup.bind(this,'')}/>
                        </div>
                    </MiniPopup>:''
                }
            </div>
        )
    }

}

export default PostDynamic;