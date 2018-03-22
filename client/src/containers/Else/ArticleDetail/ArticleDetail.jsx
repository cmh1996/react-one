import React from 'react';
import {inject,observer} from 'mobx-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize,perRem} from '../../../util/util';

import SubHeader from '../../../components/SubHeader';

import './style.less';

const clientSize = getClientSize();

@inject('stateStore')
@observer class ArticleDetail extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            url:''
        }
    }

    componentWillMount(){
        this.setState({
            url:decodeURIComponent(this.props.match.params.targetUrl)
        })
    }

    render(){
        return(
            <div className="articleDetail" style={{minHeight:clientSize.height+'px'}}>
                <SubHeader title="文章详情" bgColor={this.props.stateStore.themeColor[this.props.stateStore.curThemeIndex].mainColor}/>
                <iframe src={this.state.url} style={{minHeight:(clientSize.height-2*perRem)+'px'}} />
            </div>
        )
    }

}

export default ArticleDetail;