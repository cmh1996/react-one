import React from 'react'; 
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {inject,observer} from 'mobx-react';

import SubHeader from '../../../../components/SubHeader';
import SmallTitleBar from '../../../../components/SmallTitleBar';

import {getClientSize} from '../../../../util/util';

import styles from './style.less';

@inject('stateStore')
@observer class Skin extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
        this.clientSize = getClientSize();
    }
    render(){
        return(
            <div className="skinPage" style={{minHeight:this.clientSize.height}}>
               <SubHeader title="更换皮肤" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
               <SmallTitleBar title="主题选择"/>
               <ul className="themeList">
                    <li className="skinItem">
                        <span className="color" style={{backgroundColor:this.props.stateStore.themeColor[0].shallowColor}}></span>
                        <span className="text">蓝海</span>
                        <div className="btn" onClick={()=>{this.props.stateStore.setTheme(0)}} 
                             style={{
                                border:this.props.stateStore.curThemeIndex==0?`0.01rem solid ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}`:'0.01rem solid #7d7d7d',
                                color:this.props.stateStore.curThemeIndex==0?this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor:'#7d7d7d'
                            }}>
                            {this.props.stateStore.curThemeIndex==0?'使用中':'使用'}
                        </div>
                    </li>
                    <li className="skinItem">
                        <span className="color" style={{backgroundColor:this.props.stateStore.themeColor[1].shallowColor}}></span>
                        <span className="text">紫霞</span>
                        <div className="btn" onClick={()=>{this.props.stateStore.setTheme(1)}} 
                             style={{
                                border:this.props.stateStore.curThemeIndex==1?`0.01rem solid ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}`:'0.01rem solid #7d7d7d',
                                color:this.props.stateStore.curThemeIndex==1?this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor:'#7d7d7d'
                            }}>
                            {this.props.stateStore.curThemeIndex==1?'使用中':'使用'}
                        </div>
                    </li>
                    <li className="skinItem">
                        <span className="color" style={{backgroundColor:this.props.stateStore.themeColor[2].shallowColor}}></span>
                        <span className="text">秋漠</span>
                        <div className="btn" onClick={()=>{this.props.stateStore.setTheme(2)}} 
                             style={{
                                border:this.props.stateStore.curThemeIndex==2?`0.01rem solid ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}`:'0.01rem solid #7d7d7d',
                                color:this.props.stateStore.curThemeIndex==2?this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor:'#7d7d7d'
                            }}>
                            {this.props.stateStore.curThemeIndex==2?'使用中':'使用'}
                        </div>
                    </li>
                    <li className="skinItem">
                        <span className="color" style={{backgroundColor:this.props.stateStore.themeColor[3].shallowColor}}></span>
                        <span className="text">绿竹</span>
                        <div className="btn" onClick={()=>{this.props.stateStore.setTheme(3)}} 
                             style={{
                                border:this.props.stateStore.curThemeIndex==3?`0.01rem solid ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}`:'0.01rem solid #7d7d7d',
                                color:this.props.stateStore.curThemeIndex==3?this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor:'#7d7d7d'
                            }}>
                            {this.props.stateStore.curThemeIndex==3?'使用中':'使用'}
                        </div>
                    </li>
                    <li className="skinItem">
                        <span className="color" style={{backgroundColor:this.props.stateStore.themeColor[4].shallowColor}}></span>
                        <span className="text">星空</span>
                        <div className="btn" onClick={()=>{this.props.stateStore.setTheme(4)}} 
                             style={{
                                border:this.props.stateStore.curThemeIndex==4?`0.01rem solid ${this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}`:'0.01rem solid #7d7d7d',
                                color:this.props.stateStore.curThemeIndex==4?this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor:'#7d7d7d'
                            }}>
                            {this.props.stateStore.curThemeIndex==4?'使用中':'使用'}
                        </div>
                    </li>
               </ul>
            </div>
        )
    }

}

export default Skin;