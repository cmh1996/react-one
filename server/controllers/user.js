const UserModel = require('../models/UserModel.js');
const RelationModel = require('../models/RelationModel.js');
const LikeModel = require('../models/LikeModel.js');
const CommentModel = require('../models/CommentModel.js');
const DynamicModel = require('../models/DynamicModel.js');
const ChatModel = require('../models/ChatModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const moment = require('moment');

//注册
exports.signup = async (ctx)=>{
  const hashPwd = bcrypt.hashSync(ctx.request.body.pwd, salt);
	const user = {
  		email:ctx.request.body.email,
  		pwd:hashPwd,
  		nickname:ctx.request.body.nickname,
  		createtime:new Date(),
      updatetime:new Date()
  	};

  	//验证邮箱唯一性
  	const emailUniq = await UserModel.findOne({
	    where: {
	      email: ctx.request.body.email
	    }
	})
	//如果已经存在
  	if(emailUniq){
  		ctx.body = {
  			code:10000,
  			message:'该邮箱已被注册'
  		};
  		return;
  	}

  	//验证昵称唯一性
  	const nicknameUniq = await UserModel.findOne({
	    where: {
	      nickname: ctx.request.body.nickname
	    }
	})
	//如果已经存在
  	if(nicknameUniq){
  		ctx.body = {
  			code:10000,
  			message:'该昵称已被注册'
  		}
  		return;
  	}

  	//插入数据
  	const res = await UserModel.create(user);
  	const token = jwt.sign(res.id,'chambers');
  	ctx.body = {
  		code:0,
  		token:token,
  		message:'注册成功'
  	}
}

//登录
exports.login = async (ctx)=>{
    const user = ctx.request.body;
    //看该邮箱是否已经注册
    const emailSigned = await UserModel.findOne({
        where: {
          email: user.email
        }
    })

    //如果不存在
    if(!emailSigned){
      ctx.body = {
        code:10000,
        message:'该邮箱还没注册，请前往注册'
      };
      return;
    }
    //已经存在
    else{
        //密码不对
        if(!bcrypt.compareSync(user.pwd, emailSigned.pwd)){
          ctx.body = {
            code:10000,
            message:'密码不正确'
          };
          return;
        }
        //密码正确
        else{
          const token = jwt.sign(emailSigned.id,'chambers');
          ctx.body = {
            code:0,
            token:token,
            message:'登录成功'
          }
        }
    }
}

//获取user基本资料
exports.getData = async (ctx)=>{
  const id = ctx.query.id;
  const res = await UserModel.findOne({
      attributes:['id','email','nickname','sex','city','headimg'],
      where: {
        id: id
      }
  })
  if(!res){
      ctx.body = {
        code:10000,
        message:'该用户不存在'
      };
      return;
  }
  ctx.body = {
    code:0,
    data:res
  };
}

//更改昵称
exports.setNickname = async (ctx)=>{
  const data = ctx.request.body;
  
  try{
    const res = await UserModel.update(
      {
        nickname:data.nickname
      },
      {
        where: {
          id:data.id
        }
      }
    )
    //正常修改
    ctx.body = {
      code:0,
      nickname:data.nickname
    }
  }catch(e){
    //发生错误
    ctx.body = {
      code:10000,
      message:'该昵称已被注册，换一个试试吧~'
    }
  }
}

//更改性别
exports.setSex = async (ctx)=>{
  const data = ctx.request.body;
  data.sex = Number(data.sex);
  try{
    const res = await UserModel.update(
      {
        sex:data.sex
      },
      {
        where: {
          id:data.id
        }
      }
    )
    //正常修改
    ctx.body = {
      code:0,
      sex:data.sex
    }
  }catch(e){
    //发生错误
    ctx.body = {
      code:10000,
      message:'修改性别出错'
    }
  }
}

//更改城市
exports.setCity = async (ctx)=>{
  const data = ctx.request.body;
  
  try{
    const res = await UserModel.update(
      {
        city:data.city
      },
      {
        where: {
          id:data.id
        }
      }
    )
    //正常修改
    ctx.body = {
      code:0,
      city:data.city
    }
  }catch(e){
    //发生错误
    ctx.body = {
      code:10000,
      message:'修改城市出错'
    }
  }
}

//更改头像
exports.setHeadimg = async (ctx)=>{
  const data = ctx.request.body;
  
  try{
    const res = await UserModel.update(
      {
        headimg:data.headimg
      },
      {
        where: {
          id:data.id
        }
      }
    )
    //正常修改
    ctx.body = {
      code:0,
      headimg:data.headimg
    }
  }catch(e){
    //发生错误
    ctx.body = {
      code:10000,
      message:'修改头像出错'
    }
  }
}

//修改密码
exports.setPwd = async (ctx)=>{
  const data = ctx.request.body;
  
  const account = await UserModel.findOne({
      where: {
        id: data.id
      }
  })

  if(!bcrypt.compareSync(data.oldPwd, account.pwd)){
    ctx.body = {
      code:10000,
      message:'密码不正确'
    };
    return;
  }
  //密码正确
  else{
    try{
      const hashPwd = bcrypt.hashSync(data.newPwd, salt);
      const res = await UserModel.update(
        {
          pwd:hashPwd
        },
        {
          where: {
            id:data.id
          }
        }
      )
      //正常修改
      ctx.body = {
        code:0
      }
    }catch(e){
      //发生错误
      ctx.body = {
        code:10000,
        message:'修改密码出错'
      }
    }
  }
}

//搜索用户
exports.searchUser = async (ctx)=>{
  //根据关键词从user表中搜索用户，有则返回包含用户信息（id,headimg,nickname,email,city）的数组，没有就返回错误msg
  const keyWord = ctx.query.keyWord;
  try{
    const res = await UserModel.findAll({
        attributes:['id','email','nickname','city','headimg'],
        where: {
          '$or':[
            {email:keyWord},
            {nickname:{'$like':'%'+keyWord+'%'}},
          ]
        }
    });
    ctx.body = {
      code:0,
      data:res
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'找不到该用户'
    }
  }
}

//获得用户关注的人
exports.getFollow = async (ctx)=>{
  const id = ctx.query.id;
  try{
    const res = await RelationModel.findAll({
        attributes:['to_id','createtime'],
        where: {
          from_id:id
        },
        order: [
          ['createtime','DESC']
        ],
    });
    //没有就返回空数组
    if(!res){
      ctx.body={
        code:0,
        data:[]
      }
      return;
    }
    //有就遍历并且获得user的id，headimg，nickname
    let followList = [];
    for(let user of res){
      const follow = await UserModel.findOne({
        attributes:['id','nickname','headimg'],
        where:{
          id:user.to_id
        }
      });
      followList.push(follow);
    }

    ctx.body = {
      code:0,
      data:followList
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//获得用户粉丝
exports.getFans = async (ctx)=>{
  const id = ctx.query.id;
  try{
    const res = await RelationModel.findAll({
        attributes:['from_id','createtime'],
        where: {
          to_id:id
        },
        order: [
          ['createtime','DESC']
        ],
    });
    //没有就返回空数组
    if(!res){
      ctx.body={
        code:0,
        data:[]
      }
      return;
    }
    //有就遍历并且获得user的id，headimg，nickname
    let fansList = [];
    for(let user of res){
      const fans = await UserModel.findOne({
        attributes:['id','nickname','headimg'],
        where:{
          id:user.from_id
        }
      });
      fansList.push(fans);
    }

    ctx.body = {
      code:0,
      data:fansList
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//关注
exports.followUser = async (ctx)=>{
  let data = ctx.request.body;
  data.createtime = new Date();

  try{
    const res = await RelationModel.create(data);
    //正常修改
    ctx.body = {
      code:0,
      message:'关注成功'
    }
  }catch(e){
    //发生错误
    ctx.body = {
      code:10000,
      message:'关注失败'
    }
  }
}


//取消关注
exports.cancelFollowUser = async (ctx)=>{
  let data = ctx.request.body;

  try{
    const res = await RelationModel.destroy({
      where:{
        from_id:data.from_id,
        to_id:data.to_id
      }
    });
    //正常修改
    ctx.body = {
      code:0,
      message:'取消关注成功'
    }
  }catch(e){
    //发生错误
    ctx.body = {
      code:10000,
      message:'取消关注失败'
    }
  }
}

//获得私信列表
exports.getLetters = async (ctx)=>{
  const id = Number(ctx.query.id);
  try{
    const chats = await ChatModel.findAll({
      where:{
        $or:[
          {from_id:id},
          {to_id: id}
        ]
      },
      order: [
        ['createtime','DESC']
      ]
    });
    if(chats.length===0){
      ctx.body = {
        code:0,
        data:[]
      }
      return;
    }

    let otherSet = new Set();//包含聊天对象id的数组
    for(let chat of chats){
      if(chat.from_id===id){
        otherSet.add(chat.to_id);
      }else{
        otherSet.add(chat.from_id);
      }
    }
    let otherArr = Array.from(otherSet);
    if(otherArr.length===0){
      ctx.body = {
        code:0,
        data:[]
      }
      return;
    }

    let letterList = [];
    for(let other of otherArr){
      const user = await UserModel.findOne({
        attributes:['id','nickname','headimg'],
        where:{
          id:other
        }
      });

      const latestLatter = await ChatModel.findOne({
        attributes:['content','createtime'],
        where:{
          $or:[
            {from_id: other,to_id:id},
            {to_id: other,from_id: id}
          ]
        },
        order: [
          ['createtime','DESC']
        ]
      });

      letterList.push({
        userData:{
          id:user.id,
          nickname:user.nickname,
          headimg:user.headimg
        },
        content:latestLatter.content,
        createtime:moment(latestLatter.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss'),
      })
    }
    ctx.body = {
      code:0,
      data:letterList
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//获得评论列表
exports.getComments = async (ctx)=>{
  //并行查找发出的评论和收到的评论
  //发出的评论：查找comment表formid=id的，没有的话直接返回，有的话得出comments(dynamic_id,to_id,content,createtime),按时间排序,
  //          从dynamicid在dynamic表找出(id,content),有的话并行找出toid的(id,nickname)，没有的话就返回{}
  //收到的评论：先查找dynamic表，找出userid是id的dynamics(id)，查找comment表中toid是id的或者dynamicid在dynamics_id中的，
  //          得到comments(dynamic_id,content,fromid,createtime)按时间排序，没有的话返回[]，
  //          有的话遍历comments查找user表得到(id,nickname,headimg),并行查找dynamic表(id,content)
  const id = ctx.query.id;
  try{
    //收到的评论
    let getGotComment = async ()=>{
      const dynamics = await DynamicModel.findAll({
        attributes:['id'],
        where:{
          user_id:id
        }
      });
      let dynamicsId = [];
      for(let dynamic of dynamics){
        dynamicsId.push(dynamic.dataValues.id)
      };

      const comments = await CommentModel.findAll({
        attributes:['dynamic_id','content','from_id','createtime'],
        where:{
          $or:[
            {dynamic_id:dynamicsId},
            {to_id: id}
          ],
          from_id:{
            $ne:id
          }
        },
        order: [
          ['createtime','DESC']
        ]
      });
      if(comments.length===0){
        return [];
      }

      let gotCommentArr = [];
      for(let comment of comments){
        const dynamic = await DynamicModel.findOne({
          attributes:['id','content'],
          where:{
            id:comment.dynamic_id
          }
        });

        const user = await UserModel.findOne({
          attributes:['id','nickname','headimg'],
          where:{
            id:comment.from_id
          }
        })

        gotCommentArr.push({
          content:comment.content,
          createtime:moment(comment.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss'),
          dynamic:dynamic,
          fromUser:user
        })
      }
      return gotCommentArr;
    }

    //发出的评论
    let getSentComment = async ()=>{
      const comments = await CommentModel.findAll({
        attributes:['dynamic_id','to_id','content','createtime'],
        where:{
          from_id:id
        },
        order: [
          ['createtime','DESC']
        ]
      });
      if(comments.length===0){
        return [];
      }

      let sentCommentArr = [];
      for(let comment of comments){
        const dynamic = await DynamicModel.findOne({
          attributes:['id','content'],
          where:{
            id:comment.dynamic_id
          }
        });

        let toUserObj = {};
        if(comment.to_id){
          toUserObj = await UserModel.findOne({
            attributes:['id','nickname'],
            where:{
              id:comment.to_id
            }
          })
        }

        sentCommentArr.push({
          content:comment.content,
          createtime:moment(comment.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss'),
          dynamic:dynamic,
          toUser:toUserObj
        })
      }
      return sentCommentArr;
    }

    const res = await Promise.all([getGotComment(),getSentComment()]);
    ctx.body = {
      code:0,
      data:{
        gotComment:res[0],
        sentComment:res[1]
      }
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//获得点赞列表
exports.getLikes = async (ctx)=>{
  //并行查找发出的赞和收到的赞
  //发出的赞：查找like表，userid=id的，得到dynamics按时间排序，没有的话直接返回，有的话遍历dynamics，查找dynamics表找到全部
  //收到的赞：查找dynamic表，userid=id的，得到dynamics，没有的话直接返回，有的话查找like表dynamicid符合的，按时间排序，然后找user表
  const userId = ctx.query.id;
  try{
    //收到的赞
    let getGotLike = async ()=>{
      let gotLikeArr = [];
      const dynamics = await DynamicModel.findAll({
        attributes:['id'],
        where:{
          user_id:userId
        }
      });
      if(dynamics.length===0){
        return [];
      }

      let dynamicsId = [];
      for(let dynamic of dynamics){
        dynamicsId.push(dynamic.dataValues.id)
      }
      const likes = await LikeModel.findAll({
        where:{
          dynamic_id:dynamicsId
        },
        order: [
          ['createtime','DESC']
        ]
      });
      if(likes.length===0){
        return [];
      }

      for(let like of likes){
        const user = await UserModel.findOne({
          attributes:['id','nickname','headimg'],
          where:{
            id:like.user_id
          }
        });
        const dynamic = await DynamicModel.findOne({
          attributes:['id','content'],
          where:{
            id:like.dynamic_id
          }
        })
        gotLikeArr.push({
          userData:{
            id:user.id,
            nickname:user.nickname,
            headimg:user.headimg
          },
          dynamicData:{
            id:dynamic.id,
            content:dynamic.content,
          },
          createtime:moment(like.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss')
        })
      }
      return gotLikeArr;
    }

    //发出的赞
    let getSentLike = async ()=>{
      const likes = await LikeModel.findAll({
        attributes:['dynamic_id','createtime'],
        where:{
          user_id:userId
        },
        order: [
          ['createtime','DESC']
        ]
      });
      if(likes.length===0){
        return [];
      };

      let sentLikeArr = [];
      for(let like of likes){
        const dynamic = await DynamicModel.findOne({
          attributes:['id','user_id','content'],
          where:{
            id:like.dynamic_id
          }
        });
        if(!dynamic){
          continue;
        }
        const user = await UserModel.findOne({
          attributes:['id','nickname'],
          where:{
            id:dynamic.user_id
          }
        });
        sentLikeArr.push({
          userData:{
            id:user.id,
            nickname:user.nickname
          },
          dynamic:{
            id:dynamic.id,
            content:dynamic.content
          },
          createtime:moment(like.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss')
        })
      }
      return sentLikeArr;
    }

    const res = await Promise.all([getGotLike(),getSentLike()]);
    ctx.body = {
      code:0,
      data:{
        gotLike:res[0],
        sendLike:res[1]
      }
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//得到聊天记录
exports.getChatLog = async (ctx)=>{
  const mainId = Number(ctx.query.mainId);//自己的ID
  const otherId = Number(ctx.query.otherId);//对方的ID
  try{
    const mainUser = async ()=>{
      const mainUserObj = await UserModel.findOne({
        attributes:['id','nickname','headimg'],
        where:{
          id:mainId
        }
      });
      return mainUserObj;
    }
    
    const otherUser = async ()=>{
      const otherUserObj = await UserModel.findOne({
        attributes:['id','nickname','headimg'],
        where:{
          id:otherId
        }
      });
      return otherUserObj;
    }

    const chatLog = async ()=>{
      let chatItems = await ChatModel.findAll({
        attributes:['id','from_id','content','createtime'],
        where:{
          $or:[
            {from_id:mainId,to_id:otherId},
            {to_id: mainId,from_id:otherId}
          ]
        },
        order: [
          ['createtime','ASC']
        ]
      });
      for(let chatItem of chatItems){
        chatItem.dataValues.createtime = moment(chatItem.dataValues.createtime).add(8,'hours');
      }
      return chatItems;
    }

    const res = await Promise.all([mainUser(),otherUser(),chatLog()]);

    ctx.body = {
      code:0,
      data:{
        mainUser:res[0],
        otherUser:res[1],
        chatLog:res[2]
      }
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//把聊天信息插入数据库
exports.addChatLog = async (data)=>{
  try{
    const chat = {
      from_id:data.from_id,
      to_id:data.to_id,
      content:data.content,
      createtime:new Date()
    };
    await ChatModel.create(chat);
  }
  catch(e){
    console.log(e);
  }
}
