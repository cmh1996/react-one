import React from 'react';
import {Route,Switch,Redirect} from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClientSize} from '../../util/util';
import Bundle from '../../components/Bundle';

import Data from 'bundle-loader?lazy&name=app-[name]!./subpage/Data/Data';
import City from 'bundle-loader?lazy&name=app-[name]!./subpage/Data/City/City';
import Dynamic from 'bundle-loader?lazy&name=app-[name]!./subpage/Dynamic/Dynamic';
import DynamicDetail from 'bundle-loader?lazy&name=app-[name]!./subpage/Dynamic/DynamicDetail/DynamicDetail';
import AddFriends from 'bundle-loader?lazy&name=app-[name]!./subpage/AddFriends/AddFriends';
import Friends from 'bundle-loader?lazy&name=app-[name]!./subpage/Friends/Friends';
import Messages from 'bundle-loader?lazy&name=app-[name]!./subpage/Messages/Messages';
import Chat from 'bundle-loader?lazy&name=app-[name]!./subpage/Chat/Chat';
import Timetable from 'bundle-loader?lazy&name=app-[name]!./subpage/Timetable/Timetable';
import Skin from 'bundle-loader?lazy&name=app-[name]!./subpage/Skin/Skin';

const DataWrapper = props => <Bundle load={Data}>{(DataWrapper)=><DataWrapper {...props} />}</Bundle>;
const CityWrapper = props => <Bundle load={City}>{(CityWrapper)=><CityWrapper {...props} />}</Bundle>;
const DynamicWrapper = props => <Bundle load={Dynamic}>{(DynamicWrapper)=><DynamicWrapper {...props} />}</Bundle>;
const DynamicDetailWrapper = props => <Bundle load={DynamicDetail}>{(DynamicDetailWrapper)=><DynamicDetailWrapper {...props} />}</Bundle>;
const FriendsWrapper = props => <Bundle load={Friends}>{(FriendsWrapper)=><FriendsWrapper {...props} />}</Bundle>;
const MessagesWrapper = props => <Bundle load={Messages}>{(MessagesWrapper)=><MessagesWrapper {...props} />}</Bundle>;
const ChatWrapper = props => <Bundle load={Chat}>{(ChatWrapper)=><ChatWrapper {...props} />}</Bundle>;
const TimetableWrapper = props => <Bundle load={Timetable}>{(TimetableWrapper)=><TimetableWrapper {...props} />}</Bundle>;
const SkinWrapper = props => <Bundle load={Skin}>{(SkinWrapper)=><SkinWrapper {...props} />}</Bundle>;
const AddFriendsWrapper = props => <Bundle load={AddFriends}>{(AddFriendsWrapper)=><AddFriendsWrapper {...props} />}</Bundle>;

import PrivateRoute from '../../components/PrivateRoute';

const clientSize = getClientSize();

const styles = {
    personal:{
        width:'100%',
        minHeight:clientSize.height+'px',
    }
}

class Personal extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render(){
        return(
            <div className="personal" style={styles.personal}>
                <Switch>
                    <PrivateRoute exact path="/personal/data" component={DataWrapper}/>
                    <PrivateRoute path="/personal/data/city" component={CityWrapper}/>

                    <Route exact path="/personal/dynamic/:id" component={DynamicWrapper}/>
                    <Route path="/personal/dynamic/detail/:id" component={DynamicDetailWrapper}/>

                    <PrivateRoute path="/personal/friends/:id" component={FriendsWrapper}/>

                    <PrivateRoute path="/personal/addFriends" component={AddFriendsWrapper}/>

                    <PrivateRoute path="/personal/messages" component={MessagesWrapper}/>

                    <PrivateRoute path="/personal/chat/:id" component={ChatWrapper}/>

                    <PrivateRoute path="/personal/timetable" component={TimetableWrapper}/>

                    <Route path="/personal/skin" component={SkinWrapper}/>
                </Switch>
            </div>
        )
    }
}

export default Personal;