import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getBillboard} from '../../../../fetch/music/billboard';
import {convertUnit} from '../../../../util/util';

import SubHeader from '../../../../components/SubHeader';

import './style.less';

@inject('stateStore')
@observer class Billboard extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            billboardList:[]
        }
    }

    componentDidMount(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        this.props.stateStore.setLoading(true);
        const res = getBillboard();
        res
        .then((data)=>{
            this.setState({
                billboardList:data
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        });
    }

    navTo(id){
        this.props.history.push('/music/billboard/detail/'+id);
    }

    render(){
        return(
            <div className="BillboardPage">
                <SubHeader title="排行" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                {
                    this.state.billboardList.map((item,index)=>{
                        return(
                            <div className="billBoardItem" key={item.id} onClick={this.navTo.bind(this,item.id)}>
                                <div className="billBoardImg">
                                    <img src={item.picUrl} alt="封面图"/>
                                    <span className="leftIcon">
                                        <i className="iconfont icon-music1"/>
                                        {convertUnit(item.listenCount)}
                                    </span>
                                    <span className="rightIcon">
                                        <i className="iconfont icon-bofang"/>
                                    </span>
                                </div>
                                <ol className="billBoardContent">
                                    {
                                        item.songList.map((songItem,index)=>{
                                            return(
                                                <li className="song" key={item.id+index}>
                                                    <span className="songname">{(index+1)+' '+songItem.songname+'- '}</span>
                                                    <span className="singername">{songItem.singername}</span>
                                                </li>
                                            )
                                        })
                                    }
                                </ol>
                                <i className="iconfont icon-enter rightArrow"/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Billboard;