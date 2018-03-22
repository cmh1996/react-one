import React from 'react';
import {Route} from 'react-router-dom';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Bundle from '../../components/Bundle';
import PrivateRoute from '../../components/PrivateRoute';

import MainHeader from '../../components/MainHeader';
import Nav from '../../components/Nav';
import Dynamic from 'bundle-loader?lazy&name=app-[name]!./subpage/Dynamic/Dynamic';
import News from 'bundle-loader?lazy&name=app-[name]!./subpage/News/News';
import PostDynamic from 'bundle-loader?lazy&name=app-[name]!./subpage/Dynamic/subpage/PostDynamic';

const DynamicWrapper = props => <Bundle load={Dynamic}>{(DynamicWrapper)=><DynamicWrapper {...props} />}</Bundle>;
const NewsWrapper = props => <Bundle load={News}>{(NewsWrapper)=><NewsWrapper {...props} />}</Bundle>;
const PostDynamicWrapper = props => <Bundle load={PostDynamic}>{(PostDynamicWrapper)=><PostDynamicWrapper {...props} />}</Bundle>;

@inject('userStore','stateStore')
@observer class Home extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            items:this.props.stateStore.indexItems,
            ownItems:[
                {title:'动态',route:'/home/dynamic'},
                {title:'资讯',route:'/home/news'}
            ],
            navZIndex:10,
            personalList:this.props.stateStore.personalItems,
        }
    }

    //personal显示时设置nav的zindex为0，消失时设为10
    showPersonalHandle(){
        this.setState({
            navZIndex:0
        })
    }
    hidePersonalHandle(){
        this.setState({
            navZIndex:10
        })
    }

    render(){
        const curPath = this.props.history.location.pathname;
        return(
            <div>
            {
                curPath.indexOf('/home/dynamic/postDynamic')>-1?
                <PrivateRoute exact path="/home/dynamic/postDynamic" component={PostDynamicWrapper}/>
                :
                [<MainHeader
                    key="mainHeader"
                    personalList={this.state.personalList}
                    showPersonalHandle={this.showPersonalHandle.bind(this)}
                    hidePersonalHandle={this.hidePersonalHandle.bind(this)}
                    items={this.state.ownItems}
                    temperature={this.props.stateStore.weather.temperature}
                    icon={this.props.stateStore.weather.weatherIcon}
                    bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}
                />,
                <div className="content" ref="content" key="content">
                    <Route path="/home/dynamic" component={DynamicWrapper}/>
                    <Route exact path="/home/news" component={NewsWrapper}/>
                </div>, 
                <Nav zIndex={this.state.navZIndex}
                     selected="首页"
                     key="nav"
                     items={this.state.items} 
                     selectColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                ]
            }
            </div>
        )
    }

}

export default Home;
