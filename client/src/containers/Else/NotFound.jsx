import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize} from '../../util/util';

const clientSize = getClientSize();
const styles = {
    notFound:{
        width:clientSize.width+'px',
        height:clientSize.height+'px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#53a4c1',
        color:'white'
    },
    h:{
        marginBottom:'1rem'
    }
}

class NotFound extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        return(
            <div style={styles.notFound}>
                <h1 style={styles.h}>404</h1>
                <p>抱歉，你访问的页面走丢了</p>
            </div>
        )
    }
}

export default NotFound;