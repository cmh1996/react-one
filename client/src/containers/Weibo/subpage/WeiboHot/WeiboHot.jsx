import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getHotWeibo} from '../../../../fetch/weibo/hot';
import {getClientSize,perRem,getSessionItem,setSessionItem} from '../../../../util/util';

import BigListItem from '../../../../components/BigListItem';
import ScrollList from '../../../../components/ScrollList';
import BackToTop from '../../../../components/BackToTop';
import PictureViewer from '../../../../components/PictureViewer';

import styles from './style.less';

@inject('stateStore')
@observer class WeiboHot extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            weiboList:JSON.parse(getSessionItem('hotWeiboList') || '[]'),
            loadTimes:0,
            refreshEnd:false,
            isLoadingMore:false,
            showBackToTop:false,
            initDone:false,
            curImgList:[],
            showPictureViewer:false,
            curImgIndex:0,
        }
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        if(this.state.weiboList.length>0){
            this.setState({
                refreshEnd:true,
                initDone:true,
                isLoadingMore:false
            },()=>{
                this.refs.box.refs.box.scrollTop = this.props.stateStore.scrollTop.WeiboHot;
            });
            return;
        }
        this.props.stateStore.setLoading(true);
        this.fetchData();
    }

    componentWillUnmount(){
        this.props.stateStore.setScrollTop('WeiboHot',this.refs.box.refs.box.scrollTop);
        setSessionItem('hotWeiboList',JSON.stringify(this.state.weiboList));
    }

    fetchData(clear=false){
        const res = getHotWeibo(this.state.loadTimes);
        res
        .then((cards)=>{
            if(clear){
                this.setState({
                    weiboList:cards,
                    refreshEnd:true,
                    isLoadingMore:false
                },()=>{
                    this.props.stateStore.setTips('success','小助手为您加载了'+cards.length+'条新微博','2rem');
                    this.props.stateStore.setLoading(false);
                })
            }else{
                this.setState({
                    weiboList:this.state.weiboList.concat(cards),
                    refreshEnd:true,
                    initDone:true,
                    isLoadingMore:false
                },()=>{
                    this.props.stateStore.setTips('success','小助手为您加载了'+cards.length+'条新微博','2rem');
                    this.props.stateStore.setLoading(false);
                })
            }
        })
        .catch((e)=>{
            this.setState({
                refreshEnd:true,
                isLoadingMore:false
            });
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','获取热门微博失败');
        })
    }

    navToInnerPage(id,avatar,name,time,imgList){
        const codeAvatar = encodeURIComponent(avatar);
        const codeName = encodeURIComponent(name);
        const codeTime = encodeURIComponent(time);
        const codeImgList = encodeURIComponent(imgList);
        this.props.history.push(`/weibo/detail/${id}?data={"avatar":"${codeAvatar}","name":"${codeName}","time":"${codeTime}","imgList":"${codeImgList}"}`);
    }

    navToOuterPage(url){
        const codeUrl = encodeURIComponent(url);
        this.props.history.push('/article/detail/'+codeUrl)
    }

    //下拉刷新
    refresh(){
        this.setState({
            refreshEnd:false,
            loadTimes:0,
        },()=>{
            this.fetchData(true);
        })
    }

     //上拉加载更多
    loadMore(){
        this.setState({
            isLoadingMore:true,
            loadTimes:++this.state.loadTimes
        },()=>{
            this.fetchData();
        });
    }

    toggleBackToTop(farFromTop){
        if(farFromTop){
            this.setState({showBackToTop:true});
        }else{
            this.setState({showBackToTop:false});
        }
    }

    //回到顶部
    backToTop(){
        this.refs.box.refs.box.scrollTop = 0;
    }

    //查看图片
    seePicture(index,imgItems){
        this.setState({
            showPictureViewer:true,
            curImgIndex:index,
            curImgList:imgItems
        })
    }

    hidePictureViewer(){
        this.setState({
            showPictureViewer:false
        })
    }

    render(){
        const listHeight = this.clientSize.height-(4.4*perRem)+'px';
        return(
            <div className="weiboHotPage">
                {
                    this.state.initDone?
                    <ScrollList
                        ref="box" 
                        pullDownHandle={this.refresh.bind(this)}
                        refreshEnd={this.state.refreshEnd}
                        pullUpHandle={this.loadMore.bind(this)}
                        isLoadingMore={this.state.isLoadingMore}
                        listHeight={listHeight}
                        hasScrollSomeDistanceHandle={this.toggleBackToTop.bind(this,true)}
                        nearTopHandle={this.toggleBackToTop.bind(this,false)}
                    >
                        {
                            this.state.weiboList.map((item,index)=>{
                                let imgList = [];
                                if(item.mblog.pics){
                                    item.mblog.pics.map((item,index)=>{
                                        imgList.push(item.url);
                                    })
                                }
                                return(
                                    <BigListItem
                                        key={'weibo'+index}
                                        img={item.mblog.user.profile_image_url}
                                        title={item.mblog.user.screen_name}
                                        mainInfo={item.mblog.text}
                                        tips={item.mblog.created_at}
                                        imgItems={imgList}
                                        liClickHandle={
                                            this.navToInnerPage.bind(
                                                this,
                                                item.mblog.id,
                                                item.mblog.user.profile_image_url,
                                                item.mblog.user.screen_name,
                                                item.mblog.created_at,
                                                imgList
                                            )
                                        }
                                        imgItemClickHandle={this.seePicture.bind(this)}
                                        imgClickHandle={this.navToOuterPage.bind(this,item.mblog.user.profile_url)}
                                    />
                                )
                            })
                        }
                    </ScrollList>
                    :''
                }
                {
                    this.state.showBackToTop?
                    <BackToTop type="inABox" backTopHandle={this.backToTop.bind(this)}/>:''
                }
                {
                    this.state.showPictureViewer?
                    <PictureViewer imgs={this.state.curImgList} firstIndex={this.state.curImgIndex} hideHandle={this.hidePictureViewer.bind(this)}/>:''
                }
            </div>
        )
    }

}

export default WeiboHot;