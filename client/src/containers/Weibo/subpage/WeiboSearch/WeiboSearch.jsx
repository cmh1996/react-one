import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize} from '../../../../util/util';
import {getHotSearchSummary,getHotSearchRanking} from '../../../../fetch/weibo/search';

import styles from './style.less';

@inject('stateStore')
@observer class WeiboSearch extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            searching:false,
            hotKeyList:[]
        }
        this.clientSize=getClientSize();
    }

    componentDidMount(){
        this.props.stateStore.setLoading(true);
        const res = getHotSearchSummary();
        res
        .then((res)=>{
             this.setState({
                 hotKeyList:res[0].card_group[1].group
             },()=>{
                 this.props.stateStore.setLoading(false);
             })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    cancel(){
        this.refs.searchInput.value='';
    }

    searchConfirm(e){
        let keynum=e.keyCode||e.which;
        if(keynum == "13") {
            this.props.history.push('/weibo/result/'+encodeURIComponent(this.refs.searchInput.value));
            e.preventDefault();  
        }
    }

    navTo(url){
        this.props.history.push(url)
    }

    render(){
        return(
            <div className="weiboSearchPage" style={{minHeight:this.clientSize.height}}>
                <div className="searchBox">
                    <input ref='searchInput' type="text" placeholder="搜索" onKeyPress={this.searchConfirm.bind(this)}/>
                    <i className="iconfont icon-close" onClick={this.cancel.bind(this)}/>
                </div>
                <div className="searchSummary">
                    <div className="titleBox" onClick={this.navTo.bind(this,'/weibo/hotSearchRanking')}>
                        <img src="http://simg.s.weibo.com/20170307_realtime.png"/>
                        <span className="titleName">微博热搜榜</span>
                        <span className="tips">每分钟更新一次</span>
                        <i className="iconfont icon-enter"/>
                    </div>
                    <ul className="list">
                        {
                            this.state.hotKeyList.map((item,index)=>{
                                if(index===this.state.hotKeyList.length-1){
                                    return(
                                        <li key={'hotkey'+index} onClick={this.navTo.bind(this,'/weibo/hotSearchRanking')}>{item.title_sub}</li>
                                    )
                                }
                                return(
                                    <li key={'hotkey'+index} onClick={this.navTo.bind(this,'/weibo/result/'+item.title_sub)}>{item.title_sub}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }

}

export default WeiboSearch;