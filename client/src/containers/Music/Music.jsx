import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Route,Switch} from 'react-router-dom';
import {inject,observer} from 'mobx-react';

import {getClientSize,perRem} from '../../util/util';

import MyMusic from 'bundle-loader?lazy&name=app-[name]!./subpage/MyMusic/MyMusic';
import MusicHall from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicHall/MusicHall';
import MusicSearch from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicSearch/MusicSearch';
import MusicPlayer from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicPlayer/MusicPlayer';
import Album from 'bundle-loader?lazy&name=app-[name]!./subpage/Album/Album';
import Billboard from 'bundle-loader?lazy&name=app-[name]!./subpage/Billboard/Billboard';
import Singer from 'bundle-loader?lazy&name=app-[name]!./subpage/Singer/Singer';
import Songlist from 'bundle-loader?lazy&name=app-[name]!./subpage/Songlist/Songlist';
import MusicVideo from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicVideo/MusicVideo';
import MusicNews from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicNews/MusicNews';
import SingerDetail from 'bundle-loader?lazy&name=app-[name]!./subpage/Singer/subpage/SingerDetail/SingerDetail';
import BillboardDetail from 'bundle-loader?lazy&name=app-[name]!./subpage/Billboard/subpage/BillboardDetail/BillboardDetail';
import AlbumDetail from 'bundle-loader?lazy&name=app-[name]!./subpage/Album/subpage/AlbumDetail/AlbumDetail';
import SongListDetail from 'bundle-loader?lazy&name=app-[name]!./subpage/songlist/subpage/SongListDetail/SongListDetail';
import MVRanking from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicVideo/subpage/MVRanking/MVRanking';
import MVNews from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicVideo/subpage/MVNews/MVNews';
import MVType from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicVideo/subpage/MVType/MVType';
import MVDetail from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicVideo/subpage/MVDetail/MVDetail';
import SearchResult from 'bundle-loader?lazy&name=app-[name]!./subpage/MusicSearch/subpage/SearchResult/SearchResult';

const MyMusicWrapper = props => <Bundle load={MyMusic}>{(MyMusicWrapper)=><MyMusicWrapper {...props} />}</Bundle>;
const MusicHallWrapper = props => <Bundle load={MusicHall}>{(MusicHallWrapper)=><MusicHallWrapper {...props} />}</Bundle>;
const MusicSearchWrapper = props => <Bundle load={MusicSearch}>{(MusicSearchWrapper)=><MusicSearchWrapper {...props} />}</Bundle>;
const MusicPlayerWrapper = props => <Bundle load={MusicPlayer}>{(MusicPlayerWrapper)=><MusicPlayerWrapper {...props} />}</Bundle>;
const AlbumWrapper = props => <Bundle load={Album}>{(AlbumWrapper)=><AlbumWrapper {...props} />}</Bundle>;
const BillboardWrapper = props => <Bundle load={Billboard}>{(BillboardWrapper)=><BillboardWrapper {...props} />}</Bundle>;
const SingerWrapper = props => <Bundle load={Singer}>{(SingerWrapper)=><SingerWrapper {...props} />}</Bundle>;
const SonglistWrapper = props => <Bundle load={Songlist}>{(SonglistWrapper)=><SonglistWrapper {...props} />}</Bundle>;
const MusicVideoWrapper = props => <Bundle load={MusicVideo}>{(MusicVideoWrapper)=><MusicVideoWrapper {...props} />}</Bundle>;
const MusicNewsWrapper = props => <Bundle load={MusicNews}>{(MusicNewsWrapper)=><MusicNewsWrapper {...props} />}</Bundle>;
const SingerDetailWrapper = props => <Bundle load={SingerDetail}>{(SingerDetailWrapper)=><SingerDetailWrapper {...props} />}</Bundle>;
const BillboardDetailWrapper = props => <Bundle load={BillboardDetail}>{(BillboardDetailWrapper)=><BillboardDetailWrapper {...props} />}</Bundle>;
const AlbumDetailWrapper = props => <Bundle load={AlbumDetail}>{(AlbumDetailWrapper)=><AlbumDetailWrapper {...props} />}</Bundle>;
const SongListDetailWrapper = props => <Bundle load={SongListDetail}>{(SongListDetailWrapper)=><SongListDetailWrapper {...props} />}</Bundle>;
const MVRankingWrapper = props => <Bundle load={MVRanking}>{(MVRankingWrapper)=><MVRankingWrapper {...props} />}</Bundle>;
const MVNewsWrapper = props => <Bundle load={MVNews}>{(MVNewsWrapper)=><MVNewsWrapper {...props} />}</Bundle>;
const MVTypeWrapper = props => <Bundle load={MVType}>{(MVTypeWrapper)=><MVTypeWrapper {...props} />}</Bundle>;
const MVDetailWrapper = props => <Bundle load={MVDetail}>{(MVDetailWrapper)=><MVDetailWrapper {...props} />}</Bundle>;
const SearchResultWrapper = props => <Bundle load={SearchResult}>{(SearchResultWrapper)=><SearchResultWrapper {...props} />}</Bundle>;


