import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';
import io from 'socket.io-client';

import {getClientSize,perRem} from '../../../../util/util';

import {getChatLog} from '../../../../fetch/home/user';

import SubHeader from '../../../../components/SubHeader';
import SendBox from '../../../../components/SendBox';

import styles from './style.less';

let socket;
const clientSzie = getClientSize();
const headerAndFooterHeight = 4.2 * perRem;

@inject('stateStore','userStore')
@observer class Chat extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            sendValue:'',
            chatLogList:[],
            mainUser:{
                id:'',
                nickname:'',
                headimg:''
            },
            otherUser:{
                id:'',
                nickname:'',
                headimg:''
            }
        }
    }

    componentDidMount(){
        socket = io('http://localhost:3000');
        //发给服务器双方的id
        socket.emit('join',{
            id:this.props.userStore.user.id
        })

        socket.on('msg',(data)=>{
            if(data.from==this.props.userStore.user.id || data.from==this.props.match.params.id){
                let temList = this.state.chatLogList.slice();
                temList.push({
                    from_id:data.from,
                    createtime:new Date(),
                    content:data.msg
                })
                this.setState({
                    chatLogList:temList
                },()=>{
                    this.scrollToBottom();
                })
            }
        })


        //从数据库读取消息记录
        const res = getChatLog(this.props.userStore.user.id,this.props.match.params.id);
        res
        .then((data)=>{
            this.setState({
                mainUser:{
                    id:data.mainUser.id,
                    nickname:data.mainUser.nickname,
                    headimg:data.mainUser.headimg
                },
                otherUser:{
                    id:data.otherUser.id,
                    nickname:data.otherUser.nickname,
                    headimg:data.otherUser.headimg
                },
                chatLogList:data.chatLog
            },()=>{
                this.scrollToBottom();
            })
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail',e)
        })
    }

    send(){
        socket.emit('msg',{
            from:this.props.userStore.user.id,
            to:this.props.match.params.id,
            msg:this.state.sendValue
        });
        this.refs.SendBox.refs.input.value = '';
        this.setState({
            sendValue:''
        })
    }

    getValue(e){
        this.setState({
            sendValue:e.target.value
        })
    }

    scrollToBottom(){
        this.refs.chatContent.scrollTop = this.refs.chatContent.scrollHeight;
    }

    componentWillUnmount(){
        socket.close();
    }

    render(){
        return(
            <div className='chat' style={{height:clientSzie.height+'px',background: `linear-gradient(${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}, ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor})`}}>
                <SubHeader title={this.state.otherUser.nickname} bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <div className="chatContent" 
                     style={{height:(clientSzie.height-headerAndFooterHeight)+'px'}}
                     ref="chatContent"
                >
                    {
                        this.state.chatLogList.map((item,index)=>{
                            const timestamp = new Date(item.createtime);
                            return(
                                <div className={this.props.userStore.user.id===item.from_id?'chatBox chatBoxSelf':'chatBox'} key={index}>
                                    {
                                        index===0?
                                        <div className="chatTimeBox">
                                            <span className="chatTime">
                                            {(timestamp.getMonth()+1)+'-'+timestamp.getDate()+' '+timestamp.getHours()+':'+((timestamp.getMinutes()+'').padStart(2,'0'))}
                                            </span>
                                        </div>
                                        :
                                        timestamp-new Date(this.state.chatLogList[index-1].createtime)>600000?
                                        <div className="chatTimeBox">
                                            <span className="chatTime">{(timestamp.getMonth()+1)+'-'+timestamp.getDate()+' '+timestamp.getHours()+':'+timestamp.getMinutes()}</span>
                                        </div>
                                        :
                                        ''
                                    }
                                    <div className="chatBoxBody">
                                        <div className="chatter" onClick={()=>{this.props.history.push('/personal/dynamic/'+item.from_id)}}>
                                            <img src={this.props.userStore.user.id===item.from_id?this.state.mainUser.headimg:this.state.otherUser.headimg} alt="头像"/>
                                        </div>
                                        <div className="chatText">
                                            <p>{item.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <SendBox
                    ref="SendBox" 
                    btnHandleClick={this.send.bind(this)}
                    valueChangeHandle={this.getValue.bind(this)}
                    placeholder="说点什么"
                    btnValue='发送'
                />
            </div>
        )
    }

}

export default Chat;