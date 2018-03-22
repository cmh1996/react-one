import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getMVByType} from '../../../../../../fetch/music/mv';
import {perRem,getClientSize} from '../../../../../../util/util';

import SubHeader from '../../../../../../components/SubHeader';
import TagHeader from '../../../../../../components/TagHeader';
import CoverItem from '../../../../../../components/CoverItem';
import BackToTop from '../../../../../../components/BackToTop';

import './style.less';

@inject('stateStore') 
@observer class MVType extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            MVList:[],
            loadTimes:0,
        }
        this.clientSize = getClientSize();
        this.listHeight = this.clientSize.height-(4*perRem);
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.fetchMVByType();
    }

    fetchMVByType(){
        this.props.stateStore.setLoading(true);
        const res = getMVByType(this.props.match.params.id,this.state.curIndex+1,this.state.loadTimes);
        res
        .then((data)=>{
            this.setState({
                MVList:this.state.MVList.concat(data.mvlist),
                loadTimes:++this.state.loadTimes
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    chooseMVType(index){
        this.setState({
            curIndex:index,
            MVList:[],
            loadTimes:0,
        },()=>{
            this.fetchMVByType();
        })
    }

    navTo(id){
        this.props.history.push('/music/musicVideo/detail/'+id)
    }

    loadMore(){
        if(this.props.stateStore.isLoading){
            return;
        }
        this.fetchMVByType();
    }

    watchScroll(e){
        if(e.target.scrollTop+this.listHeight+200>=e.target.scrollHeight){
            this.loadMore();
        }
    }

    backToTop(){
        this.refs.listBox.scrollTop = 0;
    }

    render(){
        return(
            <div className="MVTypePage">
                <SubHeader title="MV列表" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <TagHeader
                    firstRenderItem={0}
                    items={[{title:'最新'},
                            {title:'最热'}]}
                    selectedColor='white'
                    selectHandle={this.chooseMVType.bind(this)}
                    bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                <ul className="MVTypeList" 
                ref="listBox" 
                style={{height:this.listHeight}}
                onScroll={this.watchScroll.bind(this)}>
                {
                    this.state.MVList.map((item,index)=>{
                        return(
                            <CoverItem
                                key={item.vid}
                                img={item.picurl}
                                leftTips={item.publictime}
                                text1={[item.mvtitle,item.singername]}
                                clickHandle={this.navTo.bind(this,item.vid)}
                            />
                        )
                    })
                }
                </ul>
                <BackToTop type="inABox" backTopHandle={this.backToTop.bind(this)}/>
            </div>
        )
    }
}

export default MVType;