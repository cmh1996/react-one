import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getMusicRecommend,getMVRecommend,getNewAlbum,getMusicNewsRecommend} from '../../../../fetch/music/musicHall';
import {getClientSize,convertUnit,getSessionItem,setSessionItem} from '../../../../util/util';

import CoverItem from '../../../../components/CoverItem';
import SectionHeader from '../../../../components/SectionHeader';
import Swiper from '../../../../components/Swiper';
import NewsListItem from '../../../../components/NewsListItem';

import styles from './style.less';

@inject('stateStore')
@observer class MusicHall extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            bannerList:JSON.parse(getSessionItem('musicHallBannerList') || '[]'),
            songList:JSON.parse(getSessionItem('musicHallSongList') || '[]'),
            mvList:JSON.parse(getSessionItem('musicHallMVList') || '[]'),
            albumList:JSON.parse(getSessionItem('musicHallAlbumList') || '[]'),
            newsList:JSON.parse(getSessionItem('musicHallNewsList') || '[]')
        }
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        document.getElementById('musicContentBox').scrollTop = 0;
        if(this.state.bannerList.length>0 && this.state.songList.length>0 && this.state.mvList.length>0 && this.state.albumList.length>0 && this.state.newsList.length>0){
            return;
        }
        this.props.stateStore.setLoading(true);

        //获取首页banner和歌单推荐
        const res = getMusicRecommend();
        res
        .then((json)=>{
            this.setState({
                bannerList:json.slider,
                songList:json.songList
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        });

        //获取MV推荐
        const resMV = getMVRecommend();
        resMV
        .then((json)=>{
             this.setState({
                 mvList:json.mvlist
             },()=>{
                 this.props.stateStore.setLoading(false);
             })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })

        //获取专辑推荐
        const resAlbum = getNewAlbum();
        resAlbum
        .then((json)=>{
             this.setState({
                 albumList:json.album_list
             },()=>{
                 this.props.stateStore.setLoading(false);
             })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })

        //获取音乐新闻
        const resNews = getMusicNewsRecommend();
        resNews
        .then((res)=>{
             this.setState({
                 newsList:res
             },()=>{
                 this.props.stateStore.setLoading(false);
             })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
        
    }

    componentWillUnmount(){
        setSessionItem('musicHallBannerList',JSON.stringify(this.state.bannerList));
        setSessionItem('musicHallSongList',JSON.stringify(this.state.songList));
        setSessionItem('musicHallMVList',JSON.stringify(this.state.mvList));
        setSessionItem('musicHallAlbumList',JSON.stringify(this.state.albumList));
        setSessionItem('musicHallNewsList',JSON.stringify(this.state.newsList));
    }

    navTo(url){
        const targetUrl = encodeURIComponent(url);
        this.props.history.push('/article/detail/'+targetUrl);
    }

    navToInnerPage(container){
        this.props.history.push('/music/'+container)
    }


    render(){
        return(
            <div className="musicHallPage">
                <div className="swiperBox">
                    {
                    this.state.bannerList.length>0?
                    <Swiper width={this.clientSize.width} height="6.5rem" num={this.state.bannerList.length}>
                        {
                            this.state.bannerList.map((item,index)=>{
                                return(
                                    <section className="banner" key={item.id} onClick={this.navTo.bind(this,item.linkUrl)}>
                                        <img src={item.picUrl} alt='banner'/>
                                    </section>
                                )
                            })
                        }
                    </Swiper>:''
                    }
                </div>
                <div className='subBtns'>
                    <div className='subBtn' onClick={this.navToInnerPage.bind(this,'singer')}>
                        <i className="iconfont icon-people_fill"/>
                        <span>歌手</span>
                    </div>
                    <div className='subBtn' onClick={this.navToInnerPage.bind(this,'billboard')}>
                        <i className="iconfont icon-paixing-copy"/>
                        <span>榜单</span>
                    </div>
                    <div className='subBtn' onClick={this.navToInnerPage.bind(this,'album')}>
                        <i className="iconfont icon-cd_icon"/>
                        <span>专辑</span>
                    </div>
                    <div className='subBtn' onClick={this.navToInnerPage.bind(this,'songlist')}>
                        <i className="iconfont icon-fenlei"/>
                        <span>分类歌单</span>
                    </div>
                    <div className='subBtn' onClick={this.navToInnerPage.bind(this,'musicVideo')}>
                        <i className="iconfont icon-luxiang"/>
                        <span>视频MV</span>
                    </div>
                    <div className='subBtn' onClick={this.navToInnerPage.bind(this,'musicNews')}>
                        <i className="iconfont icon-createtask_fill"/>
                        <span>音乐资讯</span>
                    </div>
                </div>
                <section className="recommendBox">
                    <SectionHeader title="歌单推荐" clickHandle={this.navToInnerPage.bind(this,'songlist')}/>
                    <ul className="songList">
                    {
                        this.state.songList.map((item,index)=>{
                            return(
                                <CoverItem
                                    key={item.id}
                                    img={item.picUrl}
                                    leftTips={convertUnit(item.accessnum)}
                                    text2={[item.songListDesc]}
                                    clickHandle={this.navToInnerPage.bind(this,'songlist/detail/'+item.id)}
                                />
                            )
                        })
                    }
                    </ul>
                </section>
                <section className="recommendBox mvRecommend">
                    <SectionHeader title="MV推荐" clickHandle={this.navToInnerPage.bind(this,'musicVideo')}/>
                    <ul className="songList">
                    {
                        this.state.mvList.slice(0,4).map((item,index)=>{
                            return(
                                <CoverItem
                                    key={item.mv_id} 
                                    img={item.picurl}
                                    leftTips={convertUnit(item.listennum)}
                                    text1={[item.mvtitle,item.singername]}
                                    clickHandle={this.navToInnerPage.bind(this,'musicVideo/detail/'+item.vid)}
                                />
                            )
                        })
                    }
                    </ul>
                </section>
                <section className="recommendBox albumRecommend">
                    <SectionHeader title="新碟首发" clickHandle={this.navToInnerPage.bind(this,'album')}/>
                    <ul className="songList">
                    {
                        this.state.albumList.map((item,index)=>{
                            return(
                                <CoverItem
                                    key={item.album.id}
                                    img={'//y.gtimg.cn/music/photo_new/T002R300x300M000'+item.album.mid+'.jpg?max_age=2592000'}
                                    text1={[item.album.title,item.author[0].name]}
                                    clickHandle={this.navToInnerPage.bind(this,'album/detail/'+item.album.mid)}
                                />
                            )
                        })
                    }
                    </ul>
                </section>
                <section className="musicNews">
                    <SectionHeader title="音乐资讯" clickHandle={this.navToInnerPage.bind(this,'musicNews')}/>
                    <ul className="songList">
                    {
                        this.state.newsList.map((item,index)=>{
                            if(item.skipType){
                                return;
                            }
                            return(
                                <NewsListItem
                                    key={item.docid}
                                    title={item.title}
                                    tips1={item.source}
                                    tips2={'评论 '+item.commentCount}
                                    img={item.imgsrc}
                                    liClickHandle={this.navTo.bind(this,'https://3g.163.com/ent/article/'+item.docid+'.html')}
                                />
                            )
                        })
                    }
                    </ul>
                </section>
            </div>
        )
    }

}

export default MusicHall;