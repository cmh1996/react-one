import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,perRem} from '../../../../util/util';
import {getSoccerNewsByType} from '../../../../fetch/soccer/news';

import ScrollList from '../../../../components/ScrollList';
import NewsListItem from '../../../../components/NewsListItem';
import Swiper from '../../../../components/Swiper';
import TagHeader from '../../../../components/TagHeader';
import BackToTop from '../../../../components/BackToTop';

import styles from './style.less';

const newsChannel = ['headline','hot','deep','England','Spain','Italy','Germany','China'];
const clientSize = getClientSize();

@inject('stateStore','soccerStore')
@observer class SoccerNews extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            newsData:[],
            refreshEnd:false,
            isLoadingMore:false,
            showBackToTop:false,
            initDone:false,
        };
        let time = new Date();
        this.today = `${time.getFullYear()}-${this.transMonth(time.getMonth())}-${this.transDate(time.getDate())} 今天`;
        time.setTime(time.getTime()-24*60*60*1000);
        this.yesterday = `${time.getFullYear()}-${this.transMonth(time.getMonth())}-${this.transDate(time.getDate())} 昨天`;
        time.setTime(time.getTime()+2*24*60*60*1000);
        this.tomorrow = `${time.getFullYear()}-${this.transMonth(time.getMonth())}-${this.transDate(time.getDate())} 明天`;
    }

    componentDidMount(){
        this.props.stateStore.setLoading(true);
        this.renderList();
    }  

    //切换新闻类型
    switchNewsChannel(index){
        this.props.stateStore.setLoading(true);
        this.props.soccerStore.setCurNewsType(newsChannel[index]);
        //把新闻列表清空
        this.setState({
            newsData:[],
            initDone:false,
            showBackToTop:false,
        })
        this.renderList();
    }

    //判断mobx中有没有缓存数据，有就直接上缓存，没有就fetch
    renderList(){
        const curNewsType = this.props.soccerStore.curNewsType;
        //如果当前类型新闻列表为空，那就去fetch，然后保存到mobx中
        if(this.props.soccerStore[curNewsType].length===0){
            const res = getSoccerNewsByType(curNewsType,1);
            res.then((res)=>{
                this.props.stateStore.setLoading(false);
                this.props.soccerStore.setNewsCache(curNewsType,res);
                this.props.stateStore.setTips('success','小助手为您加载了'+res.length+'条新闻');
                this.setState({
                    initDone:true,
                    newsData:[].concat(...res),
                },()=>{
                    this.refs.box.refs.box.scrollTop = 0;
                })
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络异常，请稍后再试');
            })
        }
        //如果mobx中该类型新闻已经有数据了，那就从里面取
        else{
            this.props.stateStore.setLoading(false);
            this.setState({
                initDone:true,
                newsData:[].concat(...this.props.soccerStore[curNewsType])
            },()=>{
                this.refs.box.refs.box.scrollTop = 0;
            })
        }
    }

    navTo(id){
        const url = 'http://www.dongqiudi.com/share/article/'+id+'?id='+id+'&type=undefined&refer=m_website';
        const targetUrl = encodeURIComponent(url);
        this.props.history.push('/article/detail/'+targetUrl);
    }

    navToMatchDetail(id){
        this.props.history.push('/soccer/matchData/'+id);
    }

    //下拉刷新
    refresh(){
        const curNewsType = this.props.soccerStore.curNewsType;
        this.setState({
            refreshEnd:false,
        },()=>{
            const res = getSoccerNewsByType(curNewsType,1);
            res.then((res)=>{
                const newFirstData = res[0];
                const oldFirstData = this.state.newsData[0];
                //如果刷新前后第一条数据的id一样，就认为没有新数据
                if(newFirstData.id===oldFirstData.id){
                }
                //有新数据的话就清空相应cache，重新给cache赋值
                else{
                    //在新数据里找老数据的第一条的位置，如果是-1，就说明新数据条数>15
                    let newNum = res.findIndex((item)=>{
                        return item.id===oldFirstData.id;
                    });
                    if(newNum===-1){
                        newNum = 15;
                    }
                    this.props.soccerStore.setNewsCache(curNewsType,res,true);
                    this.props.soccerStore.setLoadCount(this.props.soccerStore.curNewsTypeIndex,true);
                    this.props.stateStore.setTips('success','小助手为您加载了'+newNum+'条新闻');
                    this.setState({
                        newsData:[].concat(...this.props.soccerStore[curNewsType]),
                    })
                }
            })
            .catch((e)=>{
                this.props.stateStore.setLoading(false);
                this.props.stateStore.setTips('fail','网络异常，请稍后再试');
            })  
            .then(()=>{
                this.setState({
                    refreshEnd:true,
                })
            })
        })
    }

    //上拉加载更多
    loadMore(){
        const curIndex = this.props.soccerStore.curNewsTypeIndex;
        const curLoadCount = this.props.soccerStore.loadCount[curIndex]+1;
        const curNewsType = this.props.soccerStore.curNewsType;
        
        this.setState({
            isLoadingMore:true
        });
        const res = getSoccerNewsByType(curNewsType,curLoadCount);
        res.then((res)=>{
            this.props.soccerStore.setNewsCache(curNewsType,res);
            this.props.soccerStore.setLoadCount(curIndex);
            this.setState({
                newsData:[].concat(...this.props.soccerStore[curNewsType])
            })
        })
        .then(()=>{
            this.setState({
                isLoadingMore:false,
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','有个小mistake：'+e);
        })
    }

    //回到顶部
    backToTop(){
        this.refs.box.refs.box.scrollTop = 0;
    }

    toggleBackToTop(farFromTop){
        if(farFromTop){
            this.setState({showBackToTop:true});
        }else{
            this.setState({showBackToTop:false});
        }
    }

    //把系统的月份转化为要用的月份
    transMonth(codeMonth){
        return(codeMonth+1).toString().padStart(2,'0');
    }

    //把系统的日份转化为要用的日份
    transDate(codeDate){
        return codeDate.toString().padStart(2,'0');
    }

    render(){
        let listHeight = clientSize.height-(6.4*perRem)+'px';
        let fixedTopHeight = 4*perRem;
        let fixedBottomHeight = 2.4*perRem;
        let hotMatch = [{competition:'',teamA:'',teamALogo:'',teamAScore:'',teamB:'',teamBLogo:'',teamBScore:'',time:''},
                        {competition:'',teamA:'',teamALogo:'',teamAScore:'',teamB:'',teamBLogo:'',teamBScore:'',time:''}];
        const importantMatchList = this.props.soccerStore.importantMatch;
        let res = [];

        if(Object.keys(importantMatchList).length>0){
            res = [importantMatchList[Object.keys(importantMatchList)[0]][0],
                    importantMatchList[Object.keys(importantMatchList)[1]][0]];
            hotMatch = [{
                            id:res[0].id,
                            competition:res[0].competition.name,
                            teamA:res[0].team_A.name,
                            teamALogo:res[0].team_A.logo,
                            teamAScore:res[0].team_A.score,
                            teamB:res[0].team_B.name,
                            teamBLogo:res[0].team_B.logo,
                            teamBScore:res[0].team_B.score,
                            time:'今日'+res[0].local_time
                        },{
                            id:res[1].id,
                            competition:res[1].competition.name,
                            teamA:res[1].team_A.name,
                            teamALogo:res[1].team_A.logo,
                            teamAScore:res[1].team_A.score,
                            teamB:res[1].team_B.name,
                            teamBLogo:res[1].team_B.logo,
                            teamBScore:res[1].team_B.score,
                            time:'今日'+res[1].local_time
                        }];
        }
        return(
            <div className="soccerNewsPage">
                <TagHeader
                    firstRenderItem={this.props.soccerStore.curNewsTypeIndex}
                    items={[{title:'头条'},
                            {title:'热点'},
                            {title:'深度'},
                            {title:'英超'},
                            {title:'西甲'},
                            {title:'意甲'},
                            {title:'德甲'},
                            {title:'中超'}]}
                    selectHandle={this.switchNewsChannel.bind(this)}
                    selectedColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                {
                    this.props.soccerStore.curNewsType==='headline'?
                    [
                    <Swiper key='swiper' width={clientSize.width} height="7.5rem" num='5'>
                        {
                            this.state.newsData.length>0?
                            this.state.newsData.slice(0,5).map((item,index)=>{
                                return(
                                    <section className="banner" onClick={this.navTo.bind(this,item.id)} key={'banner'+index}>
                                        <img src={item.litpic}/>
                                        <p>{item.title}</p>
                                    </section>
                                )
                            }):''
                        }
                    </Swiper>,
                    <div className="hotMatchBox" key="hotMatch">
                        {
                            hotMatch.map((item,index)=>{
                                return(
                                    <div className="hotMatch" key={index} onClick={this.navToMatchDetail.bind(this,item.id)}>
                                        <div className="hotMatchHeader">
                                            <span className="matchType">{item.competition}</span>
                                            <span className="matchLive">{item.teamAScore?'视频':'直播'}</span>
                                        </div>
                                        <div className="hotMatchBody">
                                            <div className="matchTeams">
                                                <div className="matchTeam"><img src={item.teamALogo} />{item.teamA}</div>
                                                <div className="matchTeam"><img src={item.teamBLogo} />{item.teamB}</div>
                                            </div>
                                            {
                                                item.teamAScore?
                                                <div className="matchScore">
                                                    <span>{item.teamAScore}</span>
                                                    <span>{item.teamBScore}</span>
                                                </div>
                                                :
                                                <span className="matchTime">{item.time}</span>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    ]
                    :''
                }
                {
                    this.state.initDone?
                    this.props.soccerStore.curNewsType==='headline'?
                    <ScrollList
                        ref="box"
                        type='inPageScroll'
                        fixedTopHeight={fixedTopHeight}
                        fixedBottomHeight={fixedBottomHeight}
                        pullDownHandle={this.refresh.bind(this)}
                        refreshEnd={this.state.refreshEnd}
                        pullUpHandle={this.loadMore.bind(this)}
                        isLoadingMore={this.state.isLoadingMore}
                        listHeight={listHeight}
                        hasScrollSomeDistanceHandle={this.toggleBackToTop.bind(this,true)}
                        nearTopHandle={this.toggleBackToTop.bind(this,false)}
                    >
                        {
                            this.state.newsData.map((item,index)=>{
                                return(    
                                    <NewsListItem
                                        liClickHandle={this.navTo.bind(this,item.id)}
                                        title={item.title}
                                        desc={item.description}
                                        tips1={'评论 '+item.comments_total}
                                        img={item.litpic}
                                        key={index}
                                    /> 
                                )
                            })
                        }
                    </ScrollList>
                    :
                    <ScrollList
                        ref="box"
                        pullDownHandle={this.refresh.bind(this)}
                        refreshEnd={this.state.refreshEnd}
                        pullUpHandle={this.loadMore.bind(this)}
                        isLoadingMore={this.state.isLoadingMore}
                        listHeight={listHeight}
                        hasScrollSomeDistanceHandle={this.toggleBackToTop.bind(this,true)}
                        nearTopHandle={this.toggleBackToTop.bind(this,false)}
                    >
                        {
                            this.state.newsData.map((item,index)=>{
                                return(    
                                    <NewsListItem
                                        liClickHandle={this.navTo.bind(this,item.id)}
                                        title={item.title}
                                        desc={item.description}
                                        tips1={'评论 '+item.comments_total}
                                        img={item.litpic}
                                        key={index}
                                    /> 
                                )
                            })
                        }
                    </ScrollList>:''
                }
                {
                    this.state.showBackToTop?
                    <BackToTop type="inABox" backTopHandle={this.backToTop.bind(this)}/>:''
                }
            </div>
        )
    }

}

export default SoccerNews;