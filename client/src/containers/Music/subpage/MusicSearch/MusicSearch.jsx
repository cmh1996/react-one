import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getHotKey,getSearchMatchWords} from '../../../../fetch/music/search';
import {getLocalItem,setLocalItem} from '../../../../util/util';

import SmallTitleBar from '../../../../components/SmallTitleBar';

import styles from './style.less';

@inject('stateStore')
@observer class MusicSearch extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            hotkey:[],
            searching:false,
            curWord:'',
            songList:[],
            mvList:[],
            singerList:[],
            albumList:[],
            historyList:JSON.parse(getLocalItem('searchHistoryList') || '[]')
        };
    }
    componentDidMount(){
        const res = getHotKey();
        res
        .then((data)=>{
            this.setState({
                hotkey:data.slice(0,12)
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    navTo(url){
        this.props.history.push(url);
    }

    fetchMatchWords(word){
        this.props.stateStore.setLoading(true);
        const res = getSearchMatchWords(encodeURIComponent(word));
        res
        .then((data)=>{
            this.setState({
                songList:data.songList,
                mvList:data.mvList,
                albumList:data.albumList,
                singerList:data.singerList
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    matchWords(e){
        const val = e.target.value;
        //输入框不为空
        if(val!==''){
            this.fetchMatchWords(val);
            this.setState({
                searching:true,
                curWord:val
            })
        }else{
            this.setState({
                searching:false,
                curWord:''
            })
        }
    }

    cancel(){
        this.refs.searchInput.value='';
        this.setState({
            searching:false,
            curWord:''
        })
    }

    searchConfirm(e){
        let keynum=e.keyCode||e.which;
        if(keynum == "13") {
            let curHistoryList = JSON.parse(getLocalItem('searchHistoryList') || '[]');
            curHistoryList.unshift(this.state.curWord);
            setLocalItem('searchHistoryList',JSON.stringify(curHistoryList));
            this.props.history.push('/music/result/'+encodeURIComponent(this.state.curWord));
            e.preventDefault();  
        }
    }

    removeHistoryItem(item,e){
        let curHistoryList = JSON.parse(getLocalItem('searchHistoryList') || '[]');
        let removeIndex = curHistoryList.findIndex((val,index)=>{
            return item===val;
        })
        curHistoryList.splice(removeIndex,1);
        this.setState({
            historyList:curHistoryList
        },()=>{
            setLocalItem('searchHistoryList',JSON.stringify(curHistoryList));
        })
        e.stopPropagation();
    }

    clear(){
        this.setState({
            historyList:[]
        },()=>{
            localStorage.removeItem("searchHistoryList");
        })
    }

    clickHotKey(item){
        let curHistoryList = JSON.parse(getLocalItem('searchHistoryList') || '[]');
        curHistoryList.unshift(item);
        setLocalItem('searchHistoryList',JSON.stringify(curHistoryList));
        this.navTo('/music/result/'+encodeURIComponent(item));
    }

    render(){
        return(
            <div className="musicSearchPage">
                <div className="searchBox">
                    <input ref='searchInput' type="text" placeholder="搜索" onChange={this.matchWords.bind(this)} onKeyPress={this.searchConfirm.bind(this)}/>
                    <i className="iconfont icon-close" onClick={this.cancel.bind(this)}/>
                </div>
                {
                    this.state.searching?
                    <ul className="searchingList">
                        <li className="searchTitle" onClick={this.navTo.bind(this,'/music/result/'+encodeURIComponent(this.state.curWord))}>{'搜索“'+this.state.curWord+'”'}</li>
                        {
                            this.state.songList.map((item,index)=>{
                                return(
                                    <li className="searchResult" key={'song'+index}>
                                        <span className="icon"><i className="iconfont icon-music"/></span>
                                        <span className="text">{item.name+'-'+item.singer}</span>
                                    </li>
                                )
                            })
                        }
                        {
                            this.state.singerList.map((item,index)=>{
                                return(
                                    <li className="searchResult" key={'singer'+index} onClick={this.navTo.bind(this,'/music/singer/detail/'+item.mid)}>
                                        <span className="icon"><i className="iconfont icon-people_fill"/></span>
                                        <span className="text">{item.singer}</span>
                                    </li>
                                )
                            })
                        }
                        {
                            this.state.albumList.map((item,index)=>{
                                return(
                                    <li className="searchResult" key={'album'+index} onClick={this.navTo.bind(this,'/music/album/detail/'+item.mid)}>
                                        <span className="icon"><i className="iconfont icon-cd_icon"/></span>
                                        <span className="text">{item.name+'-'+item.singer}</span>
                                    </li>
                                )
                            })
                        }
                        {
                            this.state.mvList.map((item,index)=>{
                                return(
                                    <li className="searchResult" key={'mv'+index} onClick={this.navTo.bind(this,'/music/musicVideo/detail/'+item.mid)}>
                                        <span className="icon"><i className="iconfont icon-luxiang"/></span>
                                        <span className="text">{item.name+'-'+item.singer}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    :
                    [<section className="hotSearch" key="hotSearch">
                        <SmallTitleBar title="热门搜索"/>
                        <ul className="hotKeys">
                            {
                                this.state.hotkey.map((item,index)=>{
                                    return(
                                        <li key={item.n} onClick={this.clickHotKey.bind(this,item.k)}>{item.k}</li>
                                    )
                                })
                            }
                        </ul>
                    </section>,
                    <section className="searchHistory" key="searchHistory">
                        <SmallTitleBar title="搜索历史"/>
                        <ul className="historyItems">
                            {   
                                this.state.historyList.length>0?
                                <li onClick={this.clear.bind(this)} className="clearLi">
                                    <span>清除所有搜索记录</span>
                                </li>:''
                            }
                            {
                                this.state.historyList.map((item,index)=>{
                                    return(
                                        <li key={'history'+index} onClick={this.navTo.bind(this,'/music/result/'+encodeURIComponent(item))}>
                                            <span>{item}</span>
                                            <i onClick={this.removeHistoryItem.bind(this,item)} className="iconfont icon-close"/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </section>]

                }
            </div>
        )
    }

}

export default MusicSearch;