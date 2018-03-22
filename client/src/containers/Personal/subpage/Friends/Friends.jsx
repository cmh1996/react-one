import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getFollow,getFans} from '../../../../fetch/home/user';

import SubHeader from '../../../../components/SubHeader';
import TagHeader from '../../../../components/TagHeader';
import ListItem from '../../../../components/ListItem';

import styles from './style.less';

@inject('stateStore')
@observer class Friends extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            type:this.props.history.location.state?this.props.history.location.state.type:0,
            followList:[],
            fansList:[],
        }
    }

    componentDidMount(){
        this.fetchData();
    }

    navTo(id){
        this.props.history.push('/personal/dynamic/'+id)
    }

    switchType(index){
        this.setState({
            type:index
        },()=>{
            this.fetchData();
        })
    }

    fetchData(){
        this.props.stateStore.setLoading(true);
        if(this.state.type===0){
            if(this.state.followList.length>0){
                this.props.stateStore.setLoading(false);
                return;
            }
            const res = getFollow(this.props.match.params.id);
            res.then((list)=>{
                this.props.stateStore.setLoading(false);
                this.setState({
                    followList:list
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail',e);
            })
        }
        else if(this.state.type===1){
            if(this.state.fansList.length>0){
                this.props.stateStore.setLoading(false);
                return;
            }
            const res = getFans(this.props.match.params.id);
            res.then((list)=>{
                this.props.stateStore.setLoading(false);
                this.setState({
                    fansList:list
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail',e);
            })
        }
    }

    render(){
        return(
            <div className="friendsPage">
            <SubHeader title="好友列表" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
            <TagHeader
                firstRenderItem={this.state.type}
                items={[{title:'关注'},{title:'粉丝'}]}
                selectHandle={this.switchType.bind(this)}
                selectedColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
            />
            <ul className="friendsContent">
                {
                    this.state.type===0?
                    this.state.followList.map((item,index)=>{
                        return(
                            <ListItem
                                key={'follow'+index}
                                img={item.headimg}
                                type="normal" 
                                title={item.nickname}
                                liClickHandle={this.navTo.bind(this,item.id)}/>
                        )
                    })
                    :
                    this.state.type===1?
                    this.state.fansList.map((item,index)=>{
                        return(
                            <ListItem
                                key={'fans'+index}
                                img={item.headimg}
                                type="normal" 
                                title={item.nickname}
                                liClickHandle={this.navTo.bind(this,item.id)}/>
                        )
                    }):''
                }
                    
            </ul>
            </div>
        )
    }

}

export default Friends;