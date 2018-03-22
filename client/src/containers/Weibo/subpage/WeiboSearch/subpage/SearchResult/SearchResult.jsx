import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getSearchResult} from '../../../../../../fetch/weibo/search';

import BigListItem from '../../../../../../components/BigListItem';
import PictureViewer from '../../../../../../components/PictureViewer';

import './style.less';

@inject ('stateStore')
@observer class SearchResult extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            noresult:false,
            weiboList:[],
            curImgList:[],
            showPictureViewer:false,
            curImgIndex:0,
        };
    }

    componentDidMount(){
        this.refs.searchInput.value=this.props.match.params.word;
        this.fetchResult(this.props.match.params.word);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.word != this.props.match.params.word) {
            document.documentElement.scrollTop = document.body.scrollTop = 0;
            this.fetchResult(nextProps.match.params.word);
        } 
    }

    fetchResult(word){
        this.props.stateStore.setLoading(true);
        const res = getSearchResult(word);
        res
        .then((res)=>{
            if(typeof res === 'string'){
                this.setState({
                    noresult:true,
                    weiboList:[]
                },()=>{
                    this.props.stateStore.setLoading(false);
                })
            }else{
                 this.setState({
                    noresult:false,
                    weiboList:res
                 },()=>{
                     this.props.stateStore.setLoading(false);
                 })
            }
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

    //查看图片
    seePicture(index,imgItems){
        this.setState({
            showPictureViewer:true,
            curImgIndex:index,
            curImgList:imgItems
        })
    }

    hidePictureViewer(){
        this.setState({
            showPictureViewer:false
        })
    }

    navToInnerPage(id,avatar,name,time,imgList){
        const codeAvatar = encodeURIComponent(avatar);
        const codeName = encodeURIComponent(name);
        const codeTime = encodeURIComponent(time);
        const codeImgList = encodeURIComponent(imgList);
        this.props.history.push(`/weibo/detail/${id}?data={"avatar":"${codeAvatar}","name":"${codeName}","time":"${codeTime}","imgList":"${codeImgList}"}`);
    }

    render(){
        return(
            <div className="weiboSearchResultPage">
                <div className="searchBox">
                    <span className="left" onClick={this.navTo.bind(this,'/weibo/search')}>
                        <i className="iconfont icon-return"/>
                    </span>
                    <input ref='searchInput' type="text" placeholder="搜索" onKeyPress={this.searchConfirm.bind(this)}/>
                    <span className="right" onClick={this.cancel.bind(this)}>
                        <i className="iconfont icon-close"/>
                    </span>
                </div>
                {
                    this.state.noresult?
                    <div className="noresult">抱歉，未找到相关结果</div>
                    :
                    <div className="searchResult">
                        {
                            this.state.weiboList.map((item,index)=>{
                                let imgList = [];
                                if(item.mblog.pics){
                                    item.mblog.pics.map((item,index)=>{
                                        imgList.push(item.url);
                                    })
                                }
                                return(
                                    <BigListItem
                                        key={'weibo'+index}
                                        img={item.mblog.user.profile_image_url}
                                        title={item.mblog.user.screen_name}
                                        mainInfo={item.mblog.text}
                                        tips={item.mblog.created_at}
                                        imgItems={imgList}
                                        liClickHandle={
                                            this.navToInnerPage.bind(
                                                this,
                                                item.mblog.id,
                                                item.mblog.user.profile_image_url,
                                                item.mblog.user.screen_name,
                                                item.mblog.created_at,
                                                imgList
                                            )
                                        }
                                        imgItemClickHandle={this.seePicture.bind(this)}
                                        imgClickHandle={this.navTo.bind(this,'/article/detail/'+encodeURIComponent(item.mblog.user.profile_url))}
                                    />
                                )
                            })
                        }
                        {
                            this.state.showPictureViewer?
                            <PictureViewer imgs={this.state.curImgList} firstIndex={this.state.curImgIndex} hideHandle={this.hidePictureViewer.bind(this)}/>:''
                        }
                    </div>
                }
            </div>
        )
    }
}

export default SearchResult;