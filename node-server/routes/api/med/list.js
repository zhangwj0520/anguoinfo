// @login &register
const express = require("express");
const router = express.Router();
const passport = require("passport");

const List = require("../../../module/Med_List");

//$route POST api/Lists/add
//@desc 创建信息借口
//@access Private

router.post("/add", (req, res) => {
  const ListFields = {};
  if (req.body.sn) ListFields.sn = req.body.sn;
  if (req.body.fileName) ListFields.fileName = req.body.fileName;
  if (req.body.time) ListFields.time = req.body.time;
  if (req.body.vender) ListFields.vender = req.body.vender;
  if (req.body.venderType) ListFields.venderType = req.body.venderType;
  if (req.body.dingdan_time) ListFields.dingdan_time = req.body.dingdan_time;
  if (req.body.data) {
    let ctotal = 0;
    let dtotal = 0;
    ListFields.data = req.body.data;
    for (let i = 0; i < req.body.data.length - 1; i++) {
      let cur = req.body.data[i];
      dtotal += parseFloat(cur.quantity) * parseFloat(cur.dingdan_price);
      ctotal += parseFloat(cur.quantity) * parseFloat(cur.caigou_price);
    }
    ListFields.dingdan_totalPrice = dtotal ? dtotal : 0;
    ListFields.caigou_totalPrice = ctotal ? ctotal : 0;
  }
  if (req.body.key) ListFields.key = req.body.key;
  if (req.body.cols) ListFields.cols = req.body.cols;
  if (req.body.dataSourse) ListFields.dataSourse = req.body.dataSourse;
  if (req.body.baojiao_index) ListFields.baojiao_index = req.body.baojiao_index;

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
  List.find({}, { data: 0, dataSourse: 0, cols: 0, spendList: 0 })
    .sort({ time: -1 })
    .then(List => {
      if (!List) {
        return res.status(404).json("没有任何数据");
      }
      res.json(List);
    })
    .catch(err => res.status(404).json(err));
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

//$route POST api/Lists/edit
//@desc 编辑信息借口
//@access Private

router.post("/edit/:id", (req, res) => {
  let { data } = req.body;
  const { id } = req.params;
  let jiesuan_total = 0,
    dtotal = 0,
    ctotal = 0, //采购
    zbtotal = 0, //个数
    zhongbiao_totalPrice = 0,
    jstotal = 0;

  status = 0;
  if (data) {
    for (let i = 0; i < data.length - 1; i++) {
      let cur = req.body.data[i];
      dtotal +=
        (parseFloat(cur.quantity) - parseFloat(cur.back_quantity)) *
        cur.dingdan_price;
      if (cur.zhongbiao) {
        zbtotal++;
        ctotal += parseFloat(cur.quantity) * cur.caigou_price;
        jiesuan_total +=
          (parseFloat(cur.quantity) - parseFloat(cur.back_quantity)) *
          cur.caigou_price;
        zhongbiao_totalPrice += parseFloat(cur.quantity) * cur.dingdan_price; //中标金额
      }
      if (cur.jiesuan) {
        jstotal++;
      }
    }
    if (jstotal == 0) {
      status = 0;
    } else if (jstotal != 0 && jstotal < zbtotal) {
      status = 1;
    } else {
      status = 2;
    }
  }

  List.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        data,
        status,
        zhongbiao_totalPrice: zhongbiao_totalPrice.toFixed(2),
        jiesuan_price: jiesuan_total.toFixed(2),
        dingdan_totalPrice: dtotal.toFixed(2),
        caigou_totalPrice: ctotal.toFixed(2)
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
  const {
    name,
    dingdan_price,
    caigou_price,
    jiesuan,
    remark,
    back_quantity
  } = data;

  List.update(
    { _id: id, "data.name": name },
    {
      $set: {
        "data.$.dingdan_price": dingdan_price,
        "data.$.caigou_price": caigou_price,
        "data.$.jiesuan": jiesuan,
        "data.$.back_quantity": back_quantity,
        "data.$.remark": remark
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
