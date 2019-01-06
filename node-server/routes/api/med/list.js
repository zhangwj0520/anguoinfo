// @login &register
const express = require("express");
const router = express.Router();
const passport = require("passport");

const List = require("../../../module/Med_List");

//$route POST api/Lists/add
//@desc 创建信息借口
//@access Private

router.post("/add", (req, res) => {
  const ListFields = req.body;
  List.findOne({ sn: req.body.sn }).then(list => {
    if (list) {
      return res.json({ status: "existence" });
    } else {
      new List(ListFields).save().then(List => {
        res.json({
          status: "ok",
          data: List
        });
      });
    }
  });
});

//$route get api/Lists/
//@desc 获取所有信息
//@access Private
router.get("/", (req, res) => {
  List.aggregate([
    {
      $unwind: "$data"
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          vender: "$vender",
          baojiao_index: "$baojiao_index",
          dingdan_time: "$dingdan_time",
          fahuo_time: "$fahuo_time",
          key: "$key",
          sn: "$sn",
          spend: "$spend"
        },
        dingdan_totalPrice: {
          $sum: { $multiply: ["$data.quantity", "$data.dingdan_price"] }
        },
        zhongbiao_totalPrice: {
          $sum: {
            $multiply: [
              "$data.quantity",
              "$data.dingdan_price",
              "$data.zhongbiao"
            ]
          }
        },
        caigou_totalPrice: {
          $sum: {
            $multiply: [
              "$data.quantity",
              "$data.caigou_price",
              "$data.zhongbiao"
            ]
          }
        },
        jiesuan_totalPrice: {
          $sum: {
            $multiply: [
              { $subtract: ["$data.quantity", "$data.back_quantity"] },
              //"$data.quantity",
              "$data.dingdan_price",
              "$data.jiesuan"
            ]
          }
        },
        zhongbiaoNum: {
          $sum: "$data.zhongbiao"
        },
        jiesuanNum: {
          $sum: "$data.jiesuan"
        }
      }
    },
    {
      $project: {
        dingdan_totalPrice: 1,
        zhongbiao_totalPrice: 1,
        caigou_totalPrice: 1,
        jiesuan_totalPrice: 1,
        zhongbiaoNum: 1,
        jiesuanNum: 1,
        vender: "$_id.vender",
        _id: "$_id._id",
        baojiao_index: "$_id.baojiao_index",
        dingdan_time: "$_id.dingdan_time",
        fahuo_time: "$_id.fahuo_time",
        key: "$_id.key",
        sn: "$_id.sn",
        spend: "$_id.spend"
      }
    },
    {
      $sort: { dingdan_time: -1 }
    }
  ]).then(List => {
    res.json(List);
  });
});

//
router.post("/delete", (req, res) => {
  List.findOneAndRemove({ _id: req.body.id })
    .then(List => {
      List.save();
    })
    .then(() => {
      List.find()
        .then(List => {
          if (!List) {
            return res.status(404).json("没有任何数据");
          }
          res.json(List);
        })
        .catch(err => res.status(404).json(err));
    })
    .catch(err =>
      res.json({
        status: "error",
        data: List
      })
    );
});

//$route get api/Lists/:id
//@desc 获取单个信息
//@access Private
router.get("/:id", (req, res) => {
  List.findOne({ _id: req.params.id }, { dataSourse: 0, cols: 0, spendList: 0 })
    .then(List => {
      if (!List) {
        return res.status(404).json("没有任何数据");
      }
      res.json({
        status: "ok",
        oneListData: List.data
      });
    })
    .catch(err => res.status(404).json(err));
});
//更新某个品种
router.post("/edit", (req, res) => {
  const { data, id } = req.body;
  const { name, type } = data;
  List.update(
    { _id: id, "data.name": name, "data.type": type },
    {
      $set: {
        "data.$": data
      }
    },
    {
      new: true
    }
  ).then(() => {
    List.findOne({ _id: id }, { dataSourse: 0, cols: 0, spendList: 0 })
      .then(List => {
        if (!List) {
          return res.status(404).json("没有任何数据");
        }
        res.json({
          status: "ok",
          oneListData: List.data
        });
      })
      .catch(err =>
        res.json({
          status: "error"
        })
      );
  });
});

//$route POST api/Lists/edit
//@desc 编辑信息借口
//@access Private

