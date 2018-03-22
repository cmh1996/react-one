const DynamicModel = require('../models/DynamicModel.js');
const UserModel = require('../models/UserModel.js');
const RelationModel = require('../models/RelationModel.js');
const LikeModel = require('../models/LikeModel.js');
const CommentModel = require('../models/CommentModel.js');
const moment = require('moment');

//删除动态
exports.deleteDynamic = async (ctx)=>{
  const id = ctx.request.body.id;
  try{
    const res = await DynamicModel.destroy({
      where:{
        id:id
      }
    });
    ctx.body = {
      code:0
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//发送动态
exports.postDynamic = async (ctx)=>{
  //插入dynamic中，插入成功则返回0，不成功则返回10000
	const dynamic = {
  		user_id:ctx.request.body.id,
      content:ctx.request.body.content,
  		createtime:new Date()
  };
	//插入数据
  try{
    const res = await DynamicModel.create(dynamic);
    ctx.body = {
      code:0,
      message:'发送成功'
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'发送失败'
    }
  }
}

//获得某个用户的动态页数据
exports.getPersonalDynamic = async (ctx)=>{
  //根据id查找user表，获得用户信息，没有则直接return
  //然后查找Relation表，算出该用户关注和粉丝人数
  //并行查找dynamic表，找出该用户的动态
  //然后并行查找likes表和comments表，算出次数
  const id = ctx.query.curId;   //页主id
  const selfId = ctx.query.selfId+'';  //本人id

  //插入数据
  try{
    const user = await UserModel.findOne({
        attributes:['nickname','sex','headimg'],
        where: {
          id: id
        }
    });
    if(!user){
      ctx.body = {
        code:10000,
        message:'没有该用户'
      }
      return;
    }

    //并行计算关注数和粉丝数和与当前用户的关系
    let countRelNum = async ()=>{
      const followNum = await RelationModel.count({
        where:{
          from_id:id
        }
      });
      const fansNum = await RelationModel.count({
        where:{
          to_id:id
        }
      });
      const hasFollowed = await RelationModel.findOne({
        attributes:['createtime'],
        where:{
          from_id:selfId,
          to_id:id
        }
      });
      return Promise.all([followNum,fansNum,hasFollowed]);
    }

    //查找用户动态和该条动态的点赞数，评论数
    let findDynamics = async ()=>{
      const dynamics = await DynamicModel.findAll({
        attributes:['id','content','createtime'],
        order: [
          ['createtime','DESC']
        ],
        where: {
          user_id:id
        }
      });
      //查询每条动态的点赞数，评论数
      for(let dynamic of dynamics){
        const likeNum = await LikeModel.count({
          where:{
            dynamic_id:dynamic.id
          }
        });
        const commentNum = await CommentModel.count({
          where:{
            dynamic_id:dynamic.id
          }
        });
        const hasLiked = await LikeModel.findOne({
          attributes:['dynamic_id'],
          where:{
            dynamic_id:dynamic.id,
            user_id:selfId
          }
        });
        Promise.all([likeNum,commentNum,hasLiked])
        .then((data)=>{
          dynamic.dataValues.createtime = moment(dynamic.dataValues.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss');
          dynamic.dataValues.likeNum = data[0];
          dynamic.dataValues.commentNum = data[1];
          dynamic.dataValues.hasLiked = data[2]?true:false;
        })
      }
      return dynamics;
    }

    const res = await Promise.all([countRelNum(),findDynamics()]);

    ctx.body = {
      code:0,
      data:{
        user:user,
        rel:{
          followNum:res[0][0],
          fansNum:res[0][1],
          hasFollowed:res[0][2]?true:false
        },
        dynamics:res[1]
      }
    }

  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'获取用户动态出错'
    }
  }
}

//获得关注了的人的最新动态
exports.getLatestDynamic = async (ctx)=>{
  //根据传过来的id去找relation表，找出所有已经关注的人，再往得到的关注人数组中插入自己的id，然后去找dynamic表；
  //然后找dynamic表，符合user_id包含我关注的人和我自己的动态；有则拿到动态的content和createtime，按时间排序，没有则返回没有更多动态
  //遍历拿到的dynamics，并行查找user表(id,nickname,headimg)/点赞次数/评论次数
  const id = ctx.query.id;
  try{
    let follows = await RelationModel.findAll({
      attributes:['to_id'],
      where:{
        from_id:id
      }
    });
    let followsArr = [];
    for(let follow of follows){
      followsArr.push(follow.dataValues.to_id)
    }
    followsArr.push(id);

    const dynamics = await DynamicModel.findAll({
      where:{
        user_id:followsArr
      },
      order: [
        ['createtime','DESC']
      ],
    });
    if(dynamics.length===0){
      ctx.body = {
        code:0,
        message:'没有更多动态'
      }
      return;
    }
    //并行查找
    for(let dynamic of dynamics){
      const user = await UserModel.findOne({
        attributes:['id','nickname','headimg'],
        where:{
          id:dynamic.user_id
        }
      });
      const likeNum = await LikeModel.count({
        where:{
          dynamic_id:dynamic.id
        }
      });
      const commentNum = await CommentModel.count({
        where:{
          dynamic_id:dynamic.id
        }
      });
      const hasLiked = await LikeModel.findOne({
        attributes:['dynamic_id'],
        where:{
          dynamic_id:dynamic.id,
          user_id:id
        }
      });
      Promise.all([user,likeNum,commentNum,hasLiked])
      .then((data)=>{
        dynamic.dataValues.createtime = moment(dynamic.dataValues.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss');
        dynamic.dataValues.userData = data[0];
        dynamic.dataValues.likeNum = data[1];
        dynamic.dataValues.commentNum = data[2];
        dynamic.dataValues.hasLiked = data[3]?true:false;
      })
    }
    ctx.body = {
      code:0,
      data:dynamics
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//赞，取消点赞
exports.toggleLike = async (ctx)=>{
  //查找点赞表，有则destroy，无则create
  const userId = ctx.request.body.user_id;
  const dynamicId = ctx.request.body.dynamic_id;
  try{
    const hasLiked = await LikeModel.findOne({
      attributes:['user_id'],
      where:{
        user_id:userId,
        dynamic_id:dynamicId
      }
    });
    //已经赞了的就取消点赞
    if(hasLiked){
      await LikeModel.destroy({
        where:{
          user_id:userId,
          dynamic_id:dynamicId
        }
      });
    }else{
      await LikeModel.create({
          user_id:userId,
          dynamic_id:dynamicId,
          createtime:new Date()
      });
    }
    ctx.body = {
      code:0
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//动态详情
exports.getDynamicDetail = async (ctx)=>{
  //从dynamic表寻找，没有则返回10000号，有则得到user_id,content,createtime
  //并行查找user表（id,nickname,headimg）;
  //like表(user_id)，按时间排序，根据userid找user表（id,nickname,headimg）;
  //comment表，按时间排序,根据from_id找user表（id,nickname,headimg）,有to_id就找user表(nickname)，没有则返回null;
  const dynamicId = ctx.query.id;
  try{
    const dynamic = await DynamicModel.findOne({
      attributes:['user_id','content','createtime'],
      where:{
        id:dynamicId
      }
    });
    if(!dynamic){
      ctx.body = {
        code:10000,
        message:'该动态不存在'
      };
      return;
    }

    //寻找user信息
    let getUserData = async ()=>{
      const user = await UserModel.findOne({
        attributes:['id','nickname','headimg'],
        where:{
          id:dynamic.user_id
        }
      });
      return user;
    }

    //寻找点赞了的用户
    let getLikeList = async ()=>{
      const likes = await LikeModel.findAll({
        attributes:['user_id'],
        where:{
          dynamic_id:dynamicId
        },
        order: [
          ['createtime','DESC']
        ],
      });

      let likeList = [];
      for(let like of likes){
        const likeUser = await UserModel.findOne({
          attributes:['id','nickname','headimg'],
          where:{
            id:like.user_id
          }
        });
        likeList.push(likeUser);
      }
      return likeList;
    }

    //寻找评论
    let getCommentList = async ()=>{
      const comments = await CommentModel.findAll({
        attributes:['from_id','to_id','content','createtime'],
        where:{
          dynamic_id:dynamicId
        },
        order: [
          ['createtime','DESC']
        ],
      });

      let commentList = [];
      for(let comment of comments){
        const fromUser = await UserModel.findOne({
          attributes:['id','nickname','headimg'],
          where:{
            id:comment.from_id
          }
        });

        //有回复的人
        let toUser = {};
        if(comment.to_id){
          toUser = await UserModel.findOne({
            attributes:['id','nickname'],
            where:{
              id:comment.to_id
            }
          });
        }

        const commentObj = {
          content:comment.content,
          createtime:moment(comment.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss'),
          from:{
            id:fromUser.id,
            nickname:fromUser.nickname,
            headimg:fromUser.headimg,
          },
          to:toUser
        }
        commentList.push(commentObj);
      }
      return commentList;
    }

    const res = await Promise.all([getUserData(),getLikeList(),getCommentList()]);
    ctx.body = {
      code:0,
      data:{
        userData:res[0],
        content:dynamic.content,
        createtime:moment(dynamic.createtime).add('hours',8).format('YYYY-MM-DD HH:mm:ss'),
        likeList:res[1],
        commentList:res[2]
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

exports.sendComment = async (ctx)=>{
  let data = {
    dynamic_id:ctx.request.body.dynamicId,
    from_id:ctx.request.body.fromId,
    content:ctx.request.body.content,
    createtime:new Date()
  }
  if(ctx.request.body.toId){
    data.to_id = ctx.request.body.toId
  }

  try{
    const res = await CommentModel.create(data);

    const fromUser = await UserModel.findOne({
      attributes:['nickname','headimg'],
      where:{
        id:data.from_id
      }
    });

    let toUserObj = {};
    if(data.to_id){
      const toUser = await UserModel.findOne({
        attributes:['nickname'],
        where:{
          id:data.to_id
        }
      });
      toUserObj = {
        id:data.to_id,
        nickname:toUser.nickname
      }
    }

    ctx.body={
      code:0,
      data:{
        content:data.content,
        createtime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        from:{
          id:data.from_id,
          nickname:fromUser.nickname,
          headimg:fromUser.headimg
        },
        to:toUserObj
      }
    }
  }
  catch(e){
    ctx.body={
      code:10000,
      message:'发送失败'
    }
  }
}