import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import BigListItem from '../../../../components/BigListItem';
import NotLogin from '../../../../components/NotLogin';

import {getLatestDynamic,toggleLike} from '../../../../fetch/home/dynamic';

import {getLocalItem} from '../../../../util/util';

import styles from './style.less';

@inject('stateStore','userStore')
@observer class Dynamic extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            deg:0,
            dynamics:[],
            isLiking:false
        }
    }

    componentDidMount(){
        if(this.props.userStore.dynamics===''){
            this.setState({
                dynamics:[]
            })
            return;
        }
        if(this.props.userStore.dynamics.length>0){
            this.setState({
                dynamics:this.props.userStore.dynamics
            })
            return;
        }
        if(getLocalItem('token')){
            this.props.stateStore.setLoading(true);
            const res = getLatestDynamic(this.props.userStore.user.id);
            res
            .then((data)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('success','更新成功','2rem');
                this.setState({
                    dynamics:data
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail',e);
            })
        }
    }

    componentWillUnmount(){
        let temArr = this.state.dynamics;
        if(this.state.dynamics.length===0){
            temArr = '';
        }
        this.props.userStore.saveDynamics(temArr);
    }

    toggleLike(dynamicId){
        if(this.state.isLiking){
            return;
        }
        this.setState({
            isLiking:true
        },()=>{
            const res = toggleLike({
                user_id:this.props.userStore.user.id,
                dynamic_id:dynamicId
            });
            res.then(()=>{
                const strDynamics = JSON.stringify(this.state.dynamics);
                let temDynamics = JSON.parse(strDynamics);
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

    navTo(route){
        this.props.history.push(route);
    }

    //点击添加按钮
    postHandle(){
        this.setState({
            deg:135
        },()=>{
            setTimeout(()=>{
                this.navTo('/home/dynamic/postDynamic');
            },300)
        })
    }

    render(){
        return(
            <div className="dynamicPage">
                {
                    getLocalItem('token')?
                    [<ul className="dynamicList" key="dynamicList">
                        {
                            this.state.dynamics.map((item,index)=>{
                                return(
                                    <BigListItem
                                        key={item.id}
                                        img={item.userData.headimg}
                                        title={item.userData.nickname}
                                        mainInfo={item.content}
                                        tips={item.createtime.substring(0,16)}
                                        imgClickHandle={this.navTo.bind(this,'/personal/dynamic/'+item.userData.id)}
                                        liClickHandle={this.navTo.bind(this,'/personal/dynamic/detail/'+item.id)}
                                        itemClickHandle0={this.toggleLike.bind(this,item.id)}
                                        itemClickHandle1={this.navTo.bind(this,'/personal/dynamic/detail/'+item.id)}
                                        items={[
                                            {icon:'icon-fabulous',value:item.likeNum,selected:item.hasLiked},
                                            {icon:'icon-pinglun',value:item.commentNum}
                                        ]}
                                    />
                                )
                            })
                        }
                    </ul>,
                    <div
                        className="postBtn"
                        key="postBtn" 
                        style={{background:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor,
                                transform:'rotate('+this.state.deg+'deg)'}}
                        onClick={this.postHandle.bind(this)}>+</div>
                    ]
                    :
                    <NotLogin/>
                }
            </div>
        )
    }

}

export default Dynamic;