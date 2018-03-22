import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,perRem} from '../../../../util/util';
import {getNewsByType} from '../../../../fetch/home/news';

import ScrollList from '../../../../components/ScrollList';
import NewsListItem from '../../../../components/NewsListItem';
import TagHeader from '../../../../components/TagHeader';
import BackToTop from '../../../../components/BackToTop';

import styles from './style.less';

const newsChannel = ['hot','society','entertainment','sports','military','technology','economics'];
const perFetchNewsCount = 20;
const clientSize = getClientSize();

@inject('stateStore','newsStore')
@observer class News extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            newsData:[],
            refreshEnd:false,
            isLoadingMore:false,
            showBackToTop:false,
            initDone:false,
        }
    }

    componentDidMount(){
        this.props.stateStore.setLoading(true);
        this.renderList();
    }  

    //切换新闻类型
    switchNewsChannel(index){
        this.props.stateStore.setLoading(true);
        this.props.newsStore.setCurNewsType(newsChannel[index]);
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
        const curNewsType = this.props.newsStore.curNewsType;
        //如果当前类型新闻列表为空，那就去fetch，然后保存到mobx中
        if(this.props.newsStore[curNewsType].length===0){
            const res = getNewsByType(curNewsType,0,perFetchNewsCount);
            res.then((res)=>{
                this.props.stateStore.setLoading(false);
                this.props.newsStore.setNewsCache(curNewsType,res);
                this.props.stateStore.setTips('success','小助手为您加载了'+res.length+'条新资讯');
                this.setState({
                    initDone:true,
                    newsData:[].concat(...res),
                },()=>{
                    this.refs.box.refs.box.scrollTop = 0;
                })
            })
            .catch((e)=>{
                this.props.stateStore.setTips('fail','网络异常，请稍后再试');
            })
        }
        //如果mobx中该类型新闻已经有数据了，那就从里面取
        else{
            this.props.stateStore.setLoading(false);
            this.setState({
                initDone:true,
                newsData:[].concat(...this.props.newsStore[curNewsType])
            },()=>{
                this.refs.box.refs.box.scrollTop = 0;
            })
        }
    }

    navTo(url){
        const targetUrl = encodeURIComponent(url);
        this.props.history.push('/article/detail/'+targetUrl);
    }

    //下拉刷新
    refresh(){
        const curNewsType = this.props.newsStore.curNewsType;
        this.setState({
            refreshEnd:false,
        },()=>{
            const res = getNewsByType(curNewsType,0,perFetchNewsCount);
            res.then((res)=>{
                const newFirstData = res[0];
                const oldFirstData = this.state.newsData[0];
                //如果刷新前后第一条数据的id一样，就认为没有新数据
                if(newFirstData.itemid===oldFirstData.itemid){
                }
                //有新数据的话就清空相应cache，重新给cache赋值
                else{
                    //在新数据里找老数据的第一条的位置
                    let newNum = res.findIndex((item)=>{
                        return item.itemid===oldFirstData.itemid;
                    });
                    if(newNum===-1){
                        newNum = res.length;
                    }
                    this.props.newsStore.setNewsCache(curNewsType,res,true);
                    this.props.newsStore.setLoadCount(this.props.newsStore.curNewsTypeIndex,true);
                    this.props.stateStore.setTips('success','小助手为您加载了'+newNum+'条新资讯');
                    this.setState({
                        newsData:[].concat(...this.props.newsStore[curNewsType]),
                    })
                }
            })
            .catch((e)=>{
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
        const curIndex = this.props.newsStore.curNewsTypeIndex;
        const curLoadCount = this.props.newsStore.loadCount[curIndex];
        const curNewsType = this.props.newsStore.curNewsType;

        this.setState({
            isLoadingMore:true
        });
        const res = getNewsByType(
                        curNewsType,
                        curLoadCount*perFetchNewsCount,
                        (curLoadCount*perFetchNewsCount)+perFetchNewsCount
                    );
        res.then((res)=>{
            this.props.newsStore.setNewsCache(curNewsType,res);
            this.props.newsStore.setLoadCount(curIndex);
            this.setState({
                newsData:[].concat(...this.props.newsStore[curNewsType])
            })
        })
        .then(()=>{
            this.setState({
                isLoadingMore:false,
            })
        })
        .catch((e)=>{
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

    render(){
        let listHeight = clientSize.height-(6.4*perRem)+'px';
        return(
            <div className="newsPage">
                <TagHeader
                    firstRenderItem={this.props.newsStore.curNewsTypeIndex}
                    items={[{title:'要闻'},
                            {title:'社会'},
                            {title:'娱乐'},
                            {title:'体育'},
                            {title:'军事'},
                            {title:'科技'},
                            {title:'财经'}]}
                    selectHandle={this.switchNewsChannel.bind(this)}
                    selectedColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                {
                    this.state.initDone?
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
                                        liClickHandle={this.navTo.bind(this,item.url)}
                                        title={item.title}
                                        tips1={item.source}
                                        tips2={'评论 '+item.comment_count}
                                        img={item.image}
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

export default News;