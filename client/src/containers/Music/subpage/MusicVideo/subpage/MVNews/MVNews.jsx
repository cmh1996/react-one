import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getMVNews} from '../../../../../../fetch/music/mv';
import {convertUnit} from '../../../../../../util/util';

import SubHeader from '../../../../../../components/SubHeader';
import BackToTop from '../../../../../../components/BackToTop';

import './style.less';

@inject('stateStore')
@observer class MVNews extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            newsList:[]
        }
    }

    componentDidMount(){
        this.fetchMVList();
    }

    navTo(id){
        this.props.history.push('/music/musicVideo/detail/'+id)
    }

    fetchMVList(){
        this.props.stateStore.setLoading(true);
        const res = getMVNews();
        res.then((data)=>{
            this.setState({
                newsList:data
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    backToTop(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
    }
    
    render(){
        return(
            <div className="MVNewsPage">
                <SubHeader title='今日看点' bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <ul className="mvList">
                    {
                        this.state.newsList.map((item,index)=>{
                            return(
                                <li 
                                    className="mv" 
                                    key={item.vid}
                                    onClick={this.navTo.bind(this,item.vid)}
                                >
                                   <img src={item.picurl} alt='mv封面'/>
                                   <div className="tips1">
                                        <i className="iconfont icon-luxiang"/>
                                        <span className="num">{convertUnit(item.playcnt)}</span>
                                        <span className="name">{item.uploader_nick}</span>
                                   </div>
                                </li>
                            )
                        })
                    }
                    <BackToTop type="inABox" backTopHandle={this.backToTop.bind(this)}/>
                </ul>
            </div>
        )
    }
}

export default MVNews;