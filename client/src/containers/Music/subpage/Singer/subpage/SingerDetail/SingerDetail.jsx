import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {perRem,convertUnit,getClientSize} from '../../../../../../util/util';

import {getSingerSong,getSingerAlbum,getSingerMV} from '../../../../../../fetch/music/singer';

import SubHeader from '../../../../../../components/SubHeader';
import TagHeader from '../../../../../../components/TagHeader';
import ListItem from '../../../../../../components/ListItem';
import StickyListBox from '../../../../../../components/StickyListBox';

import './style.less';


@inject('stateStore','musicStore')
@observer class SingerDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data:'',
            songNum:0,
            albumNum:0,
            mvNum:0,
            fansNum:0,
            songTotal:0,
            albumTotal:0,
            mvTotal:0,
            name:'.',
            songList:[],
            mvList:[],
            albumList:[],
            curIndex:0,
        };
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        this.fetchData(0);
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
    }   

    fetchData(start,loadmore=false){
        if(this.state.curIndex===3){
            return;
        }
        if(this.state.curIndex===0){
            if((this.state.songList.length>0 && !loadmore) || (this.state.songList.length>=this.state.songTotal && loadmore)){
                return;
            }
            this.props.stateStore.setLoading(true);
            const res = getSingerSong(this.props.match.params.id,start,20);
            res.then((data)=>{
                this.setState({
                    data:data.SingerDesc || '',
                    songList:this.state.songList.concat(data.list || []),
                    songNum:data.total || '',
                    albumNum:data.albumTotal || '',
                    mvNum:data.mvTotal || '',
                    fansNum:data.fans || '',
                    name:data.singer_name || '',
                    songTotal:data.total,
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络出错，请刷新重试');
            })
        }else if(this.state.curIndex===1){
            if((this.state.albumList.length>0 && !loadmore) || (this.state.albumList.length>=this.state.albumTotal && loadmore)){
                return;
            }
            this.props.stateStore.setLoading(true);
            const res = getSingerAlbum(this.props.match.params.id,start,20);
            res.then((data)=>{
                this.setState({
                    albumList:this.state.albumList.concat(data.list || []),
                    albumTotal:data.total
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络出错，请刷新重试');
            })
        }else if(this.state.curIndex===2){
            if((this.state.mvList.length>0 && !loadmore) || (this.state.mvList.length>=this.state.mvTotal && loadmore)){
                return;
            }
            this.props.stateStore.setLoading(true);
            const res = getSingerMV(this.props.match.params.id,start,20);
            res.then((data)=>{
                this.setState({
                    mvList:this.state.mvList.concat(data.list || []),
                    mvTotal:data.total
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络出错，请刷新重试');
            })
        }
    }

    chooseSingerDataType(index){
        this.refs.listBox.scrollTop = 0;
        this.setState({
            curIndex:index
        },()=>{
            this.fetchData(0);
        });
    }

    loadMore(){
        if(this.props.stateStore.isLoading){
            return;
        }
        if(this.state.curIndex===0){
            this.fetchData(this.state.songList.length,true);
        }else if(this.state.curIndex===1){
            this.fetchData(this.state.albumList.length,true);
        }else if(this.state.curIndex===2){
            this.fetchData(this.state.mvList.length,true);
        }
    }

    navTo(url){
        this.props.history.push(url);
    }

    addSong(songObj){
        this.props.musicStore.addAndPlaySong(songObj)
    }

    playAll(){
        if(this.state.songList.length>0){
            let songArr = [];
            this.state.songList.map((item,index)=>{
                songArr.push({
                    id:item.musicData.songmid,
                    songName:item.musicData.songname,
                    singer:item.musicData.singer[0].name,
                    albumid:item.musicData.albummid
                })
            })
            this.props.musicStore.addAllSong(songArr);
        }
    }
    
    render(){
        return(
            <div className="singerDetailPage">
                <div className="detailHeader" style={{backgroundImage:`url("//y.gtimg.cn/music/photo_new/T001R150x150M000${this.props.match.params.id}.jpg?max_age=2592000")`}}>
                    <SubHeader />
                    <div className="contentBox">
                        <span className="tips1">{this.state.name}</span>
                        <span className="tips2">{convertUnit(this.state.fansNum)+'粉丝'}</span>
                    </div>
                </div>
                <StickyListBox 
                    ref="listBox" 
                    fixedTop={2*perRem} 
                    normalTop={12*perRem} 
                    height={(this.clientSize.height-2*perRem)}
                    loadMore={this.loadMore.bind(this)}
                >
                    <TagHeader
                        firstRenderItem={0}
                        items={[{title:'歌曲 '+this.state.songNum},
                                {title:'专辑 '+this.state.albumNum},
                                {title:'MV '+this.state.mvNum},
                                {title:'详情'}]}
                        selectedColor='white'
                        selectHandle={this.chooseSingerDataType.bind(this)}
                        bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                    />
                    <div className="listContent" ref="listContent">
                        {
                            this.state.curIndex===0?
                            <ul className="songContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                                <div className="playAll" onClick={this.playAll.bind(this)}><i className="iconfont icon-bofang"/>播放全部</div>
                            {this.state.songList.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'song'+index}
                                        title={item.musicData.songname}
                                        info={item.musicData.singer[0].name+' '+item.musicData.albumname}
                                        titleTips={true}
                                        type='normal'
                                        liClickHandle={this.addSong.bind(this,{
                                            id:item.musicData.songmid,
                                            songName:item.musicData.songname,
                                            singer:item.musicData.singer[0].name,
                                            albumid:item.musicData.albummid
                                        })}
                                    >
                                        <span className="quality">SQ</span>
                                        <span className="hasmv">MV</span>
                                    </ListItem>
                                )
                            })}
                            </ul>
                            :
                            this.state.curIndex===1?
                            <ul className="albumContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                            {this.state.albumList.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'album'+index}
                                        img={'//y.gtimg.cn/music/photo_new/T002R300x300M000'+item.albumMID+'.jpg?max_age=2592000'}
                                        title={item.albumName}
                                        info={item.pubTime}
                                        type='normal'
                                        liClickHandle={this.navTo.bind(this,'/music/album/detail/'+item.albumMID)}
                                    >
                                    </ListItem>
                                )
                            })}
                            </ul>
                            :
                            this.state.curIndex===2?
                            <ul className="mvContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                            {this.state.mvList.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'mv'+index}
                                        img={item.pic}
                                        title={item.title}
                                        info={item.date}
                                        liClickHandle={this.navTo.bind(this,'/music/musicVideo/detail/'+item.vid)}
                                    >
                                    </ListItem>
                                )
                            })}
                            </ul>
                            :
                            this.state.curIndex===3?
                            <div className="dataContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                                <p className="singerData">{this.state.data}</p>
                            </div>
                            :''
                        }
                    </div>
                </StickyListBox>
            </div>
        )
    }
}

export default SingerDetail;