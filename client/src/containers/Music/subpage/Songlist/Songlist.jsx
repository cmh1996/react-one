import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getSongList} from '../../../../fetch/music/songList';
import {perRem,getClientSize} from '../../../../util/util';

import SubHeader from '../../../../components/SubHeader';
import BigSelectBox from '../../../../components/BigSelectBox';
import CoverItem from '../../../../components/CoverItem';
import StickyListBox from '../../../../components/StickyListBox';
import BackToTop from '../../../../components/BackToTop';

import './style.less';

@inject('stateStore')
@observer class Songlist extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            songListList:[],
            curIndex:0,
            idList:[10000000,11,166,168,15,21,101,116,122,78,145],
            loadStart:0,
            showBackToTop:false
        };
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.fetchSongListByType();
    }

    fetchSongListByType(){
        this.props.stateStore.setLoading(true);
        const res = getSongList(this.state.idList[this.state.curIndex],this.state.loadStart,this.state.loadStart+29);
        res
        .then((data)=>{
            this.setState({
                songListList:this.state.songListList.concat(data.list),
                loadStart:30+this.state.loadStart
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    chooseSongListType(index){
        this.setState({
            curIndex:index,
            loadStart:0,
            songListList:[],
            showBackToTop:false,
        },()=>{
            this.fetchSongListByType();
        })
    }

    navTo(id){
        this.props.history.push('/music/songlist/detail/'+id)
    }

    loadMore(){
        this.setState({
            showBackToTop:true
        })
        if(this.props.stateStore.isLoading){
            return;
        }
        this.fetchSongListByType();
    }

    backToTop(){
        this.refs.listBox.refs.stickyListBox.scrollTop = 0;
    }

    render(){
        return(
            <div className="songListPage">
                <SubHeader title="精选歌单" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <BigSelectBox
                    firstRenderItem={0}
                    items={[{title:'精选'},
                            {title:'流行'},
                            {title:'粤语'},
                            {title:'韩语'},
                            {title:'轻音乐'},
                            {title:'爵士'},
                            {title:'学习'},
                            {title:'治愈'},
                            {title:'安静'},
                            {title:'睡前'},
                            {title:'中国风'}]}
                    selectHandle={this.chooseSongListType.bind(this)}
                />
                <StickyListBox 
                    ref="listBox" 
                    fixedTop={2*perRem} 
                    normalTop={12*perRem} 
                    height={(this.clientSize.height-2*perRem)}
                    loadMore={this.loadMore.bind(this)}
                >
                    <ul className="songListList">
                    {
                        this.state.songListList.map((item,index)=>{
                            return(
                                <CoverItem
                                    key={item.dissid}
                                    img={item.imgurl}
                                    text2={[item.dissname]}
                                    text1={[item.creator.name]}
                                    clickHandle={this.navTo.bind(this,item.dissid)}
                                />
                            )
                        })
                    }
                    {
                        this.state.showBackToTop?
                        <BackToTop type="inABox" backTopHandle={this.backToTop.bind(this)}/>:''
                    }
                    </ul>
                </StickyListBox>
            </div>
        )
    }
}

export default Songlist;