import MainHeader from '../../components/MainHeader';
import Nav from '../../components/Nav';
import Bundle from '../../components/Bundle';


import './style.less';

@inject('userStore','stateStore')
@observer class Music extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            items:this.props.stateStore.indexItems,
            ownItems:[
                {title:'我的',route:'/music/myMusic'},
                {title:'音乐厅',route:'/music/hall'},
                {title:'搜索',route:'/music/search'},
            ],            
            navZIndex:10,
            personalList:this.props.stateStore.personalItems
        }
        const clientSize = getClientSize();
        this.ContentStyle = {
            width:clientSize.width+'px',
            height:(clientSize.height-(4.4*perRem))+'px',
            overflowY:'scroll',
            position:'relative',
            top:'1.98rem',
            paddingTop:'0.02rem',
            background:`linear-gradient(${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}, ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor})`,
            color:'white',
        };
        this.singelPageStyle = {
            width:clientSize.width+'px',
            height:clientSize.height+'px',
            overflowY:'scroll',
            position:'relative',
            background:`linear-gradient(${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}, ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor})`,
            color:'white',
        };
    }
    //personal显示时设置nav的zindex为0，消失时设为10
    showPersonalHandle(){
        this.setState({
            navZIndex:0
        })
    }
    hidePersonalHandle(){
        this.setState({
            navZIndex:10
        })
    }
    render(){
        const curPath = this.props.history.location.pathname;
        return(
            <div className="musicPage">
                {
                    curPath.indexOf('/music/myMusic')>-1 || curPath.indexOf('/music/hall')>-1 || curPath.indexOf('/music/search')>-1?
                    [<MainHeader
                        key='mainheader'
                        personalList={this.state.personalList}
                        showPersonalHandle={this.showPersonalHandle.bind(this)}
                        hidePersonalHandle={this.hidePersonalHandle.bind(this)}
                        items={this.state.ownItems}
                        temperature={this.props.stateStore.weather.temperature}
                        icon={this.props.stateStore.weather.weatherIcon}
                        bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                    />,
                    <div id="musicContentBox" className="musicContentBox" style={this.ContentStyle} key='musicContentBox'>
                        <Switch>
                            <Route path="/music/myMusic" component={MyMusicWrapper} />
                            <Route path="/music/hall" component={MusicHallWrapper}/>
                            <Route exact path="/music/search" component={MusicSearchWrapper}/>
                        </Switch>
                    </div>,
                    <Nav zIndex={this.state.navZIndex} selected="音乐" items={this.state.items} key='nav' selectColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>]
                    :
                    curPath.indexOf('/music/player')>-1?
                    <Route exact path="/music/player" component={MusicPlayerWrapper}/>
                    :
                    <div className="musicSingelBox" id="musicSingelBox" style={this.singelPageStyle}>
                        <Switch>
                            <Route exact path="/music/album" component={AlbumWrapper}/>
                            <Route exact path="/music/musicNews" component={MusicNewsWrapper}/>
                            <Route exact path="/music/songlist" component={SonglistWrapper}/>
                            <Route exact path="/music/musicVideo" component={MusicVideoWrapper}/>
                            <Route exact path="/music/singer" component={SingerWrapper}/>
                            <Route exact path="/music/billboard" component={BillboardWrapper}/>
                            <Route path="/music/singer/detail/:id" component={SingerDetailWrapper}/>
                            <Route path="/music/billboard/detail/:id" component={BillboardDetailWrapper}/>
                            <Route path="/music/album/detail/:id" component={AlbumDetailWrapper}/>
                            <Route path="/music/songlist/detail/:id" component={SongListDetailWrapper}/>
                            <Route path="/music/musicVideo/ranking" component={MVRankingWrapper}/>
                            <Route path="/music/musicVideo/news" component={MVNewsWrapper}/>
                            <Route path="/music/musicVideo/type/:id" component={MVTypeWrapper}/>
                            <Route path="/music/musicVideo/detail/:id" component={MVDetailWrapper}/>
                            <Route exact path="/music/result/:word" component={SearchResultWrapper}/>
                        </Switch>
                    </div>
                }
            </div>
        )
    }
}

export default Music;