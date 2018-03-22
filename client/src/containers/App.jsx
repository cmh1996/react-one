import React from 'react';
import {Route,Switch,Redirect} from 'react-router-dom';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import jwt from 'jsonwebtoken';
import Bundle from '../components/Bundle';

import {getWeatherData} from '../fetch/home/weather';
import {getUserData} from '../fetch/home/user';
import {getLocalItem,setLocalItem} from '../util/util';

import Home from 'bundle-loader?lazy&name=app-[name]!./Home/Home';
import Personal from 'bundle-loader?lazy&name=app-[name]!./Personal/Personal';
import Weibo from 'bundle-loader?lazy&name=app-[name]!./Weibo/Weibo';
import Music from 'bundle-loader?lazy&name=app-[name]!./Music/Music';
import Soccer from 'bundle-loader?lazy&name=app-[name]!./Soccer/Soccer';
import NotFound from 'bundle-loader?lazy&name=app-[name]!./Else/NotFound';
import Login from 'bundle-loader?lazy&name=app-[name]!./Else/Login/Login';
import WeatherPage from 'bundle-loader?lazy&name=app-[name]!./Else/WeatherPage/WeatherPage';
import ArticleDetail from 'bundle-loader?lazy&name=app-[name]!./Else/ArticleDetail/ArticleDetail';

const HomeWrapper = props => <Bundle load={Home}>{(HomeWrapper)=><HomeWrapper {...props} />}</Bundle>;
const PersonalWrapper = props => <Bundle load={Personal}>{(PersonalWrapper)=><PersonalWrapper {...props} />}</Bundle>;
const WeiboWrapper = props => <Bundle load={Weibo}>{(WeiboWrapper)=><WeiboWrapper {...props} />}</Bundle>;
const MusicWrapper = props => <Bundle load={Music}>{(MusicWrapper)=><MusicWrapper {...props} />}</Bundle>;
const SoccerWrapper = props => <Bundle load={Soccer}>{(SoccerWrapper)=><SoccerWrapper {...props} />}</Bundle>;
const NotFoundWrapper = props => <Bundle load={NotFound}>{(NotFoundWrapper)=><NotFoundWrapper {...props} />}</Bundle>;
const LoginWrapper = props => <Bundle load={Login}>{(LoginWrapper)=><LoginWrapper {...props} />}</Bundle>;
const WeatherPageWrapper = props => <Bundle load={WeatherPage}>{(WeatherPageWrapper)=><WeatherPageWrapper {...props} />}</Bundle>;
const ArticleDetailWrapper = props => <Bundle load={ArticleDetail}>{(ArticleDetailWrapper)=><ArticleDetailWrapper {...props} />}</Bundle>;

import Loading from '../components/Loading';
import Tips from '../components/Tips';
import MusicPlayerBox from '../components/MusicPlayerBox';


@inject ('userStore','stateStore','musicStore')
@observer class App extends React.Component {
   constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
        }
    }

    getUserData(){
        return new Promise((resolve,reject)=>{
            //获取token
            let token;
            let rawToken = getLocalItem('token');
            //已登录状态
            if(rawToken){
                token = jwt.verify(rawToken,'chambers');
                this.props.userStore.setUser({
                    id:token
                });

                //保存全局用户信息
                const res = getUserData(token);
                res.then((data)=>{
                    this.props.userStore.setUser(data);
                    resolve(this.props.userStore.user.city);
                })
                .catch((e)=>{
                    this.props.stateStore.setTips('fail','暂时无法获得用户信息');
                    resolve('深圳市');
                })

                //读取本地歌单
                const playListLocalToken = token+'playlist';
                this.props.musicStore.setInitPlaylist(JSON.parse(getLocalItem(playListLocalToken)));
            }
            //没登录状态
            else{
                //读取本地歌单
                this.props.musicStore.setInitPlaylist(JSON.parse(getLocalItem('playlist')));
                resolve('深圳市');
            }
        })
    }

    componentWillMount(){
        //获取城市，然后获得天气
        this.getUserData()            
        .then((city)=>{
            return getWeatherData(city);
        })
        .then((data)=>{
            this.props.stateStore.setWeather({
                temperature:data.temperature,
                weatherIcon:data.weatherIcon,
                pm25:data.pm25 || '0',
                quality:'',
                type:data.type,
                lowTem:data.lowTem,
                highTem:data.highTem,
                wind:data.wind,
                dayData:data.forecast
            })
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail','暂时无法获得天气数据');
        })
    }

    componentDidMount(){
        this.props.stateStore.setLoading(false);
    }

    hasReady(e){
        this.props.musicStore.setPlayPause('play');
        this.props.musicStore.setDuration(e.target.duration);
    }

    updateTime(e){
        this.props.musicStore.setCurTime(e.target.currentTime);
    }

    musicEnded(e){
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
            e.target.load();
        }
    }

    render(){
        return(
            <div>
                <Switch>
                    <Redirect exact from="/" to="/home/dynamic" />
                    <Redirect exact from="/home" to="/home/dynamic" />
                    <Redirect exact from="/soccer" to="/soccer/news" />
                    <Redirect exact from="/music" to="/music/hall" />
                    <Redirect exact from="/weibo" to="/weibo/hot" />
                    <Route path="/article/detail/:targetUrl" component={ArticleDetailWrapper}/>
                    <Route path="/login" component={LoginWrapper}/>
                    <Route path="/weather" component={WeatherPageWrapper}/>
                    <Route path="/personal" component={PersonalWrapper}/>
                    <Route path="/home" component={HomeWrapper}/>
                    <Route path="/weibo" component={WeiboWrapper}/>
                    <Route path="/music" component={MusicWrapper}/>
                    <Route path="/soccer" component={SoccerWrapper}/>
                    <Route component={NotFoundWrapper}/>
                </Switch>
                {
                    this.props.stateStore.isLoading?
                    <Loading/>:''
                }
                <Tips 
                    type={this.props.stateStore.tips.tipsType} 
                    content={this.props.stateStore.tips.tipsContent} 
                    count={this.props.stateStore.tips.tipsShowCount}
                    successTop={this.props.stateStore.tips.tipsSuccessTop}
                />
                {
                    this.props.musicStore.showMusicBox && this.props.musicStore.songlist.length>1 && this.props.musicStore.curSongIndex!==0?
                    <MusicPlayerBox 
                        songImg={this.props.musicStore.songlist[this.props.musicStore.curSongIndex].imgUrl?this.props.musicStore.songlist[this.props.musicStore.curSongIndex].imgUrl:''}
                        musicPageRoute='/music/player'
                        percent={this.props.musicStore.curTime/this.props.musicStore.songlist[this.props.musicStore.curSongIndex].duration}
                    />:''
                }
                <audio 
                    id="musicAudio" 
                    src={'http://'+this.props.musicStore.songlist[this.props.musicStore.curSongIndex].songUrl}
                    onCanPlay={this.hasReady.bind(this)}
                    onTimeUpdate={this.updateTime.bind(this)}
                    onEnded={this.musicEnded.bind(this)}
                >
                </audio>
            </div>
        )
    }
}


export default App;
