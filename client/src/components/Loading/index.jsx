import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.less';

/*
loading组件
*/

class Loading extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        return(
            <div className="loading">
                <svg width="100%" height="100">
                    <text textAnchor="MiddleCenter" y="50%" className="text text-1">
                        Loading...
                    </text>
                    <text textAnchor="MiddleCenter" y="50%" className="text text-2">
                        Loading...
                    </text>
                    <text textAnchor="MiddleCenter" y="50%" className="text text-3">
                        Loading...
                    </text>
                    <text textAnchor="MiddleCenter" y="50%" className="text text-4">
                        Loading...
                    </text>
                </svg> 
            </div>
        )
    }
}

export default Loading;