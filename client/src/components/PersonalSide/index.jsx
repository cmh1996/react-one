import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import NotLogin from '../NotLogin';

import {getLocalItem,getClientSize} from '../../util/util';

import './style.less';

/*
侧边抽屉组件
props:{
  personalList（列表项）：[{title:',icon:'',route:''}]
  hidePersonal()（隐藏侧边栏触发函数）
}
*/

@inject('userStore')
@observer class PersonalSide extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            opacity:0,
            translateX:0
        }
    }

    componentDidMount(){
        this.setState({
            opacity:1,
            translateX:'12.5rem'
        })
    }


    hide(){
        this.setState({
            opacity:0,
            translateX:'-12.5rem'
        })
        setTimeout(()=>{
            this.props.hidePersonal();
        },300)
    }

    contentHandle(e){
        e.stopPropagation();
    }

    render(){
        const width = getClientSize().width;
        const height = getClientSize().height;
        return(
            <div 
                className="personalSide" 
                ref="personal" 
                style={{width:width,height:height,opacity:this.state.opacity}} 
                onClick={this.hide.bind(this)}
            >
                <div 
                    className="content" 
                    ref="content" 
                    style={{height:height,transform:'translate3d('+this.state.translateX+',0,0)'}} 
                    onClick={this.contentHandle.bind(this)}
                >
                {
                    getLocalItem('token')?
                    [<div className="header" key="header">
                        <Link className="headImg" to={"/personal/dynamic/"+this.props.userStore.user.id}>
                            <img alt="头像" src={this.props.userStore.user.headimg}/>
                        </Link>
                        <Link className="headInfo" to={"/personal/dynamic/"+this.props.userStore.user.id}>
                            <span className="name">{this.props.userStore.user.nickname}</span>
                            <i className="iconfont icon-enter"/>
                        </Link>
                    </div>,
                    <div className="personalList" key="personalList">
                        {
                            this.props.personalList.map((item,index)=>{
                                return(
                                    <Link className="personalListItem" key={index} to={item.route}>
                                        <i className={"iconfont "+item.icon}/>
                                        <span>{item.title}</span>
                                    </Link>
                                )
                            })
                        }
                    </div>]
                    :
                    <NotLogin/>
                }
                </div>
            </div>
        )
    }
}

export default PersonalSide;