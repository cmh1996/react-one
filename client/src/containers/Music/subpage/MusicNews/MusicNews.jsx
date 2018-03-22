import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,perRem} from '../../../../util/util';
import {getMusicNews} from '../../../../fetch/music/musicHall';

import SubHeader from '../../../../components/SubHeader';
import NewsListItem from '../../../../components/NewsListItem';

import './style.less';

@inject('stateStore')
@observer class MusicNews extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            newsList:[],
            loadTimes:0,
        }
        this.clientSize = getClientSize();
        this.listHeight = this.clientSize.height-(2*perRem);
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.fetchData();
    }

    fetchData(){
        this.props.stateStore.setLoading(true);
        const resNews = getMusicNews(this.state.loadTimes*10+1,this.state.loadTimes*10+10);
        resNews
        .then((res)=>{
             this.setState({
                 newsList:this.state.newsList.concat(res),
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

    navTo(url){
        const targetUrl = encodeURIComponent(url);
        this.props.history.push('/article/detail/'+targetUrl);
    }

    loadMore(){
        if(this.props.stateStore.isLoading){
            return;
        }
        this.fetchData();
    }

    watchScroll(e){
        if(e.target.scrollTop+this.listHeight+200>=e.target.scrollHeight){
            this.loadMore();
        }
    }

    render(){
        return(
            <div className="MusicNewsPage">
                <SubHeader title="音乐资讯" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <ul className="newsList" 
                    ref="listBox" 
                    style={{height:this.listHeight}}
                    onScroll={this.watchScroll.bind(this)}>
                {
                    this.state.newsList.map((item,index)=>{
                        if(item.skipType){
                            return;
                        }
                        return(
                            <NewsListItem
                                key={index}
                                title={item.title}
                                tips1={item.source}
                                tips2={'评论 '+item.commentCount}
                                img={item.imgsrc}
                                liClickHandle={this.navTo.bind(this,'https://3g.163.com/ent/article/'+item.docid+'.html')}
                            />
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}

export default MusicNews;