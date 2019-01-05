// @login &register
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const gravatar = require("gravatar");
const MedUsers = require("../../../module/Med_Users");
const passport = require("passport");
const moment = require("moment");

//$route POST api/users/register
//@desc 返回的请求的json数据
//@access public
router.post("/register", (req, res) => {
  //查询数据库中是否有该用户
  const regTime = moment().format("YYYY-MM-DD HH:mm:ss");
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
        passWord: newPass,
        regTime,
        key: regTime
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
  const { name, ok, _id, currentAuthority } = req.body;
  console.log(_id);
  console.log(ok);
  MedUsers.findOneAndUpdate(
    { _id },
    {
      $set: {
        currentAuthority,
        name,
        ok
      }
    },
    {
      new: true
    }
  ).then(() =>
    MedUsers.aggregate([
      {
        $group: {
          _id: "$ok",
          data: { $push: "$$ROOT" }
        }
      }
    ])
      .then(List => {
        if (!List) {
          return res.status(404).json("没有任何数据");
        }
        let list = {};
        List.map(item => [(list[item._id] = item.data)]);
        res.json(list);
      })
      .catch(err => res.status(404).json(err))
  );
});
//删除
router.post("/delete", (req, res) => {
  //查询数据库中是否有该用户
  const { name, mobile, _id } = req.body;
  if (name === "admin") return null;
  MedUsers.deleteOne({ _id }).then(List => {
    MedUsers.aggregate([
      {
        $group: {
          _id: "$ok",
          data: { $push: "$$ROOT" }
        }
      }
    ])
      .then(List => {
        if (!List) {
          return res.status(404).json("没有任何数据");
        }
        let list = {};
        List.map(item => [(list[item._id] = item.data)]);
        res.json(list);
      })
      .catch(err => res.status(404).json(err));
  });
});

//$route POST api/users/test
//@desc 返回token jwt passport
//@access public
router.post("/login", (req, res) => {
  const userName = req.body.userName;
  const lastLoginTime = moment().format("YYYY-MM-DD HH:mm:ss");
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
    const { passWord, currentAuthority, userName, ok } = user;
    let md5 = crypto.createHash("md5");
    let newPass = md5.update(req.body.passWord).digest("hex");
    if (newPass === passWord) {
      if (ok === "no") {
        res.send({
          userName,
          status: "noauth"
        });
      } else {
        res.send({
          userName,
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
  MedUsers.aggregate([
    {
      $group: {
        _id: "$ok",
        data: { $push: "$$ROOT" }
      }
    }
  ])
    .then(List => {
      if (!List) {
        return res.status(404).json("没有任何数据");
      }
      let list = {};
      List.map(item => [(list[item._id] = item.data)]);
      res.json(list);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
