import React from 'react';
import {inject,observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
音乐播放器组件
props:{
  songImg（音乐盒图片）: [str] 
  percent（进度）: [num] 
  musicPageRoute（点击会跳转到musicPlayer的route）
}
*/

class MusicPlayerBox extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
          strokeDasharray:Math.PI*100,
        }
    }

    render(){
        return(
           <Link className="muaicPlayerBox" to={this.props.musicPageRoute}>
              <svg width="2.6rem" height="2.6rem" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
                <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" strokeDasharray={this.state.strokeDasharray} strokeDashoffset={isNaN(this.props.percent)?this.state.strokeDasharray:(1-this.props.percent)*this.state.strokeDasharray}/>
              </svg>
              {
                this.props.songImg.length>0?
                <img src={this.props.songImg}/>
                :
                <span className="noSongImg"><i className="iconfont icon-close"/></span>
              }
           </Link>
        )
    }

}

export default MusicPlayerBox;