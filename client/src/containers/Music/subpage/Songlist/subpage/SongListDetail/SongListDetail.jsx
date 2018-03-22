import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {perRem,getClientSize,decode,convertUnit,getLocalItem} from '../../../../../../util/util';

import {getSongListDetail,judgeHasCollected,toggleCollect} from '../../../../../../fetch/music/songList';

import SubHeader from '../../../../../../components/SubHeader';
import TagHeader from '../../../../../../components/TagHeader';
import ListItem from '../../../../../../components/ListItem';
import StickyListBox from '../../../../../../components/StickyListBox';
import SectionHeader from '../../../../../../components/SectionHeader';

import './style.less';

@inject('stateStore','musicStore','userStore')
@observer class SongListDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            songList:[],
            songListData:'',
            songListImg:'',
            visitNum:'',
            name:'',
            creatorName:'',
            creatorImg:'',
            hasCollected:true,
            collecting:false
        };
        this.clientSize = getClientSize();
    }

    componentWillMount(){
        if(this.props.userStore.user.id!==''){
            this.judgeCollected();
        }
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.props.stateStore.setLoading(true);
        const res = getSongListDetail(this.props.match.params.id);
        res
        .then((data)=>{
            this.setState({
                songList:data.songlist,
                songListData:data.desc,
                songListImg:data.logo,
                visitNum:data.visitnum,
                name:data.dissname,
                creatorName:data.nickname,
                creatorImg:data.headurl,
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        });
    }

    judgeCollected(){
        const collected = judgeHasCollected(this.props.userStore.user.id,this.props.match.params.id);
        collected
        .then((data)=>{
            this.setState({
                hasCollected:data
            })
        })
        .catch((e)=>{
            this.setState({
                hasCollected:''
            })
        })
    }

    toggleCollect(){
        if(this.state.collecting){
            return;
        }
        this.setState({
            collecting:true
        },()=>{
            const res = toggleCollect({
                userId:this.props.userStore.user.id,
                songlistId:this.props.match.params.id,
                songlistImg:this.state.songListImg,
                songlistName:this.state.name,
                songlistAuthor:decode(this.state.creatorName),
            });
            res
            .then(()=>{
                this.setState({
                    hasCollected:!this.state.hasCollected,
                    collecting:false
                })
            })
            .catch((e)=>{
                this.props.stateStore.setTips('fail',e);
                this.setState({
                    collecting:false
                })
            })
        })
        
    }

    chooseType(index){
        this.setState({
            curIndex:index
        })
    }

    addSong(songObj){
        this.props.musicStore.addAndPlaySong(songObj)
    }
    
    playAll(){
        if(this.state.songList.length>0){
            let songArr = [];
            this.state.songList.map((item,index)=>{
                songArr.push({
                    id:item.songmid,
                    songName:item.songname,
                    singer:item.singer[0].name,
                    albumid:item.albummid
                })
            })
            this.props.musicStore.addAllSong(songArr);
        }
    }

    render(){
        return(
            <div className="SongListDetailPage">
                <div className="detailHeader" 
                     style={{backgroundImage:`url(${this.state.songListImg})`,
                            backgroundSize:'300% 300%'}}
                >
                    <SubHeader title="歌单"/>
                    <div className="infoBox">
                        <div className="headerImg">
                            <img src={this.state.songListImg}/>
                            <span>
                                <i className="iconfont icon-music1" />
                                {convertUnit(this.state.visitNum)}
                            </span>
                        </div>
                        <div className="headerInfo">
                            <span>{this.state.name}</span>
                            <div>
                                <img src={this.state.creatorImg}/>
                                {decode(this.state.creatorName)}
                            </div>
                            {
                                getLocalItem('token') && this.state.hasCollected!==''?
                                <div className="collectBtn">
                                    <i className="iconfont icon-collection_fill"/>
                                    <span onClick={this.toggleCollect.bind(this)}>{this.state.hasCollected?'已收藏':'添加收藏'}</span>
                                </div>:''
                            }
                        </div>
                    </div>
                </div>
                <StickyListBox 
                    ref="listBox" 
                    fixedTop={2*perRem} 
                    normalTop={12*perRem} 
                    height={(this.clientSize.height-2*perRem)}
                >
                    <TagHeader
                        firstRenderItem={0}
                        items={[{title:'歌曲'},
                                {title:'详情'}]}
                        selectedColor='white'
                        selectHandle={this.chooseType.bind(this)}
                        bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                    />
                    <div className="listContent" ref="listContent">
                        {
                            this.state.curIndex===0?
                            <ul className="songContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                                <div className="playAll" onClick={this.playAll.bind(this)}><i className="iconfont icon-bofang"/>播放全部</div>
                            {this.state.songList.map((item,index)=>{
                                let singerName = '';
                                item.singer.map((item,index)=>{
                                    singerName += '/'+item.name
                                })
                                singerName = decode(singerName.substring(1));
                                return(
                                    <div className="songItem" key={'alSong'+index}>
                                        <ListItem
                                            title={decode(item.songname)}
                                            info={singerName+' '+decode(item.albumname)}
                                            titleTips={true}
                                            type='normal'
                                            liClickHandle={this.addSong.bind(this,{
                                                id:item.songmid,
                                                songName:item.songname,
                                                singer:singerName,
                                                albumid:item.albummid
                                            })}
                                        >
                                            <span className="quality">SQ</span>
                                            <span className="hasmv">MV</span>
                                        </ListItem>
                                    </div>
                                )
                            })}
                            </ul>
                            :
                            this.state.curIndex===1?
                            <div className="dataContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                                <p className="songListData" dangerouslySetInnerHTML={{__html: this.state.songListData}}></p>
                            </div>
                            :''
                        }
                    </div>
                </StickyListBox>
            </div>
        )
    }
}

export default SongListDetail;