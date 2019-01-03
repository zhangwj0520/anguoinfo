// @login &register
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const gravatar = require("gravatar");
const MedUsers = require("../../../module/Med_Users");
const passport = require("passport");

//$route POST api/users/register
//@desc 返回的请求的json数据
//@access public
router.post("/register", (req, res) => {
  //查询数据库中是否有该用户
  let { userName, passWord } = req.body;
  MedUsers.findOne({
    userName: userName
  }).then(user => {
    if (user) {
      return res.json({ status: "existence" });
    } else {
      let md5 = crypto.createHash("md5");
      let newPass = md5.update(passWord).digest("hex");
      const newUser = new MedUsers({
        userName: userName,
        passWord: newPass
      });
      newUser
        .save()
        .then(() => res.json({ status: "ok" }))
        .catch(err => console.log(err));
    }
  });
});

//更新
router.post("/update", (req, res) => {
  //查询数据库中是否有该用户
  console.log(req.body);
  const { name, mobile, _id, currentAuthority } = req.body;
  MedUsers.findOneAndUpdate(
    { _id },
    {
      $set: {
        currentAuthority,
        name,
        mobile
      }
    }
    //).then(List => res.json({oneList:List,status: 'ok'}));
  ).then(() =>
    MedUsers.find()
      .then(List => {
        if (!List) {
          return res.status(404).json("没有任何数据");
        }
        res.json({ List, status: "ok" });
      })
      .catch(err => res.status(404).json(err))
  );
});
//删除
router.post("/delete", (req, res) => {
  //查询数据库中是否有该用户
  const { name, mobile, _id } = req.body;
  MedUsers.deleteOne({ _id }).then(List => res.json({ status: "ok" }));
});

//$route POST api/users/test
//@desc 返回token jwt passport
//@access public
router.post("/login", (req, res) => {
  const userName = req.body.userName;
  const lastLoginTime = new Date();
  //查询数据库
  MedUsers.findOneAndUpdate(
    {
      userName
    },
    {
      $set: {
        lastLoginTime
      }
    }
  ).then(user => {
    if (!user) {
      return res.send({
        status: "no-user"
      });
    }
    //密码匹配
    //console.log(user)
    const { passWord, currentAuthority, userName } = user;
    let md5 = crypto.createHash("md5");
    let newPass = md5.update(req.body.passWord).digest("hex");
    if (newPass === passWord) {
      if (currentAuthority.length == 0) {
        res.send({
          userName,
          message: "请申请权限",
          status: "noauth",
          currentAuthority
        });
      } else {
        res.send({
          userName,
          message: "登录成功",
          status: "ok",
          currentAuthority
        });
      }
    } else {
      return res.json({ status: "error" });
    }
  });
});

//$route POST api/users/current
//@desc 返回token jwt user
//@access private

router.get("/current", (req, res) => {
  MedUsers.find()
    .then(List => {
      if (!List) {
        return res.status(404).json("没有任何数据");
      }
      res.json(List);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
