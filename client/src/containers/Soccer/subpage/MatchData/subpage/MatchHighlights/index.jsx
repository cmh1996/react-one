import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';

import SmallTitleBar from '../../../../../../components/SmallTitleBar'; 

import './style.less';

class MatchHighlights extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    navTo(id){
        const url = 'http://www.dongqiudi.com/share/article/'+id+'?id='+id+'&type=undefined&refer=m_website';
        const targetUrl = encodeURIComponent(url);
        this.props.history.push('/article/detail/'+targetUrl);
    }

    render(){
        return(
            <div className="matchHighlightsPage">
                {
                    Object.keys(this.props.data).length!==0?
                    <div className="matchHighlights">
                        <section className="matchVideo">
                            <SmallTitleBar title="战报"/>
                            {
                                this.props.data.article?
                                <video controls="controls" src={this.props.data.article} className="highLightsVideo"></video>:''
                            }
                            {
                                this.props.data.content?
                                <p className="highlightsText">{this.props.data.content}</p>:''
                            }
                        </section>
                        {
                            this.props.data.gifCollection?
                            <section className="matchGIF">
                                <SmallTitleBar title="GIF合集"/>
                                <ul className="gifList">
                                    {
                                        this.props.data.gifCollection.map((item,index)=>{
                                            return(
                                                <li className="gifItem" key={item.id} onClick={this.navTo.bind(this,item.id)}>
                                                    <span className="gifIcon"></span>
                                                    <img src={item.thumb} alt="gif"/>
                                                    <div className="gifInfo">
                                                        <p className="gifText">{item.title}</p>
                                                        <span className="gifTime">{item.time+"'"}</span>
                                                        <span className="gifComment">{item.comments_total+'评论'}</span>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </section>:''
                        }
                    </div>
                    :<div className="noInfo">暂无集锦信息</div>
                }
            </div>
        )
    }
}

export default withRouter(MatchHighlights);