//更新中标情况
router.post("/editzhongbiao", (req, res) => {
  let { data, id } = req.body;
  List.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        data
      }
    },
    {
      new: true
    }
  ).then(List => {
    res.json({ oneListData: List.data, status: "ok" });
  });
});
//更新报价
router.post("/updateprice", (req, res) => {
  const { data, id } = req.body;
  const { name, type } = data;

  List.update(
    { _id: id, "data.name": name, "data.type": type },
    {
      $set: {
        "data.$": data
      }
    },
    {
      new: true
    }
  ).then(() => {
    List.findOne({ _id: id }, { dataSourse: 0, cols: 0, spendList: 0 })
      .then(List => {
        if (!List) {
          return res.status(404).json("没有任何数据");
        }
        res.json({
          status: "ok",
          oneListData: List.data
        });
      })
      .catch(err =>
        res.json({
          status: "error"
        })
      );
  });
});

//更新时间
router.post("/time/:id", (req, res) => {
  let { fahuo_time } = req.body;
  const { id } = req.params;
  List.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        fahuo_time
      }
    }
  ).then(() => {
    List.find()
      .then(List => {
        if (!List) {
          return res.status(404).json("没有任何数据");
        }
        res.json(List);
      })
      .catch(err => res.status(404).json(err));
  });
});

//获取花费情况
router.get("/spend/:id", (req, res) => {
  List.findOne({ _id: req.params.id }, { dataSourse: 0, cols: 0, data: 0 })
    .then(List => {
      if (!List) {
        return res.status(404).json("没有任何数据");
      }

      res.json({
        status: "ok",
        spendList: List.spendList
      });
    })
    .catch(err => res.status(404).json(err));
});

//更新花费情况
router.post("/spend/:id", (req, res) => {
  let { spendList } = req.body;
  const { id } = req.params;
  let spend = 0;
  if (spendList.length != 0) {
    for (let i = 0; i < spendList.length; i++) {
      const cur = spendList[i];
      spend += Number(cur.money);
    }
  }
  List.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        spendList,
        spend
      }
    },
    {
      new: true
    }
  )
    .then(List => {
      if (!List) {
        return res.status(404).json("没有任何数据");
      }
      res.json(List);
    })
    .catch(err => res.status(404).json(err));
});

//$route POST api/Lists/delete/:id
//@desc 删除信息接口
//@access Private
router.delete("/delete/:id", (req, res) => {
  List.findOneAndRemove({ _id: req.params.id })
    .then(List => {
      List.save().then(List => res.json(List));
    })
    .catch(err => res.status(404).json("删除失败"));
});

//导出
router.get("/export/:id", (req, res) => {
  List.findOne({ _id: req.params.id }, { data: 0, cols: 0, spendList: 0 })
    .then(List => {
      if (!List) {
        return res.status(404).json("没有任何数据");
      }

      res.json({
        status: "ok",
        exportListData: List.dataSourse,
        fileName: List.fileName
      });
    })
    .catch(err => res.status(404).json(err));
});

//
//查询medlist
router.post("/find", (req, res) => {
  const { name, type, id } = req.body;
  List.aggregate([
    {
      $project: {
        data: {
          $filter: {
            input: "$data",
            as: "item",
            cond: {
              $and: [
                { $eq: ["$$item.type", type] },
                { $eq: ["$$item.name", name] }
              ]
            }
          }
        },
        dingdan_time: 1,
        _id: 1
      }
    }
  ]).then(List => {
    let list = [];
    List.map(item => {
      if (item.data.length != 0) {
        //   if (item._id != id && item.data.length != 0) {
        item.data[0].time = item.dingdan_time;
        item.data[0]["采购价格"] = item.data[0].caigou_price;
        item.data[0]["订单价格"] = item.data[0].dingdan_price;
        delete item.data[0].id;
        delete item.data[0].description;
        delete item.data[0].back_quantity;
        delete item.data[0].jiesuan;
        delete item.data[0].key;
        delete item.data[0].origin;
        delete item.data[0].settlement;
        delete item.data[0].caigou_price;
        delete item.data[0].dingdan_price;
        delete item.data[0].type;
        delete item.data[0].specifications;
        list.push({ ...item.data[0] });
      }
    });
    res.json(list);
  });
});

//查询所有med名字
router.post("/namelist", (req, res) => {
  List.distinct("data.name").then(List => res.json(List));
});

module.exports = router;
