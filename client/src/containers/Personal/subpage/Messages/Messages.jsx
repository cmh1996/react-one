import React from 'react'; 
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {sendComment} from '../../../../fetch/home/dynamic';
import {getLetter,getComment,getLike} from '../../../../fetch/home/user';

import SubHeader from '../../../../components/SubHeader';
import TagHeader from '../../../../components/TagHeader';
import ListItem from '../../../../components/ListItem';
import BigListItem from '../../../../components/BigListItem';
import MiniPopup from '../../../../components/MiniPopup';
import Button from '../../../../components/Button';

import styles from './style.less';

@inject('stateStore','userStore')
@observer class Messages extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            type:0,
            letterList:[],
            gotCommentList:[],
            sentCommentList:[],
            gotLikeList:[],
            sentLikeList:[],
            popupShow:false,
            count:0,
            val:'',
            likeType:0,
            commentType:0,
            curToId:'',
            curDynamicId:''
        };
        this.selfId=this.props.userStore.user.id
    }
    componentDidMount(){
        this.fetchData(this.selfId);
    }

    switchType(index){
        this.setState({
            type:index
        },()=>{
            this.fetchData(this.selfId);
        })
    }

    fetchData(id){
        this.props.stateStore.setLoading(true);
        if(this.state.type===0){
            if(this.state.letterList.length>0){
                this.props.stateStore.setLoading(false);
                return;
            }
            const res = getLetter(id);
            res.then((list)=>{
                this.props.stateStore.setLoading(false);
                this.setState({
                    letterList:list
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail',e);
            })
        }
        else if(this.state.type===1){
            if(this.state.gotCommentList.length>0 || this.state.sentCommentList.length>0){
                this.props.stateStore.setLoading(false);
                return;
            }
            const res = getComment(id);
            res.then((data)=>{
                this.props.stateStore.setLoading(false);
                this.setState({
                    gotCommentList:data.gotComment,
                    sentCommentList:data.sentComment
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail',e);
            })
        }
        else if(this.state.type===2){
            if(this.state.gotLikeList.length>0 || this.state.sentLikeList.length>0){
                this.props.stateStore.setLoading(false);
                return;
            }
            const res = getLike(id);
            res.then((data)=>{
                this.props.stateStore.setLoading(false);
                this.setState({
                    gotLikeList:data.gotLike,
                    sentLikeList:data.sendLike
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail',e);
            })
        }
    }

    navTo(route){
        this.props.history.push(route);
    }

     toggleMiniPopup(show){
        this.setState({
            popupShow:show
        })
    }

    setCurId(toId,dynamicId){
        this.setState({
            curToId:toId,
            curDynamicId:dynamicId,
            popupShow:true
        })
    }

    sendReply(){
        const val = this.state.val;
        if(val === '' || val.trim().length===0){
            this.props.stateStore.setTips('fail','发送内容不能为空');
            return;
        }
        if(this.state.curToId!==''){
            let res = sendComment({
                fromId:this.props.userStore.user.id,
                toId:this.state.curToId,
                dynamicId:this.state.curDynamicId,
                content:val
            });
            res
            .then((data)=>{
                this.props.stateStore.setTips('fail','发送成功');
                this.refs.replyComment.value = '';
                this.setState({
                    count:0,
                    val:'',
                    curDynamicId:'',
                    curToId:'',
                    popupShow:false
                })
            })
            .catch((e)=>{
                this.props.stateStore.setTips('fail','发送失败');
            })
        }
    }

    compute(e){
        this.setState({
            count:e.target.value.length,
            val:e.target.value
        })
    }

    switchLikeType(index){
        this.setState({
            likeType:index
        })
    }

    switchCommentType(index){
        this.setState({
            commentType:index
        })
    }

    render(){
        return(
            <div className="messagesPage">
                <SubHeader title="消息" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <TagHeader
                    firstRenderItem={this.state.type}
                    items={[{title:'私信'},{title:'评论'},{title:'赞'}]}
                    selectHandle={this.switchType.bind(this)}
                    selectedColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                <div className="messagesContent">
                    {
                        this.state.type===0?
                        this.state.letterList.map((item,index)=>{
                            return(
                                <ListItem
                                    key={'letter'+index}
                                    img={item.userData.headimg}
                                    type="normal" 
                                    title={item.userData.nickname}
                                    info={item.content}
                                    value={item.createtime.substring(0,16)}
                                    noArrow={true}
                                    liClickHandle={this.navTo.bind(this,'/personal/chat/'+item.userData.id)}
                                />
                            )
                        })
                        :
                        this.state.type===1?
                        <div className="commentList">
                            <div className="typeBox">
                                <span onClick={this.switchCommentType.bind(this,0)} className={this.state.commentType===0?'selected':''}>收到的评论</span>
                                <span onClick={this.switchCommentType.bind(this,1)} className={this.state.commentType===1?'selected':''}>发出的评论</span>
                            </div>
                            {
                                this.state.commentType===0?
                                this.state.gotCommentList.map((item,index)=>{
                                    return(
                                        item.dynamic?
                                        <BigListItem
                                            key={'gotComment'+index}
                                            img={item.fromUser.headimg}
                                            title={item.fromUser.nickname}
                                            mainInfo={item.content}
                                            subInfo={'原文：'+item.dynamic.content}
                                            tips={item.createtime.substring(0,16)}
                                            items={[{icon:'icon-pinglun',value:'回复'}]}
                                            imgClickHandle={this.navTo.bind(this,'/personal/dynamic/'+item.fromUser.id)}
                                            liClickHandle={this.navTo.bind(this,'/personal/dynamic/detail/'+item.dynamic.id)}
                                            itemClickHandle0={this.setCurId.bind(this,item.fromUser.id,item.dynamic.id)}
                                        />
                                        :''
                                    )
                                })
                                :
                                this.state.sentCommentList.map((item,index)=>{
                                    return(
                                        <BigListItem
                                            img={this.props.userStore.user.headimg}
                                            key={'sentComment'+index}
                                            title={this.props.userStore.user.nickname}
                                            mainInfo={
                                                Object.keys(item.toUser).length>0?
                                                `<a href='http://${window.location.host}/#/personal/dynamic/${item.toUser.id}'>回复 ${item.toUser.nickname}：</a>${item.content}`
                                                :'评论：'+item.content
                                            }
                                            subInfo={item.dynamic?"原文："+item.dynamic.content:'该动态已被删除'}
                                            tips={item.createtime.substring(0,16)}
                                            liClickHandle={item.dynamic?this.navTo.bind(this,'/personal/dynamic/detail/'+item.dynamic.id):()=>{return;}}
                                        />
                                    )
                                })
                            }
                            {
                                this.state.popupShow?
                                <MiniPopup title="回复评论" hide={this.toggleMiniPopup.bind(this,false)}>
                                    <textarea autoFocus 
                                        name="comment" 
                                        id="comment" 
                                        cols="30" 
                                        rows="3"
                                        maxLength="50"
                                        placeholder="说点什么"
                                        ref="replyComment"
                                        onChange={this.compute.bind(this)}>
                                    </textarea>
                                    <span className="tips">{this.state.count+'/50'}</span>
                                    <div className="miniPopupBtnBox">
                                        <Button type="deep" value="确定" btnClickHandle={this.sendReply.bind(this)}/>
                                        <Button type="deep" value="取消" btnClickHandle={this.toggleMiniPopup.bind(this,false)}/>
                                    </div>
                                </MiniPopup>:''
                            }
                        </div>
                        :
                        this.state.type===2?
                        <div>
                            <div className="typeBox">
                                <span onClick={this.switchLikeType.bind(this,0)} className={this.state.likeType===0?'selected':''}>收到的赞</span>
                                <span onClick={this.switchLikeType.bind(this,1)} className={this.state.likeType===1?'selected':''}>发出的赞</span>
                            </div>
                            {
                                this.state.likeType===0?
                                this.state.gotLikeList.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'gotlike'+index}
                                        img={item.userData.headimg}
                                        type="normal" 
                                        title={item.userData.nickname}
                                        titleTips={true}
                                        info={"原文："+item.dynamicData.content}
                                        value={item.createtime.substring(0,16)}
                                        noArrow={true}
                                        liClickHandle={this.navTo.bind(this,'/personal/dynamic/detail/'+item.dynamicData.id)}
                                    >
                                        <span className="titleTips">赞了你</span>
                                    </ListItem>
                                )
                            })
                            :
                            this.state.sentLikeList.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'sentlike'+index}
                                        type="normal" 
                                        title={'赞了'}
                                        titleTips={true}
                                        info={"原文："+item.dynamic.content}
                                        value={item.createtime.substring(0,16)}
                                        noArrow={true}
                                        liClickHandle={this.navTo.bind(this,'/personal/dynamic/detail/'+item.dynamic.id)}
                                    >
                                        <span className="titleTips">{item.userData.nickname}</span>
                                    </ListItem>
                                )
                            })
                        }
                        </div>:''
                    }
                </div>
            </div>
        )
    }

}

export default Messages;