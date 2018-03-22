import StateStore from './stateStore';//全局数据
import UserStore from './userStore';//用户个人数据
import NewsStore from './newsStore';//新闻页数据
import SoccerStore from './soccerStore';//足球数据
import MusicStore from './musicStore';//音乐数据

export default {
	stateStore:new StateStore(),
	userStore:new UserStore(),
	newsStore:new NewsStore(),
	soccerStore:new SoccerStore(),
	musicStore:new MusicStore(),
}