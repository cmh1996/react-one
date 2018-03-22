import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getMVDetail} from '../../../../../../fetch/music/mv';
import {convertUnit} from '../../../../../../util/util';

import SubHeader from '../../../../../../components/SubHeader';
import ListItem from '../../../../../../components/ListItem';

import './style.less';

@inject('stateStore')
@observer class MVDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            mvName:'',
            singerName:'',
            playNum:'',
            date:'',
            otherMVList:[],
        }
    }

    componentDidMount(){
        this.fetchData(this.props.match.params.id);
    }

    fetchData(id){
        this.props.stateStore.setLoading(true);
        const res = getMVDetail(id);
        res.then((data)=>{
            this.setState({
                mvName:data.mvname,
                singerName:data.singer.name,
                playNum:data.listennum,
                date:data.pubdate,
                otherMVList:data.singermvlist.list,
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','获取数据失败，请刷新重试')
        })
    }

    navTo(id){
        this.props.history.push('/music/musicVideo/detail/'+id)
    }

    componentWillReceiveProps(nextprops){
        if(this.props.match.params.id!==nextprops.match.params.id){
            this.fetchData(nextprops.match.params.id);
        }
    }

    render(){
        return(
             <div className="mvDetailPage">
                <SubHeader title="MV详情" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <div className="videoArea">
                    <img src={`http://puui.qpic.cn/qqvideo_ori/0/${this.props.match.params.id}_496_280/0`} alt="封面图"/>
                    <a href={`https://y.qq.com/w/mv.html?ADTAG=newyqq.mv&vid=${this.props.match.params.id}`} className="noVideo">
                        观看MV
                    </a>
                </div>
                <div className="mvInfo">
                    <span className="mvName">{this.state.mvName}</span>
                    <span className="singerName"><i className="iconfont icon-people_fill" />{this.state.singerName}</span>
                    <div className="bottomInfo">
                        <span>{convertUnit(this.state.playNum)+'次播放'}</span>
                        <span>{this.state.date}</span>
                    </div>
                </div>
                <div className="otherMV">
                    <div className="title">
                        同艺人的其他MV
                    </div>
                    <ul className="mvList">
                        {
                            this.state.otherMVList.map((item,index)=>{
                                let singerName = item.singers.length>0?item.singers[0].name:'';
                                return(
                                    <ListItem
                                        key={item.id+index}
                                        img={item.picurl}
                                        title={item.name}
                                        info={singerName}
                                        liClickHandle={this.navTo.bind(this,item.vid)}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default MVDetail;