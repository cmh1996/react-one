import React from 'react'; 
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import ListItem from '../../../../components/ListItem';
import SubHeader from '../../../../components/SubHeader';
import MiniPopup from '../../../../components/MiniPopup';
import Button from '../../../../components/Button';

import {searchUser} from '../../../../fetch/home/user';
import {getClientSize} from '../../../../util/util';

import styles from './style.less';

@inject('stateStore')
@observer class AddFriends extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            userList:[],
            firstRender:true,
            popupShow:false
        }
    }

    searchConfirm(e){
        let keynum=e.keyCode||e.which;
        if(keynum == "13") {
            const keyWord = this.refs.searchInput.value;
            if(keyWord==='' || keyWord.trim().length===0){
                this.setState({
                    popupShow:true
                })
                return;
            }

            this.props.stateStore.setLoading(true);
            const res = searchUser(keyWord);
            res
            .then((userList)=>{
                this.props.stateStore.setLoading(false);
                this.setState({
                    userList:userList,
                    firstRender:false
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.setState({
                    firstRender:false
                })
            })

            e.preventDefault();  
        }
        
    }

    cancel(){
        this.refs.searchInput.value = '';
    }

    hidePopup(){
        this.setState({
            popupShow:false
        })
    }

    render(){
        return(
            <div className="addFriendsPage">
                <SubHeader title="添加好友" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <div className="searchBox">
                    <input ref='searchInput' type="text" placeholder="请输入用户Email / 昵称" onKeyPress={this.searchConfirm.bind(this)}/>
                    <i className="iconfont icon-close" onClick={this.cancel.bind(this)}/>
                </div>
                <ul className="userList">
                    {
                        this.state.userList.length>0 || this.state.firstRender?
                        this.state.userList.map((item,index)=>{
                            return(
                                <ListItem
                                    key={item.id}
                                    img={item.headimg}
                                    titleTips={true}
                                    title={item.nickname}
                                    type='normal'
                                    info={'地区：'+item.city}
                                    liClickHandle={()=>{this.props.history.push('/personal/dynamic/'+item.id)}}
                                >
                                    <span className="rightTips">{item.email}</span>
                                </ListItem>
                            )
                        })
                        :
                        <p className="noResult">没有更多结果</p>
                    }
                    {
                        this.state.popupShow?
                        <MiniPopup title="提示" hide={this.hidePopup.bind(this)}>
                            输入框不能为空
                        </MiniPopup>:''
                    }
                </ul>
            </div>
        )
    }

}

export default AddFriends;