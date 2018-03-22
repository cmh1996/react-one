import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import {getPersonalDynamic,toggleLike,deleteDynamic} from '../../../../fetch/home/dynamic';
import {followUser,cancelFollowUser} from '../../../../fetch/home/user';

import styles from './style.less';

import BigListItem from '../../../../components/BigListItem';
import SubHeader from '../../../../components/SubHeader';

/*有三种情况：1、游客进入，2.本人进入，3.其他已注册用户进入*/
@inject ('userStore','stateStore')
@observer class Dynamic extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            user:{
                nickname:'',
                sex:'',
                headimg:''
            },
            rel:{
                followNum:'',
                fansNum:'',
                hasFollowed:''
            },
            dynamics:[],
            isLiking:false
        }
        this.selfId = this.props.userStore.user.id; //本人的id
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.id!==nextProps.match.params.id){
            this.fetchData(nextProps.match.params.id);
        }
    }

    componentDidMount(){
        this.fetchData(this.props.match.params.id);
    }

    fetchData(curId){
        this.props.stateStore.setLoading(true);

        const res = getPersonalDynamic(this.selfId,curId);
        res.then((data)=>{
            this.props.stateStore.setLoading(false);
            this.setState({
                user:data.user,
                rel:data.rel,
                dynamics:data.dynamics
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail',e);
        })
    }

    like(){
        if(this.selfId===''){
            return;
        }
    }

    navTo(route){
        this.props.history.push(route);
    }

    followUser(){
        const res = followUser({
            from_id:this.selfId,
            to_id:this.props.match.params.id
        });
        res
        .then((msg)=>{
            this.setState({
                rel:Object.assign(this.state.rel,{hasFollowed:true})
            })
            this.props.stateStore.setTips('success',msg,'2rem');
        })
        .catch((msg)=>{
            this.props.stateStore.setTips('fail',msg);
        })
    }

    cancelFollowUser(){
        const res = cancelFollowUser({
            from_id:this.selfId,
            to_id:this.props.match.params.id
        });
        res
        .then((msg)=>{
            this.setState({
                rel:Object.assign(this.state.rel,{hasFollowed:false})
            })
            this.props.stateStore.setTips('success',msg,'2rem');
        })
        .catch((msg)=>{
            this.props.stateStore.setTips('fail',msg);
        })
    }

    toggleLike(dynamicId){
        if(this.state.isLiking || this.selfId===''){
            return;
        }
        this.setState({
            isLiking:true
        },()=>{
            const res = toggleLike({
                user_id:this.selfId,
                dynamic_id:dynamicId
            });
            res.then(()=>{
                let temDynamics = this.state.dynamics;
                temDynamics.map((item,index)=>{
                    if(item.id===dynamicId){
                        if(item.hasLiked){
                            item.likeNum-=1;
                        }else{
                            item.likeNum+=1;
                        }
                        item.hasLiked = !item.hasLiked;
                    }
                })
                this.setState({
                    dynamics:temDynamics,
                    isLiking:false
                })
            })
            .catch((e)=>{
                this.props.stateStore.setTips('fail',e);
                this.setState({
                    isLiking:false
                })
            })
        })
    }

    deleteDynamic(id,e){
        e.stopPropagation();
        const res = deleteDynamic({id:id});
        res
        .then(()=>{
            let temArr = this.state.dynamics.slice(0);
            for(let i=0;i<temArr.length;i++){
                if(temArr[i].id===id){
                    temArr.splice(i,1);
                }
            }
            this.setState({
                dynamics:temArr
            })
        })
        .catch((err)=>{
            this.props.stateStore.setTips('fail','删除失败')
        })
    }

    render(){
        const isSelf = Number(this.selfId)===Number(this.props.match.params.id);
        return(
            <div className="personalDynamic">
               <SubHeader title=""/>
               <div className="dynamicData">
                    <img src={this.state.user.headimg} alt="头像"/>
                    <span className='dynamicDataName'>
                        {this.state.user.nickname}
                        {
                            this.state.user.sex===1?
                            <span className="sexIcon man">♂</span>
                            :
                            this.state.user.sex===2?
                            <span className="sexIcon woman">♀</span>:''
                        }
                    </span>
                    <div className="dynamicDataRelative">
                        <Link 
                            className="dynamicDataFollowNum"
                            to={{
                                pathname:'/personal/friends/'+this.props.match.params.id,
                                state:{type:0}
                            }}
                        >
                            {'关注 '+this.state.rel.followNum}
                        </Link>
                        <Link 
                            className="dynamicDataFansNum" 
                            to={{
                                pathname:'/personal/friends/'+this.props.match.params.id,
                                state:{type:1}
                            }}
                        >
                            {'粉丝 '+this.state.rel.fansNum}
                        </Link>
                    </div>
                    {
                        this.selfId!=='' && this.selfId!=this.props.match.params.id?
                        <div className="dynamicDataFooter">
                            {
                                this.state.rel.hasFollowed?
                                <span className="dynamicDataFollowBtn" onClick={this.cancelFollowUser.bind(this)}>取消关注</span>
                                :
                                <span className="dynamicDataFollowBtn" onClick={this.followUser.bind(this)}>添加关注</span>
                            }
                            <span className="dynamicDataChatBtn" onClick={this.navTo.bind(this,'/personal/chat/'+this.props.match.params.id)}>聊天</span>
                        </div>:''
                    }
               </div>
               <ul className="dynamicList">
                    {
                        this.state.dynamics.map((item,index)=>{
                            return(
                                <BigListItem
                                    key={item.id}
                                    img={this.state.user.headimg}
                                    title={this.state.user.nickname}
                                    mainInfo={item.content}
                                    tips={item.createtime.substring(0,16)}
                                    rightTips={isSelf?true:false}
                                    liClickHandle={this.navTo.bind(this,'/personal/dynamic/detail/'+item.id)}
                                    itemClickHandle0={this.toggleLike.bind(this,item.id)}
                                    itemClickHandle1={this.navTo.bind(this,'/personal/dynamic/detail/'+item.id)}
                                    items={[
                                        {icon:'icon-fabulous',value:item.likeNum,selected:item.hasLiked},
                                        {icon:'icon-pinglun',value:item.commentNum}
                                    ]}
                                >
                                    <span className="bigListItemRightTips" onClick={this.deleteDynamic.bind(this,item.id)}>
                                        <i className="iconfont icon-close"/>
                                    </span>
                                </BigListItem>
                            )
                        })
                    }
               </ul>
            </div>
        )
    }

}

export default Dynamic;