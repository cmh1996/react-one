import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getCollectedSonglist} from '../../../../fetch/music/songList';

import TagHeader from '../../../../components/TagHeader';
import ListItem from '../../../../components/ListItem';
import NotLogin from '../../../../components/NotLogin';

import {getLocalItem} from '../../../../util/util';

import styles from './style.less';

@inject('stateStore','musicStore','userStore')
@observer class MyMusic extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curType:0,
            songlist:[],
            curSongIndex:0
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.musicStore.songlist.length>1 && this.state.curSongIndex!==nextProps.musicStore.curSongIndex){
            this.setCurSongColor();
        }
        this.setState({
            curSongIndex:nextProps.musicStore.curSongIndex
        })
    }

    setCurSongColor(){
        const playlist = this.refs.songContent.childNodes;
        for(let i=0;i<playlist.length;i++){
            if(i===this.props.musicStore.curSongIndex-1){
                playlist[i].querySelector('.title').style.color = '#66f9cf';
                playlist[i].querySelector('.info').style.color = '#66f9cf';
            }else{
                playlist[i].querySelector('.title').style.color = 'white';
                playlist[i].querySelector('.info').style.color = '#d8d8d8';
            }
        }
    }

    fetchSonglist(){
        if(this.state.songlist.length>0){
            return;
        }
        this.props.stateStore.setLoading(true);
        const res = getCollectedSonglist(this.props.userStore.user.id);
        res
        .then((data)=>{
            this.props.stateStore.setLoading(false);
            this.setState({
                songlist:data
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail',e);
        })
    }

    //切换播放列表和收藏歌单
    switchType(index){
        this.setState({
            curType:index
        })
        if(index===1){
            this.fetchSonglist();
        }
    }


    chooseSong(index){
        this.props.musicStore.toggleMusicBox(true);
        this.props.musicStore.setCurIndex(index+1);
    }

    render(){
        return(
            <div className="MyMusicPage">
            {
                getLocalItem('token')?
                <section className="mySongList">
                    <TagHeader
                        firstRenderItem={0}
                        items={[{title:'播放列表'},
                                {title:'收藏歌单'}]}
                        selectedColor='white'
                        selectHandle={this.switchType.bind(this)}
                        bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                    />
                    <div className="songList">
                    {
                        this.state.curType===0?
                        <ul className="songContent" ref="songContent">{
                            this.props.musicStore.songlist.slice(1).map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'playlist'+index}
                                        title={item.songName}
                                        info={item.singer}
                                        titleTips={true}
                                        type='normal'
                                        liClickHandle={this.chooseSong.bind(this,index)}
                                    >
                                        <span className="quality">SQ</span>
                                        <span className="hasmv">MV</span>
                                    </ListItem>
                                )
                            })}
                        </ul>
                        :
                        <ul className="songlistContentBox">{
                            this.state.songlist.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'songlist'+item.id}
                                        img={item.songlist_img}
                                        title={item.songlist_name}
                                        info={'By '+item.songlist_author}
                                        type='normal'
                                        noArrow={true}
                                        liClickHandle={()=>{this.props.history.push('/music/songlist/detail/'+item.songlist_id)}}
                                    />
                                )
                            })}
                        </ul>
                    }
                    </div>
                </section>
                :
                <NotLogin/>
            }
            </div>
        )
    }

}

export default MyMusic;