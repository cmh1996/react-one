import React from 'react'; 
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {addSchedule,getSchedule,editSchedule,deleteSchedule,toggleDone} from '../../../../fetch/home/timetable';

import Popup from '../../../../components/Popup';
import SubHeader from '../../../../components/SubHeader';
import MiniPopup from '../../../../components/MiniPopup';
import Button from '../../../../components/Button';

import {getClientSize,formalTime} from '../../../../util/util';

import styles from './style.less';

const clientSize = getClientSize();

@inject('stateStore','userStore')
@observer class Timetable extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            deg:0,
            popupShow:false,
            miniPopupShow:'',
            scheduleList:[],
            curScheduleId:'',
            toggling:false,
            curEditId:''
        }
    }
    componentDidMount(){
        this.fetchSchedule();
    }

    fetchSchedule(){
        this.props.stateStore.setLoading(true);
        const res = getSchedule(this.props.userStore.user.id);
        res
        .then((data)=>{
            this.props.stateStore.setLoading(false);
            this.setState({
                scheduleList:data
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail',e);
        })
    }

    //控制小弹窗内容及显示
    togglePopup(type){
        this.setState({
            miniPopupShow:type
        })
    }

    //点击添加按钮
    btnClickHandle(){
        this.setState({
            deg:135,
            popupShow:true,
            curEditId:''
        })
    }

    //点击编辑按钮
    editClickHandle(item){
        this.setState({
            popupShow:true,
            curEditId:item.id
        },()=>{
            this.refs.title.value = item.title;
            this.refs.remark.value = item.remark;
            this.refs.year.value = item.matter_time.substring(0,4);
            this.refs.month.value = item.matter_time.substring(5,7);
            this.refs.date.value = item.matter_time.substring(8,10);
            this.refs.hour.value = item.matter_time.substring(11,13);
            this.refs.minute.value = item.matter_time.substring(14,16);
        })
    }

    //大弹窗取消按钮
    cancel(){
        this.setState({
            popupShow:false,
            deg:0
        })
    }

    deleteItem(id){
        this.setState({
            curScheduleId:id,
            miniPopupShow:'delete'
        })
    }

    confirmDelete(){
        const res = deleteSchedule({id:this.state.curScheduleId});
        res.then(()=>{
            let temArr = this.state.scheduleList;
            temArr.map((item,index)=>{
                if(item.id===this.state.curScheduleId){
                    temArr.splice(index,1)
                }
            });
            this.setState({
                scheduleList:temArr,
                miniPopupShow:'deleteSuccess'
            })
        })
        .catch((e)=>{
            this.setState({
                miniPopupShow:'deleteFailed'
            })
        })
    }

    //大弹窗确认按钮
    confirm(){
        const title = this.refs.title.value.trim();
        const remark = this.refs.remark.value.trim();
        const year = this.refs.year.value.trim();
        const month = this.refs.month.value.trim();
        const date = this.refs.date.value.trim();
        const hour = this.refs.hour.value.trim();
        const minute = this.refs.minute.value.trim();
        if(title.length==0 || year.length==0 || month.length==0 || date.length==0 || hour.length==0 ||minute.length==0){
            this.setState({
                miniPopupShow:'required'
            });
            return;
        }
        if(isNaN(year) || isNaN(month) || isNaN(date) || isNaN(hour) || isNaN(minute)){
            this.setState({
                miniPopupShow:'timeErr'
            });
            return;
        }
        if(year<0 || year>9999 || month<1 || month>12 || date<1 || date>31 || hour<0 || hour>23 || minute<0 ||minute>59){
            this.setState({
                miniPopupShow:'timeErr'
            });
            return;
        }
        this.props.stateStore.setLoading(true);
        //说明是编辑的
        if(this.state.curEditId!==''){
            const res = editSchedule({
                id:this.state.curEditId,
                title:title,
                remark:remark,
                time:formalTime(year,month,date,hour,minute)
            });
            res
            .then(()=>{
                this.props.stateStore.setLoading(false);
                this.fetchSchedule();
                this.setState({
                    popupShow:false,
                    deg:0
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','修改日程失败')
            })
        }
        //新建的
        else{
            const res = addSchedule({
                user:this.props.userStore.user.id,
                title:title,
                remark:remark,
                time:formalTime(year,month,date,hour,minute)
            });
            res
            .then((data)=>{
                this.props.stateStore.setLoading(false);
                const temArr = this.state.scheduleList.slice();
                temArr.unshift(data);
                this.setState({
                    scheduleList:temArr,
                    popupShow:false,
                    deg:0
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','新建日程失败')
            })
        }
    }
    
    toggleDone(id){
        if(this.state.toggling){
            return;
        }
        this.setState({
            toggling:true
        },()=>{
            const res = toggleDone({
                id:id
            });
            res
            .then(()=>{
                this.setState({
                    toggling:false
                },()=>{
                    this.fetchSchedule();
                })
            })
            .catch((e)=>{
                this.props.stateStore.setTips('fail',e);
                this.setState({
                    toggling:false
                })
            })
        })
    }

    render(){
        const today = new Date();
        return(
            <div className="timetable" style={{minHeight:clientSize.height+'px',background: `linear-gradient(${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}, ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor})`}}>
                <SubHeader title="我的日程" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <div className="personalInfo">
                    <span>{this.props.userStore.user.nickname}</span>
                    <img src={this.props.userStore.user.headimg} alt="头像"/>
                </div>
                <div className="send">
                    <div className="sendTips">
                        <span className="sendTipsTitle">
                        My Tasks
                        <span className="sendTipsTime">{today.getFullYear()+'.'+(today.getMonth()+1)+'.'+(today.getDate())}</span>
                        </span>
                        <span className="note">
                            <span className="normal"></span>未完成  
                            <span className="expired"></span>已完成
                        </span>
                    </div>
                    <span 
                        className="sendBtn" 
                        style={{transform:'rotate('+this.state.deg+'deg)'}}
                        onClick={this.btnClickHandle.bind(this)}>+</span>
                </div>
                <ul className="tasksList">
                    {
                        this.state.scheduleList.map((item,index)=>{
                            return(
                                <li key={item.id} className={item.status===0?"task normal":"task expired"}>
                                    <div className="taskLeft">
                                        <span>{item.title}</span>
                                        <p>{item.remark}</p>
                                        <div className="taskBtn">
                                            <button className={item.status===0?'unDone':'done'} onClick={this.toggleDone.bind(this,item.id)}>{item.status===0?'未完成':'已完成'}</button>
                                            <button className="taskEditBtn" onClick={this.editClickHandle.bind(this,item)}>编辑</button>
                                            <button className="taskDeleteBtn" onClick={this.deleteItem.bind(this,item.id)}>删除</button>
                                        </div>
                                    </div>
                                    <div className="taskTime">
                                        <span className="taskYmd">{item.matter_time.substring(0,10)}<br/>{item.matter_time.substring(10,16)}</span>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                {
                    this.state.popupShow?
                    <Popup 
                       show={this.state.popupShow}
                       cancelHandle={this.cancel.bind(this)}
                       confirmHandle={this.confirm.bind(this)}>
                        <input 
                            type="text"
                            ref="title"
                            placeholder="请输入日程标题"
                            className="newTaskTitle"
                            maxLength="30"
                            />
                        <textarea
                            ref="remark"
                            cols="30"
                            rows="7"
                            maxLength="140"
                            placeholder="日程备注，最多140字">
                        </textarea>
                        <div className="newTaskTime">
                            <input type="text" ref="year"/>年
                            <input type="text" ref="month"/>月
                            <input type="text" ref="date"/>日
                            <input type="text" ref="hour"/>：<input type="text" ref="minute"/>
                        </div>
                    </Popup>
                    :''
                }
                {
                    this.state.miniPopupShow==='required'?
                    <MiniPopup title="提示" hide={this.togglePopup.bind(this,'')}>
                        <p>输入框不能为空</p>
                    </MiniPopup>:''
                }
                {
                    this.state.miniPopupShow==='timeErr'?
                    <MiniPopup title="提示" hide={this.togglePopup.bind(this,'')}>
                        <p>请输入正确的日期格式，<br/>如：2017年11月8日15:31</p>
                    </MiniPopup>:''
                }
                {
                    this.state.miniPopupShow==='deleteSuccess'?
                    <MiniPopup title="删除" hide={this.togglePopup.bind(this,'')}>
                        <p>删除成功</p>
                    </MiniPopup>:''
                }
                {
                    this.state.miniPopupShow==='deleteFailed'?
                    <MiniPopup title="删除" hide={this.togglePopup.bind(this,'')}>
                        <p>删除失败</p>
                    </MiniPopup>:''
                }
                {
                    this.state.miniPopupShow==='delete'?
                    <MiniPopup title="删除" hide={this.togglePopup.bind(this,'')}>
                        <p>您确认删除这条日程吗？</p>
                        <div className="miniPopupBtnBox">
                            <Button value="确定" btnClickHandle={this.confirmDelete.bind(this)}/>
                            <Button value="取消" btnClickHandle={this.togglePopup.bind(this,'')}/>
                        </div>
                    </MiniPopup>:''
                }
            </div>
        )
    }

}

export default Timetable;