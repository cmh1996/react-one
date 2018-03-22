import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {getMVRanking} from '../../../../../../fetch/music/mv';

import SubHeader from '../../../../../../components/SubHeader';
import TagHeader from '../../../../../../components/TagHeader';

import './style.less';

@inject('stateStore')
@observer class MVRanking extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        /*全部all，内地mainland,港台hktw,欧美euus，韩国kr，日本jp*/
        this.state={
            curIndex:0,
            allList:[],
            mainlandList:[],
            hktwList:[],
            euusList:[],
            krList:[],
            listName:['all','mainland','hktw','euus','kr']
        }
    }

    componentDidMount(){
        this.fetchMVList();
    }

    chooseRankingType(index){
        this.setState({
            curIndex:index
        },()=>{
            this.fetchMVList();
        })
    }

    navTo(id){
        this.props.history.push('/music/musicVideo/detail/'+id)
    }

    fetchMVList(){
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        const curList = this.state.listName[this.state.curIndex]+'List';
        if(this.state[curList].length>0){
            return;
        }
        this.props.stateStore.setLoading(true);
        const res = getMVRanking(this.state.listName[this.state.curIndex]);
        res.then((data)=>{
            this.setState({
                [curList]:data
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    render(){
        const curList = this.state.listName[this.state.curIndex]+'List';
        return(
            <div className="MVRankingPage">
                <SubHeader title='MV榜单' bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <TagHeader
                    firstRenderItem={0}
                    items={[{title:'总榜'},
                            {title:'内地'},
                            {title:'港台'},
                            {title:'欧美'},
                            {title:'韩国'}
                            ]}
                    selectedColor='white'
                    selectHandle={this.chooseRankingType.bind(this)}
                    bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                <ul className="mvList">
                    {
                        this.state[curList].map((item,index)=>{
                            return(
                                <li 
                                    className="mv" 
                                    key={item.info.Fvid}
                                    onClick={this.navTo.bind(this,item.info.Fvid)}
                                >
                                   <img src={item.info.Fpic} alt='mv封面'/>
                                   <div className="tips1">
                                        <span className="rankNum">{index+1}</span>
                                        <span className="score">{item.score}</span>
                                        <span className="i">-</span>
                                   </div>
                                   <span className="tips2">
                                        {item.info.Fmv_title+'-'+item.singer.Fsinger_name}
                                   </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default MVRanking;