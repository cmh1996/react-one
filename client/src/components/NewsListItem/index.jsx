import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
新闻项组件
props:{
  title（标题）: [str]
  desc（摘要描述）：[str]
  tips1（左tips）: [str]
  tips2（右tips）: [str]
  img（图片）：['图片地址']
  liClickHandle()（该列表项点击触发事件）
}
*/

class NewsListItem extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
        }
    }

    render(){
        return(
            <li className="newsListItem" onClick={this.props.liClickHandle}>
                <div className="newsText">
                    <p className="newsTitle">{this.props.title}</p>
                    <p className="newsDesc">{this.props.desc}</p>
                    <div className="newsInfo">
                        <span>{this.props.tips1}</span>
                        <span>{this.props.tips2}</span>
                    </div>
                </div>
                {
                    this.props.img?
                    <div className="newsImg">
                        <img src={this.props.img} alt="新闻图片"/>
                    </div>
                    :''
                }
            </li>
        )
    }
}

export default NewsListItem;