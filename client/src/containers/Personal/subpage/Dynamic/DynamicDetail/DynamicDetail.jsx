import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getDynamicDetail,sendComment} from '../../../../../fetch/home/dynamic';
import {perRem} from '../../../../../util/util';

import styles from './style.less';

import BigListItem from '../../../../../components/BigListItem';
import SubHeader from '../../../../../components/SubHeader';
import ListItem from '../../../../../components/ListItem';
import SendBox from '../../../../../components/SendBox';

@inject('stateStore','userStore')
@observer class DynamicDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            mode:'comment',
            userData:{
                id:'',
                nickname:'',
                headimg:''
            },
            content:'',
            createtime:'',
            likeList:[],
            commentList:[],
            sendValue:'',
            placeholder:'请输入评论内容',
            toId:''
        }
    }

    componentWillMount(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    }

    componentDidMount(){
        this.props.stateStore.setLoading(true);
        const res = getDynamicDetail(this.props.match.params.id);
        res.then((data)=>{
            this.props.stateStore.setLoading(false);
            this.setState({
                userData:data.userData,
                content:data.content,
                createtime:data.createtime,
                likeList:data.likeList,
                commentList:data.commentList
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail',e);
        })
    }


    //切换赞和评论区
    changeMode(mode){
        if(this.state.commentList.length<8 || mode==='like'){
            document.documentElement.scrollTop = document.body.scrollTop = 0;
        }else{
            document.documentElement.scrollTop = document.body.scrollTop = this.refs.listArea.offsetTop-4*perRem;
        }
        this.setState({
            mode:mode
        })
    }

    replyHandle(id,nickname){
        this.refs.sendBox.refs.input.focus();
        this.refs.sendBox.refs.input.value = '';
        this.setState({
            placeholder:'回复 '+nickname+'：',
            toId:id
        })
    }

    //获得发送的value
    getValue(e){
        this.setState({
            sendValue:e.target.value
        })
    }

    //发送评论
    send(){
        const value = this.state.sendValue;
        if(value === '' || value.trim().length===0){
            this.props.stateStore.setTips('fail','发送内容不能为空');
            return;
        }
        let res;
        //说明是回复的
        if(this.state.toId!==''){
            res = sendComment({
                fromId:this.props.userStore.user.id,
                toId:this.state.toId,
                dynamicId:this.props.match.params.id,
                content:value
            });
        }
        //正常评论
        else{
            res = sendComment({
                fromId:this.props.userStore.user.id,
                dynamicId:this.props.match.params.id,
                content:value
            });
        }
        res
        .then((data)=>{
            this.props.stateStore.setTips('fail','发送成功');
            this.refs.sendBox.refs.input.value = '';
            let temArr = this.state.commentList;
            temArr.unshift(data);
            this.setState({
                sendValue:'',
                commentList:temArr,
                toId:'',
                placeholder:'请输入评论内容'
            })
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail','发送失败');
        })
    }

    render(){
        return(
            <div className="dynamicDetail">
                <SubHeader title="动态详情" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <BigListItem 
                    img={this.state.userData.headimg}
                    title={this.state.userData.nickname}
                    mainInfo={this.state.content}
                    tips={this.state.createtime.substring(0,16)}
                    imgClickHandle={()=>{this.props.history.push('/personal/dynamic/'+this.state.userData.id)}}
                />
                <div className="dynamicDetailBar">
                    <span onClick={this.changeMode.bind(this,'like')}
                          className={this.state.mode==='like'?'selected':''}>{'赞 '+this.state.likeList.length}</span>
                    <span onClick={this.changeMode.bind(this,'comment')}
                          className={this.state.mode==='comment'?'selected':''}>{'评论 '+this.state.commentList.length}</span>
                </div>
                <div className="listArea" ref="listArea" id="listArea">
                {
                    this.state.mode==='comment'?
                    <div className="dynamicDetailInteraction">
                        <ul className="commentList">
                        {
                            this.state.commentList.length>0?
                            this.state.commentList.map((item,index)=>{
                                return(
                                    <BigListItem
                                        key={'comment'+index}
                                        img={item.from.headimg}
                                        title={item.from.nickname}
                                        mainInfo={
                                            Object.keys(item.to).length>0?
                                            `<a href='http://${window.location.host}/#/personal/dynamic/${item.to.id}'>回复 ${item.to.nickname}：</a>${item.content}`
                                            :item.content
                                        }
                                        tips={item.createtime.substring(0,16)}
                                        liClickHandle={this.replyHandle.bind(this,item.from.id,item.from.nickname)}
                                        imgClickHandle={()=>{this.props.history.push('/personal/dynamic/'+item.from.id)}}
                                    >
                                    </BigListItem>
                                )
                            })
                            :
                            <p className="nolike">还没有评论，快来抢沙发吧~</p>
                        }
                        </ul>
                        {
                            this.props.userStore.user.id!==''?
                            <SendBox
                                ref='sendBox'
                                btnHandleClick={this.send.bind(this)}
                                valueChangeHandle={this.getValue.bind(this)}
                                btnValue='发送'
                                placeholder={this.state.placeholder}/>:''
                        }
                    </div>
                    :
                    <div className="dynamicDetailInteraction">
                        <ul className="likeList">
                        {
                            this.state.likeList.length>0?
                            this.state.likeList.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'like'+index}
                                        img={item.headimg}
                                        type="normal" 
                                        title={item.nickname}
                                        liClickHandle={()=>{this.props.history.push('/personal/dynamic/'+item.id)}}/>
                                )
                            })
                            :
                            <p className="nolike">还没有人赞过</p>
                        }
                        </ul>
                    </div>
                }
                </div>
            </div>
        )
    }

}

export default DynamicDetail;