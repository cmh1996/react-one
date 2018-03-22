import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router,Route} from 'react-router-dom';
import { Provider } from 'mobx-react';
import stores from './stores';

import App from './containers/App';

import './static/js/rem.js';
import './static/css/common.less';
import './static/font/iconfont.css';

ReactDOM.render(
    <Provider {...stores}>
    	<Router>
    		<Route path="/" component={App}/>
    	</Router>
    </Provider>, 
    document.getElementById('root')
);

