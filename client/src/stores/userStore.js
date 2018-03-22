import {observable,action,useStrict} from 'mobx';

useStrict(true);

export default class userStore{
	@observable user={
		id:'',
		email:'',
		nickname:'',
		sex:'',
		city:'',
		headimg:'',
	};

	@observable dynamics = [];

	@action saveDynamics = (dynamics)=>{
		this.dynamics = dynamics;
	}

	@action setUser = (user)=>{
		this.user = Object.assign(this.user,user);
	}

	@action clearUser = ()=>{
		this.user = {
			id:'',
			email:'',
			nickname:'',
			sex:'',
			city:'',
			headimg:'',
		}
	}
}