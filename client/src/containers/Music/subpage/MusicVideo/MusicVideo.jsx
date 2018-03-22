import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import SubHeader from '../../../../components/SubHeader';

import './style.less';

@inject('stateStore')
@observer class MusicVideo extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    navTo(url){
        this.props.history.push(url)
    }

    render(){
        return(
            <div className="musicVideoPage">
                <SubHeader title="MV频道" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <section className="channelBlock">
                    <div className="title">热点</div>
                    <ul className="channelList">
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/ranking')} style={{backgroundImage:'url(http://puui.qpic.cn/qqvideo_ori/0/s00244on2oh_496_280/0)'}}>
                            <span>榜单</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/news')} style={{backgroundImage:'url(http://puui.qpic.cn/qqvideo_ori/0/m002426ajaw_496_280/0)'}}>
                            <span>今日看点</span>
                        </li>
                    </ul>
                </section>
                <section className="channelBlock">
                    <div className="title">频道</div>
                    <ul className="channelList">
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/0')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/y0024nc8d9z_360_204/0)'}}>
                            <span>全部</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/3')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/b0024x67l0j_360_204/0)'}}>
                            <span>影视原声</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/9')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/i00243djnhq_360_204/0)'}}>
                            <span>舞蹈</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/13')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/q0017kxcpfa_360_204/0)'}}>
                            <span>演唱会</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/14')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/t0015mbw6le_360_204/0)'}}>
                            <span>颁奖礼</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/40')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/k00220j0ill_360_204/0)'}}>
                            <span>创意</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/41')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/z0016zggbyu_360_204/0)'}}>
                            <span>搞笑</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/50')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/w0024uwvhb0_360_204/0)'}}>
                            <span>剧情</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/51')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/g0024ttvak9_360_204/0)'}}>
                            <span>清新</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/53')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/d0023n5vru7_360_204/0)'}}>
                            <span>演奏</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/16')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/r0017lbvgio_360_204/0)'}}>
                            <span>动漫</span>
                        </li>
                        <li className="channel" onClick={this.navTo.bind(this,'/music/musicVideo/type/52')} style={{backgroundImage:'url(https://shp.qpic.cn/qqvideo_ori/0/z0018x2dctn_360_204/0)'}}>
                            <span>民族风</span>
                        </li>
                    </ul>
                </section>
            </div>
        )
    }
}

export default MusicVideo;