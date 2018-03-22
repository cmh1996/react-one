import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {perRem,getClientSize,convertTime,convertUnit,decode,getLocalItem,setLocalItem} from '../../../../../../util/util';

import {getSearchSong,getSearchAlbum,getSearchMV,getSearchSonglist,getSearchMatchWords} from '../../../../../../fetch/music/search';

import TagHeader from '../../../../../../components/TagHeader';
import ListItem from '../../../../../../components/ListItem';

import './style.less';

@inject ('stateStore','musicStore')
@observer class SearchResult extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            songList:[],
            mvList:[],
            songlistList:[],
            albumList:[],
            loadTimes:[1,1,1,1],
            searching:false,
            curWord:'',
            matchSongList:[],
            matchMVList:[],
            matchSingerList:[],
            matchAlbumList:[]
        };
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        this.refs.searchInput.value = this.props.match.params.word;
        this.fetchData();
    }

    fetchData(loadmore=false){
        const word = encodeURIComponent(this.props.match.params.word);
        if(this.state.curIndex===0){
            if(this.state.songList.length>0 && !loadmore){
                return;
            }
            this.props.stateStore.setLoading(true);
            const res = getSearchSong(word,this.state.loadTimes[0]);
            res
            .then((data)=>{
                this.setState({
                    songList:this.state.songList.concat(data.song.list),
                    loadTimes:[++this.state.loadTimes[0],this.state.loadTimes[1],this.state.loadTimes[2],this.state.loadTimes[3]]
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络出错，请刷新重试');
            });
        }
        else if(this.state.curIndex===1){
            if(this.state.albumList.length>0 && !loadmore){
                return;
            }
            this.props.stateStore.setLoading(true);
            const res = getSearchAlbum(word,this.state.loadTimes[1]);
            res
            .then((data)=>{
                this.setState({
                    albumList:this.state.albumList.concat(data.album.list),
                    loadTimes:[this.state.loadTimes[0],++this.state.loadTimes[1],this.state.loadTimes[2],this.state.loadTimes[3]]
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络出错，请刷新重试');
            });
        }
        else if(this.state.curIndex===2){
            if(this.state.mvList.length>0 && !loadmore){
                return;
            }
            this.props.stateStore.setLoading(true);
            const res = getSearchMV(word,this.state.loadTimes[2]);
            res
            .then((data)=>{
                this.setState({
                    mvList:this.state.mvList.concat(data.mv.list),
                    loadTimes:[this.state.loadTimes[0],this.state.loadTimes[1],++this.state.loadTimes[2],this.state.loadTimes[3]]
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络出错，请刷新重试');
            });
        }
        else if(this.state.curIndex===3){
            if(this.state.songlistList.length>0 && !loadmore){
                return;
            }
            this.props.stateStore.setLoading(true);
            const res = getSearchSonglist(word,this.state.loadTimes[3]);
            res
            .then((data)=>{
                this.setState({
                    songlistList:this.state.songlistList.concat(data),
                    loadTimes:[this.state.loadTimes[0],this.state.loadTimes[1],this.state.loadTimes[2],++this.state.loadTimes[3]]
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络出错，请刷新重试');
            });
        }
    }

    scrollHandle(e){
        if(this.props.stateStore.isLoading){
            return;
        }
        const listBox = e.target;
        if(listBox.clientHeight+listBox.scrollTop>=listBox.scrollHeight){
            this.fetchData(true);
        }
    }

    chooseType(index){
        this.refs.listBox.scrollTop = 0;
        this.setState({
            curIndex:index
        },()=>{
            this.fetchData();
        })
    }

    navTo(url){
        this.props.history.push(url);
    }

    back(e){
        this.props.history.push('/music/search');
        e.stopPropagation();
    }

    fetchMatchWords(word){
        this.props.stateStore.setLoading(true);
        const res = getSearchMatchWords(encodeURIComponent(word));
        res
        .then((data)=>{
            this.setState({
                matchSongList:data.songList,
                matchMVList:data.mvList,
                matchAlbumList:data.albumList,
                matchSingerList:data.singerList
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    matchWords(e){
        const val = e.target.value;
        //输入框不为空
        if(val!==''){
            this.fetchMatchWords(val);
            this.setState({
                searching:true,
                curWord:val
            })
        }else{
            this.setState({
                searching:false,
                curWord:''
            })
        }
    }

    cancel(){
        this.refs.searchInput.value='';
        this.setState({
            searching:false,
            curWord:''
        })
    }

    searchConfirm(e){
        let keynum=e.keyCode||e.which;
        if(keynum == "13") {
            let curHistoryList = JSON.parse(getLocalItem('searchHistoryList') || '[]');
            curHistoryList.unshift(this.state.curWord);
            setLocalItem('searchHistoryList',JSON.stringify(curHistoryList));

            this.props.history.push('/music/result/'+this.state.curWord);
            this.setState({
                curIndex:0,
                songList:[],
                mvList:[],
                songlistList:[],
                albumList:[],
                searching:false,
            },()=>{
                this.fetchData();
            })
            e.preventDefault();  
        }
    }

    addSong(songObj){
        this.props.musicStore.addAndPlaySong(songObj)
    }

    render(){
        return(
            <div className="searchResultPage">
                    <div className="searchBox" style={{backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}}>
                        <span className="left"><i className="iconfont icon-return" onClick={this.back.bind(this)}/></span>
                        <input ref='searchInput' type="text" placeholder="搜索" onChange={this.matchWords.bind(this)} onKeyPress={this.searchConfirm.bind(this)}/>
                        <span className="right"><i className="iconfont icon-close" onClick={this.cancel.bind(this)}/></span>
                    </div>
                    {
                        this.state.searching?
                        <ul className="searchingList">
                            <li className="searchTitle" onClick={this.navTo.bind(this,'/music/result/'+this.state.curWord)}>{'搜索“'+this.state.curWord+'”'}</li>
                            {
                                this.state.matchSongList.map((item,index)=>{
                                    return(
                                        <li 
                                            className="searchResult" 
                                            key={'song'+index} 
                                            onClick={this.addSong.bind(this,{
                                                    id:item.mid,
                                                    songName:item.name,
                                                    singer:item.singer,
                                                    albumid:item.albummid
                                            })}
                                        >
                                            <span className="icon"><i className="iconfont icon-music"/></span>
                                            <span className="text">{item.name+'-'+item.singer}</span>
                                        </li>
                                    )
                                })
                            }
                            {
                                this.state.matchSingerList.map((item,index)=>{
                                    return(
                                        <li className="searchResult" key={'singer'+index} onClick={this.navTo.bind(this,'/music/singer/detail/'+item.mid)}>
                                            <span className="icon"><i className="iconfont icon-people_fill"/></span>
                                            <span className="text">{item.singer}</span>
                                        </li>
                                    )
                                })
                            }
                            {
                                this.state.matchAlbumList.map((item,index)=>{
                                    return(
                                        <li className="searchResult" key={'album'+index} onClick={this.navTo.bind(this,'/music/album/detail/'+item.mid)}>
                                            <span className="icon"><i className="iconfont icon-cd_icon"/></span>
                                            <span className="text">{item.name+'-'+item.singer}</span>
                                        </li>
                                    )
                                })
                            }
                            {
                                this.state.matchMVList.map((item,index)=>{
                                    return(
                                        <li className="searchResult" key={'mv'+index} onClick={this.navTo.bind(this,'/music/musicVideo/detail/'+item.mid)}>
                                            <span className="icon"><i className="iconfont icon-luxiang"/></span>
                                            <span className="text">{item.name+'-'+item.singer}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        :
                        [
                        <TagHeader
                            firstRenderItem={0}
                            items={[{title:'单曲'},
                                    {title:'专辑'},
                                    {title:'MV'},
                                    {title:'歌单'}]}
                            key="TagHeader"
                            selectedColor='white'
                            selectHandle={this.chooseType.bind(this)}
                            bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                        />,
                        <div 
                            className="listBox" 
                            ref="listBox" 
                            key="listBox" 
                            style={{height:this.clientSize.height-4*perRem}}
                            onScroll={this.scrollHandle.bind(this)}
                            style={{backgroundColor:`linear-gradient(${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}, ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor})`}}
                        >
                            {
                                this.state.curIndex===0?
                                <ul className="songContent content">
                                {
                                    this.state.songList.length>0?
                                    this.state.songList.map((item,index)=>{
                                        let singerName = '';
                                        item.singer.map((item,index)=>{
                                            singerName += '/'+item.name
                                        })
                                        singerName = singerName.substring(1);
                                        return(
                                            <ListItem
                                                key={item.id}
                                                title={item.name}
                                                info={singerName+' '+item.album.name}
                                                titleTips={true}
                                                type='normal'
                                                liClickHandle={this.addSong.bind(this,{
                                                    id:item.mid,
                                                    songName:item.name,
                                                    singer:singerName,
                                                    albumid:item.album.mid
                                                })}
                                            >
                                                <span className="quality">SQ</span>
                                                <span className="hasmv">MV</span>
                                            </ListItem>
                                        )
                                    })
                                    :
                                    <p className="noresult">抱歉，没有该歌曲资源</p>
                                }
                                </ul>
                                :
                                this.state.curIndex===1?
                                <ul className="albumContent content">
                                {
                                    this.state.albumList.length>0?
                                    this.state.albumList.map((item,index)=>{
                                        return(
                                            <ListItem
                                                key={item.albumMID}
                                                img={item.albumPic}
                                                title={item.albumName}
                                                info={item.singerName+'  '+item.publicTime}
                                                type='normal'
                                                liClickHandle={this.navTo.bind(this,'/music/album/detail/'+item.albumMID)}
                                            >
                                            </ListItem>
                                        )
                                    }):
                                    <p className="noresult">抱歉，没有该专辑资源</p>
                                }
                                </ul>
                                :
                                this.state.curIndex===2?
                                <ul className="mvContent content">
                                {
                                    this.state.mvList.length>0?
                                    this.state.mvList.map((item,index)=>{
                                        let singerName = '';
                                        item.singer_list.map((item,index)=>{
                                            singerName += '/'+item.name
                                        })
                                        singerName = singerName.substring(1);
                                        return(
                                            <ListItem
                                                key={item.v_id}
                                                img={item.mv_pic_url}
                                                title={item.mv_name}
                                                info={singerName+'  '+convertTime(item.duration)}
                                                liClickHandle={this.navTo.bind(this,'/music/musicVideo/detail/'+item.v_id)}
                                            >
                                            </ListItem>
                                        )
                                    })
                                    :
                                    <p className="noresult">抱歉，没有该MV资源</p>
                                }
                                </ul>
                                :
                                this.state.curIndex===3?
                                <ul className="songlistContent content">
                                {
                                    this.state.songlistList.length>0?
                                    this.state.songlistList.map((item,index)=>{
                                        return(
                                            <ListItem
                                                key={item.dissid}
                                                img={item.imgurl}
                                                title={decode(item.dissname)}
                                                info={`${item.song_count}首  ${decode(item.creator.name)}  ${convertUnit(item.listennum)}人播放`}
                                                liClickHandle={this.navTo.bind(this,'/music/songlist/detail/'+item.dissid)}
                                            >
                                            </ListItem>
                                        )
                                    })
                                    :
                                    <p className="noresult">抱歉，没有该歌单资源</p>
                                }
                                </ul>
                                :''
                            }
                        </div>
                    ]
                    }
            </div>
        )
    }
}

export default SearchResult;