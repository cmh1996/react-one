import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getWeiboText,getWeiboLike,getWeiboComment} from '../../../../fetch/weibo/hot';
import {perRem} from '../../../../util/util';

import styles from './style.less';

import BigListItem from '../../../../components/BigListItem';
import SubHeader from '../../../../components/SubHeader';
import SmallTitleBar from '../../../../components/SmallTitleBar';
import ListItem from '../../../../components/ListItem';
import PictureViewer from '../../../../components/PictureViewer';

@inject('stateStore')
@observer class WeiboDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            mode:'comment',
            sendValue:'',
            weiboData:{
                avatar:'',
                time:'',
                imgList:[],
                name:'',
            },
            weiboText:'',
            curImgList:[],
            showPictureViewer:false,
            curImgIndex:0,
            commentLoadTime:1,
            likeLoadTime:1,
            commentList:[],
            hotCommentList:[],
            commentNum:'',
            likeList:[],
            likeNum:'',
            noComment:false
        }
        this.loadMore1 = this.loadMore.bind(this);
    }

    componentWillMount(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    }

    componentDidMount(){
        window.addEventListener('scroll',this.loadMore1,false);

        //获取正文内容
        const res = getWeiboText(this.props.match.params.id);
        res
        .then((text)=>{
            this.setState({
                weiboText:text
            })
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail','获取微博内容失败');
        })

        //获取评论
        this.fetchComment();

        //获取微博其他信息
        const data = JSON.parse(this.props.location.search.substr(6));
        const imgList = decodeURIComponent(data.imgList);
        if(imgList.length>0){
            this.setState({
                weiboData:{
                    avatar:decodeURIComponent(data.avatar),
                    time:(decodeURIComponent(data.time)),
                    imgList:imgList.split(','),
                    name:(decodeURIComponent(data.name)),
                }
            })
        }else{
            this.setState({
                weiboData:{
                    avatar:decodeURIComponent(data.avatar),
                    time:(decodeURIComponent(data.time)),
                    imgList:[],
                    name:(decodeURIComponent(data.name)),
                }
            })
        }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll',this.loadMore1,false);
    }

    loadMore(){
        const clientH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const scrollT = document.documentElement.scrollTop || document.body.scrollTop;
        const wholeH = document.body.scrollHeight;
        if(clientH+scrollT>=wholeH){
            if(this.state.mode==='comment' && !this.state.noComment){
                this.fetchComment();
            }
        }
    }

    fetchLike(){
        const res = getWeiboLike(this.props.match.params.id,this.state.likeLoadTime);
        res
        .then((data)=>{
            //还没有人赞过
            if(data.ok===0){
                this.setState({
                    likeList:[],
                })
            }else{
                this.setState({
                    likeList:this.state.likeList.concat(data.data),
                    likeLoadTime:++this.state.likeLoadTime,
                    likeNum:data.total_number
                })
            }
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail','获取微博赞失败');
        })
    }
    

    fetchComment(){
        const res = getWeiboComment(this.props.match.params.id,this.state.commentLoadTime);
        res
        .then((data)=>{
            //没数据
            if(data.ok===0){
                this.setState({
                    noComment:true,
                })
                return;
            }
            //如果有热门数据
            if(data.data.hot_data){
                this.setState({
                    hotCommentList:this.state.hotCommentList.concat(data.data.hot_data),
                    commentList:this.state.commentList.concat(data.data.data),
                    commentLoadTime:++this.state.commentLoadTime,
                    commentNum:data.data.total_number,
                    noComment:false
                })
            }else{
                this.setState({
                    commentList:this.state.commentList.concat(data.data.data),
                    commentLoadTime:++this.state.commentLoadTime,
                    commentNum:data.data.total_number,
                    noComment:false
                })
            }
        })
        .catch((e)=>{
            this.props.stateStore.setTips('fail','获取微博评论失败');
        })
    }

    //跳转页面
    navTo(id){
        this.props.history.push('/article/detail/'+id)
    }

    //切换赞和评论区
    changeMode(mode){
        if(this.state.commentList.length<7 || mode==='like'){
            document.documentElement.scrollTop = document.body.scrollTop = 0;
        }else{
            document.documentElement.scrollTop = document.body.scrollTop = this.refs.listArea.offsetTop-4*perRem;
        }
        this.setState({
            mode:mode
        },()=>{
            if(this.state.mode==='like' && this.state.likeList.length===0){
                //获取赞
                this.fetchLike();
            }
        })
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

    render(){
        return(
            <div className="dynamicDetail">
                <SubHeader title="微博正文" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <BigListItem 
                    img={this.state.weiboData.avatar}
                    title={this.state.weiboData.name}
                    mainInfo={this.state.weiboText}
                    tips={this.state.weiboData.time}
                    imgItems={this.state.weiboData.imgList}
                    imgItemClickHandle={this.seePicture.bind(this)}
                />
                <div className="dynamicDetailBar">
                    <span onClick={this.changeMode.bind(this,'like')}
                          className={this.state.mode==='like'?'selected':''}>{'赞 '+this.state.likeNum}</span>
                    <span onClick={this.changeMode.bind(this,'comment')}
                          className={this.state.mode==='comment'?'selected':''}>{'评论 '+this.state.commentNum}</span>
                </div>
                <div className="listArea" ref="listArea" id="listArea">
                {
                    this.state.mode==='comment'?
                    <div className="dynamicDetailInteraction">
                        <SmallTitleBar title="热门评论"/>
                        <ul className="commentList">
                        {
                            this.state.hotCommentList.map((item,index)=>{
                                return(
                                    <BigListItem
                                        key={'hotComment'+index}
                                        img={item.user.profile_image_url}
                                        title={item.user.screen_name}
                                        mainInfo={item.text}
                                        tips={item.created_at}
                                        rightTips={true}
                                    >
                                        <span className="bigListItemRightTips">
                                            <i className="iconfont icon-fabulous"/>{item.like_counts}
                                        </span>
                                    </BigListItem>
                                )
                            })
                        }
                        </ul>
                        <SmallTitleBar title="全部评论" />
                        <ul className="commentList">
                        {
                            this.state.commentList.map((item,index)=>{
                                return(
                                    <BigListItem
                                        key={'hotComment'+index}
                                        img={item.user.profile_image_url}
                                        title={item.user.screen_name}
                                        mainInfo={item.text}
                                        tips={item.created_at}
                                        rightTips={item.like_counts}
                                    />
                                )
                            })
                        }
                        {
                            this.state.noComment || this.state.commentList.length<7?
                            <p className="loadingText">没有更多评论</p>
                            :
                            <p className="loadingText">正在加载中...</p>
                        }
                        </ul>
                    </div>
                    :
                    <div className="dynamicDetailInteraction">
                        <ul className="likeList">
                        {
                            this.state.likeList.length>0?
                            this.state.likeList.map((item,index)=>{
                                return(
                                    <ListItem
                                        key={'like'+index}
                                        img={item.user.profile_image_url}
                                        type="normal" 
                                        title={item.user.screen_name}
                                        liClickHandle={this.navTo.bind(this,item.user.profile_url)}/>
                                )
                            })
                            :
                            <p className="nolike">还没有人赞过</p>
                        }
                        </ul>
                    </div>
                }
                </div>
                {
                    this.state.showPictureViewer?
                    <PictureViewer imgs={this.state.curImgList} firstIndex={this.state.curImgIndex} hideHandle={this.hidePictureViewer.bind(this)}/>:''
                }
            </div>
        )
    }

}

export default WeiboDetail;