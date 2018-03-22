import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getSongLyric} from '../../../../fetch/music/song';
import {getClientSize,perRem,convertTime,decode,shuffle} from '../../../../util/util';

import SubHeader from '../../../../components/SubHeader';
import BottomPopup from '../../../../components/BottomPopup';

import styles from './style.less';

@inject ('stateStore','musicStore')
@observer class MusicPlayer extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            firstTapX:0,
            translateX:0,
            animateTime:0,
            curPage:0,
            curProgress:0,
            lyricList:[{
                time:'',
                text:''
            }],
            curLyricIndex:0,
            firstTapLyricY:0,
            firstTapLyricX:0,
            touchStartlyricListTop:0,
            lyricListTop:'6rem',
            lyricListAnimateTime:0.3,
            isTouchingLyric:false,
            popupShow:false
        };
        this.clientSize = getClientSize();
        this.barBoxWidth = 9*perRem;
        this.timer = null;
        this.pageTimer = null;
    }

    componentWillMount(){
        this.props.musicStore.toggleMusicBox(false);
    }

    componentWillUnmount(){
        this.props.musicStore.toggleMusicBox(true);
        clearTimeout(this.pageTimer);
        this.pageTimer = null;
        clearTimeout(this.timer);
        this.timer = null;
    }

    componentDidMount(){
        this.fetchLyric();
        //设置歌词和进度条位置
        const audio = document.getElementById('musicAudio');
        this.pageTimer = setInterval(()=>{
            this.setLyrics();
            this.setState({
                curProgress:(audio.currentTime/audio.duration)*100,
            },()=>{
                if(this.state.curProgress<=0.2){
                    this.fetchLyric();
                }
            })
        },500);
    }

    fetchLyric(){
        //获取歌词
        const res = getSongLyric(this.props.musicStore.songlist[this.props.musicStore.curSongIndex].id);
        res.then((res)=>{
            this.setState({
                lyricList:res
            })
        })
        .catch((e)=>{
            console.log('歌词获取出错');
        })
    }

    //歌词跳动，设置当前歌词
    setLyrics(){
        const audio = document.getElementById('musicAudio');
         //已经有歌词数据了
        if(this.state.lyricList[0].time.length>0){
            //找出时间match的歌词的index
            const curIndex = this.state.lyricList.findIndex((val,index)=>{
                return val.time.substr(0,5)===convertTime(audio.currentTime)
            });
            if(curIndex!==-1 && !this.state.isTouchingLyric){
                this.setState({
                    curLyricIndex:curIndex,
                    lyricListTop:-curIndex*1.5*perRem+6*perRem
                })
            }
        }
    }

    touchstartHandle(e){
        let tapX = e.touches[0].pageX;
        //在第二页时
        if(this.state.translateX<0){
            tapX = tapX+this.clientSize.width;
        }
        this.setState({
            firstTapX:tapX,
            animateTime:0
        })
        e.stopPropagation();
    }

    touchmoveHandle(e){
        this.setState({
            translateX:e.touches[0].pageX-this.state.firstTapX,
            animateTime:0
        })
        e.stopPropagation();
    }

    touchendHandle(e){
        //已经可以滑动到第二页了
        if(this.state.translateX<(-this.clientSize.width/2)){
            this.setState({
                translateX:-this.clientSize.width,
                animateTime:0.3,
                curPage:1
            })
        }
        //还在第一页的范围内
        else{
            this.setState({
                translateX:0,
                animateTime:0.3,
                curPage:0
            })
        }
        e.stopPropagation();
    }

    moveTime(e){
        const tapX = e.touches[0].pageX-e.target.getBoundingClientRect().left;
        const curProgress = Math.max(Math.min((tapX/this.barBoxWidth)*100,100),0);
        this.setState({
            curProgress:curProgress,
            lyricListTop:-this.refs.lyricList.clientHeight*(curProgress/100)+6*perRem,
        },()=>{
            const audio = document.getElementById('musicAudio');
            const curTime = (this.state.curProgress/100)*this.props.musicStore.songlist[this.props.musicStore.curSongIndex].duration;
            audio.currentTime = curTime;
            this.props.musicStore.setCurTime(curTime);
        })
        
    }

    playOrPause(){
        if(this.props.musicStore.isPlaying){
            this.props.musicStore.setPlayPause('pause');
        }else{
            this.props.musicStore.setPlayPause('play');
        }
    }

    playPrev(){
        const audio = document.getElementById('musicAudio');
        //顺序
        if(this.props.musicStore.playMode===0){
            this.props.musicStore.setCurIndex(this.props.musicStore.curSongIndex-1);
        }
        //随机
        else if(this.props.musicStore.playMode===1){
            const len = this.props.musicStore.songlist.length-1;
            this.props.musicStore.setCurIndex(parseInt(Math.random()*len+1));
        }
        //单曲
        else if(this.props.musicStore.playMode===2){
            this.props.musicStore.setCurIndex(this.props.musicStore.curSongIndex);
            audio.load();
        }
        this.fetchLyric();
    }

    playNext(){
        const audio = document.getElementById('musicAudio');
        //顺序
        if(this.props.musicStore.playMode===0){
            this.props.musicStore.setCurIndex(this.props.musicStore.curSongIndex+1);
        }
        //随机
        else if(this.props.musicStore.playMode===1){
            const len = this.props.musicStore.songlist.length-1;
            this.props.musicStore.setCurIndex(parseInt(Math.random()*len+1));
        }
        //单曲
        else if(this.props.musicStore.playMode===2){
            this.props.musicStore.setCurIndex(this.props.musicStore.curSongIndex);
            audio.load();
        }
        this.fetchLyric();
    }

    touchLyric(e){
        this.setState({
            firstTapLyricX:e.touches[0].pageX,
            firstTapLyricY:e.touches[0].pageY,
            lyricListAnimateTime:0,
            isTouchingLyric:true,
            touchStartlyricListTop:this.state.lyricListTop,
        })
    }

    slideLyric(e){
        const tapLyricX = e.touches[0].pageX;
        const tapLyricY = e.touches[0].pageY;
        const diffX = tapLyricX-this.state.firstTapLyricX;
        if(Math.abs(diffX)<=100){
            e.stopPropagation();
            const diffY = tapLyricY-this.state.firstTapLyricY;
            this.setState({
                lyricListTop:this.state.touchStartlyricListTop+diffY
            })
        }
    }

    touchLyricEnd(e){
        this.setState({
            lyricListAnimateTime:0.3,
        },()=>{
            if(this.state.lyricListTop>=(this.refs.lyricBox.clientHeight-100)){
                this.setState({
                    lyricListTop:6*perRem
                })
            }else if(this.state.lyricListTop<=(-this.refs.lyricList.clientHeight+6*perRem)){
                this.setState({
                    lyricListTop:-this.refs.lyricList.clientHeight+6*perRem
                })
            }
        });
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(()=>{
            this.setState({
                isTouchingLyric:false
            });
        },1000)
    }

    changeMode(){
        this.props.musicStore.setPlayMode(this.props.musicStore.playMode+1);
    }

    togglePopup(bol){
        this.setState({
            popupShow:bol
        },()=>{
            //播放列表滚动到正在播放的歌曲那里
            if(this.state.popupShow){
                this.refs.playingSonglist.scrollTop = (this.props.musicStore.curSongIndex-1)*2.2*perRem;
            }
        })
    }

    removeSong(index,e){
        this.props.musicStore.removeSong(index);
        e.stopPropagation();
    }

    clearSonglist(){
        this.props.musicStore.clearSonglist();
    }

    chooseSong(index){
        this.props.musicStore.setCurIndex(index+1);
    }

    render(){
        return(
            <div className="musicPlayerPage" style={{height:this.clientSize.height}}>
                <img className="bg" src={this.props.musicStore.songlist[this.props.musicStore.curSongIndex].imgUrl} />
                <div className="header"><SubHeader title={decode(this.props.musicStore.songlist[this.props.musicStore.curSongIndex].songName)}/></div>      
                {
                    this.props.musicStore.songlist.length>1?
                    <div className="content">
                        <div className="singelPage">
                            <div 
                                className="togglePage" 
                                style={{transform:`translate3d(${this.state.translateX}px,0,0)`,
                                        transition: `transform ${this.state.animateTime}s`}}
                                onTouchStart={this.touchstartHandle.bind(this)} 
                                onTouchMove={this.touchmoveHandle.bind(this)}
                                onTouchEnd={this.touchendHandle.bind(this)}
                            >
                                <div className="cdInfo">
                                    <span className="singerName">—  {decode(this.props.musicStore.songlist[this.props.musicStore.curSongIndex].singer)}  —</span>
                                    <div className="cdImg">
                                        <img className={this.props.musicStore.isPlaying?'imgRotate':''} src={this.props.musicStore.songlist[this.props.musicStore.curSongIndex].imgUrl} />
                                    </div>
                                    <div className="curLyric">
                                        {
                                            this.state.lyricList[this.state.curLyricIndex].text?
                                            this.state.lyricList[this.state.curLyricIndex].text:''
                                        }
                                    </div>
                                </div>
                                <div className="lyricBox" ref="lyricBox">
                                    <ul 
                                        className="lyricList" 
                                        ref="lyricList"
                                        style={{top:this.state.lyricListTop,transition:`top ${this.state.lyricListAnimateTime}s`}} 
                                        onTouchStart={this.touchLyric.bind(this)} 
                                        onTouchMove={this.slideLyric.bind(this)}
                                        onTouchEnd={this.touchLyricEnd.bind(this)}
                                    >
                                        {
                                            this.state.lyricList.map((item,index)=>{
                                                return(
                                                    <li key={index} className={this.state.curLyricIndex===index?'curLi':''}>{item.text}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="pagePoint">
                            <span className={this.state.curPage===0?"selected":''}></span>
                            <span className={this.state.curPage===1?"selected":''}></span>
                        </div>
                        <div className="progressBar">
                            <span className="time">{convertTime(this.props.musicStore.curTime)}</span>
                            <div className="touchBox" onTouchStart={this.moveTime.bind(this)} onTouchMove={this.moveTime.bind(this)}>
                                <div className="barBox">
                                    <div className="bar" style={{width:this.state.curProgress+'%'}}></div>
                                </div>
                            </div>
                            <span className="time">{convertTime(this.props.musicStore.songlist[this.props.musicStore.curSongIndex].duration)}</span>
                        </div>
                        <div className="controlBox">
                            <span className="normalBtn1" onClick={this.changeMode.bind(this)}>
                                {
                                    this.props.musicStore.playMode===0?
                                    <i className="iconfont icon-ttpodicon"/>
                                    :
                                    this.props.musicStore.playMode===1?
                                    <i className="iconfont icon-bofangye-caozuolan-suijibofang"/>
                                    :
                                    this.props.musicStore.playMode===2?
                                    <i className="iconfont icon-danquxunhuan"/>
                                    :''
                                }
                            </span>
                            <span className="brightBtn" onClick={this.playPrev.bind(this)}><i className="iconfont icon-shangyishou"/></span>
                            <span className="brightBtn" onClick={this.playOrPause.bind(this)}>
                                {
                                    this.props.musicStore.isPlaying?
                                    <i className="iconfont icon-bofangzanting03"/>
                                    :
                                    <i className="iconfont icon-bofang"/>
                                }
                            </span>
                            <span className="brightBtn" onClick={this.playNext.bind(this)}><i className="iconfont icon-xiayishou"/></span>
                            <span className="normalBtn" onClick={this.togglePopup.bind(this,true)}><i className="iconfont icon-bofangliebiao"/></span>
                        </div>
                    </div>
                    :
                    <div className="empty">播放列表为空，快添加歌曲吧~</div>
                }
                {
                    this.state.popupShow?
                    <BottomPopup height='17rem' hideHandle={this.togglePopup.bind(this,false)}>
                        <div className="pContent">
                            <div className="pHeader">
                                <div className="pHeaderLeft">
                                    {
                                        this.props.musicStore.playMode===0?
                                        <i className="iconfont icon-ttpodicon"/>
                                        :
                                        this.props.musicStore.playMode===1?
                                        <i className="iconfont icon-bofangye-caozuolan-suijibofang"/>
                                        :
                                        this.props.musicStore.playMode===2?
                                        <i className="iconfont icon-danquxunhuan"/>
                                        :''
                                    }
                                    <span className="mode">
                                    {
                                        this.props.musicStore.playMode===0?
                                        '顺序播放':
                                        this.props.musicStore.playMode===1?
                                        '随机播放':
                                        this.props.musicStore.playMode===2?
                                        '单曲循环':''
                                    }
                                    </span>
                                    <span className="num">{'('+(this.props.musicStore.songlist.length-1)+'首)'}</span>
                                </div>
                                <span className="pHeaderRight" onClick={this.clearSonglist.bind(this)}>
                                    <i className="iconfont icon-trash_fill"/>
                                </span>
                            </div>
                            <ul className="playingSonglist" ref="playingSonglist">
                                {
                                    this.props.musicStore.songlist.slice(1).map((item,index)=>{
                                        return(
                                            <li onClick={this.chooseSong.bind(this,index)} key={'songlistsong'+index} className={this.props.musicStore.curSongIndex===index+1?"playingSongItem playingItem":"playingSongItem"}>
                                                <div className="left">
                                                    <span>{decode(item.songName)}</span>
                                                    <span className="sq">SQ</span>
                                                    <span className="singer">{'-'+decode(item.singer)}</span>
                                                </div>
                                                <span className="right" onClick={this.removeSong.bind(this,index)}><i className="iconfont icon-close"/></span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </BottomPopup>
                    :''
                }
            </div>
        )
    }

}

export default MusicPlayer;