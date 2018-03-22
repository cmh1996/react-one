import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import {perRem} from '../../../../util/util';

import {getSinger} from '../../../../fetch/music/singer';

import SubHeader from '../../../../components/SubHeader';
import TagHeader from '../../../../components/TagHeader';
import ListItem from '../../../../components/ListItem';
import LetterBar from '../../../../components/LetterBar';

import './style.less';

@inject('stateStore')
@observer class Singer extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            curType:{
                nationality:'all',
                sex:'all'
            },
            typeList:[{nationality:'all',sex:'all'},
                    {nationality:'cn',sex:'man'},
                    {nationality:'cn',sex:'woman'},
                    {nationality:'cn',sex:'team'},
                    {nationality:'k',sex:'man'},
                    {nationality:'k',sex:'woman'},
                    {nationality:'k',sex:'team'},
                    {nationality:'eu',sex:'man'},
                    {nationality:'eu',sex:'woman'},
                    {nationality:'eu',sex:'team'},
                    {nationality:'j',sex:'man'},
                    {nationality:'j',sex:'woman'},
                    {nationality:'j',sex:'team'},
            ],
            singerList:[],
            letterList:[],
            positionList:[],
            curLetterIndex:0,
        };
        this.perItemHeight=2.8*perRem;
        this.watchScrollTop2=this.watchScrollTop1.bind(this);
    }

    componentDidMount(){
        this.fetchSingerDataByType();
        const page = document.getElementById('musicSingelBox');
        page.addEventListener('scroll',this.watchScrollTop2,false);
    }

    componentWillUnmount(){
        const page = document.getElementById('musicSingelBox');
        page.removeEventListener('scroll',this.watchScrollTop2,false);
    }

    watchScrollTop1(e){
        const scrollTop = e.target.scrollTop;
        for(let i=0;i<this.state.positionList.length;i++){
            if(i===0){
                if(0<=scrollTop && scrollTop<=this.state.positionList[1]*this.perItemHeight){
                    this.setState({
                        curLetterIndex:0
                    })
                    break;
                }
            }
            if(this.state.positionList[i-1]*this.perItemHeight<=scrollTop && scrollTop<=this.state.positionList[i]*this.perItemHeight){
                this.setState({
                    curLetterIndex:i-1
                });
                break;
            }
        }
    }

    fetchSingerDataByType(){
        this.props.stateStore.setLoading(true);
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = 0;
        const res = getSinger(this.state.curType.nationality,this.state.curType.sex);
        res
        .then((data)=>{
            let heightList = [];
            data.positionList.map((item,index)=>{
                heightList.push(item)
            })
            this.setState({
                singerList:data.singerList,
                letterList:data.letterList,
                positionList:data.positionList,
                curLetterIndex:0,
            },()=>{
                this.props.stateStore.setLoading(false);
            })
        })
        .catch((e)=>{
            this.props.stateStore.setLoading(false);
            this.props.stateStore.setTips('fail','网络出错，请刷新重试');
        })
    }

    chooseSingerType(index){
        this.setState({
            curType:this.state.typeList[index]
        },()=>{
            this.fetchSingerDataByType();
        })
    }

    navTo(id){
        this.props.history.push('/music/singer/detail/'+id);
    }

    //选择字母
    switchLetter(index){
        this.setState({
            curLetterIndex:index
        })
        //外层父元素滚动到指定位置
        const page = document.getElementById('musicSingelBox');
        page.scrollTop = (this.perItemHeight*this.state.positionList[index]);
    }
    
    render(){
        return(
            <div className="singerPage">
                <SubHeader title='歌手' bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <TagHeader
                    firstRenderItem={0}
                    items={[{title:'全部'},
                            {title:'华语男'},
                            {title:'华语女'},
                            {title:'华语组合'},
                            {title:'韩语男'},
                            {title:'韩语女'},
                            {title:'韩语组合'},
                            {title:'欧美男'},
                            {title:'欧美女'},
                            {title:'欧美组合'},
                            {title:'日语男'},
                            {title:'日语女'},
                            {title:'日语组合'}]}
                    selectedColor='white'
                    selectHandle={this.chooseSingerType.bind(this)}
                    bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />
                <ul className="singerList" ref="singerList">
                {
                    this.state.singerList.map((item,index)=>{
                        return(
                            <ListItem
                            key={item.Fsinger_id}
                            img={'//y.gtimg.cn/music/photo_new/T001R150x150M000'+item.Fsinger_mid+'.jpg?max_age=2592000'}
                            type="normal" 
                            noArrow={true}
                            title={item.Fsinger_name}
                            liClickHandle={this.navTo.bind(this,item.Fsinger_mid)}/>
                        )
                    })
                }
                </ul>
                <LetterBar 
                    items={this.state.letterList} 
                    curIndex={this.state.curLetterIndex}
                    clickHandle={this.switchLetter.bind(this)}
                />
            </div>
        )
    }
}

export default Singer;