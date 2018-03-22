import {observable,action,useStrict,computed} from 'mobx';
import {getLocalItem,setLocalItem} from '../util/util';
import jwt from 'jsonwebtoken';

const rawToken = getLocalItem('token');
const token = rawToken?jwt.verify(rawToken,'chambers'):'';
const playListLocalToken = token+'playlist';

useStrict(true);

export default class musicStore{
	//播放列表
	@observable songlist=[{
		id:'',
		songName:'',
		singer:'',
		imgUrl:``,
		songUrl:``,
		duration:0
	}];

	@observable curSongIndex = 0;

	@observable curTime = 0;

	@observable isPlaying=false;
	@observable showMusicBox=true;

	@observable playMode=0;	//0顺序播放，1随机播放，2单曲循环

	//初始化歌单（把localstorage的读取到mobx里）
	@action setInitPlaylist = (arr)=>{
		if(arr.length>0){
			this.songlist = [{
							id:'',
							songName:'ONE音乐',
							singer:'随心随地听音乐',
							imgUrl:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=591033481,1021256424&fm=58&bpow=709&bpoh=403&u_exp_0=404054377,704489291&fm_exp_0=86',
							songUrl:``,
							duration:0
							}].concat(...arr);
		}
	}

	@action setPlayMode = (mode=0)=>{
		if(mode>=3){
			this.playMode = 0;
		}else{
			this.playMode = mode;
		}
	}

	//设置当前歌曲index
	@action setCurIndex = (index,clear=false)=>{
		if(clear){
			this.curSongIndex = 0;
			return;
		}
		//到了第一首还按上一首，那就跳到列表的最后
		if(index<=0){
			this.curSongIndex = this.songlist.length-1;
		}
		//到了最后一首还按下一首，那就跳到列表的第一首
		else if(index>=this.songlist.length){
			this.curSongIndex = 1;
		}else{
			this.curSongIndex = index;
		}
	}

	//点击播放全部
	@action addAllSong = (songlist)=>{
		let newList = [];
		songlist.map((item,index)=>{
			const newSong = {
				id:item.id,
				songName:item.songName,
				singer:item.singer,
				imgUrl:`//y.gtimg.cn/music/photo_new/T002R300x300M000${item.albumid}.jpg?max_age=2592000`,
				songUrl:`ws.stream.qqmusic.qq.com/C100${item.id}.m4a?fromtag=38`,
				duration:0
			};
			newList.push(newSong);
		});
		this.songlist.splice(this.curSongIndex+1,0,...newList);
		this.setCurIndex(this.curSongIndex+1);
		this.setPlayPause('play');
		
		//保存到localStorage
		let curLocalPlaylist = this.songlist.slice(1);
		setLocalItem(playListLocalToken,JSON.stringify(curLocalPlaylist));
	}

	//添加一首歌曲到list中
	@action addAndPlaySong = (newSong)=>{
		const insertSong = {
			id:newSong.id,
			songName:newSong.songName,
			singer:newSong.singer,
			imgUrl:`//y.gtimg.cn/music/photo_new/T002R300x300M000${newSong.albumid}.jpg?max_age=2592000`,
			songUrl:`ws.stream.qqmusic.qq.com/C100${newSong.id}.m4a?fromtag=38`,
			duration:0
		}
		this.songlist.splice(this.curSongIndex+1,0,insertSong);
		this.setCurIndex(this.curSongIndex+1);
		this.setPlayPause('play');

		//保存到localStorage
		let curLocalPlaylist = this.songlist.slice(1);
		setLocalItem(playListLocalToken,JSON.stringify(curLocalPlaylist));
	}

	//设置当前歌曲的duration
	@action setDuration = (duration)=>{
		this.songlist[this.curSongIndex].duration = duration;
	}
	//改变当前歌曲的现在播放的时间
	@action setCurTime = (time)=>{
		this.curTime = time;
	}
	
	//播放暂停切换
	@action setPlayPause = (state)=>{
		const audio = document.getElementById('musicAudio');
		if(state==='play'){
			this.isPlaying = true;
			if(audio.readyState!==0){
				audio.play();
			}
		}else{
			this.isPlaying = false;
			audio.pause();
		}
	}

	//移除一首歌曲
	@action removeSong = (index)=>{
		this.songlist.splice(index+1,1);
		if(this.songlist.length<=1){
			this.setCurIndex(0,true);
			return;
		}
		if(this.curSongIndex>=index+2){
			this.setCurIndex(this.curSongIndex-1)
		}

		//保存到localStorage
		let curLocalPlaylist = this.songlist.slice(1);
		setLocalItem(playListLocalToken,JSON.stringify(curLocalPlaylist));
	}
	
	@action clearSonglist = ()=>{
		this.setCurIndex(0,true);
		this.songlist = [{
					id:'',
					songName:'',
					singer:'',
					imgUrl:``,
					songUrl:``,
					duration:0
				}];
		//保存到localStorage
		setLocalItem(playListLocalToken,'[]');
	}

	//小音乐盒显示隐藏
	@action toggleMusicBox = (bol)=>{
		this.showMusicBox = bol;
	}
}