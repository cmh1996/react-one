import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';
import {Route,Switch} from 'react-router-dom';

import WeiboHot from 'bundle-loader?lazy&name=app-[name]!./subpage/WeiboHot/WeiboHot';
import WeiboDetail from 'bundle-loader?lazy&name=app-[name]!./subpage/WeiboDetail/WeiboDetail';
import WeiboSearch from 'bundle-loader?lazy&name=app-[name]!./subpage/WeiboSearch/WeiboSearch';
import HotSearchRanking from 'bundle-loader?lazy&name=app-[name]!./subpage/WeiboSearch/subpage/HotSearchRanking/HotSearchRanking';
import SearchResult from 'bundle-loader?lazy&name=app-[name]!./subpage/WeiboSearch/subpage/SearchResult/SearchResult';

const WeiboHotWrapper = props => <Bundle load={WeiboHot}>{(WeiboHotWrapper)=><WeiboHotWrapper {...props} />}</Bundle>;
const WeiboDetailWrapper = props => <Bundle load={WeiboDetail}>{(WeiboDetailWrapper)=><WeiboDetailWrapper {...props} />}</Bundle>;
const WeiboSearchWrapper = props => <Bundle load={WeiboSearch}>{(WeiboSearchWrapper)=><WeiboSearchWrapper {...props} />}</Bundle>;
const HotSearchRankingWrapper = props => <Bundle load={HotSearchRanking}>{(HotSearchRankingWrapper)=><HotSearchRankingWrapper {...props} />}</Bundle>;
const SearchResultWrapper = props => <Bundle load={SearchResult}>{(SearchResultWrapper)=><SearchResultWrapper {...props} />}</Bundle>;

import MainHeader from '../../components/MainHeader';
import Nav from '../../components/Nav';
import Bundle from '../../components/Bundle';

@inject('userStore','stateStore')
@observer class Weibo extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            items:this.props.stateStore.indexItems,
            ownItems:[
                {title:'热门微博',route:'/weibo/hot',defaultItem:true},
                {title:'搜索',route:'/weibo/search',defaultItem:false}
            ],
            navZIndex:10,
            personalList:this.props.stateStore.personalItems,
        }
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
            <div>
                {
                    curPath.indexOf('/weibo/detail/')>-1 || curPath.indexOf('/weibo/result')>-1 || curPath.indexOf('/weibo/hotSearchRanking')>-1?
                    <div className="singlePage">
                        <Switch>
                            <Route exact path="/weibo/detail/:id" component={WeiboDetailWrapper}/>
                            <Route exact path="/weibo/result/:word" component={SearchResultWrapper}/>
                            <Route exact path="/weibo/hotSearchRanking" component={HotSearchRankingWrapper}/>
                        </Switch>
                    </div>
                    :
                    [<MainHeader
                        key="MainHeader"
                        personalList={this.state.personalList}
                        showPersonalHandle={this.showPersonalHandle.bind(this)}
                        hidePersonalHandle={this.hidePersonalHandle.bind(this)}
                        items={this.state.ownItems}
                        temperature={this.props.stateStore.weather.temperature}
                        icon={this.props.stateStore.weather.weatherIcon}
                        bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                    />,
                    <div className="content" ref="content" key="content">
                        <Switch>
                            <Route exact path="/weibo/hot" component={WeiboHotWrapper}/>
                            <Route exact path="/weibo/search" component={WeiboSearchWrapper}/>
                        </Switch>
                    </div>,
                    <Nav zIndex={this.state.navZIndex} selected="微博" items={this.state.items} key="nav" selectColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>]
                }
            </div>
        )
    }
}

export default Weibo;