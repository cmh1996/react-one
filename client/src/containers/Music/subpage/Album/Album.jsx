import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getAlbum} from '../../../../fetch/music/album';
import {perRem,getClientSize} from '../../../../util/util';

import SubHeader from '../../../../components/SubHeader';
import BigSelectBox from '../../../../components/BigSelectBox';
import CoverItem from '../../../../components/CoverItem';
import StickyListBox from '../../../../components/StickyListBox';
import BackToTop from '../../../../components/BackToTop';

import './style.less';

@inject('stateStore') 
@observer class Album extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            idList:[0,1,2,3,36,22,27,21,39,34,37,19,20,33,23,28],
            albumList:[],
            loadTimes:0,
            showBackToTop:false
        }
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.fetchAlbumByType();
    }

    fetchAlbumByType(){
        this.props.stateStore.setLoading(true);
        const res = getAlbum(this.state.idList[this.state.curIndex],this.state.loadTimes);
        res
        .then((data)=>{
            this.setState({
                albumList:this.state.albumList.concat(data),
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

    chooseAlbumType(index){
        this.setState({
            curIndex:index,
            loadTimes:0,
            albumList:[],
            showBackToTop:false,
        },()=>{
            this.fetchAlbumByType();
        })
    }

    navTo(id){
        this.props.history.push('/music/album/detail/'+id)
    }

    loadMore(){
        this.setState({
            showBackToTop:true
        })
        if(this.props.stateStore.isLoading){
            return;
        }
        this.fetchAlbumByType();
    }

    backToTop(){
        this.refs.listBox.refs.stickyListBox.scrollTop = 0;
    }

    render(){
        return(
            <div className="AlbumPage">
                <SubHeader title="专辑" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <BigSelectBox
                    firstRenderItem={0}
                    items={[{title:'全部'},
                            {title:'流行'},
                            {title:'古典'},
                            {title:'爵士'},
                            {title:'摇滚'},
                            {title:'电子'},
                            {title:'拉丁'},
                            {title:'轻音乐'},
                            {title:'世界音乐'},
                            {title:'嘻哈'},
                            {title:'原声'},
                            {title:'乡村'},
                            {title:'舞曲'},
                            {title:'R&B'},
                            {title:'民谣'},
                            {title:'金属'}]}
                    selectHandle={this.chooseAlbumType.bind(this)}
                />
                <StickyListBox 
                    ref="listBox" 
                    fixedTop={2*perRem} 
                    normalTop={16.5*perRem} 
                    height={(this.clientSize.height-2*perRem)}
                    loadMore={this.loadMore.bind(this)}
                >
                    <ul className="albumList">
                    {
                        this.state.albumList.map((item,index)=>{
                            return(
                                <CoverItem
                                    key={item.album_mid}
                                    img={`//y.gtimg.cn/music/photo_new/T002R300x300M000${item.album_mid}.jpg?max_age=2592000`}
                                    text1={[item.album_name,item.singer_name,item.public_time]}
                                    clickHandle={this.navTo.bind(this,item.album_mid)}
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

export default Album;