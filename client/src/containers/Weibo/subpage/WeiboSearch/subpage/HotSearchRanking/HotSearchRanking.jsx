import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getHotSearchRanking} from '../../../../../../fetch/weibo/search';
import {convertUnit} from '../../../../../../util/util';

import SubHeader from '../../../../../../components/SubHeader';
import SmallTitleBar from '../../../../../../components/SmallTitleBar';

import './style.less';

@inject ('stateStore')
@observer class HotSearchRanking extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            rankList:[]
        };
    }

    componentDidMount(){
        this.props.stateStore.setLoading(true);
        const res = getHotSearchRanking();
        res
        .then((res)=>{
             this.setState({
                 rankList:res[1].card_group
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
        this.props.history.push(url);
    }

    render(){
        return(
            <div className="HotSearchRankingPage">
                <SubHeader title="实时热搜榜" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <SmallTitleBar title="实时搜索热点，每分钟更新一次" />
                <ul className="list">
                    {
                        this.state.rankList.map((item,index)=>{
                            return(
                                <li className="rankItem" key={'rankItem'+index} onClick={this.navTo.bind(this,'/weibo/result/'+item.desc)}>
                                    <span className={index<=2?'rankNum top':'rankNum'}>{index+1}</span>
                                    <span className="title">{item.desc}</span>
                                    <span className="searchNum">{convertUnit(item.desc_extr)+'次'}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default HotSearchRanking;