import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {perRem,getClientSize} from '../../../../../../util/util';

import {getBillboardDetail} from '../../../../../../fetch/music/billboard';

import SubHeader from '../../../../../../components/SubHeader';
import TagHeader from '../../../../../../components/TagHeader';
import ListItem from '../../../../../../components/ListItem';
import StickyListBox from '../../../../../../components/StickyListBox';

import './style.less';

@inject('stateStore','musicStore')
@observer class BillboardDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curIndex:0,
            billboardList:[],
            billboardName:'',
            day:'',
            updateDate:'',
            billboardData:'',
            img:''
        };
        this.clientSize = getClientSize();
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.props.stateStore.setLoading(true);
        const res = getBillboardDetail(this.props.match.params.id);
        res
        .then((data)=>{
            this.setState({
                billboardList:data.songlist,
                billboardName:data.topinfo.listName,
                day:data.day_of_year,
                updateDate:data.date,
                billboardData:data.topinfo.info,
                img:data.topinfo.pic_v12
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        });
    }

    chooseType(index){
        this.setState({
            curIndex:index
        })
    }

    addSong(songObj){
        this.props.musicStore.addAndPlaySong(songObj)
    }

    playAll(){
        if(this.state.billboardList.length>0){
            let songArr = [];
            this.state.billboardList.map((item,index)=>{
                songArr.push({
                    id:item.data.songmid,
                    songName:item.data.songname,
                    singer:item.data.singer[0].name,
                    albumid:item.data.albummid
                })
            })
            this.props.musicStore.addAllSong(songArr);
        }
    }

    render(){
        return(
            <div className="billboardDetailPage">
                <div className="detailHeader" style={{backgroundImage:`url(${this.state.img})`}}>
                    <SubHeader />
                </div>
                <StickyListBox 
                    ref="listBox" 
                    fixedTop={2*perRem} 
                    normalTop={12*perRem} 
                    height={(this.clientSize.height-2*perRem)}
                >
                    <TagHeader
                        firstRenderItem={0}
                        items={[{title:'歌曲'},
                                {title:'详情'}]}
                        selectHandle={this.chooseType.bind(this)}
                        selectedColor='white'
                        bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                    />
                    <div className="listContent" ref="listContent">
                        {
                            this.state.curIndex===0?
                            <ul className="songContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                                <div className="playAll" onClick={this.playAll.bind(this)}><i className="iconfont icon-bofang"/>播放全部</div>
                            {this.state.billboardList.map((item,index)=>{
                                let singerName = '';
                                item.data.singer.map((item,index)=>{
                                    singerName += '/'+item.name
                                })
                                singerName = singerName.substring(1);
                                return(
                                    <div className="songItem" key={'bbSong'+index}>
                                        <span className={index<3?"rankingNum selected":"rankingNum"}>
                                            {index+1}
                                        </span>
                                        <ListItem
                                            title={item.data.songname}
                                            info={singerName+' '+item.data.albumname}
                                            titleTips={true}
                                            type='normal'
                                            liClickHandle={this.addSong.bind(this,{
                                                id:item.data.songmid,
                                                songName:item.data.songname,
                                                singer:singerName,
                                                albumid:item.data.albummid
                                            })}
                                        >
                                            <span className="quality">SQ</span>
                                            <span className="hasmv">MV</span>
                                        </ListItem>
                                    </div>
                                )
                            })}
                            </ul>
                            :
                            this.state.curIndex===1?
                            <div className="dataContent" style={{minHeight:this.clientSize.height-4*perRem,backgroundColor:this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].shallowColor}}>
                                <p className="billboardData" dangerouslySetInnerHTML={{__html: this.state.billboardData}}></p>
                            </div>
                            :''
                        }
                    </div>
                </StickyListBox>
            </div>
        )
    }
}

export default BillboardDetail;