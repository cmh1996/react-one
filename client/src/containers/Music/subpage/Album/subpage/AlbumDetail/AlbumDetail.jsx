import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {perRem,getClientSize} from '../../../../../../util/util';

import {getAlbumDetail} from '../../../../../../fetch/music/album';

import SubHeader from '../../../../../../components/SubHeader';
import TagHeader from '../../../../../../components/TagHeader';
import ListItem from '../../../../../../components/ListItem';
import StickyListBox from '../../../../../../components/StickyListBox';

import './style.less';

@inject('stateStore','musicStore')
@observer class AlbumDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            songList:[],
            albumData:'',
            date:'',
            name:'',
            singerName:'',
            singerId:'',
        };
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.props.stateStore.setLoading(true);
        const res = getAlbumDetail(this.props.match.params.id);
        res
        .then((data)=>{
            this.setState({
                songList:data.list,
                albumData:data.desc,
                date:data.aDate,
                name:data.name,
                singerName:data.singername,
                singerId:data.singermid
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        });
    }

    chooseType(index){
        this.setState({
            curIndex:index
        })
    }

    addSong(songObj){
        this.props.musicStore.addAndPlaySong(songObj)
    }

    navTo(){
        this.props.history.push('/music/singer/detail/'+this.state.singerId)
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
            <div className="albumDetailPage">
                <div className="detailHeader" 
                     style={{backgroundImage:`url(//y.gtimg.cn/music/photo_new/T002R300x300M000${this.props.match.params.id}.jpg?max_age=2592000)`,
                            backgroundSize:'300% 300%'}}
                >
                    <SubHeader title="专辑"/>
                    <div className="infoBox">
                        <div className="headerImg">
                            <img src={`//y.gtimg.cn/music/photo_new/T002R300x300M000${this.props.match.params.id}.jpg?max_age=2592000`}/>
                            <span>{this.state.date}</span>
                        </div>
                        <div className="headerInfo">
                            <span>{this.state.name}</span>
                            <div onClick={this.navTo.bind(this)}>
                                <img src={`//y.gtimg.cn/music/photo_new/T001R150x150M000${this.state.singerId}.jpg?max_age=2592000`}/>
                                {this.state.singerName}
                            </div>
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
                        selectHandle={this.chooseType.bind(this)}
                        selectedColor='white'
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
                                singerName = singerName.substring(1);
                                return(
                                    <div className="songItem" key={'alSong'+index}>
                                        <span className="rankingNum">
                                            {index+1}
                                        </span>
                                        <ListItem
                                            title={item.songname}
                                            info={singerName+' '+item.albumname}
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
                                <p className="albumData" dangerouslySetInnerHTML={{__html: this.state.albumData}}></p>
                            </div>
                            :''
                        }
                    </div>
                </StickyListBox>
            </div>
        )
    }
}

export default AlbumDetail;