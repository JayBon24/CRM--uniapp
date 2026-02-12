import { createMockResponse, createMockListResponse } from './utils'

// 省份数据（完整的34个省级行政区）
const provinces = [
  {
    "id": "110000",
    "areaId": "110000",
    "code": "110000",
    "name": "北京市",
    "fullname": "北京市",
    "level": 1
  },
  {
    "id": "120000",
    "areaId": "120000",
    "code": "120000",
    "name": "天津市",
    "fullname": "天津市",
    "level": 1
  },
  {
    "id": "130000",
    "areaId": "130000",
    "code": "130000",
    "name": "河北省",
    "fullname": "河北省",
    "level": 1
  },
  {
    "id": "140000",
    "areaId": "140000",
    "code": "140000",
    "name": "山西省",
    "fullname": "山西省",
    "level": 1
  },
  {
    "id": "150000",
    "areaId": "150000",
    "code": "150000",
    "name": "内蒙古自治区",
    "fullname": "内蒙古自治区",
    "level": 1
  },
  {
    "id": "210000",
    "areaId": "210000",
    "code": "210000",
    "name": "辽宁省",
    "fullname": "辽宁省",
    "level": 1
  },
  {
    "id": "220000",
    "areaId": "220000",
    "code": "220000",
    "name": "吉林省",
    "fullname": "吉林省",
    "level": 1
  },
  {
    "id": "230000",
    "areaId": "230000",
    "code": "230000",
    "name": "黑龙江省",
    "fullname": "黑龙江省",
    "level": 1
  },
  {
    "id": "310000",
    "areaId": "310000",
    "code": "310000",
    "name": "上海市",
    "fullname": "上海市",
    "level": 1
  },
  {
    "id": "320000",
    "areaId": "320000",
    "code": "320000",
    "name": "江苏省",
    "fullname": "江苏省",
    "level": 1
  },
  {
    "id": "330000",
    "areaId": "330000",
    "code": "330000",
    "name": "浙江省",
    "fullname": "浙江省",
    "level": 1
  },
  {
    "id": "340000",
    "areaId": "340000",
    "code": "340000",
    "name": "安徽省",
    "fullname": "安徽省",
    "level": 1
  },
  {
    "id": "350000",
    "areaId": "350000",
    "code": "350000",
    "name": "福建省",
    "fullname": "福建省",
    "level": 1
  },
  {
    "id": "360000",
    "areaId": "360000",
    "code": "360000",
    "name": "江西省",
    "fullname": "江西省",
    "level": 1
  },
  {
    "id": "370000",
    "areaId": "370000",
    "code": "370000",
    "name": "山东省",
    "fullname": "山东省",
    "level": 1
  },
  {
    "id": "410000",
    "areaId": "410000",
    "code": "410000",
    "name": "河南省",
    "fullname": "河南省",
    "level": 1
  },
  {
    "id": "420000",
    "areaId": "420000",
    "code": "420000",
    "name": "湖北省",
    "fullname": "湖北省",
    "level": 1
  },
  {
    "id": "430000",
    "areaId": "430000",
    "code": "430000",
    "name": "湖南省",
    "fullname": "湖南省",
    "level": 1
  },
  {
    "id": "440000",
    "areaId": "440000",
    "code": "440000",
    "name": "广东省",
    "fullname": "广东省",
    "level": 1
  },
  {
    "id": "450000",
    "areaId": "450000",
    "code": "450000",
    "name": "广西壮族自治区",
    "fullname": "广西壮族自治区",
    "level": 1
  },
  {
    "id": "460000",
    "areaId": "460000",
    "code": "460000",
    "name": "海南省",
    "fullname": "海南省",
    "level": 1
  },
  {
    "id": "500000",
    "areaId": "500000",
    "code": "500000",
    "name": "重庆市",
    "fullname": "重庆市",
    "level": 1
  },
  {
    "id": "510000",
    "areaId": "510000",
    "code": "510000",
    "name": "四川省",
    "fullname": "四川省",
    "level": 1
  },
  {
    "id": "520000",
    "areaId": "520000",
    "code": "520000",
    "name": "贵州省",
    "fullname": "贵州省",
    "level": 1
  },
  {
    "id": "530000",
    "areaId": "530000",
    "code": "530000",
    "name": "云南省",
    "fullname": "云南省",
    "level": 1
  },
  {
    "id": "540000",
    "areaId": "540000",
    "code": "540000",
    "name": "西藏自治区",
    "fullname": "西藏自治区",
    "level": 1
  },
  {
    "id": "610000",
    "areaId": "610000",
    "code": "610000",
    "name": "陕西省",
    "fullname": "陕西省",
    "level": 1
  },
  {
    "id": "620000",
    "areaId": "620000",
    "code": "620000",
    "name": "甘肃省",
    "fullname": "甘肃省",
    "level": 1
  },
  {
    "id": "630000",
    "areaId": "630000",
    "code": "630000",
    "name": "青海省",
    "fullname": "青海省",
    "level": 1
  },
  {
    "id": "640000",
    "areaId": "640000",
    "code": "640000",
    "name": "宁夏回族自治区",
    "fullname": "宁夏回族自治区",
    "level": 1
  },
  {
    "id": "650000",
    "areaId": "650000",
    "code": "650000",
    "name": "新疆维吾尔自治区",
    "fullname": "新疆维吾尔自治区",
    "level": 1
  },
  {
    "id": "710000",
    "areaId": "710000",
    "code": "710000",
    "name": "台湾省",
    "fullname": "台湾省",
    "level": 1
  },
  {
    "id": "810000",
    "areaId": "810000",
    "code": "810000",
    "name": "香港特别行政区",
    "fullname": "香港特别行政区",
    "level": 1
  },
  {
    "id": "820000",
    "areaId": "820000",
    "code": "820000",
    "name": "澳门特别行政区",
    "fullname": "澳门特别行政区",
    "level": 1
  }
]

// 城市数据（完整的地级市数据）
const cities = [
  {
    "id": "110100",
    "areaId": "110100",
    "code": "110100",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 2,
    "parentId": "110000"
  },
  {
    "id": "120100",
    "areaId": "120100",
    "code": "120100",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 2,
    "parentId": "120000"
  },
  {
    "id": "130100",
    "areaId": "130100",
    "code": "130100",
    "name": "石家庄市",
    "fullname": "石家庄市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130200",
    "areaId": "130200",
    "code": "130200",
    "name": "唐山市",
    "fullname": "唐山市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130300",
    "areaId": "130300",
    "code": "130300",
    "name": "秦皇岛市",
    "fullname": "秦皇岛市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130400",
    "areaId": "130400",
    "code": "130400",
    "name": "邯郸市",
    "fullname": "邯郸市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130500",
    "areaId": "130500",
    "code": "130500",
    "name": "邢台市",
    "fullname": "邢台市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130600",
    "areaId": "130600",
    "code": "130600",
    "name": "保定市",
    "fullname": "保定市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130700",
    "areaId": "130700",
    "code": "130700",
    "name": "张家口市",
    "fullname": "张家口市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130800",
    "areaId": "130800",
    "code": "130800",
    "name": "承德市",
    "fullname": "承德市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "130900",
    "areaId": "130900",
    "code": "130900",
    "name": "沧州市",
    "fullname": "沧州市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "131000",
    "areaId": "131000",
    "code": "131000",
    "name": "廊坊市",
    "fullname": "廊坊市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "131100",
    "areaId": "131100",
    "code": "131100",
    "name": "衡水市",
    "fullname": "衡水市",
    "level": 2,
    "parentId": "130000"
  },
  {
    "id": "140100",
    "areaId": "140100",
    "code": "140100",
    "name": "太原市",
    "fullname": "太原市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140200",
    "areaId": "140200",
    "code": "140200",
    "name": "大同市",
    "fullname": "大同市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140300",
    "areaId": "140300",
    "code": "140300",
    "name": "阳泉市",
    "fullname": "阳泉市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140400",
    "areaId": "140400",
    "code": "140400",
    "name": "长治市",
    "fullname": "长治市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140500",
    "areaId": "140500",
    "code": "140500",
    "name": "晋城市",
    "fullname": "晋城市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140600",
    "areaId": "140600",
    "code": "140600",
    "name": "朔州市",
    "fullname": "朔州市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140700",
    "areaId": "140700",
    "code": "140700",
    "name": "晋中市",
    "fullname": "晋中市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140800",
    "areaId": "140800",
    "code": "140800",
    "name": "运城市",
    "fullname": "运城市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "140900",
    "areaId": "140900",
    "code": "140900",
    "name": "忻州市",
    "fullname": "忻州市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "141000",
    "areaId": "141000",
    "code": "141000",
    "name": "临汾市",
    "fullname": "临汾市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "141100",
    "areaId": "141100",
    "code": "141100",
    "name": "吕梁市",
    "fullname": "吕梁市",
    "level": 2,
    "parentId": "140000"
  },
  {
    "id": "150100",
    "areaId": "150100",
    "code": "150100",
    "name": "呼和浩特市",
    "fullname": "呼和浩特市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150200",
    "areaId": "150200",
    "code": "150200",
    "name": "包头市",
    "fullname": "包头市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150300",
    "areaId": "150300",
    "code": "150300",
    "name": "乌海市",
    "fullname": "乌海市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150400",
    "areaId": "150400",
    "code": "150400",
    "name": "赤峰市",
    "fullname": "赤峰市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150500",
    "areaId": "150500",
    "code": "150500",
    "name": "通辽市",
    "fullname": "通辽市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150600",
    "areaId": "150600",
    "code": "150600",
    "name": "鄂尔多斯市",
    "fullname": "鄂尔多斯市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150700",
    "areaId": "150700",
    "code": "150700",
    "name": "呼伦贝尔市",
    "fullname": "呼伦贝尔市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150800",
    "areaId": "150800",
    "code": "150800",
    "name": "巴彦淖尔市",
    "fullname": "巴彦淖尔市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "150900",
    "areaId": "150900",
    "code": "150900",
    "name": "乌兰察布市",
    "fullname": "乌兰察布市",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "152200",
    "areaId": "152200",
    "code": "152200",
    "name": "兴安盟",
    "fullname": "兴安盟",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "152500",
    "areaId": "152500",
    "code": "152500",
    "name": "锡林郭勒盟",
    "fullname": "锡林郭勒盟",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "152900",
    "areaId": "152900",
    "code": "152900",
    "name": "阿拉善盟",
    "fullname": "阿拉善盟",
    "level": 2,
    "parentId": "150000"
  },
  {
    "id": "210100",
    "areaId": "210100",
    "code": "210100",
    "name": "沈阳市",
    "fullname": "沈阳市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210200",
    "areaId": "210200",
    "code": "210200",
    "name": "大连市",
    "fullname": "大连市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210300",
    "areaId": "210300",
    "code": "210300",
    "name": "鞍山市",
    "fullname": "鞍山市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210400",
    "areaId": "210400",
    "code": "210400",
    "name": "抚顺市",
    "fullname": "抚顺市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210500",
    "areaId": "210500",
    "code": "210500",
    "name": "本溪市",
    "fullname": "本溪市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210600",
    "areaId": "210600",
    "code": "210600",
    "name": "丹东市",
    "fullname": "丹东市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210700",
    "areaId": "210700",
    "code": "210700",
    "name": "锦州市",
    "fullname": "锦州市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210800",
    "areaId": "210800",
    "code": "210800",
    "name": "营口市",
    "fullname": "营口市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "210900",
    "areaId": "210900",
    "code": "210900",
    "name": "阜新市",
    "fullname": "阜新市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "211000",
    "areaId": "211000",
    "code": "211000",
    "name": "辽阳市",
    "fullname": "辽阳市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "211100",
    "areaId": "211100",
    "code": "211100",
    "name": "盘锦市",
    "fullname": "盘锦市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "211200",
    "areaId": "211200",
    "code": "211200",
    "name": "铁岭市",
    "fullname": "铁岭市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "211300",
    "areaId": "211300",
    "code": "211300",
    "name": "朝阳市",
    "fullname": "朝阳市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "211400",
    "areaId": "211400",
    "code": "211400",
    "name": "葫芦岛市",
    "fullname": "葫芦岛市",
    "level": 2,
    "parentId": "210000"
  },
  {
    "id": "220100",
    "areaId": "220100",
    "code": "220100",
    "name": "长春市",
    "fullname": "长春市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "220200",
    "areaId": "220200",
    "code": "220200",
    "name": "吉林市",
    "fullname": "吉林市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "220300",
    "areaId": "220300",
    "code": "220300",
    "name": "四平市",
    "fullname": "四平市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "220400",
    "areaId": "220400",
    "code": "220400",
    "name": "辽源市",
    "fullname": "辽源市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "220500",
    "areaId": "220500",
    "code": "220500",
    "name": "通化市",
    "fullname": "通化市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "220600",
    "areaId": "220600",
    "code": "220600",
    "name": "白山市",
    "fullname": "白山市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "220700",
    "areaId": "220700",
    "code": "220700",
    "name": "松原市",
    "fullname": "松原市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "220800",
    "areaId": "220800",
    "code": "220800",
    "name": "白城市",
    "fullname": "白城市",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "222400",
    "areaId": "222400",
    "code": "222400",
    "name": "延边朝鲜族自治州",
    "fullname": "延边朝鲜族自治州",
    "level": 2,
    "parentId": "220000"
  },
  {
    "id": "230100",
    "areaId": "230100",
    "code": "230100",
    "name": "哈尔滨市",
    "fullname": "哈尔滨市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230200",
    "areaId": "230200",
    "code": "230200",
    "name": "齐齐哈尔市",
    "fullname": "齐齐哈尔市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230300",
    "areaId": "230300",
    "code": "230300",
    "name": "鸡西市",
    "fullname": "鸡西市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230400",
    "areaId": "230400",
    "code": "230400",
    "name": "鹤岗市",
    "fullname": "鹤岗市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230500",
    "areaId": "230500",
    "code": "230500",
    "name": "双鸭山市",
    "fullname": "双鸭山市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230600",
    "areaId": "230600",
    "code": "230600",
    "name": "大庆市",
    "fullname": "大庆市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230700",
    "areaId": "230700",
    "code": "230700",
    "name": "伊春市",
    "fullname": "伊春市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230800",
    "areaId": "230800",
    "code": "230800",
    "name": "佳木斯市",
    "fullname": "佳木斯市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "230900",
    "areaId": "230900",
    "code": "230900",
    "name": "七台河市",
    "fullname": "七台河市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "231000",
    "areaId": "231000",
    "code": "231000",
    "name": "牡丹江市",
    "fullname": "牡丹江市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "231100",
    "areaId": "231100",
    "code": "231100",
    "name": "黑河市",
    "fullname": "黑河市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "231200",
    "areaId": "231200",
    "code": "231200",
    "name": "绥化市",
    "fullname": "绥化市",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "232700",
    "areaId": "232700",
    "code": "232700",
    "name": "大兴安岭地区",
    "fullname": "大兴安岭地区",
    "level": 2,
    "parentId": "230000"
  },
  {
    "id": "310100",
    "areaId": "310100",
    "code": "310100",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 2,
    "parentId": "310000"
  },
  {
    "id": "320100",
    "areaId": "320100",
    "code": "320100",
    "name": "南京市",
    "fullname": "南京市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320200",
    "areaId": "320200",
    "code": "320200",
    "name": "无锡市",
    "fullname": "无锡市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320300",
    "areaId": "320300",
    "code": "320300",
    "name": "徐州市",
    "fullname": "徐州市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320400",
    "areaId": "320400",
    "code": "320400",
    "name": "常州市",
    "fullname": "常州市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320500",
    "areaId": "320500",
    "code": "320500",
    "name": "苏州市",
    "fullname": "苏州市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320600",
    "areaId": "320600",
    "code": "320600",
    "name": "南通市",
    "fullname": "南通市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320700",
    "areaId": "320700",
    "code": "320700",
    "name": "连云港市",
    "fullname": "连云港市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320800",
    "areaId": "320800",
    "code": "320800",
    "name": "淮安市",
    "fullname": "淮安市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "320900",
    "areaId": "320900",
    "code": "320900",
    "name": "盐城市",
    "fullname": "盐城市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "321000",
    "areaId": "321000",
    "code": "321000",
    "name": "扬州市",
    "fullname": "扬州市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "321100",
    "areaId": "321100",
    "code": "321100",
    "name": "镇江市",
    "fullname": "镇江市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "321200",
    "areaId": "321200",
    "code": "321200",
    "name": "泰州市",
    "fullname": "泰州市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "321300",
    "areaId": "321300",
    "code": "321300",
    "name": "宿迁市",
    "fullname": "宿迁市",
    "level": 2,
    "parentId": "320000"
  },
  {
    "id": "330100",
    "areaId": "330100",
    "code": "330100",
    "name": "杭州市",
    "fullname": "杭州市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330200",
    "areaId": "330200",
    "code": "330200",
    "name": "宁波市",
    "fullname": "宁波市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330300",
    "areaId": "330300",
    "code": "330300",
    "name": "温州市",
    "fullname": "温州市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330400",
    "areaId": "330400",
    "code": "330400",
    "name": "嘉兴市",
    "fullname": "嘉兴市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330500",
    "areaId": "330500",
    "code": "330500",
    "name": "湖州市",
    "fullname": "湖州市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330600",
    "areaId": "330600",
    "code": "330600",
    "name": "绍兴市",
    "fullname": "绍兴市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330700",
    "areaId": "330700",
    "code": "330700",
    "name": "金华市",
    "fullname": "金华市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330800",
    "areaId": "330800",
    "code": "330800",
    "name": "衢州市",
    "fullname": "衢州市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "330900",
    "areaId": "330900",
    "code": "330900",
    "name": "舟山市",
    "fullname": "舟山市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "331000",
    "areaId": "331000",
    "code": "331000",
    "name": "台州市",
    "fullname": "台州市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "331100",
    "areaId": "331100",
    "code": "331100",
    "name": "丽水市",
    "fullname": "丽水市",
    "level": 2,
    "parentId": "330000"
  },
  {
    "id": "340100",
    "areaId": "340100",
    "code": "340100",
    "name": "合肥市",
    "fullname": "合肥市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "340200",
    "areaId": "340200",
    "code": "340200",
    "name": "芜湖市",
    "fullname": "芜湖市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "340300",
    "areaId": "340300",
    "code": "340300",
    "name": "蚌埠市",
    "fullname": "蚌埠市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "340400",
    "areaId": "340400",
    "code": "340400",
    "name": "淮南市",
    "fullname": "淮南市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "340500",
    "areaId": "340500",
    "code": "340500",
    "name": "马鞍山市",
    "fullname": "马鞍山市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "340600",
    "areaId": "340600",
    "code": "340600",
    "name": "淮北市",
    "fullname": "淮北市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "340700",
    "areaId": "340700",
    "code": "340700",
    "name": "铜陵市",
    "fullname": "铜陵市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "340800",
    "areaId": "340800",
    "code": "340800",
    "name": "安庆市",
    "fullname": "安庆市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341000",
    "areaId": "341000",
    "code": "341000",
    "name": "黄山市",
    "fullname": "黄山市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341100",
    "areaId": "341100",
    "code": "341100",
    "name": "滁州市",
    "fullname": "滁州市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341200",
    "areaId": "341200",
    "code": "341200",
    "name": "阜阳市",
    "fullname": "阜阳市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341300",
    "areaId": "341300",
    "code": "341300",
    "name": "宿州市",
    "fullname": "宿州市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341500",
    "areaId": "341500",
    "code": "341500",
    "name": "六安市",
    "fullname": "六安市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341600",
    "areaId": "341600",
    "code": "341600",
    "name": "亳州市",
    "fullname": "亳州市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341700",
    "areaId": "341700",
    "code": "341700",
    "name": "池州市",
    "fullname": "池州市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "341800",
    "areaId": "341800",
    "code": "341800",
    "name": "宣城市",
    "fullname": "宣城市",
    "level": 2,
    "parentId": "340000"
  },
  {
    "id": "350100",
    "areaId": "350100",
    "code": "350100",
    "name": "福州市",
    "fullname": "福州市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350200",
    "areaId": "350200",
    "code": "350200",
    "name": "厦门市",
    "fullname": "厦门市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350300",
    "areaId": "350300",
    "code": "350300",
    "name": "莆田市",
    "fullname": "莆田市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350400",
    "areaId": "350400",
    "code": "350400",
    "name": "三明市",
    "fullname": "三明市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350500",
    "areaId": "350500",
    "code": "350500",
    "name": "泉州市",
    "fullname": "泉州市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350600",
    "areaId": "350600",
    "code": "350600",
    "name": "漳州市",
    "fullname": "漳州市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350700",
    "areaId": "350700",
    "code": "350700",
    "name": "南平市",
    "fullname": "南平市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350800",
    "areaId": "350800",
    "code": "350800",
    "name": "龙岩市",
    "fullname": "龙岩市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "350900",
    "areaId": "350900",
    "code": "350900",
    "name": "宁德市",
    "fullname": "宁德市",
    "level": 2,
    "parentId": "350000"
  },
  {
    "id": "360100",
    "areaId": "360100",
    "code": "360100",
    "name": "南昌市",
    "fullname": "南昌市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360200",
    "areaId": "360200",
    "code": "360200",
    "name": "景德镇市",
    "fullname": "景德镇市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360300",
    "areaId": "360300",
    "code": "360300",
    "name": "萍乡市",
    "fullname": "萍乡市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360400",
    "areaId": "360400",
    "code": "360400",
    "name": "九江市",
    "fullname": "九江市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360500",
    "areaId": "360500",
    "code": "360500",
    "name": "新余市",
    "fullname": "新余市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360600",
    "areaId": "360600",
    "code": "360600",
    "name": "鹰潭市",
    "fullname": "鹰潭市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360700",
    "areaId": "360700",
    "code": "360700",
    "name": "赣州市",
    "fullname": "赣州市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360800",
    "areaId": "360800",
    "code": "360800",
    "name": "吉安市",
    "fullname": "吉安市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "360900",
    "areaId": "360900",
    "code": "360900",
    "name": "宜春市",
    "fullname": "宜春市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "361000",
    "areaId": "361000",
    "code": "361000",
    "name": "抚州市",
    "fullname": "抚州市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "361100",
    "areaId": "361100",
    "code": "361100",
    "name": "上饶市",
    "fullname": "上饶市",
    "level": 2,
    "parentId": "360000"
  },
  {
    "id": "370100",
    "areaId": "370100",
    "code": "370100",
    "name": "济南市",
    "fullname": "济南市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370200",
    "areaId": "370200",
    "code": "370200",
    "name": "青岛市",
    "fullname": "青岛市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370300",
    "areaId": "370300",
    "code": "370300",
    "name": "淄博市",
    "fullname": "淄博市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370400",
    "areaId": "370400",
    "code": "370400",
    "name": "枣庄市",
    "fullname": "枣庄市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370500",
    "areaId": "370500",
    "code": "370500",
    "name": "东营市",
    "fullname": "东营市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370600",
    "areaId": "370600",
    "code": "370600",
    "name": "烟台市",
    "fullname": "烟台市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370700",
    "areaId": "370700",
    "code": "370700",
    "name": "潍坊市",
    "fullname": "潍坊市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370800",
    "areaId": "370800",
    "code": "370800",
    "name": "济宁市",
    "fullname": "济宁市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "370900",
    "areaId": "370900",
    "code": "370900",
    "name": "泰安市",
    "fullname": "泰安市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "371000",
    "areaId": "371000",
    "code": "371000",
    "name": "威海市",
    "fullname": "威海市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "371100",
    "areaId": "371100",
    "code": "371100",
    "name": "日照市",
    "fullname": "日照市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "371300",
    "areaId": "371300",
    "code": "371300",
    "name": "临沂市",
    "fullname": "临沂市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "371400",
    "areaId": "371400",
    "code": "371400",
    "name": "德州市",
    "fullname": "德州市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "371500",
    "areaId": "371500",
    "code": "371500",
    "name": "聊城市",
    "fullname": "聊城市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "371600",
    "areaId": "371600",
    "code": "371600",
    "name": "滨州市",
    "fullname": "滨州市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "371700",
    "areaId": "371700",
    "code": "371700",
    "name": "菏泽市",
    "fullname": "菏泽市",
    "level": 2,
    "parentId": "370000"
  },
  {
    "id": "410100",
    "areaId": "410100",
    "code": "410100",
    "name": "郑州市",
    "fullname": "郑州市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410200",
    "areaId": "410200",
    "code": "410200",
    "name": "开封市",
    "fullname": "开封市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410300",
    "areaId": "410300",
    "code": "410300",
    "name": "洛阳市",
    "fullname": "洛阳市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410400",
    "areaId": "410400",
    "code": "410400",
    "name": "平顶山市",
    "fullname": "平顶山市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410500",
    "areaId": "410500",
    "code": "410500",
    "name": "安阳市",
    "fullname": "安阳市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410600",
    "areaId": "410600",
    "code": "410600",
    "name": "鹤壁市",
    "fullname": "鹤壁市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410700",
    "areaId": "410700",
    "code": "410700",
    "name": "新乡市",
    "fullname": "新乡市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410800",
    "areaId": "410800",
    "code": "410800",
    "name": "焦作市",
    "fullname": "焦作市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "410900",
    "areaId": "410900",
    "code": "410900",
    "name": "濮阳市",
    "fullname": "濮阳市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411000",
    "areaId": "411000",
    "code": "411000",
    "name": "许昌市",
    "fullname": "许昌市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411100",
    "areaId": "411100",
    "code": "411100",
    "name": "漯河市",
    "fullname": "漯河市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411200",
    "areaId": "411200",
    "code": "411200",
    "name": "三门峡市",
    "fullname": "三门峡市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411300",
    "areaId": "411300",
    "code": "411300",
    "name": "南阳市",
    "fullname": "南阳市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411400",
    "areaId": "411400",
    "code": "411400",
    "name": "商丘市",
    "fullname": "商丘市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411500",
    "areaId": "411500",
    "code": "411500",
    "name": "信阳市",
    "fullname": "信阳市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411600",
    "areaId": "411600",
    "code": "411600",
    "name": "周口市",
    "fullname": "周口市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "411700",
    "areaId": "411700",
    "code": "411700",
    "name": "驻马店市",
    "fullname": "驻马店市",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "419000",
    "areaId": "419000",
    "code": "419000",
    "name": "省直辖县级行政区划",
    "fullname": "省直辖县级行政区划",
    "level": 2,
    "parentId": "410000"
  },
  {
    "id": "420100",
    "areaId": "420100",
    "code": "420100",
    "name": "武汉市",
    "fullname": "武汉市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "420200",
    "areaId": "420200",
    "code": "420200",
    "name": "黄石市",
    "fullname": "黄石市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "420300",
    "areaId": "420300",
    "code": "420300",
    "name": "十堰市",
    "fullname": "十堰市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "420500",
    "areaId": "420500",
    "code": "420500",
    "name": "宜昌市",
    "fullname": "宜昌市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "420600",
    "areaId": "420600",
    "code": "420600",
    "name": "襄阳市",
    "fullname": "襄阳市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "420700",
    "areaId": "420700",
    "code": "420700",
    "name": "鄂州市",
    "fullname": "鄂州市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "420800",
    "areaId": "420800",
    "code": "420800",
    "name": "荆门市",
    "fullname": "荆门市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "420900",
    "areaId": "420900",
    "code": "420900",
    "name": "孝感市",
    "fullname": "孝感市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "421000",
    "areaId": "421000",
    "code": "421000",
    "name": "荆州市",
    "fullname": "荆州市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "421100",
    "areaId": "421100",
    "code": "421100",
    "name": "黄冈市",
    "fullname": "黄冈市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "421200",
    "areaId": "421200",
    "code": "421200",
    "name": "咸宁市",
    "fullname": "咸宁市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "421300",
    "areaId": "421300",
    "code": "421300",
    "name": "随州市",
    "fullname": "随州市",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "422800",
    "areaId": "422800",
    "code": "422800",
    "name": "恩施土家族苗族自治州",
    "fullname": "恩施土家族苗族自治州",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "429000",
    "areaId": "429000",
    "code": "429000",
    "name": "省直辖县级行政区划",
    "fullname": "省直辖县级行政区划",
    "level": 2,
    "parentId": "420000"
  },
  {
    "id": "430100",
    "areaId": "430100",
    "code": "430100",
    "name": "长沙市",
    "fullname": "长沙市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430200",
    "areaId": "430200",
    "code": "430200",
    "name": "株洲市",
    "fullname": "株洲市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430300",
    "areaId": "430300",
    "code": "430300",
    "name": "湘潭市",
    "fullname": "湘潭市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430400",
    "areaId": "430400",
    "code": "430400",
    "name": "衡阳市",
    "fullname": "衡阳市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430500",
    "areaId": "430500",
    "code": "430500",
    "name": "邵阳市",
    "fullname": "邵阳市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430600",
    "areaId": "430600",
    "code": "430600",
    "name": "岳阳市",
    "fullname": "岳阳市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430700",
    "areaId": "430700",
    "code": "430700",
    "name": "常德市",
    "fullname": "常德市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430800",
    "areaId": "430800",
    "code": "430800",
    "name": "张家界市",
    "fullname": "张家界市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "430900",
    "areaId": "430900",
    "code": "430900",
    "name": "益阳市",
    "fullname": "益阳市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "431000",
    "areaId": "431000",
    "code": "431000",
    "name": "郴州市",
    "fullname": "郴州市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "431100",
    "areaId": "431100",
    "code": "431100",
    "name": "永州市",
    "fullname": "永州市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "431200",
    "areaId": "431200",
    "code": "431200",
    "name": "怀化市",
    "fullname": "怀化市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "431300",
    "areaId": "431300",
    "code": "431300",
    "name": "娄底市",
    "fullname": "娄底市",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "433100",
    "areaId": "433100",
    "code": "433100",
    "name": "湘西土家族苗族自治州",
    "fullname": "湘西土家族苗族自治州",
    "level": 2,
    "parentId": "430000"
  },
  {
    "id": "440100",
    "areaId": "440100",
    "code": "440100",
    "name": "广州市",
    "fullname": "广州市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440200",
    "areaId": "440200",
    "code": "440200",
    "name": "韶关市",
    "fullname": "韶关市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440300",
    "areaId": "440300",
    "code": "440300",
    "name": "深圳市",
    "fullname": "深圳市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440400",
    "areaId": "440400",
    "code": "440400",
    "name": "珠海市",
    "fullname": "珠海市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440500",
    "areaId": "440500",
    "code": "440500",
    "name": "汕头市",
    "fullname": "汕头市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440600",
    "areaId": "440600",
    "code": "440600",
    "name": "佛山市",
    "fullname": "佛山市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440700",
    "areaId": "440700",
    "code": "440700",
    "name": "江门市",
    "fullname": "江门市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440800",
    "areaId": "440800",
    "code": "440800",
    "name": "湛江市",
    "fullname": "湛江市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "440900",
    "areaId": "440900",
    "code": "440900",
    "name": "茂名市",
    "fullname": "茂名市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441200",
    "areaId": "441200",
    "code": "441200",
    "name": "肇庆市",
    "fullname": "肇庆市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441300",
    "areaId": "441300",
    "code": "441300",
    "name": "惠州市",
    "fullname": "惠州市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441400",
    "areaId": "441400",
    "code": "441400",
    "name": "梅州市",
    "fullname": "梅州市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441500",
    "areaId": "441500",
    "code": "441500",
    "name": "汕尾市",
    "fullname": "汕尾市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441600",
    "areaId": "441600",
    "code": "441600",
    "name": "河源市",
    "fullname": "河源市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441700",
    "areaId": "441700",
    "code": "441700",
    "name": "阳江市",
    "fullname": "阳江市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441800",
    "areaId": "441800",
    "code": "441800",
    "name": "清远市",
    "fullname": "清远市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "441900",
    "areaId": "441900",
    "code": "441900",
    "name": "东莞市",
    "fullname": "东莞市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "442000",
    "areaId": "442000",
    "code": "442000",
    "name": "中山市",
    "fullname": "中山市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "445100",
    "areaId": "445100",
    "code": "445100",
    "name": "潮州市",
    "fullname": "潮州市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "445200",
    "areaId": "445200",
    "code": "445200",
    "name": "揭阳市",
    "fullname": "揭阳市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "445300",
    "areaId": "445300",
    "code": "445300",
    "name": "云浮市",
    "fullname": "云浮市",
    "level": 2,
    "parentId": "440000"
  },
  {
    "id": "450100",
    "areaId": "450100",
    "code": "450100",
    "name": "南宁市",
    "fullname": "南宁市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450200",
    "areaId": "450200",
    "code": "450200",
    "name": "柳州市",
    "fullname": "柳州市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450300",
    "areaId": "450300",
    "code": "450300",
    "name": "桂林市",
    "fullname": "桂林市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450400",
    "areaId": "450400",
    "code": "450400",
    "name": "梧州市",
    "fullname": "梧州市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450500",
    "areaId": "450500",
    "code": "450500",
    "name": "北海市",
    "fullname": "北海市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450600",
    "areaId": "450600",
    "code": "450600",
    "name": "防城港市",
    "fullname": "防城港市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450700",
    "areaId": "450700",
    "code": "450700",
    "name": "钦州市",
    "fullname": "钦州市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450800",
    "areaId": "450800",
    "code": "450800",
    "name": "贵港市",
    "fullname": "贵港市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "450900",
    "areaId": "450900",
    "code": "450900",
    "name": "玉林市",
    "fullname": "玉林市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "451000",
    "areaId": "451000",
    "code": "451000",
    "name": "百色市",
    "fullname": "百色市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "451100",
    "areaId": "451100",
    "code": "451100",
    "name": "贺州市",
    "fullname": "贺州市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "451200",
    "areaId": "451200",
    "code": "451200",
    "name": "河池市",
    "fullname": "河池市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "451300",
    "areaId": "451300",
    "code": "451300",
    "name": "来宾市",
    "fullname": "来宾市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "451400",
    "areaId": "451400",
    "code": "451400",
    "name": "崇左市",
    "fullname": "崇左市",
    "level": 2,
    "parentId": "450000"
  },
  {
    "id": "460100",
    "areaId": "460100",
    "code": "460100",
    "name": "海口市",
    "fullname": "海口市",
    "level": 2,
    "parentId": "460000"
  },
  {
    "id": "460200",
    "areaId": "460200",
    "code": "460200",
    "name": "三亚市",
    "fullname": "三亚市",
    "level": 2,
    "parentId": "460000"
  },
  {
    "id": "460300",
    "areaId": "460300",
    "code": "460300",
    "name": "三沙市",
    "fullname": "三沙市",
    "level": 2,
    "parentId": "460000"
  },
  {
    "id": "460400",
    "areaId": "460400",
    "code": "460400",
    "name": "儋州市",
    "fullname": "儋州市",
    "level": 2,
    "parentId": "460000"
  },
  {
    "id": "469000",
    "areaId": "469000",
    "code": "469000",
    "name": "省直辖县级行政区划",
    "fullname": "省直辖县级行政区划",
    "level": 2,
    "parentId": "460000"
  },
  {
    "id": "500100",
    "areaId": "500100",
    "code": "500100",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 2,
    "parentId": "500000"
  },
  {
    "id": "500200",
    "areaId": "500200",
    "code": "500200",
    "name": "县",
    "fullname": "县",
    "level": 2,
    "parentId": "500000"
  },
  {
    "id": "510100",
    "areaId": "510100",
    "code": "510100",
    "name": "成都市",
    "fullname": "成都市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "510300",
    "areaId": "510300",
    "code": "510300",
    "name": "自贡市",
    "fullname": "自贡市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "510400",
    "areaId": "510400",
    "code": "510400",
    "name": "攀枝花市",
    "fullname": "攀枝花市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "510500",
    "areaId": "510500",
    "code": "510500",
    "name": "泸州市",
    "fullname": "泸州市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "510600",
    "areaId": "510600",
    "code": "510600",
    "name": "德阳市",
    "fullname": "德阳市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "510700",
    "areaId": "510700",
    "code": "510700",
    "name": "绵阳市",
    "fullname": "绵阳市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "510800",
    "areaId": "510800",
    "code": "510800",
    "name": "广元市",
    "fullname": "广元市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "510900",
    "areaId": "510900",
    "code": "510900",
    "name": "遂宁市",
    "fullname": "遂宁市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511000",
    "areaId": "511000",
    "code": "511000",
    "name": "内江市",
    "fullname": "内江市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511100",
    "areaId": "511100",
    "code": "511100",
    "name": "乐山市",
    "fullname": "乐山市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511300",
    "areaId": "511300",
    "code": "511300",
    "name": "南充市",
    "fullname": "南充市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511400",
    "areaId": "511400",
    "code": "511400",
    "name": "眉山市",
    "fullname": "眉山市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511500",
    "areaId": "511500",
    "code": "511500",
    "name": "宜宾市",
    "fullname": "宜宾市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511600",
    "areaId": "511600",
    "code": "511600",
    "name": "广安市",
    "fullname": "广安市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511700",
    "areaId": "511700",
    "code": "511700",
    "name": "达州市",
    "fullname": "达州市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511800",
    "areaId": "511800",
    "code": "511800",
    "name": "雅安市",
    "fullname": "雅安市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "511900",
    "areaId": "511900",
    "code": "511900",
    "name": "巴中市",
    "fullname": "巴中市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "512000",
    "areaId": "512000",
    "code": "512000",
    "name": "资阳市",
    "fullname": "资阳市",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "513200",
    "areaId": "513200",
    "code": "513200",
    "name": "阿坝藏族羌族自治州",
    "fullname": "阿坝藏族羌族自治州",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "513300",
    "areaId": "513300",
    "code": "513300",
    "name": "甘孜藏族自治州",
    "fullname": "甘孜藏族自治州",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "513400",
    "areaId": "513400",
    "code": "513400",
    "name": "凉山彝族自治州",
    "fullname": "凉山彝族自治州",
    "level": 2,
    "parentId": "510000"
  },
  {
    "id": "520100",
    "areaId": "520100",
    "code": "520100",
    "name": "贵阳市",
    "fullname": "贵阳市",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "520200",
    "areaId": "520200",
    "code": "520200",
    "name": "六盘水市",
    "fullname": "六盘水市",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "520300",
    "areaId": "520300",
    "code": "520300",
    "name": "遵义市",
    "fullname": "遵义市",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "520400",
    "areaId": "520400",
    "code": "520400",
    "name": "安顺市",
    "fullname": "安顺市",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "520500",
    "areaId": "520500",
    "code": "520500",
    "name": "毕节市",
    "fullname": "毕节市",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "520600",
    "areaId": "520600",
    "code": "520600",
    "name": "铜仁市",
    "fullname": "铜仁市",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "522300",
    "areaId": "522300",
    "code": "522300",
    "name": "黔西南布依族苗族自治州",
    "fullname": "黔西南布依族苗族自治州",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "522600",
    "areaId": "522600",
    "code": "522600",
    "name": "黔东南苗族侗族自治州",
    "fullname": "黔东南苗族侗族自治州",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "522700",
    "areaId": "522700",
    "code": "522700",
    "name": "黔南布依族苗族自治州",
    "fullname": "黔南布依族苗族自治州",
    "level": 2,
    "parentId": "520000"
  },
  {
    "id": "530100",
    "areaId": "530100",
    "code": "530100",
    "name": "昆明市",
    "fullname": "昆明市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "530300",
    "areaId": "530300",
    "code": "530300",
    "name": "曲靖市",
    "fullname": "曲靖市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "530400",
    "areaId": "530400",
    "code": "530400",
    "name": "玉溪市",
    "fullname": "玉溪市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "530500",
    "areaId": "530500",
    "code": "530500",
    "name": "保山市",
    "fullname": "保山市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "530600",
    "areaId": "530600",
    "code": "530600",
    "name": "昭通市",
    "fullname": "昭通市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "530700",
    "areaId": "530700",
    "code": "530700",
    "name": "丽江市",
    "fullname": "丽江市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "530800",
    "areaId": "530800",
    "code": "530800",
    "name": "普洱市",
    "fullname": "普洱市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "530900",
    "areaId": "530900",
    "code": "530900",
    "name": "临沧市",
    "fullname": "临沧市",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "532300",
    "areaId": "532300",
    "code": "532300",
    "name": "楚雄彝族自治州",
    "fullname": "楚雄彝族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "532500",
    "areaId": "532500",
    "code": "532500",
    "name": "红河哈尼族彝族自治州",
    "fullname": "红河哈尼族彝族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "532600",
    "areaId": "532600",
    "code": "532600",
    "name": "文山壮族苗族自治州",
    "fullname": "文山壮族苗族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "532800",
    "areaId": "532800",
    "code": "532800",
    "name": "西双版纳傣族自治州",
    "fullname": "西双版纳傣族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "532900",
    "areaId": "532900",
    "code": "532900",
    "name": "大理白族自治州",
    "fullname": "大理白族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "533100",
    "areaId": "533100",
    "code": "533100",
    "name": "德宏傣族景颇族自治州",
    "fullname": "德宏傣族景颇族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "533300",
    "areaId": "533300",
    "code": "533300",
    "name": "怒江傈僳族自治州",
    "fullname": "怒江傈僳族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "533400",
    "areaId": "533400",
    "code": "533400",
    "name": "迪庆藏族自治州",
    "fullname": "迪庆藏族自治州",
    "level": 2,
    "parentId": "530000"
  },
  {
    "id": "540100",
    "areaId": "540100",
    "code": "540100",
    "name": "拉萨市",
    "fullname": "拉萨市",
    "level": 2,
    "parentId": "540000"
  },
  {
    "id": "540200",
    "areaId": "540200",
    "code": "540200",
    "name": "日喀则市",
    "fullname": "日喀则市",
    "level": 2,
    "parentId": "540000"
  },
  {
    "id": "540300",
    "areaId": "540300",
    "code": "540300",
    "name": "昌都市",
    "fullname": "昌都市",
    "level": 2,
    "parentId": "540000"
  },
  {
    "id": "540400",
    "areaId": "540400",
    "code": "540400",
    "name": "林芝市",
    "fullname": "林芝市",
    "level": 2,
    "parentId": "540000"
  },
  {
    "id": "540500",
    "areaId": "540500",
    "code": "540500",
    "name": "山南市",
    "fullname": "山南市",
    "level": 2,
    "parentId": "540000"
  },
  {
    "id": "540600",
    "areaId": "540600",
    "code": "540600",
    "name": "那曲市",
    "fullname": "那曲市",
    "level": 2,
    "parentId": "540000"
  },
  {
    "id": "542500",
    "areaId": "542500",
    "code": "542500",
    "name": "阿里地区",
    "fullname": "阿里地区",
    "level": 2,
    "parentId": "540000"
  },
  {
    "id": "610100",
    "areaId": "610100",
    "code": "610100",
    "name": "西安市",
    "fullname": "西安市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610200",
    "areaId": "610200",
    "code": "610200",
    "name": "铜川市",
    "fullname": "铜川市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610300",
    "areaId": "610300",
    "code": "610300",
    "name": "宝鸡市",
    "fullname": "宝鸡市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610400",
    "areaId": "610400",
    "code": "610400",
    "name": "咸阳市",
    "fullname": "咸阳市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610500",
    "areaId": "610500",
    "code": "610500",
    "name": "渭南市",
    "fullname": "渭南市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610600",
    "areaId": "610600",
    "code": "610600",
    "name": "延安市",
    "fullname": "延安市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610700",
    "areaId": "610700",
    "code": "610700",
    "name": "汉中市",
    "fullname": "汉中市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610800",
    "areaId": "610800",
    "code": "610800",
    "name": "榆林市",
    "fullname": "榆林市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "610900",
    "areaId": "610900",
    "code": "610900",
    "name": "安康市",
    "fullname": "安康市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "611000",
    "areaId": "611000",
    "code": "611000",
    "name": "商洛市",
    "fullname": "商洛市",
    "level": 2,
    "parentId": "610000"
  },
  {
    "id": "620100",
    "areaId": "620100",
    "code": "620100",
    "name": "兰州市",
    "fullname": "兰州市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620200",
    "areaId": "620200",
    "code": "620200",
    "name": "嘉峪关市",
    "fullname": "嘉峪关市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620300",
    "areaId": "620300",
    "code": "620300",
    "name": "金昌市",
    "fullname": "金昌市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620400",
    "areaId": "620400",
    "code": "620400",
    "name": "白银市",
    "fullname": "白银市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620500",
    "areaId": "620500",
    "code": "620500",
    "name": "天水市",
    "fullname": "天水市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620600",
    "areaId": "620600",
    "code": "620600",
    "name": "武威市",
    "fullname": "武威市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620700",
    "areaId": "620700",
    "code": "620700",
    "name": "张掖市",
    "fullname": "张掖市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620800",
    "areaId": "620800",
    "code": "620800",
    "name": "平凉市",
    "fullname": "平凉市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "620900",
    "areaId": "620900",
    "code": "620900",
    "name": "酒泉市",
    "fullname": "酒泉市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "621000",
    "areaId": "621000",
    "code": "621000",
    "name": "庆阳市",
    "fullname": "庆阳市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "621100",
    "areaId": "621100",
    "code": "621100",
    "name": "定西市",
    "fullname": "定西市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "621200",
    "areaId": "621200",
    "code": "621200",
    "name": "陇南市",
    "fullname": "陇南市",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "622900",
    "areaId": "622900",
    "code": "622900",
    "name": "临夏回族自治州",
    "fullname": "临夏回族自治州",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "623000",
    "areaId": "623000",
    "code": "623000",
    "name": "甘南藏族自治州",
    "fullname": "甘南藏族自治州",
    "level": 2,
    "parentId": "620000"
  },
  {
    "id": "630100",
    "areaId": "630100",
    "code": "630100",
    "name": "西宁市",
    "fullname": "西宁市",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "630200",
    "areaId": "630200",
    "code": "630200",
    "name": "海东市",
    "fullname": "海东市",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "632200",
    "areaId": "632200",
    "code": "632200",
    "name": "海北藏族自治州",
    "fullname": "海北藏族自治州",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "632300",
    "areaId": "632300",
    "code": "632300",
    "name": "黄南藏族自治州",
    "fullname": "黄南藏族自治州",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "632500",
    "areaId": "632500",
    "code": "632500",
    "name": "海南藏族自治州",
    "fullname": "海南藏族自治州",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "632600",
    "areaId": "632600",
    "code": "632600",
    "name": "果洛藏族自治州",
    "fullname": "果洛藏族自治州",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "632700",
    "areaId": "632700",
    "code": "632700",
    "name": "玉树藏族自治州",
    "fullname": "玉树藏族自治州",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "632800",
    "areaId": "632800",
    "code": "632800",
    "name": "海西蒙古族藏族自治州",
    "fullname": "海西蒙古族藏族自治州",
    "level": 2,
    "parentId": "630000"
  },
  {
    "id": "640100",
    "areaId": "640100",
    "code": "640100",
    "name": "银川市",
    "fullname": "银川市",
    "level": 2,
    "parentId": "640000"
  },
  {
    "id": "640200",
    "areaId": "640200",
    "code": "640200",
    "name": "石嘴山市",
    "fullname": "石嘴山市",
    "level": 2,
    "parentId": "640000"
  },
  {
    "id": "640300",
    "areaId": "640300",
    "code": "640300",
    "name": "吴忠市",
    "fullname": "吴忠市",
    "level": 2,
    "parentId": "640000"
  },
  {
    "id": "640400",
    "areaId": "640400",
    "code": "640400",
    "name": "固原市",
    "fullname": "固原市",
    "level": 2,
    "parentId": "640000"
  },
  {
    "id": "640500",
    "areaId": "640500",
    "code": "640500",
    "name": "中卫市",
    "fullname": "中卫市",
    "level": 2,
    "parentId": "640000"
  },
  {
    "id": "650100",
    "areaId": "650100",
    "code": "650100",
    "name": "乌鲁木齐市",
    "fullname": "乌鲁木齐市",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "650200",
    "areaId": "650200",
    "code": "650200",
    "name": "克拉玛依市",
    "fullname": "克拉玛依市",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "650400",
    "areaId": "650400",
    "code": "650400",
    "name": "吐鲁番市",
    "fullname": "吐鲁番市",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "650500",
    "areaId": "650500",
    "code": "650500",
    "name": "哈密市",
    "fullname": "哈密市",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "652300",
    "areaId": "652300",
    "code": "652300",
    "name": "昌吉回族自治州",
    "fullname": "昌吉回族自治州",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "652700",
    "areaId": "652700",
    "code": "652700",
    "name": "博尔塔拉蒙古自治州",
    "fullname": "博尔塔拉蒙古自治州",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "652800",
    "areaId": "652800",
    "code": "652800",
    "name": "巴音郭楞蒙古自治州",
    "fullname": "巴音郭楞蒙古自治州",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "652900",
    "areaId": "652900",
    "code": "652900",
    "name": "阿克苏地区",
    "fullname": "阿克苏地区",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "653000",
    "areaId": "653000",
    "code": "653000",
    "name": "克孜勒苏柯尔克孜自治州",
    "fullname": "克孜勒苏柯尔克孜自治州",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "653100",
    "areaId": "653100",
    "code": "653100",
    "name": "喀什地区",
    "fullname": "喀什地区",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "653200",
    "areaId": "653200",
    "code": "653200",
    "name": "和田地区",
    "fullname": "和田地区",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "654000",
    "areaId": "654000",
    "code": "654000",
    "name": "伊犁哈萨克自治州",
    "fullname": "伊犁哈萨克自治州",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "654200",
    "areaId": "654200",
    "code": "654200",
    "name": "塔城地区",
    "fullname": "塔城地区",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "654300",
    "areaId": "654300",
    "code": "654300",
    "name": "阿勒泰地区",
    "fullname": "阿勒泰地区",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "659000",
    "areaId": "659000",
    "code": "659000",
    "name": "自治区直辖县级行政区划",
    "fullname": "自治区直辖县级行政区划",
    "level": 2,
    "parentId": "650000"
  },
  {
    "id": "710100",
    "areaId": "710100",
    "code": "710100",
    "name": "台北市",
    "fullname": "台北市",
    "level": 2,
    "parentId": "710000"
  },
  {
    "id": "710200",
    "areaId": "710200",
    "code": "710200",
    "name": "高雄市",
    "fullname": "高雄市",
    "level": 2,
    "parentId": "710000"
  },
  {
    "id": "710300",
    "areaId": "710300",
    "code": "710300",
    "name": "基隆市",
    "fullname": "基隆市",
    "level": 2,
    "parentId": "710000"
  },
  {
    "id": "710400",
    "areaId": "710400",
    "code": "710400",
    "name": "台中市",
    "fullname": "台中市",
    "level": 2,
    "parentId": "710000"
  },
  {
    "id": "710500",
    "areaId": "710500",
    "code": "710500",
    "name": "台南市",
    "fullname": "台南市",
    "level": 2,
    "parentId": "710000"
  },
  {
    "id": "710600",
    "areaId": "710600",
    "code": "710600",
    "name": "新竹市",
    "fullname": "新竹市",
    "level": 2,
    "parentId": "710000"
  },
  {
    "id": "710700",
    "areaId": "710700",
    "code": "710700",
    "name": "嘉义市",
    "fullname": "嘉义市",
    "level": 2,
    "parentId": "710000"
  },
  {
    "id": "810001",
    "areaId": "810001",
    "code": "810001",
    "name": "中西區",
    "fullname": "中西區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810002",
    "areaId": "810002",
    "code": "810002",
    "name": "灣仔區",
    "fullname": "灣仔區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810003",
    "areaId": "810003",
    "code": "810003",
    "name": "東區",
    "fullname": "東區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810004",
    "areaId": "810004",
    "code": "810004",
    "name": "南區",
    "fullname": "南區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810005",
    "areaId": "810005",
    "code": "810005",
    "name": "油尖旺區",
    "fullname": "油尖旺區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810006",
    "areaId": "810006",
    "code": "810006",
    "name": "深水埗區",
    "fullname": "深水埗區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810007",
    "areaId": "810007",
    "code": "810007",
    "name": "九龍城區",
    "fullname": "九龍城區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810008",
    "areaId": "810008",
    "code": "810008",
    "name": "黃大仙區",
    "fullname": "黃大仙區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810009",
    "areaId": "810009",
    "code": "810009",
    "name": "觀塘區",
    "fullname": "觀塘區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810010",
    "areaId": "810010",
    "code": "810010",
    "name": "荃灣區",
    "fullname": "荃灣區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810011",
    "areaId": "810011",
    "code": "810011",
    "name": "屯門區",
    "fullname": "屯門區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810012",
    "areaId": "810012",
    "code": "810012",
    "name": "元朗區",
    "fullname": "元朗區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810013",
    "areaId": "810013",
    "code": "810013",
    "name": "北區",
    "fullname": "北區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810014",
    "areaId": "810014",
    "code": "810014",
    "name": "大埔區",
    "fullname": "大埔區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810015",
    "areaId": "810015",
    "code": "810015",
    "name": "西貢區",
    "fullname": "西貢區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810016",
    "areaId": "810016",
    "code": "810016",
    "name": "沙田區",
    "fullname": "沙田區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810017",
    "areaId": "810017",
    "code": "810017",
    "name": "葵青區",
    "fullname": "葵青區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "810018",
    "areaId": "810018",
    "code": "810018",
    "name": "離島區",
    "fullname": "離島區",
    "level": 2,
    "parentId": "810000"
  },
  {
    "id": "820001",
    "areaId": "820001",
    "code": "820001",
    "name": "花地瑪堂區",
    "fullname": "花地瑪堂區",
    "level": 2,
    "parentId": "820000"
  },
  {
    "id": "820002",
    "areaId": "820002",
    "code": "820002",
    "name": "花王堂區",
    "fullname": "花王堂區",
    "level": 2,
    "parentId": "820000"
  },
  {
    "id": "820003",
    "areaId": "820003",
    "code": "820003",
    "name": "望德堂區",
    "fullname": "望德堂區",
    "level": 2,
    "parentId": "820000"
  },
  {
    "id": "820004",
    "areaId": "820004",
    "code": "820004",
    "name": "大堂區",
    "fullname": "大堂區",
    "level": 2,
    "parentId": "820000"
  },
  {
    "id": "820005",
    "areaId": "820005",
    "code": "820005",
    "name": "風順堂區",
    "fullname": "風順堂區",
    "level": 2,
    "parentId": "820000"
  },
  {
    "id": "820006",
    "areaId": "820006",
    "code": "820006",
    "name": "嘉模堂區",
    "fullname": "嘉模堂區",
    "level": 2,
    "parentId": "820000"
  },
  {
    "id": "820007",
    "areaId": "820007",
    "code": "820007",
    "name": "路氹填海區",
    "fullname": "路氹填海區",
    "level": 2,
    "parentId": "820000"
  },
  {
    "id": "820008",
    "areaId": "820008",
    "code": "820008",
    "name": "聖方濟各堂區",
    "fullname": "聖方濟各堂區",
    "level": 2,
    "parentId": "820000"
  }
]

// 区县数据（完整的区县数据）
const counties = [
  {
    "id": "110101",
    "areaId": "110101",
    "code": "110101",
    "name": "东城区",
    "fullname": "东城区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110102",
    "areaId": "110102",
    "code": "110102",
    "name": "西城区",
    "fullname": "西城区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110105",
    "areaId": "110105",
    "code": "110105",
    "name": "朝阳区",
    "fullname": "朝阳区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110106",
    "areaId": "110106",
    "code": "110106",
    "name": "丰台区",
    "fullname": "丰台区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110107",
    "areaId": "110107",
    "code": "110107",
    "name": "石景山区",
    "fullname": "石景山区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110108",
    "areaId": "110108",
    "code": "110108",
    "name": "海淀区",
    "fullname": "海淀区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110109",
    "areaId": "110109",
    "code": "110109",
    "name": "门头沟区",
    "fullname": "门头沟区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110111",
    "areaId": "110111",
    "code": "110111",
    "name": "房山区",
    "fullname": "房山区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110112",
    "areaId": "110112",
    "code": "110112",
    "name": "通州区",
    "fullname": "通州区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110113",
    "areaId": "110113",
    "code": "110113",
    "name": "顺义区",
    "fullname": "顺义区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110114",
    "areaId": "110114",
    "code": "110114",
    "name": "昌平区",
    "fullname": "昌平区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110115",
    "areaId": "110115",
    "code": "110115",
    "name": "大兴区",
    "fullname": "大兴区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110116",
    "areaId": "110116",
    "code": "110116",
    "name": "怀柔区",
    "fullname": "怀柔区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110117",
    "areaId": "110117",
    "code": "110117",
    "name": "平谷区",
    "fullname": "平谷区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110118",
    "areaId": "110118",
    "code": "110118",
    "name": "密云区",
    "fullname": "密云区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "110119",
    "areaId": "110119",
    "code": "110119",
    "name": "延庆区",
    "fullname": "延庆区",
    "level": 3,
    "parentId": "110100"
  },
  {
    "id": "120101",
    "areaId": "120101",
    "code": "120101",
    "name": "和平区",
    "fullname": "和平区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120102",
    "areaId": "120102",
    "code": "120102",
    "name": "河东区",
    "fullname": "河东区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120103",
    "areaId": "120103",
    "code": "120103",
    "name": "河西区",
    "fullname": "河西区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120104",
    "areaId": "120104",
    "code": "120104",
    "name": "南开区",
    "fullname": "南开区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120105",
    "areaId": "120105",
    "code": "120105",
    "name": "河北区",
    "fullname": "河北区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120106",
    "areaId": "120106",
    "code": "120106",
    "name": "红桥区",
    "fullname": "红桥区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120110",
    "areaId": "120110",
    "code": "120110",
    "name": "东丽区",
    "fullname": "东丽区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120111",
    "areaId": "120111",
    "code": "120111",
    "name": "西青区",
    "fullname": "西青区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120112",
    "areaId": "120112",
    "code": "120112",
    "name": "津南区",
    "fullname": "津南区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120113",
    "areaId": "120113",
    "code": "120113",
    "name": "北辰区",
    "fullname": "北辰区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120114",
    "areaId": "120114",
    "code": "120114",
    "name": "武清区",
    "fullname": "武清区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120115",
    "areaId": "120115",
    "code": "120115",
    "name": "宝坻区",
    "fullname": "宝坻区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120116",
    "areaId": "120116",
    "code": "120116",
    "name": "滨海新区",
    "fullname": "滨海新区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120117",
    "areaId": "120117",
    "code": "120117",
    "name": "宁河区",
    "fullname": "宁河区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120118",
    "areaId": "120118",
    "code": "120118",
    "name": "静海区",
    "fullname": "静海区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "120119",
    "areaId": "120119",
    "code": "120119",
    "name": "蓟州区",
    "fullname": "蓟州区",
    "level": 3,
    "parentId": "120100"
  },
  {
    "id": "130101",
    "areaId": "130101",
    "code": "130101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130102",
    "areaId": "130102",
    "code": "130102",
    "name": "长安区",
    "fullname": "长安区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130104",
    "areaId": "130104",
    "code": "130104",
    "name": "桥西区",
    "fullname": "桥西区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130105",
    "areaId": "130105",
    "code": "130105",
    "name": "新华区",
    "fullname": "新华区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130107",
    "areaId": "130107",
    "code": "130107",
    "name": "井陉矿区",
    "fullname": "井陉矿区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130108",
    "areaId": "130108",
    "code": "130108",
    "name": "裕华区",
    "fullname": "裕华区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130109",
    "areaId": "130109",
    "code": "130109",
    "name": "藁城区",
    "fullname": "藁城区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130110",
    "areaId": "130110",
    "code": "130110",
    "name": "鹿泉区",
    "fullname": "鹿泉区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130111",
    "areaId": "130111",
    "code": "130111",
    "name": "栾城区",
    "fullname": "栾城区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130121",
    "areaId": "130121",
    "code": "130121",
    "name": "井陉县",
    "fullname": "井陉县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130123",
    "areaId": "130123",
    "code": "130123",
    "name": "正定县",
    "fullname": "正定县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130125",
    "areaId": "130125",
    "code": "130125",
    "name": "行唐县",
    "fullname": "行唐县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130126",
    "areaId": "130126",
    "code": "130126",
    "name": "灵寿县",
    "fullname": "灵寿县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130127",
    "areaId": "130127",
    "code": "130127",
    "name": "高邑县",
    "fullname": "高邑县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130128",
    "areaId": "130128",
    "code": "130128",
    "name": "深泽县",
    "fullname": "深泽县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130129",
    "areaId": "130129",
    "code": "130129",
    "name": "赞皇县",
    "fullname": "赞皇县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130130",
    "areaId": "130130",
    "code": "130130",
    "name": "无极县",
    "fullname": "无极县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130131",
    "areaId": "130131",
    "code": "130131",
    "name": "平山县",
    "fullname": "平山县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130132",
    "areaId": "130132",
    "code": "130132",
    "name": "元氏县",
    "fullname": "元氏县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130133",
    "areaId": "130133",
    "code": "130133",
    "name": "赵县",
    "fullname": "赵县",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130171",
    "areaId": "130171",
    "code": "130171",
    "name": "石家庄高新技术产业开发区",
    "fullname": "石家庄高新技术产业开发区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130172",
    "areaId": "130172",
    "code": "130172",
    "name": "石家庄循环化工园区",
    "fullname": "石家庄循环化工园区",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130181",
    "areaId": "130181",
    "code": "130181",
    "name": "辛集市",
    "fullname": "辛集市",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130183",
    "areaId": "130183",
    "code": "130183",
    "name": "晋州市",
    "fullname": "晋州市",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130184",
    "areaId": "130184",
    "code": "130184",
    "name": "新乐市",
    "fullname": "新乐市",
    "level": 3,
    "parentId": "130100"
  },
  {
    "id": "130201",
    "areaId": "130201",
    "code": "130201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130202",
    "areaId": "130202",
    "code": "130202",
    "name": "路南区",
    "fullname": "路南区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130203",
    "areaId": "130203",
    "code": "130203",
    "name": "路北区",
    "fullname": "路北区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130204",
    "areaId": "130204",
    "code": "130204",
    "name": "古冶区",
    "fullname": "古冶区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130205",
    "areaId": "130205",
    "code": "130205",
    "name": "开平区",
    "fullname": "开平区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130207",
    "areaId": "130207",
    "code": "130207",
    "name": "丰南区",
    "fullname": "丰南区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130208",
    "areaId": "130208",
    "code": "130208",
    "name": "丰润区",
    "fullname": "丰润区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130209",
    "areaId": "130209",
    "code": "130209",
    "name": "曹妃甸区",
    "fullname": "曹妃甸区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130224",
    "areaId": "130224",
    "code": "130224",
    "name": "滦南县",
    "fullname": "滦南县",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130225",
    "areaId": "130225",
    "code": "130225",
    "name": "乐亭县",
    "fullname": "乐亭县",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130227",
    "areaId": "130227",
    "code": "130227",
    "name": "迁西县",
    "fullname": "迁西县",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130229",
    "areaId": "130229",
    "code": "130229",
    "name": "玉田县",
    "fullname": "玉田县",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130271",
    "areaId": "130271",
    "code": "130271",
    "name": "河北唐山芦台经济开发区",
    "fullname": "河北唐山芦台经济开发区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130272",
    "areaId": "130272",
    "code": "130272",
    "name": "唐山市汉沽管理区",
    "fullname": "唐山市汉沽管理区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130273",
    "areaId": "130273",
    "code": "130273",
    "name": "唐山高新技术产业开发区",
    "fullname": "唐山高新技术产业开发区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130274",
    "areaId": "130274",
    "code": "130274",
    "name": "河北唐山海港经济开发区",
    "fullname": "河北唐山海港经济开发区",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130281",
    "areaId": "130281",
    "code": "130281",
    "name": "遵化市",
    "fullname": "遵化市",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130283",
    "areaId": "130283",
    "code": "130283",
    "name": "迁安市",
    "fullname": "迁安市",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130284",
    "areaId": "130284",
    "code": "130284",
    "name": "滦州市",
    "fullname": "滦州市",
    "level": 3,
    "parentId": "130200"
  },
  {
    "id": "130301",
    "areaId": "130301",
    "code": "130301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130302",
    "areaId": "130302",
    "code": "130302",
    "name": "海港区",
    "fullname": "海港区",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130303",
    "areaId": "130303",
    "code": "130303",
    "name": "山海关区",
    "fullname": "山海关区",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130304",
    "areaId": "130304",
    "code": "130304",
    "name": "北戴河区",
    "fullname": "北戴河区",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130306",
    "areaId": "130306",
    "code": "130306",
    "name": "抚宁区",
    "fullname": "抚宁区",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130321",
    "areaId": "130321",
    "code": "130321",
    "name": "青龙满族自治县",
    "fullname": "青龙满族自治县",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130322",
    "areaId": "130322",
    "code": "130322",
    "name": "昌黎县",
    "fullname": "昌黎县",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130324",
    "areaId": "130324",
    "code": "130324",
    "name": "卢龙县",
    "fullname": "卢龙县",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130371",
    "areaId": "130371",
    "code": "130371",
    "name": "秦皇岛市经济技术开发区",
    "fullname": "秦皇岛市经济技术开发区",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130372",
    "areaId": "130372",
    "code": "130372",
    "name": "北戴河新区",
    "fullname": "北戴河新区",
    "level": 3,
    "parentId": "130300"
  },
  {
    "id": "130401",
    "areaId": "130401",
    "code": "130401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130402",
    "areaId": "130402",
    "code": "130402",
    "name": "邯山区",
    "fullname": "邯山区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130403",
    "areaId": "130403",
    "code": "130403",
    "name": "丛台区",
    "fullname": "丛台区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130404",
    "areaId": "130404",
    "code": "130404",
    "name": "复兴区",
    "fullname": "复兴区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130406",
    "areaId": "130406",
    "code": "130406",
    "name": "峰峰矿区",
    "fullname": "峰峰矿区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130407",
    "areaId": "130407",
    "code": "130407",
    "name": "肥乡区",
    "fullname": "肥乡区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130408",
    "areaId": "130408",
    "code": "130408",
    "name": "永年区",
    "fullname": "永年区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130423",
    "areaId": "130423",
    "code": "130423",
    "name": "临漳县",
    "fullname": "临漳县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130424",
    "areaId": "130424",
    "code": "130424",
    "name": "成安县",
    "fullname": "成安县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130425",
    "areaId": "130425",
    "code": "130425",
    "name": "大名县",
    "fullname": "大名县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130426",
    "areaId": "130426",
    "code": "130426",
    "name": "涉县",
    "fullname": "涉县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130427",
    "areaId": "130427",
    "code": "130427",
    "name": "磁县",
    "fullname": "磁县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130430",
    "areaId": "130430",
    "code": "130430",
    "name": "邱县",
    "fullname": "邱县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130431",
    "areaId": "130431",
    "code": "130431",
    "name": "鸡泽县",
    "fullname": "鸡泽县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130432",
    "areaId": "130432",
    "code": "130432",
    "name": "广平县",
    "fullname": "广平县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130433",
    "areaId": "130433",
    "code": "130433",
    "name": "馆陶县",
    "fullname": "馆陶县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130434",
    "areaId": "130434",
    "code": "130434",
    "name": "魏县",
    "fullname": "魏县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130435",
    "areaId": "130435",
    "code": "130435",
    "name": "曲周县",
    "fullname": "曲周县",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130471",
    "areaId": "130471",
    "code": "130471",
    "name": "邯郸经济技术开发区",
    "fullname": "邯郸经济技术开发区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130473",
    "areaId": "130473",
    "code": "130473",
    "name": "邯郸冀南新区",
    "fullname": "邯郸冀南新区",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130481",
    "areaId": "130481",
    "code": "130481",
    "name": "武安市",
    "fullname": "武安市",
    "level": 3,
    "parentId": "130400"
  },
  {
    "id": "130501",
    "areaId": "130501",
    "code": "130501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130502",
    "areaId": "130502",
    "code": "130502",
    "name": "桥东区",
    "fullname": "桥东区",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130503",
    "areaId": "130503",
    "code": "130503",
    "name": "桥西区",
    "fullname": "桥西区",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130521",
    "areaId": "130521",
    "code": "130521",
    "name": "邢台县",
    "fullname": "邢台县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130522",
    "areaId": "130522",
    "code": "130522",
    "name": "临城县",
    "fullname": "临城县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130523",
    "areaId": "130523",
    "code": "130523",
    "name": "内丘县",
    "fullname": "内丘县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130524",
    "areaId": "130524",
    "code": "130524",
    "name": "柏乡县",
    "fullname": "柏乡县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130525",
    "areaId": "130525",
    "code": "130525",
    "name": "隆尧县",
    "fullname": "隆尧县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130526",
    "areaId": "130526",
    "code": "130526",
    "name": "任县",
    "fullname": "任县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130527",
    "areaId": "130527",
    "code": "130527",
    "name": "南和县",
    "fullname": "南和县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130528",
    "areaId": "130528",
    "code": "130528",
    "name": "宁晋县",
    "fullname": "宁晋县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130529",
    "areaId": "130529",
    "code": "130529",
    "name": "巨鹿县",
    "fullname": "巨鹿县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130530",
    "areaId": "130530",
    "code": "130530",
    "name": "新河县",
    "fullname": "新河县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130531",
    "areaId": "130531",
    "code": "130531",
    "name": "广宗县",
    "fullname": "广宗县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130532",
    "areaId": "130532",
    "code": "130532",
    "name": "平乡县",
    "fullname": "平乡县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130533",
    "areaId": "130533",
    "code": "130533",
    "name": "威县",
    "fullname": "威县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130534",
    "areaId": "130534",
    "code": "130534",
    "name": "清河县",
    "fullname": "清河县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130535",
    "areaId": "130535",
    "code": "130535",
    "name": "临西县",
    "fullname": "临西县",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130571",
    "areaId": "130571",
    "code": "130571",
    "name": "河北邢台经济开发区",
    "fullname": "河北邢台经济开发区",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130581",
    "areaId": "130581",
    "code": "130581",
    "name": "南宫市",
    "fullname": "南宫市",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130582",
    "areaId": "130582",
    "code": "130582",
    "name": "沙河市",
    "fullname": "沙河市",
    "level": 3,
    "parentId": "130500"
  },
  {
    "id": "130601",
    "areaId": "130601",
    "code": "130601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130602",
    "areaId": "130602",
    "code": "130602",
    "name": "竞秀区",
    "fullname": "竞秀区",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130606",
    "areaId": "130606",
    "code": "130606",
    "name": "莲池区",
    "fullname": "莲池区",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130607",
    "areaId": "130607",
    "code": "130607",
    "name": "满城区",
    "fullname": "满城区",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130608",
    "areaId": "130608",
    "code": "130608",
    "name": "清苑区",
    "fullname": "清苑区",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130609",
    "areaId": "130609",
    "code": "130609",
    "name": "徐水区",
    "fullname": "徐水区",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130623",
    "areaId": "130623",
    "code": "130623",
    "name": "涞水县",
    "fullname": "涞水县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130624",
    "areaId": "130624",
    "code": "130624",
    "name": "阜平县",
    "fullname": "阜平县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130626",
    "areaId": "130626",
    "code": "130626",
    "name": "定兴县",
    "fullname": "定兴县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130627",
    "areaId": "130627",
    "code": "130627",
    "name": "唐县",
    "fullname": "唐县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130628",
    "areaId": "130628",
    "code": "130628",
    "name": "高阳县",
    "fullname": "高阳县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130629",
    "areaId": "130629",
    "code": "130629",
    "name": "容城县",
    "fullname": "容城县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130630",
    "areaId": "130630",
    "code": "130630",
    "name": "涞源县",
    "fullname": "涞源县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130631",
    "areaId": "130631",
    "code": "130631",
    "name": "望都县",
    "fullname": "望都县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130632",
    "areaId": "130632",
    "code": "130632",
    "name": "安新县",
    "fullname": "安新县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130633",
    "areaId": "130633",
    "code": "130633",
    "name": "易县",
    "fullname": "易县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130634",
    "areaId": "130634",
    "code": "130634",
    "name": "曲阳县",
    "fullname": "曲阳县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130635",
    "areaId": "130635",
    "code": "130635",
    "name": "蠡县",
    "fullname": "蠡县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130636",
    "areaId": "130636",
    "code": "130636",
    "name": "顺平县",
    "fullname": "顺平县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130637",
    "areaId": "130637",
    "code": "130637",
    "name": "博野县",
    "fullname": "博野县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130638",
    "areaId": "130638",
    "code": "130638",
    "name": "雄县",
    "fullname": "雄县",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130671",
    "areaId": "130671",
    "code": "130671",
    "name": "保定高新技术产业开发区",
    "fullname": "保定高新技术产业开发区",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130672",
    "areaId": "130672",
    "code": "130672",
    "name": "保定白沟新城",
    "fullname": "保定白沟新城",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130681",
    "areaId": "130681",
    "code": "130681",
    "name": "涿州市",
    "fullname": "涿州市",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130682",
    "areaId": "130682",
    "code": "130682",
    "name": "定州市",
    "fullname": "定州市",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130683",
    "areaId": "130683",
    "code": "130683",
    "name": "安国市",
    "fullname": "安国市",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130684",
    "areaId": "130684",
    "code": "130684",
    "name": "高碑店市",
    "fullname": "高碑店市",
    "level": 3,
    "parentId": "130600"
  },
  {
    "id": "130701",
    "areaId": "130701",
    "code": "130701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130702",
    "areaId": "130702",
    "code": "130702",
    "name": "桥东区",
    "fullname": "桥东区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130703",
    "areaId": "130703",
    "code": "130703",
    "name": "桥西区",
    "fullname": "桥西区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130705",
    "areaId": "130705",
    "code": "130705",
    "name": "宣化区",
    "fullname": "宣化区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130706",
    "areaId": "130706",
    "code": "130706",
    "name": "下花园区",
    "fullname": "下花园区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130708",
    "areaId": "130708",
    "code": "130708",
    "name": "万全区",
    "fullname": "万全区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130709",
    "areaId": "130709",
    "code": "130709",
    "name": "崇礼区",
    "fullname": "崇礼区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130722",
    "areaId": "130722",
    "code": "130722",
    "name": "张北县",
    "fullname": "张北县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130723",
    "areaId": "130723",
    "code": "130723",
    "name": "康保县",
    "fullname": "康保县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130724",
    "areaId": "130724",
    "code": "130724",
    "name": "沽源县",
    "fullname": "沽源县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130725",
    "areaId": "130725",
    "code": "130725",
    "name": "尚义县",
    "fullname": "尚义县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130726",
    "areaId": "130726",
    "code": "130726",
    "name": "蔚县",
    "fullname": "蔚县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130727",
    "areaId": "130727",
    "code": "130727",
    "name": "阳原县",
    "fullname": "阳原县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130728",
    "areaId": "130728",
    "code": "130728",
    "name": "怀安县",
    "fullname": "怀安县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130730",
    "areaId": "130730",
    "code": "130730",
    "name": "怀来县",
    "fullname": "怀来县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130731",
    "areaId": "130731",
    "code": "130731",
    "name": "涿鹿县",
    "fullname": "涿鹿县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130732",
    "areaId": "130732",
    "code": "130732",
    "name": "赤城县",
    "fullname": "赤城县",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130771",
    "areaId": "130771",
    "code": "130771",
    "name": "张家口经济开发区",
    "fullname": "张家口经济开发区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130772",
    "areaId": "130772",
    "code": "130772",
    "name": "张家口市察北管理区",
    "fullname": "张家口市察北管理区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130773",
    "areaId": "130773",
    "code": "130773",
    "name": "张家口市塞北管理区",
    "fullname": "张家口市塞北管理区",
    "level": 3,
    "parentId": "130700"
  },
  {
    "id": "130801",
    "areaId": "130801",
    "code": "130801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130802",
    "areaId": "130802",
    "code": "130802",
    "name": "双桥区",
    "fullname": "双桥区",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130803",
    "areaId": "130803",
    "code": "130803",
    "name": "双滦区",
    "fullname": "双滦区",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130804",
    "areaId": "130804",
    "code": "130804",
    "name": "鹰手营子矿区",
    "fullname": "鹰手营子矿区",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130821",
    "areaId": "130821",
    "code": "130821",
    "name": "承德县",
    "fullname": "承德县",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130822",
    "areaId": "130822",
    "code": "130822",
    "name": "兴隆县",
    "fullname": "兴隆县",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130824",
    "areaId": "130824",
    "code": "130824",
    "name": "滦平县",
    "fullname": "滦平县",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130825",
    "areaId": "130825",
    "code": "130825",
    "name": "隆化县",
    "fullname": "隆化县",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130826",
    "areaId": "130826",
    "code": "130826",
    "name": "丰宁满族自治县",
    "fullname": "丰宁满族自治县",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130827",
    "areaId": "130827",
    "code": "130827",
    "name": "宽城满族自治县",
    "fullname": "宽城满族自治县",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130828",
    "areaId": "130828",
    "code": "130828",
    "name": "围场满族蒙古族自治县",
    "fullname": "围场满族蒙古族自治县",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130871",
    "areaId": "130871",
    "code": "130871",
    "name": "承德高新技术产业开发区",
    "fullname": "承德高新技术产业开发区",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130881",
    "areaId": "130881",
    "code": "130881",
    "name": "平泉市",
    "fullname": "平泉市",
    "level": 3,
    "parentId": "130800"
  },
  {
    "id": "130901",
    "areaId": "130901",
    "code": "130901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130902",
    "areaId": "130902",
    "code": "130902",
    "name": "新华区",
    "fullname": "新华区",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130903",
    "areaId": "130903",
    "code": "130903",
    "name": "运河区",
    "fullname": "运河区",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130921",
    "areaId": "130921",
    "code": "130921",
    "name": "沧县",
    "fullname": "沧县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130922",
    "areaId": "130922",
    "code": "130922",
    "name": "青县",
    "fullname": "青县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130923",
    "areaId": "130923",
    "code": "130923",
    "name": "东光县",
    "fullname": "东光县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130924",
    "areaId": "130924",
    "code": "130924",
    "name": "海兴县",
    "fullname": "海兴县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130925",
    "areaId": "130925",
    "code": "130925",
    "name": "盐山县",
    "fullname": "盐山县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130926",
    "areaId": "130926",
    "code": "130926",
    "name": "肃宁县",
    "fullname": "肃宁县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130927",
    "areaId": "130927",
    "code": "130927",
    "name": "南皮县",
    "fullname": "南皮县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130928",
    "areaId": "130928",
    "code": "130928",
    "name": "吴桥县",
    "fullname": "吴桥县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130929",
    "areaId": "130929",
    "code": "130929",
    "name": "献县",
    "fullname": "献县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130930",
    "areaId": "130930",
    "code": "130930",
    "name": "孟村回族自治县",
    "fullname": "孟村回族自治县",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130971",
    "areaId": "130971",
    "code": "130971",
    "name": "河北沧州经济开发区",
    "fullname": "河北沧州经济开发区",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130972",
    "areaId": "130972",
    "code": "130972",
    "name": "沧州高新技术产业开发区",
    "fullname": "沧州高新技术产业开发区",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130973",
    "areaId": "130973",
    "code": "130973",
    "name": "沧州渤海新区",
    "fullname": "沧州渤海新区",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130981",
    "areaId": "130981",
    "code": "130981",
    "name": "泊头市",
    "fullname": "泊头市",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130982",
    "areaId": "130982",
    "code": "130982",
    "name": "任丘市",
    "fullname": "任丘市",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130983",
    "areaId": "130983",
    "code": "130983",
    "name": "黄骅市",
    "fullname": "黄骅市",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "130984",
    "areaId": "130984",
    "code": "130984",
    "name": "河间市",
    "fullname": "河间市",
    "level": 3,
    "parentId": "130900"
  },
  {
    "id": "131001",
    "areaId": "131001",
    "code": "131001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131002",
    "areaId": "131002",
    "code": "131002",
    "name": "安次区",
    "fullname": "安次区",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131003",
    "areaId": "131003",
    "code": "131003",
    "name": "广阳区",
    "fullname": "广阳区",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131022",
    "areaId": "131022",
    "code": "131022",
    "name": "固安县",
    "fullname": "固安县",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131023",
    "areaId": "131023",
    "code": "131023",
    "name": "永清县",
    "fullname": "永清县",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131024",
    "areaId": "131024",
    "code": "131024",
    "name": "香河县",
    "fullname": "香河县",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131025",
    "areaId": "131025",
    "code": "131025",
    "name": "大城县",
    "fullname": "大城县",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131026",
    "areaId": "131026",
    "code": "131026",
    "name": "文安县",
    "fullname": "文安县",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131028",
    "areaId": "131028",
    "code": "131028",
    "name": "大厂回族自治县",
    "fullname": "大厂回族自治县",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131071",
    "areaId": "131071",
    "code": "131071",
    "name": "廊坊经济技术开发区",
    "fullname": "廊坊经济技术开发区",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131081",
    "areaId": "131081",
    "code": "131081",
    "name": "霸州市",
    "fullname": "霸州市",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131082",
    "areaId": "131082",
    "code": "131082",
    "name": "三河市",
    "fullname": "三河市",
    "level": 3,
    "parentId": "131000"
  },
  {
    "id": "131101",
    "areaId": "131101",
    "code": "131101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131102",
    "areaId": "131102",
    "code": "131102",
    "name": "桃城区",
    "fullname": "桃城区",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131103",
    "areaId": "131103",
    "code": "131103",
    "name": "冀州区",
    "fullname": "冀州区",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131121",
    "areaId": "131121",
    "code": "131121",
    "name": "枣强县",
    "fullname": "枣强县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131122",
    "areaId": "131122",
    "code": "131122",
    "name": "武邑县",
    "fullname": "武邑县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131123",
    "areaId": "131123",
    "code": "131123",
    "name": "武强县",
    "fullname": "武强县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131124",
    "areaId": "131124",
    "code": "131124",
    "name": "饶阳县",
    "fullname": "饶阳县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131125",
    "areaId": "131125",
    "code": "131125",
    "name": "安平县",
    "fullname": "安平县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131126",
    "areaId": "131126",
    "code": "131126",
    "name": "故城县",
    "fullname": "故城县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131127",
    "areaId": "131127",
    "code": "131127",
    "name": "景县",
    "fullname": "景县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131128",
    "areaId": "131128",
    "code": "131128",
    "name": "阜城县",
    "fullname": "阜城县",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131171",
    "areaId": "131171",
    "code": "131171",
    "name": "河北衡水高新技术产业开发区",
    "fullname": "河北衡水高新技术产业开发区",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131172",
    "areaId": "131172",
    "code": "131172",
    "name": "衡水滨湖新区",
    "fullname": "衡水滨湖新区",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "131182",
    "areaId": "131182",
    "code": "131182",
    "name": "深州市",
    "fullname": "深州市",
    "level": 3,
    "parentId": "131100"
  },
  {
    "id": "140101",
    "areaId": "140101",
    "code": "140101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140105",
    "areaId": "140105",
    "code": "140105",
    "name": "小店区",
    "fullname": "小店区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140106",
    "areaId": "140106",
    "code": "140106",
    "name": "迎泽区",
    "fullname": "迎泽区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140107",
    "areaId": "140107",
    "code": "140107",
    "name": "杏花岭区",
    "fullname": "杏花岭区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140108",
    "areaId": "140108",
    "code": "140108",
    "name": "尖草坪区",
    "fullname": "尖草坪区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140109",
    "areaId": "140109",
    "code": "140109",
    "name": "万柏林区",
    "fullname": "万柏林区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140110",
    "areaId": "140110",
    "code": "140110",
    "name": "晋源区",
    "fullname": "晋源区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140121",
    "areaId": "140121",
    "code": "140121",
    "name": "清徐县",
    "fullname": "清徐县",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140122",
    "areaId": "140122",
    "code": "140122",
    "name": "阳曲县",
    "fullname": "阳曲县",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140123",
    "areaId": "140123",
    "code": "140123",
    "name": "娄烦县",
    "fullname": "娄烦县",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140171",
    "areaId": "140171",
    "code": "140171",
    "name": "山西转型综合改革示范区",
    "fullname": "山西转型综合改革示范区",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140181",
    "areaId": "140181",
    "code": "140181",
    "name": "古交市",
    "fullname": "古交市",
    "level": 3,
    "parentId": "140100"
  },
  {
    "id": "140201",
    "areaId": "140201",
    "code": "140201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140212",
    "areaId": "140212",
    "code": "140212",
    "name": "新荣区",
    "fullname": "新荣区",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140213",
    "areaId": "140213",
    "code": "140213",
    "name": "平城区",
    "fullname": "平城区",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140214",
    "areaId": "140214",
    "code": "140214",
    "name": "云冈区",
    "fullname": "云冈区",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140215",
    "areaId": "140215",
    "code": "140215",
    "name": "云州区",
    "fullname": "云州区",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140221",
    "areaId": "140221",
    "code": "140221",
    "name": "阳高县",
    "fullname": "阳高县",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140222",
    "areaId": "140222",
    "code": "140222",
    "name": "天镇县",
    "fullname": "天镇县",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140223",
    "areaId": "140223",
    "code": "140223",
    "name": "广灵县",
    "fullname": "广灵县",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140224",
    "areaId": "140224",
    "code": "140224",
    "name": "灵丘县",
    "fullname": "灵丘县",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140225",
    "areaId": "140225",
    "code": "140225",
    "name": "浑源县",
    "fullname": "浑源县",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140226",
    "areaId": "140226",
    "code": "140226",
    "name": "左云县",
    "fullname": "左云县",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140271",
    "areaId": "140271",
    "code": "140271",
    "name": "山西大同经济开发区",
    "fullname": "山西大同经济开发区",
    "level": 3,
    "parentId": "140200"
  },
  {
    "id": "140301",
    "areaId": "140301",
    "code": "140301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140300"
  },
  {
    "id": "140302",
    "areaId": "140302",
    "code": "140302",
    "name": "城区",
    "fullname": "城区",
    "level": 3,
    "parentId": "140300"
  },
  {
    "id": "140303",
    "areaId": "140303",
    "code": "140303",
    "name": "矿区",
    "fullname": "矿区",
    "level": 3,
    "parentId": "140300"
  },
  {
    "id": "140311",
    "areaId": "140311",
    "code": "140311",
    "name": "郊区",
    "fullname": "郊区",
    "level": 3,
    "parentId": "140300"
  },
  {
    "id": "140321",
    "areaId": "140321",
    "code": "140321",
    "name": "平定县",
    "fullname": "平定县",
    "level": 3,
    "parentId": "140300"
  },
  {
    "id": "140322",
    "areaId": "140322",
    "code": "140322",
    "name": "盂县",
    "fullname": "盂县",
    "level": 3,
    "parentId": "140300"
  },
  {
    "id": "140401",
    "areaId": "140401",
    "code": "140401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140403",
    "areaId": "140403",
    "code": "140403",
    "name": "潞州区",
    "fullname": "潞州区",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140404",
    "areaId": "140404",
    "code": "140404",
    "name": "上党区",
    "fullname": "上党区",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140405",
    "areaId": "140405",
    "code": "140405",
    "name": "屯留区",
    "fullname": "屯留区",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140406",
    "areaId": "140406",
    "code": "140406",
    "name": "潞城区",
    "fullname": "潞城区",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140423",
    "areaId": "140423",
    "code": "140423",
    "name": "襄垣县",
    "fullname": "襄垣县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140425",
    "areaId": "140425",
    "code": "140425",
    "name": "平顺县",
    "fullname": "平顺县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140426",
    "areaId": "140426",
    "code": "140426",
    "name": "黎城县",
    "fullname": "黎城县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140427",
    "areaId": "140427",
    "code": "140427",
    "name": "壶关县",
    "fullname": "壶关县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140428",
    "areaId": "140428",
    "code": "140428",
    "name": "长子县",
    "fullname": "长子县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140429",
    "areaId": "140429",
    "code": "140429",
    "name": "武乡县",
    "fullname": "武乡县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140430",
    "areaId": "140430",
    "code": "140430",
    "name": "沁县",
    "fullname": "沁县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140431",
    "areaId": "140431",
    "code": "140431",
    "name": "沁源县",
    "fullname": "沁源县",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140471",
    "areaId": "140471",
    "code": "140471",
    "name": "山西长治高新技术产业园区",
    "fullname": "山西长治高新技术产业园区",
    "level": 3,
    "parentId": "140400"
  },
  {
    "id": "140501",
    "areaId": "140501",
    "code": "140501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140500"
  },
  {
    "id": "140502",
    "areaId": "140502",
    "code": "140502",
    "name": "城区",
    "fullname": "城区",
    "level": 3,
    "parentId": "140500"
  },
  {
    "id": "140521",
    "areaId": "140521",
    "code": "140521",
    "name": "沁水县",
    "fullname": "沁水县",
    "level": 3,
    "parentId": "140500"
  },
  {
    "id": "140522",
    "areaId": "140522",
    "code": "140522",
    "name": "阳城县",
    "fullname": "阳城县",
    "level": 3,
    "parentId": "140500"
  },
  {
    "id": "140524",
    "areaId": "140524",
    "code": "140524",
    "name": "陵川县",
    "fullname": "陵川县",
    "level": 3,
    "parentId": "140500"
  },
  {
    "id": "140525",
    "areaId": "140525",
    "code": "140525",
    "name": "泽州县",
    "fullname": "泽州县",
    "level": 3,
    "parentId": "140500"
  },
  {
    "id": "140581",
    "areaId": "140581",
    "code": "140581",
    "name": "高平市",
    "fullname": "高平市",
    "level": 3,
    "parentId": "140500"
  },
  {
    "id": "140601",
    "areaId": "140601",
    "code": "140601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140602",
    "areaId": "140602",
    "code": "140602",
    "name": "朔城区",
    "fullname": "朔城区",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140603",
    "areaId": "140603",
    "code": "140603",
    "name": "平鲁区",
    "fullname": "平鲁区",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140621",
    "areaId": "140621",
    "code": "140621",
    "name": "山阴县",
    "fullname": "山阴县",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140622",
    "areaId": "140622",
    "code": "140622",
    "name": "应县",
    "fullname": "应县",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140623",
    "areaId": "140623",
    "code": "140623",
    "name": "右玉县",
    "fullname": "右玉县",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140671",
    "areaId": "140671",
    "code": "140671",
    "name": "山西朔州经济开发区",
    "fullname": "山西朔州经济开发区",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140681",
    "areaId": "140681",
    "code": "140681",
    "name": "怀仁市",
    "fullname": "怀仁市",
    "level": 3,
    "parentId": "140600"
  },
  {
    "id": "140701",
    "areaId": "140701",
    "code": "140701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140702",
    "areaId": "140702",
    "code": "140702",
    "name": "榆次区",
    "fullname": "榆次区",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140721",
    "areaId": "140721",
    "code": "140721",
    "name": "榆社县",
    "fullname": "榆社县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140722",
    "areaId": "140722",
    "code": "140722",
    "name": "左权县",
    "fullname": "左权县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140723",
    "areaId": "140723",
    "code": "140723",
    "name": "和顺县",
    "fullname": "和顺县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140724",
    "areaId": "140724",
    "code": "140724",
    "name": "昔阳县",
    "fullname": "昔阳县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140725",
    "areaId": "140725",
    "code": "140725",
    "name": "寿阳县",
    "fullname": "寿阳县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140726",
    "areaId": "140726",
    "code": "140726",
    "name": "太谷县",
    "fullname": "太谷县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140727",
    "areaId": "140727",
    "code": "140727",
    "name": "祁县",
    "fullname": "祁县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140728",
    "areaId": "140728",
    "code": "140728",
    "name": "平遥县",
    "fullname": "平遥县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140729",
    "areaId": "140729",
    "code": "140729",
    "name": "灵石县",
    "fullname": "灵石县",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140781",
    "areaId": "140781",
    "code": "140781",
    "name": "介休市",
    "fullname": "介休市",
    "level": 3,
    "parentId": "140700"
  },
  {
    "id": "140801",
    "areaId": "140801",
    "code": "140801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140802",
    "areaId": "140802",
    "code": "140802",
    "name": "盐湖区",
    "fullname": "盐湖区",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140821",
    "areaId": "140821",
    "code": "140821",
    "name": "临猗县",
    "fullname": "临猗县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140822",
    "areaId": "140822",
    "code": "140822",
    "name": "万荣县",
    "fullname": "万荣县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140823",
    "areaId": "140823",
    "code": "140823",
    "name": "闻喜县",
    "fullname": "闻喜县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140824",
    "areaId": "140824",
    "code": "140824",
    "name": "稷山县",
    "fullname": "稷山县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140825",
    "areaId": "140825",
    "code": "140825",
    "name": "新绛县",
    "fullname": "新绛县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140826",
    "areaId": "140826",
    "code": "140826",
    "name": "绛县",
    "fullname": "绛县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140827",
    "areaId": "140827",
    "code": "140827",
    "name": "垣曲县",
    "fullname": "垣曲县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140828",
    "areaId": "140828",
    "code": "140828",
    "name": "夏县",
    "fullname": "夏县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140829",
    "areaId": "140829",
    "code": "140829",
    "name": "平陆县",
    "fullname": "平陆县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140830",
    "areaId": "140830",
    "code": "140830",
    "name": "芮城县",
    "fullname": "芮城县",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140881",
    "areaId": "140881",
    "code": "140881",
    "name": "永济市",
    "fullname": "永济市",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140882",
    "areaId": "140882",
    "code": "140882",
    "name": "河津市",
    "fullname": "河津市",
    "level": 3,
    "parentId": "140800"
  },
  {
    "id": "140901",
    "areaId": "140901",
    "code": "140901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140902",
    "areaId": "140902",
    "code": "140902",
    "name": "忻府区",
    "fullname": "忻府区",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140921",
    "areaId": "140921",
    "code": "140921",
    "name": "定襄县",
    "fullname": "定襄县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140922",
    "areaId": "140922",
    "code": "140922",
    "name": "五台县",
    "fullname": "五台县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140923",
    "areaId": "140923",
    "code": "140923",
    "name": "代县",
    "fullname": "代县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140924",
    "areaId": "140924",
    "code": "140924",
    "name": "繁峙县",
    "fullname": "繁峙县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140925",
    "areaId": "140925",
    "code": "140925",
    "name": "宁武县",
    "fullname": "宁武县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140926",
    "areaId": "140926",
    "code": "140926",
    "name": "静乐县",
    "fullname": "静乐县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140927",
    "areaId": "140927",
    "code": "140927",
    "name": "神池县",
    "fullname": "神池县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140928",
    "areaId": "140928",
    "code": "140928",
    "name": "五寨县",
    "fullname": "五寨县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140929",
    "areaId": "140929",
    "code": "140929",
    "name": "岢岚县",
    "fullname": "岢岚县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140930",
    "areaId": "140930",
    "code": "140930",
    "name": "河曲县",
    "fullname": "河曲县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140931",
    "areaId": "140931",
    "code": "140931",
    "name": "保德县",
    "fullname": "保德县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140932",
    "areaId": "140932",
    "code": "140932",
    "name": "偏关县",
    "fullname": "偏关县",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140971",
    "areaId": "140971",
    "code": "140971",
    "name": "五台山风景名胜区",
    "fullname": "五台山风景名胜区",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "140981",
    "areaId": "140981",
    "code": "140981",
    "name": "原平市",
    "fullname": "原平市",
    "level": 3,
    "parentId": "140900"
  },
  {
    "id": "141001",
    "areaId": "141001",
    "code": "141001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141002",
    "areaId": "141002",
    "code": "141002",
    "name": "尧都区",
    "fullname": "尧都区",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141021",
    "areaId": "141021",
    "code": "141021",
    "name": "曲沃县",
    "fullname": "曲沃县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141022",
    "areaId": "141022",
    "code": "141022",
    "name": "翼城县",
    "fullname": "翼城县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141023",
    "areaId": "141023",
    "code": "141023",
    "name": "襄汾县",
    "fullname": "襄汾县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141024",
    "areaId": "141024",
    "code": "141024",
    "name": "洪洞县",
    "fullname": "洪洞县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141025",
    "areaId": "141025",
    "code": "141025",
    "name": "古县",
    "fullname": "古县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141026",
    "areaId": "141026",
    "code": "141026",
    "name": "安泽县",
    "fullname": "安泽县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141027",
    "areaId": "141027",
    "code": "141027",
    "name": "浮山县",
    "fullname": "浮山县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141028",
    "areaId": "141028",
    "code": "141028",
    "name": "吉县",
    "fullname": "吉县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141029",
    "areaId": "141029",
    "code": "141029",
    "name": "乡宁县",
    "fullname": "乡宁县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141030",
    "areaId": "141030",
    "code": "141030",
    "name": "大宁县",
    "fullname": "大宁县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141031",
    "areaId": "141031",
    "code": "141031",
    "name": "隰县",
    "fullname": "隰县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141032",
    "areaId": "141032",
    "code": "141032",
    "name": "永和县",
    "fullname": "永和县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141033",
    "areaId": "141033",
    "code": "141033",
    "name": "蒲县",
    "fullname": "蒲县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141034",
    "areaId": "141034",
    "code": "141034",
    "name": "汾西县",
    "fullname": "汾西县",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141081",
    "areaId": "141081",
    "code": "141081",
    "name": "侯马市",
    "fullname": "侯马市",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141082",
    "areaId": "141082",
    "code": "141082",
    "name": "霍州市",
    "fullname": "霍州市",
    "level": 3,
    "parentId": "141000"
  },
  {
    "id": "141101",
    "areaId": "141101",
    "code": "141101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141102",
    "areaId": "141102",
    "code": "141102",
    "name": "离石区",
    "fullname": "离石区",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141121",
    "areaId": "141121",
    "code": "141121",
    "name": "文水县",
    "fullname": "文水县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141122",
    "areaId": "141122",
    "code": "141122",
    "name": "交城县",
    "fullname": "交城县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141123",
    "areaId": "141123",
    "code": "141123",
    "name": "兴县",
    "fullname": "兴县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141124",
    "areaId": "141124",
    "code": "141124",
    "name": "临县",
    "fullname": "临县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141125",
    "areaId": "141125",
    "code": "141125",
    "name": "柳林县",
    "fullname": "柳林县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141126",
    "areaId": "141126",
    "code": "141126",
    "name": "石楼县",
    "fullname": "石楼县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141127",
    "areaId": "141127",
    "code": "141127",
    "name": "岚县",
    "fullname": "岚县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141128",
    "areaId": "141128",
    "code": "141128",
    "name": "方山县",
    "fullname": "方山县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141129",
    "areaId": "141129",
    "code": "141129",
    "name": "中阳县",
    "fullname": "中阳县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141130",
    "areaId": "141130",
    "code": "141130",
    "name": "交口县",
    "fullname": "交口县",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141181",
    "areaId": "141181",
    "code": "141181",
    "name": "孝义市",
    "fullname": "孝义市",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "141182",
    "areaId": "141182",
    "code": "141182",
    "name": "汾阳市",
    "fullname": "汾阳市",
    "level": 3,
    "parentId": "141100"
  },
  {
    "id": "150101",
    "areaId": "150101",
    "code": "150101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150102",
    "areaId": "150102",
    "code": "150102",
    "name": "新城区",
    "fullname": "新城区",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150103",
    "areaId": "150103",
    "code": "150103",
    "name": "回民区",
    "fullname": "回民区",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150104",
    "areaId": "150104",
    "code": "150104",
    "name": "玉泉区",
    "fullname": "玉泉区",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150105",
    "areaId": "150105",
    "code": "150105",
    "name": "赛罕区",
    "fullname": "赛罕区",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150121",
    "areaId": "150121",
    "code": "150121",
    "name": "土默特左旗",
    "fullname": "土默特左旗",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150122",
    "areaId": "150122",
    "code": "150122",
    "name": "托克托县",
    "fullname": "托克托县",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150123",
    "areaId": "150123",
    "code": "150123",
    "name": "和林格尔县",
    "fullname": "和林格尔县",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150124",
    "areaId": "150124",
    "code": "150124",
    "name": "清水河县",
    "fullname": "清水河县",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150125",
    "areaId": "150125",
    "code": "150125",
    "name": "武川县",
    "fullname": "武川县",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150171",
    "areaId": "150171",
    "code": "150171",
    "name": "呼和浩特金海工业园区",
    "fullname": "呼和浩特金海工业园区",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150172",
    "areaId": "150172",
    "code": "150172",
    "name": "呼和浩特经济技术开发区",
    "fullname": "呼和浩特经济技术开发区",
    "level": 3,
    "parentId": "150100"
  },
  {
    "id": "150201",
    "areaId": "150201",
    "code": "150201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150202",
    "areaId": "150202",
    "code": "150202",
    "name": "东河区",
    "fullname": "东河区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150203",
    "areaId": "150203",
    "code": "150203",
    "name": "昆都仑区",
    "fullname": "昆都仑区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150204",
    "areaId": "150204",
    "code": "150204",
    "name": "青山区",
    "fullname": "青山区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150205",
    "areaId": "150205",
    "code": "150205",
    "name": "石拐区",
    "fullname": "石拐区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150206",
    "areaId": "150206",
    "code": "150206",
    "name": "白云鄂博矿区",
    "fullname": "白云鄂博矿区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150207",
    "areaId": "150207",
    "code": "150207",
    "name": "九原区",
    "fullname": "九原区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150221",
    "areaId": "150221",
    "code": "150221",
    "name": "土默特右旗",
    "fullname": "土默特右旗",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150222",
    "areaId": "150222",
    "code": "150222",
    "name": "固阳县",
    "fullname": "固阳县",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150223",
    "areaId": "150223",
    "code": "150223",
    "name": "达尔罕茂明安联合旗",
    "fullname": "达尔罕茂明安联合旗",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150271",
    "areaId": "150271",
    "code": "150271",
    "name": "包头稀土高新技术产业开发区",
    "fullname": "包头稀土高新技术产业开发区",
    "level": 3,
    "parentId": "150200"
  },
  {
    "id": "150301",
    "areaId": "150301",
    "code": "150301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150300"
  },
  {
    "id": "150302",
    "areaId": "150302",
    "code": "150302",
    "name": "海勃湾区",
    "fullname": "海勃湾区",
    "level": 3,
    "parentId": "150300"
  },
  {
    "id": "150303",
    "areaId": "150303",
    "code": "150303",
    "name": "海南区",
    "fullname": "海南区",
    "level": 3,
    "parentId": "150300"
  },
  {
    "id": "150304",
    "areaId": "150304",
    "code": "150304",
    "name": "乌达区",
    "fullname": "乌达区",
    "level": 3,
    "parentId": "150300"
  },
  {
    "id": "150401",
    "areaId": "150401",
    "code": "150401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150402",
    "areaId": "150402",
    "code": "150402",
    "name": "红山区",
    "fullname": "红山区",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150403",
    "areaId": "150403",
    "code": "150403",
    "name": "元宝山区",
    "fullname": "元宝山区",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150404",
    "areaId": "150404",
    "code": "150404",
    "name": "松山区",
    "fullname": "松山区",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150421",
    "areaId": "150421",
    "code": "150421",
    "name": "阿鲁科尔沁旗",
    "fullname": "阿鲁科尔沁旗",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150422",
    "areaId": "150422",
    "code": "150422",
    "name": "巴林左旗",
    "fullname": "巴林左旗",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150423",
    "areaId": "150423",
    "code": "150423",
    "name": "巴林右旗",
    "fullname": "巴林右旗",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150424",
    "areaId": "150424",
    "code": "150424",
    "name": "林西县",
    "fullname": "林西县",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150425",
    "areaId": "150425",
    "code": "150425",
    "name": "克什克腾旗",
    "fullname": "克什克腾旗",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150426",
    "areaId": "150426",
    "code": "150426",
    "name": "翁牛特旗",
    "fullname": "翁牛特旗",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150428",
    "areaId": "150428",
    "code": "150428",
    "name": "喀喇沁旗",
    "fullname": "喀喇沁旗",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150429",
    "areaId": "150429",
    "code": "150429",
    "name": "宁城县",
    "fullname": "宁城县",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150430",
    "areaId": "150430",
    "code": "150430",
    "name": "敖汉旗",
    "fullname": "敖汉旗",
    "level": 3,
    "parentId": "150400"
  },
  {
    "id": "150501",
    "areaId": "150501",
    "code": "150501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150502",
    "areaId": "150502",
    "code": "150502",
    "name": "科尔沁区",
    "fullname": "科尔沁区",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150521",
    "areaId": "150521",
    "code": "150521",
    "name": "科尔沁左翼中旗",
    "fullname": "科尔沁左翼中旗",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150522",
    "areaId": "150522",
    "code": "150522",
    "name": "科尔沁左翼后旗",
    "fullname": "科尔沁左翼后旗",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150523",
    "areaId": "150523",
    "code": "150523",
    "name": "开鲁县",
    "fullname": "开鲁县",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150524",
    "areaId": "150524",
    "code": "150524",
    "name": "库伦旗",
    "fullname": "库伦旗",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150525",
    "areaId": "150525",
    "code": "150525",
    "name": "奈曼旗",
    "fullname": "奈曼旗",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150526",
    "areaId": "150526",
    "code": "150526",
    "name": "扎鲁特旗",
    "fullname": "扎鲁特旗",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150571",
    "areaId": "150571",
    "code": "150571",
    "name": "通辽经济技术开发区",
    "fullname": "通辽经济技术开发区",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150581",
    "areaId": "150581",
    "code": "150581",
    "name": "霍林郭勒市",
    "fullname": "霍林郭勒市",
    "level": 3,
    "parentId": "150500"
  },
  {
    "id": "150601",
    "areaId": "150601",
    "code": "150601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150602",
    "areaId": "150602",
    "code": "150602",
    "name": "东胜区",
    "fullname": "东胜区",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150603",
    "areaId": "150603",
    "code": "150603",
    "name": "康巴什区",
    "fullname": "康巴什区",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150621",
    "areaId": "150621",
    "code": "150621",
    "name": "达拉特旗",
    "fullname": "达拉特旗",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150622",
    "areaId": "150622",
    "code": "150622",
    "name": "准格尔旗",
    "fullname": "准格尔旗",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150623",
    "areaId": "150623",
    "code": "150623",
    "name": "鄂托克前旗",
    "fullname": "鄂托克前旗",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150624",
    "areaId": "150624",
    "code": "150624",
    "name": "鄂托克旗",
    "fullname": "鄂托克旗",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150625",
    "areaId": "150625",
    "code": "150625",
    "name": "杭锦旗",
    "fullname": "杭锦旗",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150626",
    "areaId": "150626",
    "code": "150626",
    "name": "乌审旗",
    "fullname": "乌审旗",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150627",
    "areaId": "150627",
    "code": "150627",
    "name": "伊金霍洛旗",
    "fullname": "伊金霍洛旗",
    "level": 3,
    "parentId": "150600"
  },
  {
    "id": "150701",
    "areaId": "150701",
    "code": "150701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150702",
    "areaId": "150702",
    "code": "150702",
    "name": "海拉尔区",
    "fullname": "海拉尔区",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150703",
    "areaId": "150703",
    "code": "150703",
    "name": "扎赉诺尔区",
    "fullname": "扎赉诺尔区",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150721",
    "areaId": "150721",
    "code": "150721",
    "name": "阿荣旗",
    "fullname": "阿荣旗",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150722",
    "areaId": "150722",
    "code": "150722",
    "name": "莫力达瓦达斡尔族自治旗",
    "fullname": "莫力达瓦达斡尔族自治旗",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150723",
    "areaId": "150723",
    "code": "150723",
    "name": "鄂伦春自治旗",
    "fullname": "鄂伦春自治旗",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150724",
    "areaId": "150724",
    "code": "150724",
    "name": "鄂温克族自治旗",
    "fullname": "鄂温克族自治旗",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150725",
    "areaId": "150725",
    "code": "150725",
    "name": "陈巴尔虎旗",
    "fullname": "陈巴尔虎旗",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150726",
    "areaId": "150726",
    "code": "150726",
    "name": "新巴尔虎左旗",
    "fullname": "新巴尔虎左旗",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150727",
    "areaId": "150727",
    "code": "150727",
    "name": "新巴尔虎右旗",
    "fullname": "新巴尔虎右旗",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150781",
    "areaId": "150781",
    "code": "150781",
    "name": "满洲里市",
    "fullname": "满洲里市",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150782",
    "areaId": "150782",
    "code": "150782",
    "name": "牙克石市",
    "fullname": "牙克石市",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150783",
    "areaId": "150783",
    "code": "150783",
    "name": "扎兰屯市",
    "fullname": "扎兰屯市",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150784",
    "areaId": "150784",
    "code": "150784",
    "name": "额尔古纳市",
    "fullname": "额尔古纳市",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150785",
    "areaId": "150785",
    "code": "150785",
    "name": "根河市",
    "fullname": "根河市",
    "level": 3,
    "parentId": "150700"
  },
  {
    "id": "150801",
    "areaId": "150801",
    "code": "150801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150802",
    "areaId": "150802",
    "code": "150802",
    "name": "临河区",
    "fullname": "临河区",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150821",
    "areaId": "150821",
    "code": "150821",
    "name": "五原县",
    "fullname": "五原县",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150822",
    "areaId": "150822",
    "code": "150822",
    "name": "磴口县",
    "fullname": "磴口县",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150823",
    "areaId": "150823",
    "code": "150823",
    "name": "乌拉特前旗",
    "fullname": "乌拉特前旗",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150824",
    "areaId": "150824",
    "code": "150824",
    "name": "乌拉特中旗",
    "fullname": "乌拉特中旗",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150825",
    "areaId": "150825",
    "code": "150825",
    "name": "乌拉特后旗",
    "fullname": "乌拉特后旗",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150826",
    "areaId": "150826",
    "code": "150826",
    "name": "杭锦后旗",
    "fullname": "杭锦后旗",
    "level": 3,
    "parentId": "150800"
  },
  {
    "id": "150901",
    "areaId": "150901",
    "code": "150901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150902",
    "areaId": "150902",
    "code": "150902",
    "name": "集宁区",
    "fullname": "集宁区",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150921",
    "areaId": "150921",
    "code": "150921",
    "name": "卓资县",
    "fullname": "卓资县",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150922",
    "areaId": "150922",
    "code": "150922",
    "name": "化德县",
    "fullname": "化德县",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150923",
    "areaId": "150923",
    "code": "150923",
    "name": "商都县",
    "fullname": "商都县",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150924",
    "areaId": "150924",
    "code": "150924",
    "name": "兴和县",
    "fullname": "兴和县",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150925",
    "areaId": "150925",
    "code": "150925",
    "name": "凉城县",
    "fullname": "凉城县",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150926",
    "areaId": "150926",
    "code": "150926",
    "name": "察哈尔右翼前旗",
    "fullname": "察哈尔右翼前旗",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150927",
    "areaId": "150927",
    "code": "150927",
    "name": "察哈尔右翼中旗",
    "fullname": "察哈尔右翼中旗",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150928",
    "areaId": "150928",
    "code": "150928",
    "name": "察哈尔右翼后旗",
    "fullname": "察哈尔右翼后旗",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150929",
    "areaId": "150929",
    "code": "150929",
    "name": "四子王旗",
    "fullname": "四子王旗",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "150981",
    "areaId": "150981",
    "code": "150981",
    "name": "丰镇市",
    "fullname": "丰镇市",
    "level": 3,
    "parentId": "150900"
  },
  {
    "id": "152201",
    "areaId": "152201",
    "code": "152201",
    "name": "乌兰浩特市",
    "fullname": "乌兰浩特市",
    "level": 3,
    "parentId": "152200"
  },
  {
    "id": "152202",
    "areaId": "152202",
    "code": "152202",
    "name": "阿尔山市",
    "fullname": "阿尔山市",
    "level": 3,
    "parentId": "152200"
  },
  {
    "id": "152221",
    "areaId": "152221",
    "code": "152221",
    "name": "科尔沁右翼前旗",
    "fullname": "科尔沁右翼前旗",
    "level": 3,
    "parentId": "152200"
  },
  {
    "id": "152222",
    "areaId": "152222",
    "code": "152222",
    "name": "科尔沁右翼中旗",
    "fullname": "科尔沁右翼中旗",
    "level": 3,
    "parentId": "152200"
  },
  {
    "id": "152223",
    "areaId": "152223",
    "code": "152223",
    "name": "扎赉特旗",
    "fullname": "扎赉特旗",
    "level": 3,
    "parentId": "152200"
  },
  {
    "id": "152224",
    "areaId": "152224",
    "code": "152224",
    "name": "突泉县",
    "fullname": "突泉县",
    "level": 3,
    "parentId": "152200"
  },
  {
    "id": "152501",
    "areaId": "152501",
    "code": "152501",
    "name": "二连浩特市",
    "fullname": "二连浩特市",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152502",
    "areaId": "152502",
    "code": "152502",
    "name": "锡林浩特市",
    "fullname": "锡林浩特市",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152522",
    "areaId": "152522",
    "code": "152522",
    "name": "阿巴嘎旗",
    "fullname": "阿巴嘎旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152523",
    "areaId": "152523",
    "code": "152523",
    "name": "苏尼特左旗",
    "fullname": "苏尼特左旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152524",
    "areaId": "152524",
    "code": "152524",
    "name": "苏尼特右旗",
    "fullname": "苏尼特右旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152525",
    "areaId": "152525",
    "code": "152525",
    "name": "东乌珠穆沁旗",
    "fullname": "东乌珠穆沁旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152526",
    "areaId": "152526",
    "code": "152526",
    "name": "西乌珠穆沁旗",
    "fullname": "西乌珠穆沁旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152527",
    "areaId": "152527",
    "code": "152527",
    "name": "太仆寺旗",
    "fullname": "太仆寺旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152528",
    "areaId": "152528",
    "code": "152528",
    "name": "镶黄旗",
    "fullname": "镶黄旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152529",
    "areaId": "152529",
    "code": "152529",
    "name": "正镶白旗",
    "fullname": "正镶白旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152530",
    "areaId": "152530",
    "code": "152530",
    "name": "正蓝旗",
    "fullname": "正蓝旗",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152531",
    "areaId": "152531",
    "code": "152531",
    "name": "多伦县",
    "fullname": "多伦县",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152571",
    "areaId": "152571",
    "code": "152571",
    "name": "乌拉盖管委会",
    "fullname": "乌拉盖管委会",
    "level": 3,
    "parentId": "152500"
  },
  {
    "id": "152921",
    "areaId": "152921",
    "code": "152921",
    "name": "阿拉善左旗",
    "fullname": "阿拉善左旗",
    "level": 3,
    "parentId": "152900"
  },
  {
    "id": "152922",
    "areaId": "152922",
    "code": "152922",
    "name": "阿拉善右旗",
    "fullname": "阿拉善右旗",
    "level": 3,
    "parentId": "152900"
  },
  {
    "id": "152923",
    "areaId": "152923",
    "code": "152923",
    "name": "额济纳旗",
    "fullname": "额济纳旗",
    "level": 3,
    "parentId": "152900"
  },
  {
    "id": "152971",
    "areaId": "152971",
    "code": "152971",
    "name": "内蒙古阿拉善经济开发区",
    "fullname": "内蒙古阿拉善经济开发区",
    "level": 3,
    "parentId": "152900"
  },
  {
    "id": "210101",
    "areaId": "210101",
    "code": "210101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210102",
    "areaId": "210102",
    "code": "210102",
    "name": "和平区",
    "fullname": "和平区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210103",
    "areaId": "210103",
    "code": "210103",
    "name": "沈河区",
    "fullname": "沈河区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210104",
    "areaId": "210104",
    "code": "210104",
    "name": "大东区",
    "fullname": "大东区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210105",
    "areaId": "210105",
    "code": "210105",
    "name": "皇姑区",
    "fullname": "皇姑区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210106",
    "areaId": "210106",
    "code": "210106",
    "name": "铁西区",
    "fullname": "铁西区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210111",
    "areaId": "210111",
    "code": "210111",
    "name": "苏家屯区",
    "fullname": "苏家屯区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210112",
    "areaId": "210112",
    "code": "210112",
    "name": "浑南区",
    "fullname": "浑南区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210113",
    "areaId": "210113",
    "code": "210113",
    "name": "沈北新区",
    "fullname": "沈北新区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210114",
    "areaId": "210114",
    "code": "210114",
    "name": "于洪区",
    "fullname": "于洪区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210115",
    "areaId": "210115",
    "code": "210115",
    "name": "辽中区",
    "fullname": "辽中区",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210123",
    "areaId": "210123",
    "code": "210123",
    "name": "康平县",
    "fullname": "康平县",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210124",
    "areaId": "210124",
    "code": "210124",
    "name": "法库县",
    "fullname": "法库县",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210181",
    "areaId": "210181",
    "code": "210181",
    "name": "新民市",
    "fullname": "新民市",
    "level": 3,
    "parentId": "210100"
  },
  {
    "id": "210201",
    "areaId": "210201",
    "code": "210201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210202",
    "areaId": "210202",
    "code": "210202",
    "name": "中山区",
    "fullname": "中山区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210203",
    "areaId": "210203",
    "code": "210203",
    "name": "西岗区",
    "fullname": "西岗区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210204",
    "areaId": "210204",
    "code": "210204",
    "name": "沙河口区",
    "fullname": "沙河口区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210211",
    "areaId": "210211",
    "code": "210211",
    "name": "甘井子区",
    "fullname": "甘井子区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210212",
    "areaId": "210212",
    "code": "210212",
    "name": "旅顺口区",
    "fullname": "旅顺口区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210213",
    "areaId": "210213",
    "code": "210213",
    "name": "金州区",
    "fullname": "金州区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210214",
    "areaId": "210214",
    "code": "210214",
    "name": "普兰店区",
    "fullname": "普兰店区",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210224",
    "areaId": "210224",
    "code": "210224",
    "name": "长海县",
    "fullname": "长海县",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210281",
    "areaId": "210281",
    "code": "210281",
    "name": "瓦房店市",
    "fullname": "瓦房店市",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210283",
    "areaId": "210283",
    "code": "210283",
    "name": "庄河市",
    "fullname": "庄河市",
    "level": 3,
    "parentId": "210200"
  },
  {
    "id": "210301",
    "areaId": "210301",
    "code": "210301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210302",
    "areaId": "210302",
    "code": "210302",
    "name": "铁东区",
    "fullname": "铁东区",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210303",
    "areaId": "210303",
    "code": "210303",
    "name": "铁西区",
    "fullname": "铁西区",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210304",
    "areaId": "210304",
    "code": "210304",
    "name": "立山区",
    "fullname": "立山区",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210311",
    "areaId": "210311",
    "code": "210311",
    "name": "千山区",
    "fullname": "千山区",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210321",
    "areaId": "210321",
    "code": "210321",
    "name": "台安县",
    "fullname": "台安县",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210323",
    "areaId": "210323",
    "code": "210323",
    "name": "岫岩满族自治县",
    "fullname": "岫岩满族自治县",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210381",
    "areaId": "210381",
    "code": "210381",
    "name": "海城市",
    "fullname": "海城市",
    "level": 3,
    "parentId": "210300"
  },
  {
    "id": "210401",
    "areaId": "210401",
    "code": "210401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210402",
    "areaId": "210402",
    "code": "210402",
    "name": "新抚区",
    "fullname": "新抚区",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210403",
    "areaId": "210403",
    "code": "210403",
    "name": "东洲区",
    "fullname": "东洲区",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210404",
    "areaId": "210404",
    "code": "210404",
    "name": "望花区",
    "fullname": "望花区",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210411",
    "areaId": "210411",
    "code": "210411",
    "name": "顺城区",
    "fullname": "顺城区",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210421",
    "areaId": "210421",
    "code": "210421",
    "name": "抚顺县",
    "fullname": "抚顺县",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210422",
    "areaId": "210422",
    "code": "210422",
    "name": "新宾满族自治县",
    "fullname": "新宾满族自治县",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210423",
    "areaId": "210423",
    "code": "210423",
    "name": "清原满族自治县",
    "fullname": "清原满族自治县",
    "level": 3,
    "parentId": "210400"
  },
  {
    "id": "210501",
    "areaId": "210501",
    "code": "210501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210500"
  },
  {
    "id": "210502",
    "areaId": "210502",
    "code": "210502",
    "name": "平山区",
    "fullname": "平山区",
    "level": 3,
    "parentId": "210500"
  },
  {
    "id": "210503",
    "areaId": "210503",
    "code": "210503",
    "name": "溪湖区",
    "fullname": "溪湖区",
    "level": 3,
    "parentId": "210500"
  },
  {
    "id": "210504",
    "areaId": "210504",
    "code": "210504",
    "name": "明山区",
    "fullname": "明山区",
    "level": 3,
    "parentId": "210500"
  },
  {
    "id": "210505",
    "areaId": "210505",
    "code": "210505",
    "name": "南芬区",
    "fullname": "南芬区",
    "level": 3,
    "parentId": "210500"
  },
  {
    "id": "210521",
    "areaId": "210521",
    "code": "210521",
    "name": "本溪满族自治县",
    "fullname": "本溪满族自治县",
    "level": 3,
    "parentId": "210500"
  },
  {
    "id": "210522",
    "areaId": "210522",
    "code": "210522",
    "name": "桓仁满族自治县",
    "fullname": "桓仁满族自治县",
    "level": 3,
    "parentId": "210500"
  },
  {
    "id": "210601",
    "areaId": "210601",
    "code": "210601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210600"
  },
  {
    "id": "210602",
    "areaId": "210602",
    "code": "210602",
    "name": "元宝区",
    "fullname": "元宝区",
    "level": 3,
    "parentId": "210600"
  },
  {
    "id": "210603",
    "areaId": "210603",
    "code": "210603",
    "name": "振兴区",
    "fullname": "振兴区",
    "level": 3,
    "parentId": "210600"
  },
  {
    "id": "210604",
    "areaId": "210604",
    "code": "210604",
    "name": "振安区",
    "fullname": "振安区",
    "level": 3,
    "parentId": "210600"
  },
  {
    "id": "210624",
    "areaId": "210624",
    "code": "210624",
    "name": "宽甸满族自治县",
    "fullname": "宽甸满族自治县",
    "level": 3,
    "parentId": "210600"
  },
  {
    "id": "210681",
    "areaId": "210681",
    "code": "210681",
    "name": "东港市",
    "fullname": "东港市",
    "level": 3,
    "parentId": "210600"
  },
  {
    "id": "210682",
    "areaId": "210682",
    "code": "210682",
    "name": "凤城市",
    "fullname": "凤城市",
    "level": 3,
    "parentId": "210600"
  },
  {
    "id": "210701",
    "areaId": "210701",
    "code": "210701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210702",
    "areaId": "210702",
    "code": "210702",
    "name": "古塔区",
    "fullname": "古塔区",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210703",
    "areaId": "210703",
    "code": "210703",
    "name": "凌河区",
    "fullname": "凌河区",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210711",
    "areaId": "210711",
    "code": "210711",
    "name": "太和区",
    "fullname": "太和区",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210726",
    "areaId": "210726",
    "code": "210726",
    "name": "黑山县",
    "fullname": "黑山县",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210727",
    "areaId": "210727",
    "code": "210727",
    "name": "义县",
    "fullname": "义县",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210781",
    "areaId": "210781",
    "code": "210781",
    "name": "凌海市",
    "fullname": "凌海市",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210782",
    "areaId": "210782",
    "code": "210782",
    "name": "北镇市",
    "fullname": "北镇市",
    "level": 3,
    "parentId": "210700"
  },
  {
    "id": "210801",
    "areaId": "210801",
    "code": "210801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210800"
  },
  {
    "id": "210802",
    "areaId": "210802",
    "code": "210802",
    "name": "站前区",
    "fullname": "站前区",
    "level": 3,
    "parentId": "210800"
  },
  {
    "id": "210803",
    "areaId": "210803",
    "code": "210803",
    "name": "西市区",
    "fullname": "西市区",
    "level": 3,
    "parentId": "210800"
  },
  {
    "id": "210804",
    "areaId": "210804",
    "code": "210804",
    "name": "鲅鱼圈区",
    "fullname": "鲅鱼圈区",
    "level": 3,
    "parentId": "210800"
  },
  {
    "id": "210811",
    "areaId": "210811",
    "code": "210811",
    "name": "老边区",
    "fullname": "老边区",
    "level": 3,
    "parentId": "210800"
  },
  {
    "id": "210881",
    "areaId": "210881",
    "code": "210881",
    "name": "盖州市",
    "fullname": "盖州市",
    "level": 3,
    "parentId": "210800"
  },
  {
    "id": "210882",
    "areaId": "210882",
    "code": "210882",
    "name": "大石桥市",
    "fullname": "大石桥市",
    "level": 3,
    "parentId": "210800"
  },
  {
    "id": "210901",
    "areaId": "210901",
    "code": "210901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "210902",
    "areaId": "210902",
    "code": "210902",
    "name": "海州区",
    "fullname": "海州区",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "210903",
    "areaId": "210903",
    "code": "210903",
    "name": "新邱区",
    "fullname": "新邱区",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "210904",
    "areaId": "210904",
    "code": "210904",
    "name": "太平区",
    "fullname": "太平区",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "210905",
    "areaId": "210905",
    "code": "210905",
    "name": "清河门区",
    "fullname": "清河门区",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "210911",
    "areaId": "210911",
    "code": "210911",
    "name": "细河区",
    "fullname": "细河区",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "210921",
    "areaId": "210921",
    "code": "210921",
    "name": "阜新蒙古族自治县",
    "fullname": "阜新蒙古族自治县",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "210922",
    "areaId": "210922",
    "code": "210922",
    "name": "彰武县",
    "fullname": "彰武县",
    "level": 3,
    "parentId": "210900"
  },
  {
    "id": "211001",
    "areaId": "211001",
    "code": "211001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211002",
    "areaId": "211002",
    "code": "211002",
    "name": "白塔区",
    "fullname": "白塔区",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211003",
    "areaId": "211003",
    "code": "211003",
    "name": "文圣区",
    "fullname": "文圣区",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211004",
    "areaId": "211004",
    "code": "211004",
    "name": "宏伟区",
    "fullname": "宏伟区",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211005",
    "areaId": "211005",
    "code": "211005",
    "name": "弓长岭区",
    "fullname": "弓长岭区",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211011",
    "areaId": "211011",
    "code": "211011",
    "name": "太子河区",
    "fullname": "太子河区",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211021",
    "areaId": "211021",
    "code": "211021",
    "name": "辽阳县",
    "fullname": "辽阳县",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211081",
    "areaId": "211081",
    "code": "211081",
    "name": "灯塔市",
    "fullname": "灯塔市",
    "level": 3,
    "parentId": "211000"
  },
  {
    "id": "211101",
    "areaId": "211101",
    "code": "211101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "211100"
  },
  {
    "id": "211102",
    "areaId": "211102",
    "code": "211102",
    "name": "双台子区",
    "fullname": "双台子区",
    "level": 3,
    "parentId": "211100"
  },
  {
    "id": "211103",
    "areaId": "211103",
    "code": "211103",
    "name": "兴隆台区",
    "fullname": "兴隆台区",
    "level": 3,
    "parentId": "211100"
  },
  {
    "id": "211104",
    "areaId": "211104",
    "code": "211104",
    "name": "大洼区",
    "fullname": "大洼区",
    "level": 3,
    "parentId": "211100"
  },
  {
    "id": "211122",
    "areaId": "211122",
    "code": "211122",
    "name": "盘山县",
    "fullname": "盘山县",
    "level": 3,
    "parentId": "211100"
  },
  {
    "id": "211201",
    "areaId": "211201",
    "code": "211201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211202",
    "areaId": "211202",
    "code": "211202",
    "name": "银州区",
    "fullname": "银州区",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211204",
    "areaId": "211204",
    "code": "211204",
    "name": "清河区",
    "fullname": "清河区",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211221",
    "areaId": "211221",
    "code": "211221",
    "name": "铁岭县",
    "fullname": "铁岭县",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211223",
    "areaId": "211223",
    "code": "211223",
    "name": "西丰县",
    "fullname": "西丰县",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211224",
    "areaId": "211224",
    "code": "211224",
    "name": "昌图县",
    "fullname": "昌图县",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211281",
    "areaId": "211281",
    "code": "211281",
    "name": "调兵山市",
    "fullname": "调兵山市",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211282",
    "areaId": "211282",
    "code": "211282",
    "name": "开原市",
    "fullname": "开原市",
    "level": 3,
    "parentId": "211200"
  },
  {
    "id": "211301",
    "areaId": "211301",
    "code": "211301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211302",
    "areaId": "211302",
    "code": "211302",
    "name": "双塔区",
    "fullname": "双塔区",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211303",
    "areaId": "211303",
    "code": "211303",
    "name": "龙城区",
    "fullname": "龙城区",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211321",
    "areaId": "211321",
    "code": "211321",
    "name": "朝阳县",
    "fullname": "朝阳县",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211322",
    "areaId": "211322",
    "code": "211322",
    "name": "建平县",
    "fullname": "建平县",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211324",
    "areaId": "211324",
    "code": "211324",
    "name": "喀喇沁左翼蒙古族自治县",
    "fullname": "喀喇沁左翼蒙古族自治县",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211381",
    "areaId": "211381",
    "code": "211381",
    "name": "北票市",
    "fullname": "北票市",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211382",
    "areaId": "211382",
    "code": "211382",
    "name": "凌源市",
    "fullname": "凌源市",
    "level": 3,
    "parentId": "211300"
  },
  {
    "id": "211401",
    "areaId": "211401",
    "code": "211401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "211400"
  },
  {
    "id": "211402",
    "areaId": "211402",
    "code": "211402",
    "name": "连山区",
    "fullname": "连山区",
    "level": 3,
    "parentId": "211400"
  },
  {
    "id": "211403",
    "areaId": "211403",
    "code": "211403",
    "name": "龙港区",
    "fullname": "龙港区",
    "level": 3,
    "parentId": "211400"
  },
  {
    "id": "211404",
    "areaId": "211404",
    "code": "211404",
    "name": "南票区",
    "fullname": "南票区",
    "level": 3,
    "parentId": "211400"
  },
  {
    "id": "211421",
    "areaId": "211421",
    "code": "211421",
    "name": "绥中县",
    "fullname": "绥中县",
    "level": 3,
    "parentId": "211400"
  },
  {
    "id": "211422",
    "areaId": "211422",
    "code": "211422",
    "name": "建昌县",
    "fullname": "建昌县",
    "level": 3,
    "parentId": "211400"
  },
  {
    "id": "211481",
    "areaId": "211481",
    "code": "211481",
    "name": "兴城市",
    "fullname": "兴城市",
    "level": 3,
    "parentId": "211400"
  },
  {
    "id": "220101",
    "areaId": "220101",
    "code": "220101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220102",
    "areaId": "220102",
    "code": "220102",
    "name": "南关区",
    "fullname": "南关区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220103",
    "areaId": "220103",
    "code": "220103",
    "name": "宽城区",
    "fullname": "宽城区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220104",
    "areaId": "220104",
    "code": "220104",
    "name": "朝阳区",
    "fullname": "朝阳区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220105",
    "areaId": "220105",
    "code": "220105",
    "name": "二道区",
    "fullname": "二道区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220106",
    "areaId": "220106",
    "code": "220106",
    "name": "绿园区",
    "fullname": "绿园区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220112",
    "areaId": "220112",
    "code": "220112",
    "name": "双阳区",
    "fullname": "双阳区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220113",
    "areaId": "220113",
    "code": "220113",
    "name": "九台区",
    "fullname": "九台区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220122",
    "areaId": "220122",
    "code": "220122",
    "name": "农安县",
    "fullname": "农安县",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220171",
    "areaId": "220171",
    "code": "220171",
    "name": "长春经济技术开发区",
    "fullname": "长春经济技术开发区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220172",
    "areaId": "220172",
    "code": "220172",
    "name": "长春净月高新技术产业开发区",
    "fullname": "长春净月高新技术产业开发区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220173",
    "areaId": "220173",
    "code": "220173",
    "name": "长春高新技术产业开发区",
    "fullname": "长春高新技术产业开发区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220174",
    "areaId": "220174",
    "code": "220174",
    "name": "长春汽车经济技术开发区",
    "fullname": "长春汽车经济技术开发区",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220182",
    "areaId": "220182",
    "code": "220182",
    "name": "榆树市",
    "fullname": "榆树市",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220183",
    "areaId": "220183",
    "code": "220183",
    "name": "德惠市",
    "fullname": "德惠市",
    "level": 3,
    "parentId": "220100"
  },
  {
    "id": "220201",
    "areaId": "220201",
    "code": "220201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220202",
    "areaId": "220202",
    "code": "220202",
    "name": "昌邑区",
    "fullname": "昌邑区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220203",
    "areaId": "220203",
    "code": "220203",
    "name": "龙潭区",
    "fullname": "龙潭区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220204",
    "areaId": "220204",
    "code": "220204",
    "name": "船营区",
    "fullname": "船营区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220211",
    "areaId": "220211",
    "code": "220211",
    "name": "丰满区",
    "fullname": "丰满区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220221",
    "areaId": "220221",
    "code": "220221",
    "name": "永吉县",
    "fullname": "永吉县",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220271",
    "areaId": "220271",
    "code": "220271",
    "name": "吉林经济开发区",
    "fullname": "吉林经济开发区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220272",
    "areaId": "220272",
    "code": "220272",
    "name": "吉林高新技术产业开发区",
    "fullname": "吉林高新技术产业开发区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220273",
    "areaId": "220273",
    "code": "220273",
    "name": "吉林中国新加坡食品区",
    "fullname": "吉林中国新加坡食品区",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220281",
    "areaId": "220281",
    "code": "220281",
    "name": "蛟河市",
    "fullname": "蛟河市",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220282",
    "areaId": "220282",
    "code": "220282",
    "name": "桦甸市",
    "fullname": "桦甸市",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220283",
    "areaId": "220283",
    "code": "220283",
    "name": "舒兰市",
    "fullname": "舒兰市",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220284",
    "areaId": "220284",
    "code": "220284",
    "name": "磐石市",
    "fullname": "磐石市",
    "level": 3,
    "parentId": "220200"
  },
  {
    "id": "220301",
    "areaId": "220301",
    "code": "220301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220300"
  },
  {
    "id": "220302",
    "areaId": "220302",
    "code": "220302",
    "name": "铁西区",
    "fullname": "铁西区",
    "level": 3,
    "parentId": "220300"
  },
  {
    "id": "220303",
    "areaId": "220303",
    "code": "220303",
    "name": "铁东区",
    "fullname": "铁东区",
    "level": 3,
    "parentId": "220300"
  },
  {
    "id": "220322",
    "areaId": "220322",
    "code": "220322",
    "name": "梨树县",
    "fullname": "梨树县",
    "level": 3,
    "parentId": "220300"
  },
  {
    "id": "220323",
    "areaId": "220323",
    "code": "220323",
    "name": "伊通满族自治县",
    "fullname": "伊通满族自治县",
    "level": 3,
    "parentId": "220300"
  },
  {
    "id": "220381",
    "areaId": "220381",
    "code": "220381",
    "name": "公主岭市",
    "fullname": "公主岭市",
    "level": 3,
    "parentId": "220300"
  },
  {
    "id": "220382",
    "areaId": "220382",
    "code": "220382",
    "name": "双辽市",
    "fullname": "双辽市",
    "level": 3,
    "parentId": "220300"
  },
  {
    "id": "220401",
    "areaId": "220401",
    "code": "220401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220400"
  },
  {
    "id": "220402",
    "areaId": "220402",
    "code": "220402",
    "name": "龙山区",
    "fullname": "龙山区",
    "level": 3,
    "parentId": "220400"
  },
  {
    "id": "220403",
    "areaId": "220403",
    "code": "220403",
    "name": "西安区",
    "fullname": "西安区",
    "level": 3,
    "parentId": "220400"
  },
  {
    "id": "220421",
    "areaId": "220421",
    "code": "220421",
    "name": "东丰县",
    "fullname": "东丰县",
    "level": 3,
    "parentId": "220400"
  },
  {
    "id": "220422",
    "areaId": "220422",
    "code": "220422",
    "name": "东辽县",
    "fullname": "东辽县",
    "level": 3,
    "parentId": "220400"
  },
  {
    "id": "220501",
    "areaId": "220501",
    "code": "220501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220502",
    "areaId": "220502",
    "code": "220502",
    "name": "东昌区",
    "fullname": "东昌区",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220503",
    "areaId": "220503",
    "code": "220503",
    "name": "二道江区",
    "fullname": "二道江区",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220521",
    "areaId": "220521",
    "code": "220521",
    "name": "通化县",
    "fullname": "通化县",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220523",
    "areaId": "220523",
    "code": "220523",
    "name": "辉南县",
    "fullname": "辉南县",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220524",
    "areaId": "220524",
    "code": "220524",
    "name": "柳河县",
    "fullname": "柳河县",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220581",
    "areaId": "220581",
    "code": "220581",
    "name": "梅河口市",
    "fullname": "梅河口市",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220582",
    "areaId": "220582",
    "code": "220582",
    "name": "集安市",
    "fullname": "集安市",
    "level": 3,
    "parentId": "220500"
  },
  {
    "id": "220601",
    "areaId": "220601",
    "code": "220601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220600"
  },
  {
    "id": "220602",
    "areaId": "220602",
    "code": "220602",
    "name": "浑江区",
    "fullname": "浑江区",
    "level": 3,
    "parentId": "220600"
  },
  {
    "id": "220605",
    "areaId": "220605",
    "code": "220605",
    "name": "江源区",
    "fullname": "江源区",
    "level": 3,
    "parentId": "220600"
  },
  {
    "id": "220621",
    "areaId": "220621",
    "code": "220621",
    "name": "抚松县",
    "fullname": "抚松县",
    "level": 3,
    "parentId": "220600"
  },
  {
    "id": "220622",
    "areaId": "220622",
    "code": "220622",
    "name": "靖宇县",
    "fullname": "靖宇县",
    "level": 3,
    "parentId": "220600"
  },
  {
    "id": "220623",
    "areaId": "220623",
    "code": "220623",
    "name": "长白朝鲜族自治县",
    "fullname": "长白朝鲜族自治县",
    "level": 3,
    "parentId": "220600"
  },
  {
    "id": "220681",
    "areaId": "220681",
    "code": "220681",
    "name": "临江市",
    "fullname": "临江市",
    "level": 3,
    "parentId": "220600"
  },
  {
    "id": "220701",
    "areaId": "220701",
    "code": "220701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220700"
  },
  {
    "id": "220702",
    "areaId": "220702",
    "code": "220702",
    "name": "宁江区",
    "fullname": "宁江区",
    "level": 3,
    "parentId": "220700"
  },
  {
    "id": "220721",
    "areaId": "220721",
    "code": "220721",
    "name": "前郭尔罗斯蒙古族自治县",
    "fullname": "前郭尔罗斯蒙古族自治县",
    "level": 3,
    "parentId": "220700"
  },
  {
    "id": "220722",
    "areaId": "220722",
    "code": "220722",
    "name": "长岭县",
    "fullname": "长岭县",
    "level": 3,
    "parentId": "220700"
  },
  {
    "id": "220723",
    "areaId": "220723",
    "code": "220723",
    "name": "乾安县",
    "fullname": "乾安县",
    "level": 3,
    "parentId": "220700"
  },
  {
    "id": "220771",
    "areaId": "220771",
    "code": "220771",
    "name": "吉林松原经济开发区",
    "fullname": "吉林松原经济开发区",
    "level": 3,
    "parentId": "220700"
  },
  {
    "id": "220781",
    "areaId": "220781",
    "code": "220781",
    "name": "扶余市",
    "fullname": "扶余市",
    "level": 3,
    "parentId": "220700"
  },
  {
    "id": "220801",
    "areaId": "220801",
    "code": "220801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "220800"
  },
  {
    "id": "220802",
    "areaId": "220802",
    "code": "220802",
    "name": "洮北区",
    "fullname": "洮北区",
    "level": 3,
    "parentId": "220800"
  },
  {
    "id": "220821",
    "areaId": "220821",
    "code": "220821",
    "name": "镇赉县",
    "fullname": "镇赉县",
    "level": 3,
    "parentId": "220800"
  },
  {
    "id": "220822",
    "areaId": "220822",
    "code": "220822",
    "name": "通榆县",
    "fullname": "通榆县",
    "level": 3,
    "parentId": "220800"
  },
  {
    "id": "220871",
    "areaId": "220871",
    "code": "220871",
    "name": "吉林白城经济开发区",
    "fullname": "吉林白城经济开发区",
    "level": 3,
    "parentId": "220800"
  },
  {
    "id": "220881",
    "areaId": "220881",
    "code": "220881",
    "name": "洮南市",
    "fullname": "洮南市",
    "level": 3,
    "parentId": "220800"
  },
  {
    "id": "220882",
    "areaId": "220882",
    "code": "220882",
    "name": "大安市",
    "fullname": "大安市",
    "level": 3,
    "parentId": "220800"
  },
  {
    "id": "222401",
    "areaId": "222401",
    "code": "222401",
    "name": "延吉市",
    "fullname": "延吉市",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "222402",
    "areaId": "222402",
    "code": "222402",
    "name": "图们市",
    "fullname": "图们市",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "222403",
    "areaId": "222403",
    "code": "222403",
    "name": "敦化市",
    "fullname": "敦化市",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "222404",
    "areaId": "222404",
    "code": "222404",
    "name": "珲春市",
    "fullname": "珲春市",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "222405",
    "areaId": "222405",
    "code": "222405",
    "name": "龙井市",
    "fullname": "龙井市",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "222406",
    "areaId": "222406",
    "code": "222406",
    "name": "和龙市",
    "fullname": "和龙市",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "222424",
    "areaId": "222424",
    "code": "222424",
    "name": "汪清县",
    "fullname": "汪清县",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "222426",
    "areaId": "222426",
    "code": "222426",
    "name": "安图县",
    "fullname": "安图县",
    "level": 3,
    "parentId": "222400"
  },
  {
    "id": "230101",
    "areaId": "230101",
    "code": "230101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230102",
    "areaId": "230102",
    "code": "230102",
    "name": "道里区",
    "fullname": "道里区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230103",
    "areaId": "230103",
    "code": "230103",
    "name": "南岗区",
    "fullname": "南岗区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230104",
    "areaId": "230104",
    "code": "230104",
    "name": "道外区",
    "fullname": "道外区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230108",
    "areaId": "230108",
    "code": "230108",
    "name": "平房区",
    "fullname": "平房区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230109",
    "areaId": "230109",
    "code": "230109",
    "name": "松北区",
    "fullname": "松北区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230110",
    "areaId": "230110",
    "code": "230110",
    "name": "香坊区",
    "fullname": "香坊区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230111",
    "areaId": "230111",
    "code": "230111",
    "name": "呼兰区",
    "fullname": "呼兰区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230112",
    "areaId": "230112",
    "code": "230112",
    "name": "阿城区",
    "fullname": "阿城区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230113",
    "areaId": "230113",
    "code": "230113",
    "name": "双城区",
    "fullname": "双城区",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230123",
    "areaId": "230123",
    "code": "230123",
    "name": "依兰县",
    "fullname": "依兰县",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230124",
    "areaId": "230124",
    "code": "230124",
    "name": "方正县",
    "fullname": "方正县",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230125",
    "areaId": "230125",
    "code": "230125",
    "name": "宾县",
    "fullname": "宾县",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230126",
    "areaId": "230126",
    "code": "230126",
    "name": "巴彦县",
    "fullname": "巴彦县",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230127",
    "areaId": "230127",
    "code": "230127",
    "name": "木兰县",
    "fullname": "木兰县",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230128",
    "areaId": "230128",
    "code": "230128",
    "name": "通河县",
    "fullname": "通河县",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230129",
    "areaId": "230129",
    "code": "230129",
    "name": "延寿县",
    "fullname": "延寿县",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230183",
    "areaId": "230183",
    "code": "230183",
    "name": "尚志市",
    "fullname": "尚志市",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230184",
    "areaId": "230184",
    "code": "230184",
    "name": "五常市",
    "fullname": "五常市",
    "level": 3,
    "parentId": "230100"
  },
  {
    "id": "230201",
    "areaId": "230201",
    "code": "230201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230202",
    "areaId": "230202",
    "code": "230202",
    "name": "龙沙区",
    "fullname": "龙沙区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230203",
    "areaId": "230203",
    "code": "230203",
    "name": "建华区",
    "fullname": "建华区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230204",
    "areaId": "230204",
    "code": "230204",
    "name": "铁锋区",
    "fullname": "铁锋区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230205",
    "areaId": "230205",
    "code": "230205",
    "name": "昂昂溪区",
    "fullname": "昂昂溪区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230206",
    "areaId": "230206",
    "code": "230206",
    "name": "富拉尔基区",
    "fullname": "富拉尔基区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230207",
    "areaId": "230207",
    "code": "230207",
    "name": "碾子山区",
    "fullname": "碾子山区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230208",
    "areaId": "230208",
    "code": "230208",
    "name": "梅里斯达斡尔族区",
    "fullname": "梅里斯达斡尔族区",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230221",
    "areaId": "230221",
    "code": "230221",
    "name": "龙江县",
    "fullname": "龙江县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230223",
    "areaId": "230223",
    "code": "230223",
    "name": "依安县",
    "fullname": "依安县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230224",
    "areaId": "230224",
    "code": "230224",
    "name": "泰来县",
    "fullname": "泰来县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230225",
    "areaId": "230225",
    "code": "230225",
    "name": "甘南县",
    "fullname": "甘南县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230227",
    "areaId": "230227",
    "code": "230227",
    "name": "富裕县",
    "fullname": "富裕县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230229",
    "areaId": "230229",
    "code": "230229",
    "name": "克山县",
    "fullname": "克山县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230230",
    "areaId": "230230",
    "code": "230230",
    "name": "克东县",
    "fullname": "克东县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230231",
    "areaId": "230231",
    "code": "230231",
    "name": "拜泉县",
    "fullname": "拜泉县",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230281",
    "areaId": "230281",
    "code": "230281",
    "name": "讷河市",
    "fullname": "讷河市",
    "level": 3,
    "parentId": "230200"
  },
  {
    "id": "230301",
    "areaId": "230301",
    "code": "230301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230302",
    "areaId": "230302",
    "code": "230302",
    "name": "鸡冠区",
    "fullname": "鸡冠区",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230303",
    "areaId": "230303",
    "code": "230303",
    "name": "恒山区",
    "fullname": "恒山区",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230304",
    "areaId": "230304",
    "code": "230304",
    "name": "滴道区",
    "fullname": "滴道区",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230305",
    "areaId": "230305",
    "code": "230305",
    "name": "梨树区",
    "fullname": "梨树区",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230306",
    "areaId": "230306",
    "code": "230306",
    "name": "城子河区",
    "fullname": "城子河区",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230307",
    "areaId": "230307",
    "code": "230307",
    "name": "麻山区",
    "fullname": "麻山区",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230321",
    "areaId": "230321",
    "code": "230321",
    "name": "鸡东县",
    "fullname": "鸡东县",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230381",
    "areaId": "230381",
    "code": "230381",
    "name": "虎林市",
    "fullname": "虎林市",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230382",
    "areaId": "230382",
    "code": "230382",
    "name": "密山市",
    "fullname": "密山市",
    "level": 3,
    "parentId": "230300"
  },
  {
    "id": "230401",
    "areaId": "230401",
    "code": "230401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230402",
    "areaId": "230402",
    "code": "230402",
    "name": "向阳区",
    "fullname": "向阳区",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230403",
    "areaId": "230403",
    "code": "230403",
    "name": "工农区",
    "fullname": "工农区",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230404",
    "areaId": "230404",
    "code": "230404",
    "name": "南山区",
    "fullname": "南山区",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230405",
    "areaId": "230405",
    "code": "230405",
    "name": "兴安区",
    "fullname": "兴安区",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230406",
    "areaId": "230406",
    "code": "230406",
    "name": "东山区",
    "fullname": "东山区",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230407",
    "areaId": "230407",
    "code": "230407",
    "name": "兴山区",
    "fullname": "兴山区",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230421",
    "areaId": "230421",
    "code": "230421",
    "name": "萝北县",
    "fullname": "萝北县",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230422",
    "areaId": "230422",
    "code": "230422",
    "name": "绥滨县",
    "fullname": "绥滨县",
    "level": 3,
    "parentId": "230400"
  },
  {
    "id": "230501",
    "areaId": "230501",
    "code": "230501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230502",
    "areaId": "230502",
    "code": "230502",
    "name": "尖山区",
    "fullname": "尖山区",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230503",
    "areaId": "230503",
    "code": "230503",
    "name": "岭东区",
    "fullname": "岭东区",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230505",
    "areaId": "230505",
    "code": "230505",
    "name": "四方台区",
    "fullname": "四方台区",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230506",
    "areaId": "230506",
    "code": "230506",
    "name": "宝山区",
    "fullname": "宝山区",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230521",
    "areaId": "230521",
    "code": "230521",
    "name": "集贤县",
    "fullname": "集贤县",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230522",
    "areaId": "230522",
    "code": "230522",
    "name": "友谊县",
    "fullname": "友谊县",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230523",
    "areaId": "230523",
    "code": "230523",
    "name": "宝清县",
    "fullname": "宝清县",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230524",
    "areaId": "230524",
    "code": "230524",
    "name": "饶河县",
    "fullname": "饶河县",
    "level": 3,
    "parentId": "230500"
  },
  {
    "id": "230601",
    "areaId": "230601",
    "code": "230601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230602",
    "areaId": "230602",
    "code": "230602",
    "name": "萨尔图区",
    "fullname": "萨尔图区",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230603",
    "areaId": "230603",
    "code": "230603",
    "name": "龙凤区",
    "fullname": "龙凤区",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230604",
    "areaId": "230604",
    "code": "230604",
    "name": "让胡路区",
    "fullname": "让胡路区",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230605",
    "areaId": "230605",
    "code": "230605",
    "name": "红岗区",
    "fullname": "红岗区",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230606",
    "areaId": "230606",
    "code": "230606",
    "name": "大同区",
    "fullname": "大同区",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230621",
    "areaId": "230621",
    "code": "230621",
    "name": "肇州县",
    "fullname": "肇州县",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230622",
    "areaId": "230622",
    "code": "230622",
    "name": "肇源县",
    "fullname": "肇源县",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230623",
    "areaId": "230623",
    "code": "230623",
    "name": "林甸县",
    "fullname": "林甸县",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230624",
    "areaId": "230624",
    "code": "230624",
    "name": "杜尔伯特蒙古族自治县",
    "fullname": "杜尔伯特蒙古族自治县",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230671",
    "areaId": "230671",
    "code": "230671",
    "name": "大庆高新技术产业开发区",
    "fullname": "大庆高新技术产业开发区",
    "level": 3,
    "parentId": "230600"
  },
  {
    "id": "230701",
    "areaId": "230701",
    "code": "230701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230717",
    "areaId": "230717",
    "code": "230717",
    "name": "伊美区",
    "fullname": "伊美区",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230718",
    "areaId": "230718",
    "code": "230718",
    "name": "乌翠区",
    "fullname": "乌翠区",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230719",
    "areaId": "230719",
    "code": "230719",
    "name": "友好区",
    "fullname": "友好区",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230722",
    "areaId": "230722",
    "code": "230722",
    "name": "嘉荫县",
    "fullname": "嘉荫县",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230723",
    "areaId": "230723",
    "code": "230723",
    "name": "汤旺县",
    "fullname": "汤旺县",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230724",
    "areaId": "230724",
    "code": "230724",
    "name": "丰林县",
    "fullname": "丰林县",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230725",
    "areaId": "230725",
    "code": "230725",
    "name": "大箐山县",
    "fullname": "大箐山县",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230726",
    "areaId": "230726",
    "code": "230726",
    "name": "南岔县",
    "fullname": "南岔县",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230751",
    "areaId": "230751",
    "code": "230751",
    "name": "金林区",
    "fullname": "金林区",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230781",
    "areaId": "230781",
    "code": "230781",
    "name": "铁力市",
    "fullname": "铁力市",
    "level": 3,
    "parentId": "230700"
  },
  {
    "id": "230801",
    "areaId": "230801",
    "code": "230801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230803",
    "areaId": "230803",
    "code": "230803",
    "name": "向阳区",
    "fullname": "向阳区",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230804",
    "areaId": "230804",
    "code": "230804",
    "name": "前进区",
    "fullname": "前进区",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230805",
    "areaId": "230805",
    "code": "230805",
    "name": "东风区",
    "fullname": "东风区",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230811",
    "areaId": "230811",
    "code": "230811",
    "name": "郊区",
    "fullname": "郊区",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230822",
    "areaId": "230822",
    "code": "230822",
    "name": "桦南县",
    "fullname": "桦南县",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230826",
    "areaId": "230826",
    "code": "230826",
    "name": "桦川县",
    "fullname": "桦川县",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230828",
    "areaId": "230828",
    "code": "230828",
    "name": "汤原县",
    "fullname": "汤原县",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230881",
    "areaId": "230881",
    "code": "230881",
    "name": "同江市",
    "fullname": "同江市",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230882",
    "areaId": "230882",
    "code": "230882",
    "name": "富锦市",
    "fullname": "富锦市",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230883",
    "areaId": "230883",
    "code": "230883",
    "name": "抚远市",
    "fullname": "抚远市",
    "level": 3,
    "parentId": "230800"
  },
  {
    "id": "230901",
    "areaId": "230901",
    "code": "230901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "230900"
  },
  {
    "id": "230902",
    "areaId": "230902",
    "code": "230902",
    "name": "新兴区",
    "fullname": "新兴区",
    "level": 3,
    "parentId": "230900"
  },
  {
    "id": "230903",
    "areaId": "230903",
    "code": "230903",
    "name": "桃山区",
    "fullname": "桃山区",
    "level": 3,
    "parentId": "230900"
  },
  {
    "id": "230904",
    "areaId": "230904",
    "code": "230904",
    "name": "茄子河区",
    "fullname": "茄子河区",
    "level": 3,
    "parentId": "230900"
  },
  {
    "id": "230921",
    "areaId": "230921",
    "code": "230921",
    "name": "勃利县",
    "fullname": "勃利县",
    "level": 3,
    "parentId": "230900"
  },
  {
    "id": "231001",
    "areaId": "231001",
    "code": "231001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231002",
    "areaId": "231002",
    "code": "231002",
    "name": "东安区",
    "fullname": "东安区",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231003",
    "areaId": "231003",
    "code": "231003",
    "name": "阳明区",
    "fullname": "阳明区",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231004",
    "areaId": "231004",
    "code": "231004",
    "name": "爱民区",
    "fullname": "爱民区",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231005",
    "areaId": "231005",
    "code": "231005",
    "name": "西安区",
    "fullname": "西安区",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231025",
    "areaId": "231025",
    "code": "231025",
    "name": "林口县",
    "fullname": "林口县",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231071",
    "areaId": "231071",
    "code": "231071",
    "name": "牡丹江经济技术开发区",
    "fullname": "牡丹江经济技术开发区",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231081",
    "areaId": "231081",
    "code": "231081",
    "name": "绥芬河市",
    "fullname": "绥芬河市",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231083",
    "areaId": "231083",
    "code": "231083",
    "name": "海林市",
    "fullname": "海林市",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231084",
    "areaId": "231084",
    "code": "231084",
    "name": "宁安市",
    "fullname": "宁安市",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231085",
    "areaId": "231085",
    "code": "231085",
    "name": "穆棱市",
    "fullname": "穆棱市",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231086",
    "areaId": "231086",
    "code": "231086",
    "name": "东宁市",
    "fullname": "东宁市",
    "level": 3,
    "parentId": "231000"
  },
  {
    "id": "231101",
    "areaId": "231101",
    "code": "231101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "231100"
  },
  {
    "id": "231102",
    "areaId": "231102",
    "code": "231102",
    "name": "爱辉区",
    "fullname": "爱辉区",
    "level": 3,
    "parentId": "231100"
  },
  {
    "id": "231123",
    "areaId": "231123",
    "code": "231123",
    "name": "逊克县",
    "fullname": "逊克县",
    "level": 3,
    "parentId": "231100"
  },
  {
    "id": "231124",
    "areaId": "231124",
    "code": "231124",
    "name": "孙吴县",
    "fullname": "孙吴县",
    "level": 3,
    "parentId": "231100"
  },
  {
    "id": "231181",
    "areaId": "231181",
    "code": "231181",
    "name": "北安市",
    "fullname": "北安市",
    "level": 3,
    "parentId": "231100"
  },
  {
    "id": "231182",
    "areaId": "231182",
    "code": "231182",
    "name": "五大连池市",
    "fullname": "五大连池市",
    "level": 3,
    "parentId": "231100"
  },
  {
    "id": "231183",
    "areaId": "231183",
    "code": "231183",
    "name": "嫩江市",
    "fullname": "嫩江市",
    "level": 3,
    "parentId": "231100"
  },
  {
    "id": "231201",
    "areaId": "231201",
    "code": "231201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231202",
    "areaId": "231202",
    "code": "231202",
    "name": "北林区",
    "fullname": "北林区",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231221",
    "areaId": "231221",
    "code": "231221",
    "name": "望奎县",
    "fullname": "望奎县",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231222",
    "areaId": "231222",
    "code": "231222",
    "name": "兰西县",
    "fullname": "兰西县",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231223",
    "areaId": "231223",
    "code": "231223",
    "name": "青冈县",
    "fullname": "青冈县",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231224",
    "areaId": "231224",
    "code": "231224",
    "name": "庆安县",
    "fullname": "庆安县",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231225",
    "areaId": "231225",
    "code": "231225",
    "name": "明水县",
    "fullname": "明水县",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231226",
    "areaId": "231226",
    "code": "231226",
    "name": "绥棱县",
    "fullname": "绥棱县",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231281",
    "areaId": "231281",
    "code": "231281",
    "name": "安达市",
    "fullname": "安达市",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231282",
    "areaId": "231282",
    "code": "231282",
    "name": "肇东市",
    "fullname": "肇东市",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "231283",
    "areaId": "231283",
    "code": "231283",
    "name": "海伦市",
    "fullname": "海伦市",
    "level": 3,
    "parentId": "231200"
  },
  {
    "id": "232701",
    "areaId": "232701",
    "code": "232701",
    "name": "漠河市",
    "fullname": "漠河市",
    "level": 3,
    "parentId": "232700"
  },
  {
    "id": "232721",
    "areaId": "232721",
    "code": "232721",
    "name": "呼玛县",
    "fullname": "呼玛县",
    "level": 3,
    "parentId": "232700"
  },
  {
    "id": "232722",
    "areaId": "232722",
    "code": "232722",
    "name": "塔河县",
    "fullname": "塔河县",
    "level": 3,
    "parentId": "232700"
  },
  {
    "id": "232761",
    "areaId": "232761",
    "code": "232761",
    "name": "加格达奇区",
    "fullname": "加格达奇区",
    "level": 3,
    "parentId": "232700"
  },
  {
    "id": "232762",
    "areaId": "232762",
    "code": "232762",
    "name": "松岭区",
    "fullname": "松岭区",
    "level": 3,
    "parentId": "232700"
  },
  {
    "id": "232763",
    "areaId": "232763",
    "code": "232763",
    "name": "新林区",
    "fullname": "新林区",
    "level": 3,
    "parentId": "232700"
  },
  {
    "id": "232764",
    "areaId": "232764",
    "code": "232764",
    "name": "呼中区",
    "fullname": "呼中区",
    "level": 3,
    "parentId": "232700"
  },
  {
    "id": "310101",
    "areaId": "310101",
    "code": "310101",
    "name": "黄浦区",
    "fullname": "黄浦区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310104",
    "areaId": "310104",
    "code": "310104",
    "name": "徐汇区",
    "fullname": "徐汇区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310105",
    "areaId": "310105",
    "code": "310105",
    "name": "长宁区",
    "fullname": "长宁区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310106",
    "areaId": "310106",
    "code": "310106",
    "name": "静安区",
    "fullname": "静安区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310107",
    "areaId": "310107",
    "code": "310107",
    "name": "普陀区",
    "fullname": "普陀区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310109",
    "areaId": "310109",
    "code": "310109",
    "name": "虹口区",
    "fullname": "虹口区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310110",
    "areaId": "310110",
    "code": "310110",
    "name": "杨浦区",
    "fullname": "杨浦区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310112",
    "areaId": "310112",
    "code": "310112",
    "name": "闵行区",
    "fullname": "闵行区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310113",
    "areaId": "310113",
    "code": "310113",
    "name": "宝山区",
    "fullname": "宝山区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310114",
    "areaId": "310114",
    "code": "310114",
    "name": "嘉定区",
    "fullname": "嘉定区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310115",
    "areaId": "310115",
    "code": "310115",
    "name": "浦东新区",
    "fullname": "浦东新区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310116",
    "areaId": "310116",
    "code": "310116",
    "name": "金山区",
    "fullname": "金山区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310117",
    "areaId": "310117",
    "code": "310117",
    "name": "松江区",
    "fullname": "松江区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310118",
    "areaId": "310118",
    "code": "310118",
    "name": "青浦区",
    "fullname": "青浦区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310120",
    "areaId": "310120",
    "code": "310120",
    "name": "奉贤区",
    "fullname": "奉贤区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "310151",
    "areaId": "310151",
    "code": "310151",
    "name": "崇明区",
    "fullname": "崇明区",
    "level": 3,
    "parentId": "310100"
  },
  {
    "id": "320101",
    "areaId": "320101",
    "code": "320101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320102",
    "areaId": "320102",
    "code": "320102",
    "name": "玄武区",
    "fullname": "玄武区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320104",
    "areaId": "320104",
    "code": "320104",
    "name": "秦淮区",
    "fullname": "秦淮区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320105",
    "areaId": "320105",
    "code": "320105",
    "name": "建邺区",
    "fullname": "建邺区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320106",
    "areaId": "320106",
    "code": "320106",
    "name": "鼓楼区",
    "fullname": "鼓楼区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320111",
    "areaId": "320111",
    "code": "320111",
    "name": "浦口区",
    "fullname": "浦口区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320113",
    "areaId": "320113",
    "code": "320113",
    "name": "栖霞区",
    "fullname": "栖霞区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320114",
    "areaId": "320114",
    "code": "320114",
    "name": "雨花台区",
    "fullname": "雨花台区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320115",
    "areaId": "320115",
    "code": "320115",
    "name": "江宁区",
    "fullname": "江宁区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320116",
    "areaId": "320116",
    "code": "320116",
    "name": "六合区",
    "fullname": "六合区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320117",
    "areaId": "320117",
    "code": "320117",
    "name": "溧水区",
    "fullname": "溧水区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320118",
    "areaId": "320118",
    "code": "320118",
    "name": "高淳区",
    "fullname": "高淳区",
    "level": 3,
    "parentId": "320100"
  },
  {
    "id": "320201",
    "areaId": "320201",
    "code": "320201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320205",
    "areaId": "320205",
    "code": "320205",
    "name": "锡山区",
    "fullname": "锡山区",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320206",
    "areaId": "320206",
    "code": "320206",
    "name": "惠山区",
    "fullname": "惠山区",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320211",
    "areaId": "320211",
    "code": "320211",
    "name": "滨湖区",
    "fullname": "滨湖区",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320213",
    "areaId": "320213",
    "code": "320213",
    "name": "梁溪区",
    "fullname": "梁溪区",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320214",
    "areaId": "320214",
    "code": "320214",
    "name": "新吴区",
    "fullname": "新吴区",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320281",
    "areaId": "320281",
    "code": "320281",
    "name": "江阴市",
    "fullname": "江阴市",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320282",
    "areaId": "320282",
    "code": "320282",
    "name": "宜兴市",
    "fullname": "宜兴市",
    "level": 3,
    "parentId": "320200"
  },
  {
    "id": "320301",
    "areaId": "320301",
    "code": "320301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320302",
    "areaId": "320302",
    "code": "320302",
    "name": "鼓楼区",
    "fullname": "鼓楼区",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320303",
    "areaId": "320303",
    "code": "320303",
    "name": "云龙区",
    "fullname": "云龙区",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320305",
    "areaId": "320305",
    "code": "320305",
    "name": "贾汪区",
    "fullname": "贾汪区",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320311",
    "areaId": "320311",
    "code": "320311",
    "name": "泉山区",
    "fullname": "泉山区",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320312",
    "areaId": "320312",
    "code": "320312",
    "name": "铜山区",
    "fullname": "铜山区",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320321",
    "areaId": "320321",
    "code": "320321",
    "name": "丰县",
    "fullname": "丰县",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320322",
    "areaId": "320322",
    "code": "320322",
    "name": "沛县",
    "fullname": "沛县",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320324",
    "areaId": "320324",
    "code": "320324",
    "name": "睢宁县",
    "fullname": "睢宁县",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320371",
    "areaId": "320371",
    "code": "320371",
    "name": "徐州经济技术开发区",
    "fullname": "徐州经济技术开发区",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320381",
    "areaId": "320381",
    "code": "320381",
    "name": "新沂市",
    "fullname": "新沂市",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320382",
    "areaId": "320382",
    "code": "320382",
    "name": "邳州市",
    "fullname": "邳州市",
    "level": 3,
    "parentId": "320300"
  },
  {
    "id": "320401",
    "areaId": "320401",
    "code": "320401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320400"
  },
  {
    "id": "320402",
    "areaId": "320402",
    "code": "320402",
    "name": "天宁区",
    "fullname": "天宁区",
    "level": 3,
    "parentId": "320400"
  },
  {
    "id": "320404",
    "areaId": "320404",
    "code": "320404",
    "name": "钟楼区",
    "fullname": "钟楼区",
    "level": 3,
    "parentId": "320400"
  },
  {
    "id": "320411",
    "areaId": "320411",
    "code": "320411",
    "name": "新北区",
    "fullname": "新北区",
    "level": 3,
    "parentId": "320400"
  },
  {
    "id": "320412",
    "areaId": "320412",
    "code": "320412",
    "name": "武进区",
    "fullname": "武进区",
    "level": 3,
    "parentId": "320400"
  },
  {
    "id": "320413",
    "areaId": "320413",
    "code": "320413",
    "name": "金坛区",
    "fullname": "金坛区",
    "level": 3,
    "parentId": "320400"
  },
  {
    "id": "320481",
    "areaId": "320481",
    "code": "320481",
    "name": "溧阳市",
    "fullname": "溧阳市",
    "level": 3,
    "parentId": "320400"
  },
  {
    "id": "320501",
    "areaId": "320501",
    "code": "320501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320505",
    "areaId": "320505",
    "code": "320505",
    "name": "虎丘区",
    "fullname": "虎丘区",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320506",
    "areaId": "320506",
    "code": "320506",
    "name": "吴中区",
    "fullname": "吴中区",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320507",
    "areaId": "320507",
    "code": "320507",
    "name": "相城区",
    "fullname": "相城区",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320508",
    "areaId": "320508",
    "code": "320508",
    "name": "姑苏区",
    "fullname": "姑苏区",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320509",
    "areaId": "320509",
    "code": "320509",
    "name": "吴江区",
    "fullname": "吴江区",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320571",
    "areaId": "320571",
    "code": "320571",
    "name": "苏州工业园区",
    "fullname": "苏州工业园区",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320581",
    "areaId": "320581",
    "code": "320581",
    "name": "常熟市",
    "fullname": "常熟市",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320582",
    "areaId": "320582",
    "code": "320582",
    "name": "张家港市",
    "fullname": "张家港市",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320583",
    "areaId": "320583",
    "code": "320583",
    "name": "昆山市",
    "fullname": "昆山市",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320585",
    "areaId": "320585",
    "code": "320585",
    "name": "太仓市",
    "fullname": "太仓市",
    "level": 3,
    "parentId": "320500"
  },
  {
    "id": "320601",
    "areaId": "320601",
    "code": "320601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320602",
    "areaId": "320602",
    "code": "320602",
    "name": "崇川区",
    "fullname": "崇川区",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320611",
    "areaId": "320611",
    "code": "320611",
    "name": "港闸区",
    "fullname": "港闸区",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320612",
    "areaId": "320612",
    "code": "320612",
    "name": "通州区",
    "fullname": "通州区",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320623",
    "areaId": "320623",
    "code": "320623",
    "name": "如东县",
    "fullname": "如东县",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320671",
    "areaId": "320671",
    "code": "320671",
    "name": "南通经济技术开发区",
    "fullname": "南通经济技术开发区",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320681",
    "areaId": "320681",
    "code": "320681",
    "name": "启东市",
    "fullname": "启东市",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320682",
    "areaId": "320682",
    "code": "320682",
    "name": "如皋市",
    "fullname": "如皋市",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320684",
    "areaId": "320684",
    "code": "320684",
    "name": "海门市",
    "fullname": "海门市",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320685",
    "areaId": "320685",
    "code": "320685",
    "name": "海安市",
    "fullname": "海安市",
    "level": 3,
    "parentId": "320600"
  },
  {
    "id": "320701",
    "areaId": "320701",
    "code": "320701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320703",
    "areaId": "320703",
    "code": "320703",
    "name": "连云区",
    "fullname": "连云区",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320706",
    "areaId": "320706",
    "code": "320706",
    "name": "海州区",
    "fullname": "海州区",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320707",
    "areaId": "320707",
    "code": "320707",
    "name": "赣榆区",
    "fullname": "赣榆区",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320722",
    "areaId": "320722",
    "code": "320722",
    "name": "东海县",
    "fullname": "东海县",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320723",
    "areaId": "320723",
    "code": "320723",
    "name": "灌云县",
    "fullname": "灌云县",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320724",
    "areaId": "320724",
    "code": "320724",
    "name": "灌南县",
    "fullname": "灌南县",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320771",
    "areaId": "320771",
    "code": "320771",
    "name": "连云港经济技术开发区",
    "fullname": "连云港经济技术开发区",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320772",
    "areaId": "320772",
    "code": "320772",
    "name": "连云港高新技术产业开发区",
    "fullname": "连云港高新技术产业开发区",
    "level": 3,
    "parentId": "320700"
  },
  {
    "id": "320801",
    "areaId": "320801",
    "code": "320801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320803",
    "areaId": "320803",
    "code": "320803",
    "name": "淮安区",
    "fullname": "淮安区",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320804",
    "areaId": "320804",
    "code": "320804",
    "name": "淮阴区",
    "fullname": "淮阴区",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320812",
    "areaId": "320812",
    "code": "320812",
    "name": "清江浦区",
    "fullname": "清江浦区",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320813",
    "areaId": "320813",
    "code": "320813",
    "name": "洪泽区",
    "fullname": "洪泽区",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320826",
    "areaId": "320826",
    "code": "320826",
    "name": "涟水县",
    "fullname": "涟水县",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320830",
    "areaId": "320830",
    "code": "320830",
    "name": "盱眙县",
    "fullname": "盱眙县",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320831",
    "areaId": "320831",
    "code": "320831",
    "name": "金湖县",
    "fullname": "金湖县",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320871",
    "areaId": "320871",
    "code": "320871",
    "name": "淮安经济技术开发区",
    "fullname": "淮安经济技术开发区",
    "level": 3,
    "parentId": "320800"
  },
  {
    "id": "320901",
    "areaId": "320901",
    "code": "320901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320902",
    "areaId": "320902",
    "code": "320902",
    "name": "亭湖区",
    "fullname": "亭湖区",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320903",
    "areaId": "320903",
    "code": "320903",
    "name": "盐都区",
    "fullname": "盐都区",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320904",
    "areaId": "320904",
    "code": "320904",
    "name": "大丰区",
    "fullname": "大丰区",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320921",
    "areaId": "320921",
    "code": "320921",
    "name": "响水县",
    "fullname": "响水县",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320922",
    "areaId": "320922",
    "code": "320922",
    "name": "滨海县",
    "fullname": "滨海县",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320923",
    "areaId": "320923",
    "code": "320923",
    "name": "阜宁县",
    "fullname": "阜宁县",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320924",
    "areaId": "320924",
    "code": "320924",
    "name": "射阳县",
    "fullname": "射阳县",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320925",
    "areaId": "320925",
    "code": "320925",
    "name": "建湖县",
    "fullname": "建湖县",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320971",
    "areaId": "320971",
    "code": "320971",
    "name": "盐城经济技术开发区",
    "fullname": "盐城经济技术开发区",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "320981",
    "areaId": "320981",
    "code": "320981",
    "name": "东台市",
    "fullname": "东台市",
    "level": 3,
    "parentId": "320900"
  },
  {
    "id": "321001",
    "areaId": "321001",
    "code": "321001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321002",
    "areaId": "321002",
    "code": "321002",
    "name": "广陵区",
    "fullname": "广陵区",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321003",
    "areaId": "321003",
    "code": "321003",
    "name": "邗江区",
    "fullname": "邗江区",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321012",
    "areaId": "321012",
    "code": "321012",
    "name": "江都区",
    "fullname": "江都区",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321023",
    "areaId": "321023",
    "code": "321023",
    "name": "宝应县",
    "fullname": "宝应县",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321071",
    "areaId": "321071",
    "code": "321071",
    "name": "扬州经济技术开发区",
    "fullname": "扬州经济技术开发区",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321081",
    "areaId": "321081",
    "code": "321081",
    "name": "仪征市",
    "fullname": "仪征市",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321084",
    "areaId": "321084",
    "code": "321084",
    "name": "高邮市",
    "fullname": "高邮市",
    "level": 3,
    "parentId": "321000"
  },
  {
    "id": "321101",
    "areaId": "321101",
    "code": "321101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321102",
    "areaId": "321102",
    "code": "321102",
    "name": "京口区",
    "fullname": "京口区",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321111",
    "areaId": "321111",
    "code": "321111",
    "name": "润州区",
    "fullname": "润州区",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321112",
    "areaId": "321112",
    "code": "321112",
    "name": "丹徒区",
    "fullname": "丹徒区",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321171",
    "areaId": "321171",
    "code": "321171",
    "name": "镇江新区",
    "fullname": "镇江新区",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321181",
    "areaId": "321181",
    "code": "321181",
    "name": "丹阳市",
    "fullname": "丹阳市",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321182",
    "areaId": "321182",
    "code": "321182",
    "name": "扬中市",
    "fullname": "扬中市",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321183",
    "areaId": "321183",
    "code": "321183",
    "name": "句容市",
    "fullname": "句容市",
    "level": 3,
    "parentId": "321100"
  },
  {
    "id": "321201",
    "areaId": "321201",
    "code": "321201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321202",
    "areaId": "321202",
    "code": "321202",
    "name": "海陵区",
    "fullname": "海陵区",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321203",
    "areaId": "321203",
    "code": "321203",
    "name": "高港区",
    "fullname": "高港区",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321204",
    "areaId": "321204",
    "code": "321204",
    "name": "姜堰区",
    "fullname": "姜堰区",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321271",
    "areaId": "321271",
    "code": "321271",
    "name": "泰州医药高新技术产业开发区",
    "fullname": "泰州医药高新技术产业开发区",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321281",
    "areaId": "321281",
    "code": "321281",
    "name": "兴化市",
    "fullname": "兴化市",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321282",
    "areaId": "321282",
    "code": "321282",
    "name": "靖江市",
    "fullname": "靖江市",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321283",
    "areaId": "321283",
    "code": "321283",
    "name": "泰兴市",
    "fullname": "泰兴市",
    "level": 3,
    "parentId": "321200"
  },
  {
    "id": "321301",
    "areaId": "321301",
    "code": "321301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "321300"
  },
  {
    "id": "321302",
    "areaId": "321302",
    "code": "321302",
    "name": "宿城区",
    "fullname": "宿城区",
    "level": 3,
    "parentId": "321300"
  },
  {
    "id": "321311",
    "areaId": "321311",
    "code": "321311",
    "name": "宿豫区",
    "fullname": "宿豫区",
    "level": 3,
    "parentId": "321300"
  },
  {
    "id": "321322",
    "areaId": "321322",
    "code": "321322",
    "name": "沭阳县",
    "fullname": "沭阳县",
    "level": 3,
    "parentId": "321300"
  },
  {
    "id": "321323",
    "areaId": "321323",
    "code": "321323",
    "name": "泗阳县",
    "fullname": "泗阳县",
    "level": 3,
    "parentId": "321300"
  },
  {
    "id": "321324",
    "areaId": "321324",
    "code": "321324",
    "name": "泗洪县",
    "fullname": "泗洪县",
    "level": 3,
    "parentId": "321300"
  },
  {
    "id": "321371",
    "areaId": "321371",
    "code": "321371",
    "name": "宿迁经济技术开发区",
    "fullname": "宿迁经济技术开发区",
    "level": 3,
    "parentId": "321300"
  },
  {
    "id": "330101",
    "areaId": "330101",
    "code": "330101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330102",
    "areaId": "330102",
    "code": "330102",
    "name": "上城区",
    "fullname": "上城区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330103",
    "areaId": "330103",
    "code": "330103",
    "name": "下城区",
    "fullname": "下城区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330104",
    "areaId": "330104",
    "code": "330104",
    "name": "江干区",
    "fullname": "江干区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330105",
    "areaId": "330105",
    "code": "330105",
    "name": "拱墅区",
    "fullname": "拱墅区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330106",
    "areaId": "330106",
    "code": "330106",
    "name": "西湖区",
    "fullname": "西湖区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330108",
    "areaId": "330108",
    "code": "330108",
    "name": "滨江区",
    "fullname": "滨江区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330109",
    "areaId": "330109",
    "code": "330109",
    "name": "萧山区",
    "fullname": "萧山区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330110",
    "areaId": "330110",
    "code": "330110",
    "name": "余杭区",
    "fullname": "余杭区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330111",
    "areaId": "330111",
    "code": "330111",
    "name": "富阳区",
    "fullname": "富阳区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330112",
    "areaId": "330112",
    "code": "330112",
    "name": "临安区",
    "fullname": "临安区",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330122",
    "areaId": "330122",
    "code": "330122",
    "name": "桐庐县",
    "fullname": "桐庐县",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330127",
    "areaId": "330127",
    "code": "330127",
    "name": "淳安县",
    "fullname": "淳安县",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330182",
    "areaId": "330182",
    "code": "330182",
    "name": "建德市",
    "fullname": "建德市",
    "level": 3,
    "parentId": "330100"
  },
  {
    "id": "330201",
    "areaId": "330201",
    "code": "330201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330203",
    "areaId": "330203",
    "code": "330203",
    "name": "海曙区",
    "fullname": "海曙区",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330205",
    "areaId": "330205",
    "code": "330205",
    "name": "江北区",
    "fullname": "江北区",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330206",
    "areaId": "330206",
    "code": "330206",
    "name": "北仑区",
    "fullname": "北仑区",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330211",
    "areaId": "330211",
    "code": "330211",
    "name": "镇海区",
    "fullname": "镇海区",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330212",
    "areaId": "330212",
    "code": "330212",
    "name": "鄞州区",
    "fullname": "鄞州区",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330213",
    "areaId": "330213",
    "code": "330213",
    "name": "奉化区",
    "fullname": "奉化区",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330225",
    "areaId": "330225",
    "code": "330225",
    "name": "象山县",
    "fullname": "象山县",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330226",
    "areaId": "330226",
    "code": "330226",
    "name": "宁海县",
    "fullname": "宁海县",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330281",
    "areaId": "330281",
    "code": "330281",
    "name": "余姚市",
    "fullname": "余姚市",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330282",
    "areaId": "330282",
    "code": "330282",
    "name": "慈溪市",
    "fullname": "慈溪市",
    "level": 3,
    "parentId": "330200"
  },
  {
    "id": "330301",
    "areaId": "330301",
    "code": "330301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330302",
    "areaId": "330302",
    "code": "330302",
    "name": "鹿城区",
    "fullname": "鹿城区",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330303",
    "areaId": "330303",
    "code": "330303",
    "name": "龙湾区",
    "fullname": "龙湾区",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330304",
    "areaId": "330304",
    "code": "330304",
    "name": "瓯海区",
    "fullname": "瓯海区",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330305",
    "areaId": "330305",
    "code": "330305",
    "name": "洞头区",
    "fullname": "洞头区",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330324",
    "areaId": "330324",
    "code": "330324",
    "name": "永嘉县",
    "fullname": "永嘉县",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330326",
    "areaId": "330326",
    "code": "330326",
    "name": "平阳县",
    "fullname": "平阳县",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330327",
    "areaId": "330327",
    "code": "330327",
    "name": "苍南县",
    "fullname": "苍南县",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330328",
    "areaId": "330328",
    "code": "330328",
    "name": "文成县",
    "fullname": "文成县",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330329",
    "areaId": "330329",
    "code": "330329",
    "name": "泰顺县",
    "fullname": "泰顺县",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330371",
    "areaId": "330371",
    "code": "330371",
    "name": "温州经济技术开发区",
    "fullname": "温州经济技术开发区",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330381",
    "areaId": "330381",
    "code": "330381",
    "name": "瑞安市",
    "fullname": "瑞安市",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330382",
    "areaId": "330382",
    "code": "330382",
    "name": "乐清市",
    "fullname": "乐清市",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330383",
    "areaId": "330383",
    "code": "330383",
    "name": "龙港市",
    "fullname": "龙港市",
    "level": 3,
    "parentId": "330300"
  },
  {
    "id": "330401",
    "areaId": "330401",
    "code": "330401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330402",
    "areaId": "330402",
    "code": "330402",
    "name": "南湖区",
    "fullname": "南湖区",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330411",
    "areaId": "330411",
    "code": "330411",
    "name": "秀洲区",
    "fullname": "秀洲区",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330421",
    "areaId": "330421",
    "code": "330421",
    "name": "嘉善县",
    "fullname": "嘉善县",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330424",
    "areaId": "330424",
    "code": "330424",
    "name": "海盐县",
    "fullname": "海盐县",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330481",
    "areaId": "330481",
    "code": "330481",
    "name": "海宁市",
    "fullname": "海宁市",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330482",
    "areaId": "330482",
    "code": "330482",
    "name": "平湖市",
    "fullname": "平湖市",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330483",
    "areaId": "330483",
    "code": "330483",
    "name": "桐乡市",
    "fullname": "桐乡市",
    "level": 3,
    "parentId": "330400"
  },
  {
    "id": "330501",
    "areaId": "330501",
    "code": "330501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330500"
  },
  {
    "id": "330502",
    "areaId": "330502",
    "code": "330502",
    "name": "吴兴区",
    "fullname": "吴兴区",
    "level": 3,
    "parentId": "330500"
  },
  {
    "id": "330503",
    "areaId": "330503",
    "code": "330503",
    "name": "南浔区",
    "fullname": "南浔区",
    "level": 3,
    "parentId": "330500"
  },
  {
    "id": "330521",
    "areaId": "330521",
    "code": "330521",
    "name": "德清县",
    "fullname": "德清县",
    "level": 3,
    "parentId": "330500"
  },
  {
    "id": "330522",
    "areaId": "330522",
    "code": "330522",
    "name": "长兴县",
    "fullname": "长兴县",
    "level": 3,
    "parentId": "330500"
  },
  {
    "id": "330523",
    "areaId": "330523",
    "code": "330523",
    "name": "安吉县",
    "fullname": "安吉县",
    "level": 3,
    "parentId": "330500"
  },
  {
    "id": "330601",
    "areaId": "330601",
    "code": "330601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330600"
  },
  {
    "id": "330602",
    "areaId": "330602",
    "code": "330602",
    "name": "越城区",
    "fullname": "越城区",
    "level": 3,
    "parentId": "330600"
  },
  {
    "id": "330603",
    "areaId": "330603",
    "code": "330603",
    "name": "柯桥区",
    "fullname": "柯桥区",
    "level": 3,
    "parentId": "330600"
  },
  {
    "id": "330604",
    "areaId": "330604",
    "code": "330604",
    "name": "上虞区",
    "fullname": "上虞区",
    "level": 3,
    "parentId": "330600"
  },
  {
    "id": "330624",
    "areaId": "330624",
    "code": "330624",
    "name": "新昌县",
    "fullname": "新昌县",
    "level": 3,
    "parentId": "330600"
  },
  {
    "id": "330681",
    "areaId": "330681",
    "code": "330681",
    "name": "诸暨市",
    "fullname": "诸暨市",
    "level": 3,
    "parentId": "330600"
  },
  {
    "id": "330683",
    "areaId": "330683",
    "code": "330683",
    "name": "嵊州市",
    "fullname": "嵊州市",
    "level": 3,
    "parentId": "330600"
  },
  {
    "id": "330701",
    "areaId": "330701",
    "code": "330701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330702",
    "areaId": "330702",
    "code": "330702",
    "name": "婺城区",
    "fullname": "婺城区",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330703",
    "areaId": "330703",
    "code": "330703",
    "name": "金东区",
    "fullname": "金东区",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330723",
    "areaId": "330723",
    "code": "330723",
    "name": "武义县",
    "fullname": "武义县",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330726",
    "areaId": "330726",
    "code": "330726",
    "name": "浦江县",
    "fullname": "浦江县",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330727",
    "areaId": "330727",
    "code": "330727",
    "name": "磐安县",
    "fullname": "磐安县",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330781",
    "areaId": "330781",
    "code": "330781",
    "name": "兰溪市",
    "fullname": "兰溪市",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330782",
    "areaId": "330782",
    "code": "330782",
    "name": "义乌市",
    "fullname": "义乌市",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330783",
    "areaId": "330783",
    "code": "330783",
    "name": "东阳市",
    "fullname": "东阳市",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330784",
    "areaId": "330784",
    "code": "330784",
    "name": "永康市",
    "fullname": "永康市",
    "level": 3,
    "parentId": "330700"
  },
  {
    "id": "330801",
    "areaId": "330801",
    "code": "330801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330800"
  },
  {
    "id": "330802",
    "areaId": "330802",
    "code": "330802",
    "name": "柯城区",
    "fullname": "柯城区",
    "level": 3,
    "parentId": "330800"
  },
  {
    "id": "330803",
    "areaId": "330803",
    "code": "330803",
    "name": "衢江区",
    "fullname": "衢江区",
    "level": 3,
    "parentId": "330800"
  },
  {
    "id": "330822",
    "areaId": "330822",
    "code": "330822",
    "name": "常山县",
    "fullname": "常山县",
    "level": 3,
    "parentId": "330800"
  },
  {
    "id": "330824",
    "areaId": "330824",
    "code": "330824",
    "name": "开化县",
    "fullname": "开化县",
    "level": 3,
    "parentId": "330800"
  },
  {
    "id": "330825",
    "areaId": "330825",
    "code": "330825",
    "name": "龙游县",
    "fullname": "龙游县",
    "level": 3,
    "parentId": "330800"
  },
  {
    "id": "330881",
    "areaId": "330881",
    "code": "330881",
    "name": "江山市",
    "fullname": "江山市",
    "level": 3,
    "parentId": "330800"
  },
  {
    "id": "330901",
    "areaId": "330901",
    "code": "330901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "330900"
  },
  {
    "id": "330902",
    "areaId": "330902",
    "code": "330902",
    "name": "定海区",
    "fullname": "定海区",
    "level": 3,
    "parentId": "330900"
  },
  {
    "id": "330903",
    "areaId": "330903",
    "code": "330903",
    "name": "普陀区",
    "fullname": "普陀区",
    "level": 3,
    "parentId": "330900"
  },
  {
    "id": "330921",
    "areaId": "330921",
    "code": "330921",
    "name": "岱山县",
    "fullname": "岱山县",
    "level": 3,
    "parentId": "330900"
  },
  {
    "id": "330922",
    "areaId": "330922",
    "code": "330922",
    "name": "嵊泗县",
    "fullname": "嵊泗县",
    "level": 3,
    "parentId": "330900"
  },
  {
    "id": "331001",
    "areaId": "331001",
    "code": "331001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331002",
    "areaId": "331002",
    "code": "331002",
    "name": "椒江区",
    "fullname": "椒江区",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331003",
    "areaId": "331003",
    "code": "331003",
    "name": "黄岩区",
    "fullname": "黄岩区",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331004",
    "areaId": "331004",
    "code": "331004",
    "name": "路桥区",
    "fullname": "路桥区",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331022",
    "areaId": "331022",
    "code": "331022",
    "name": "三门县",
    "fullname": "三门县",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331023",
    "areaId": "331023",
    "code": "331023",
    "name": "天台县",
    "fullname": "天台县",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331024",
    "areaId": "331024",
    "code": "331024",
    "name": "仙居县",
    "fullname": "仙居县",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331081",
    "areaId": "331081",
    "code": "331081",
    "name": "温岭市",
    "fullname": "温岭市",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331082",
    "areaId": "331082",
    "code": "331082",
    "name": "临海市",
    "fullname": "临海市",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331083",
    "areaId": "331083",
    "code": "331083",
    "name": "玉环市",
    "fullname": "玉环市",
    "level": 3,
    "parentId": "331000"
  },
  {
    "id": "331101",
    "areaId": "331101",
    "code": "331101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331102",
    "areaId": "331102",
    "code": "331102",
    "name": "莲都区",
    "fullname": "莲都区",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331121",
    "areaId": "331121",
    "code": "331121",
    "name": "青田县",
    "fullname": "青田县",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331122",
    "areaId": "331122",
    "code": "331122",
    "name": "缙云县",
    "fullname": "缙云县",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331123",
    "areaId": "331123",
    "code": "331123",
    "name": "遂昌县",
    "fullname": "遂昌县",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331124",
    "areaId": "331124",
    "code": "331124",
    "name": "松阳县",
    "fullname": "松阳县",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331125",
    "areaId": "331125",
    "code": "331125",
    "name": "云和县",
    "fullname": "云和县",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331126",
    "areaId": "331126",
    "code": "331126",
    "name": "庆元县",
    "fullname": "庆元县",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331127",
    "areaId": "331127",
    "code": "331127",
    "name": "景宁畲族自治县",
    "fullname": "景宁畲族自治县",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "331181",
    "areaId": "331181",
    "code": "331181",
    "name": "龙泉市",
    "fullname": "龙泉市",
    "level": 3,
    "parentId": "331100"
  },
  {
    "id": "340101",
    "areaId": "340101",
    "code": "340101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340102",
    "areaId": "340102",
    "code": "340102",
    "name": "瑶海区",
    "fullname": "瑶海区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340103",
    "areaId": "340103",
    "code": "340103",
    "name": "庐阳区",
    "fullname": "庐阳区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340104",
    "areaId": "340104",
    "code": "340104",
    "name": "蜀山区",
    "fullname": "蜀山区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340111",
    "areaId": "340111",
    "code": "340111",
    "name": "包河区",
    "fullname": "包河区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340121",
    "areaId": "340121",
    "code": "340121",
    "name": "长丰县",
    "fullname": "长丰县",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340122",
    "areaId": "340122",
    "code": "340122",
    "name": "肥东县",
    "fullname": "肥东县",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340123",
    "areaId": "340123",
    "code": "340123",
    "name": "肥西县",
    "fullname": "肥西县",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340124",
    "areaId": "340124",
    "code": "340124",
    "name": "庐江县",
    "fullname": "庐江县",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340171",
    "areaId": "340171",
    "code": "340171",
    "name": "合肥高新技术产业开发区",
    "fullname": "合肥高新技术产业开发区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340172",
    "areaId": "340172",
    "code": "340172",
    "name": "合肥经济技术开发区",
    "fullname": "合肥经济技术开发区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340173",
    "areaId": "340173",
    "code": "340173",
    "name": "合肥新站高新技术产业开发区",
    "fullname": "合肥新站高新技术产业开发区",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340181",
    "areaId": "340181",
    "code": "340181",
    "name": "巢湖市",
    "fullname": "巢湖市",
    "level": 3,
    "parentId": "340100"
  },
  {
    "id": "340201",
    "areaId": "340201",
    "code": "340201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340202",
    "areaId": "340202",
    "code": "340202",
    "name": "镜湖区",
    "fullname": "镜湖区",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340203",
    "areaId": "340203",
    "code": "340203",
    "name": "弋江区",
    "fullname": "弋江区",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340207",
    "areaId": "340207",
    "code": "340207",
    "name": "鸠江区",
    "fullname": "鸠江区",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340208",
    "areaId": "340208",
    "code": "340208",
    "name": "三山区",
    "fullname": "三山区",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340221",
    "areaId": "340221",
    "code": "340221",
    "name": "芜湖县",
    "fullname": "芜湖县",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340222",
    "areaId": "340222",
    "code": "340222",
    "name": "繁昌县",
    "fullname": "繁昌县",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340223",
    "areaId": "340223",
    "code": "340223",
    "name": "南陵县",
    "fullname": "南陵县",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340225",
    "areaId": "340225",
    "code": "340225",
    "name": "无为县",
    "fullname": "无为县",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340271",
    "areaId": "340271",
    "code": "340271",
    "name": "芜湖经济技术开发区",
    "fullname": "芜湖经济技术开发区",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340272",
    "areaId": "340272",
    "code": "340272",
    "name": "安徽芜湖长江大桥经济开发区",
    "fullname": "安徽芜湖长江大桥经济开发区",
    "level": 3,
    "parentId": "340200"
  },
  {
    "id": "340301",
    "areaId": "340301",
    "code": "340301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340302",
    "areaId": "340302",
    "code": "340302",
    "name": "龙子湖区",
    "fullname": "龙子湖区",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340303",
    "areaId": "340303",
    "code": "340303",
    "name": "蚌山区",
    "fullname": "蚌山区",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340304",
    "areaId": "340304",
    "code": "340304",
    "name": "禹会区",
    "fullname": "禹会区",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340311",
    "areaId": "340311",
    "code": "340311",
    "name": "淮上区",
    "fullname": "淮上区",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340321",
    "areaId": "340321",
    "code": "340321",
    "name": "怀远县",
    "fullname": "怀远县",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340322",
    "areaId": "340322",
    "code": "340322",
    "name": "五河县",
    "fullname": "五河县",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340323",
    "areaId": "340323",
    "code": "340323",
    "name": "固镇县",
    "fullname": "固镇县",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340371",
    "areaId": "340371",
    "code": "340371",
    "name": "蚌埠市高新技术开发区",
    "fullname": "蚌埠市高新技术开发区",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340372",
    "areaId": "340372",
    "code": "340372",
    "name": "蚌埠市经济开发区",
    "fullname": "蚌埠市经济开发区",
    "level": 3,
    "parentId": "340300"
  },
  {
    "id": "340401",
    "areaId": "340401",
    "code": "340401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340402",
    "areaId": "340402",
    "code": "340402",
    "name": "大通区",
    "fullname": "大通区",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340403",
    "areaId": "340403",
    "code": "340403",
    "name": "田家庵区",
    "fullname": "田家庵区",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340404",
    "areaId": "340404",
    "code": "340404",
    "name": "谢家集区",
    "fullname": "谢家集区",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340405",
    "areaId": "340405",
    "code": "340405",
    "name": "八公山区",
    "fullname": "八公山区",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340406",
    "areaId": "340406",
    "code": "340406",
    "name": "潘集区",
    "fullname": "潘集区",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340421",
    "areaId": "340421",
    "code": "340421",
    "name": "凤台县",
    "fullname": "凤台县",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340422",
    "areaId": "340422",
    "code": "340422",
    "name": "寿县",
    "fullname": "寿县",
    "level": 3,
    "parentId": "340400"
  },
  {
    "id": "340501",
    "areaId": "340501",
    "code": "340501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340500"
  },
  {
    "id": "340503",
    "areaId": "340503",
    "code": "340503",
    "name": "花山区",
    "fullname": "花山区",
    "level": 3,
    "parentId": "340500"
  },
  {
    "id": "340504",
    "areaId": "340504",
    "code": "340504",
    "name": "雨山区",
    "fullname": "雨山区",
    "level": 3,
    "parentId": "340500"
  },
  {
    "id": "340506",
    "areaId": "340506",
    "code": "340506",
    "name": "博望区",
    "fullname": "博望区",
    "level": 3,
    "parentId": "340500"
  },
  {
    "id": "340521",
    "areaId": "340521",
    "code": "340521",
    "name": "当涂县",
    "fullname": "当涂县",
    "level": 3,
    "parentId": "340500"
  },
  {
    "id": "340522",
    "areaId": "340522",
    "code": "340522",
    "name": "含山县",
    "fullname": "含山县",
    "level": 3,
    "parentId": "340500"
  },
  {
    "id": "340523",
    "areaId": "340523",
    "code": "340523",
    "name": "和县",
    "fullname": "和县",
    "level": 3,
    "parentId": "340500"
  },
  {
    "id": "340601",
    "areaId": "340601",
    "code": "340601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340600"
  },
  {
    "id": "340602",
    "areaId": "340602",
    "code": "340602",
    "name": "杜集区",
    "fullname": "杜集区",
    "level": 3,
    "parentId": "340600"
  },
  {
    "id": "340603",
    "areaId": "340603",
    "code": "340603",
    "name": "相山区",
    "fullname": "相山区",
    "level": 3,
    "parentId": "340600"
  },
  {
    "id": "340604",
    "areaId": "340604",
    "code": "340604",
    "name": "烈山区",
    "fullname": "烈山区",
    "level": 3,
    "parentId": "340600"
  },
  {
    "id": "340621",
    "areaId": "340621",
    "code": "340621",
    "name": "濉溪县",
    "fullname": "濉溪县",
    "level": 3,
    "parentId": "340600"
  },
  {
    "id": "340701",
    "areaId": "340701",
    "code": "340701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340700"
  },
  {
    "id": "340705",
    "areaId": "340705",
    "code": "340705",
    "name": "铜官区",
    "fullname": "铜官区",
    "level": 3,
    "parentId": "340700"
  },
  {
    "id": "340706",
    "areaId": "340706",
    "code": "340706",
    "name": "义安区",
    "fullname": "义安区",
    "level": 3,
    "parentId": "340700"
  },
  {
    "id": "340711",
    "areaId": "340711",
    "code": "340711",
    "name": "郊区",
    "fullname": "郊区",
    "level": 3,
    "parentId": "340700"
  },
  {
    "id": "340722",
    "areaId": "340722",
    "code": "340722",
    "name": "枞阳县",
    "fullname": "枞阳县",
    "level": 3,
    "parentId": "340700"
  },
  {
    "id": "340801",
    "areaId": "340801",
    "code": "340801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340802",
    "areaId": "340802",
    "code": "340802",
    "name": "迎江区",
    "fullname": "迎江区",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340803",
    "areaId": "340803",
    "code": "340803",
    "name": "大观区",
    "fullname": "大观区",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340811",
    "areaId": "340811",
    "code": "340811",
    "name": "宜秀区",
    "fullname": "宜秀区",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340822",
    "areaId": "340822",
    "code": "340822",
    "name": "怀宁县",
    "fullname": "怀宁县",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340825",
    "areaId": "340825",
    "code": "340825",
    "name": "太湖县",
    "fullname": "太湖县",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340826",
    "areaId": "340826",
    "code": "340826",
    "name": "宿松县",
    "fullname": "宿松县",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340827",
    "areaId": "340827",
    "code": "340827",
    "name": "望江县",
    "fullname": "望江县",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340828",
    "areaId": "340828",
    "code": "340828",
    "name": "岳西县",
    "fullname": "岳西县",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340871",
    "areaId": "340871",
    "code": "340871",
    "name": "安徽安庆经济开发区",
    "fullname": "安徽安庆经济开发区",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340881",
    "areaId": "340881",
    "code": "340881",
    "name": "桐城市",
    "fullname": "桐城市",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "340882",
    "areaId": "340882",
    "code": "340882",
    "name": "潜山市",
    "fullname": "潜山市",
    "level": 3,
    "parentId": "340800"
  },
  {
    "id": "341001",
    "areaId": "341001",
    "code": "341001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341002",
    "areaId": "341002",
    "code": "341002",
    "name": "屯溪区",
    "fullname": "屯溪区",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341003",
    "areaId": "341003",
    "code": "341003",
    "name": "黄山区",
    "fullname": "黄山区",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341004",
    "areaId": "341004",
    "code": "341004",
    "name": "徽州区",
    "fullname": "徽州区",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341021",
    "areaId": "341021",
    "code": "341021",
    "name": "歙县",
    "fullname": "歙县",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341022",
    "areaId": "341022",
    "code": "341022",
    "name": "休宁县",
    "fullname": "休宁县",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341023",
    "areaId": "341023",
    "code": "341023",
    "name": "黟县",
    "fullname": "黟县",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341024",
    "areaId": "341024",
    "code": "341024",
    "name": "祁门县",
    "fullname": "祁门县",
    "level": 3,
    "parentId": "341000"
  },
  {
    "id": "341101",
    "areaId": "341101",
    "code": "341101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341102",
    "areaId": "341102",
    "code": "341102",
    "name": "琅琊区",
    "fullname": "琅琊区",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341103",
    "areaId": "341103",
    "code": "341103",
    "name": "南谯区",
    "fullname": "南谯区",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341122",
    "areaId": "341122",
    "code": "341122",
    "name": "来安县",
    "fullname": "来安县",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341124",
    "areaId": "341124",
    "code": "341124",
    "name": "全椒县",
    "fullname": "全椒县",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341125",
    "areaId": "341125",
    "code": "341125",
    "name": "定远县",
    "fullname": "定远县",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341126",
    "areaId": "341126",
    "code": "341126",
    "name": "凤阳县",
    "fullname": "凤阳县",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341171",
    "areaId": "341171",
    "code": "341171",
    "name": "苏滁现代产业园",
    "fullname": "苏滁现代产业园",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341172",
    "areaId": "341172",
    "code": "341172",
    "name": "滁州经济技术开发区",
    "fullname": "滁州经济技术开发区",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341181",
    "areaId": "341181",
    "code": "341181",
    "name": "天长市",
    "fullname": "天长市",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341182",
    "areaId": "341182",
    "code": "341182",
    "name": "明光市",
    "fullname": "明光市",
    "level": 3,
    "parentId": "341100"
  },
  {
    "id": "341201",
    "areaId": "341201",
    "code": "341201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341202",
    "areaId": "341202",
    "code": "341202",
    "name": "颍州区",
    "fullname": "颍州区",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341203",
    "areaId": "341203",
    "code": "341203",
    "name": "颍东区",
    "fullname": "颍东区",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341204",
    "areaId": "341204",
    "code": "341204",
    "name": "颍泉区",
    "fullname": "颍泉区",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341221",
    "areaId": "341221",
    "code": "341221",
    "name": "临泉县",
    "fullname": "临泉县",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341222",
    "areaId": "341222",
    "code": "341222",
    "name": "太和县",
    "fullname": "太和县",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341225",
    "areaId": "341225",
    "code": "341225",
    "name": "阜南县",
    "fullname": "阜南县",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341226",
    "areaId": "341226",
    "code": "341226",
    "name": "颍上县",
    "fullname": "颍上县",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341271",
    "areaId": "341271",
    "code": "341271",
    "name": "阜阳合肥现代产业园区",
    "fullname": "阜阳合肥现代产业园区",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341272",
    "areaId": "341272",
    "code": "341272",
    "name": "阜阳经济技术开发区",
    "fullname": "阜阳经济技术开发区",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341282",
    "areaId": "341282",
    "code": "341282",
    "name": "界首市",
    "fullname": "界首市",
    "level": 3,
    "parentId": "341200"
  },
  {
    "id": "341301",
    "areaId": "341301",
    "code": "341301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341302",
    "areaId": "341302",
    "code": "341302",
    "name": "埇桥区",
    "fullname": "埇桥区",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341321",
    "areaId": "341321",
    "code": "341321",
    "name": "砀山县",
    "fullname": "砀山县",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341322",
    "areaId": "341322",
    "code": "341322",
    "name": "萧县",
    "fullname": "萧县",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341323",
    "areaId": "341323",
    "code": "341323",
    "name": "灵璧县",
    "fullname": "灵璧县",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341324",
    "areaId": "341324",
    "code": "341324",
    "name": "泗县",
    "fullname": "泗县",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341371",
    "areaId": "341371",
    "code": "341371",
    "name": "宿州马鞍山现代产业园区",
    "fullname": "宿州马鞍山现代产业园区",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341372",
    "areaId": "341372",
    "code": "341372",
    "name": "宿州经济技术开发区",
    "fullname": "宿州经济技术开发区",
    "level": 3,
    "parentId": "341300"
  },
  {
    "id": "341501",
    "areaId": "341501",
    "code": "341501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341502",
    "areaId": "341502",
    "code": "341502",
    "name": "金安区",
    "fullname": "金安区",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341503",
    "areaId": "341503",
    "code": "341503",
    "name": "裕安区",
    "fullname": "裕安区",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341504",
    "areaId": "341504",
    "code": "341504",
    "name": "叶集区",
    "fullname": "叶集区",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341522",
    "areaId": "341522",
    "code": "341522",
    "name": "霍邱县",
    "fullname": "霍邱县",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341523",
    "areaId": "341523",
    "code": "341523",
    "name": "舒城县",
    "fullname": "舒城县",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341524",
    "areaId": "341524",
    "code": "341524",
    "name": "金寨县",
    "fullname": "金寨县",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341525",
    "areaId": "341525",
    "code": "341525",
    "name": "霍山县",
    "fullname": "霍山县",
    "level": 3,
    "parentId": "341500"
  },
  {
    "id": "341601",
    "areaId": "341601",
    "code": "341601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341600"
  },
  {
    "id": "341602",
    "areaId": "341602",
    "code": "341602",
    "name": "谯城区",
    "fullname": "谯城区",
    "level": 3,
    "parentId": "341600"
  },
  {
    "id": "341621",
    "areaId": "341621",
    "code": "341621",
    "name": "涡阳县",
    "fullname": "涡阳县",
    "level": 3,
    "parentId": "341600"
  },
  {
    "id": "341622",
    "areaId": "341622",
    "code": "341622",
    "name": "蒙城县",
    "fullname": "蒙城县",
    "level": 3,
    "parentId": "341600"
  },
  {
    "id": "341623",
    "areaId": "341623",
    "code": "341623",
    "name": "利辛县",
    "fullname": "利辛县",
    "level": 3,
    "parentId": "341600"
  },
  {
    "id": "341701",
    "areaId": "341701",
    "code": "341701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341700"
  },
  {
    "id": "341702",
    "areaId": "341702",
    "code": "341702",
    "name": "贵池区",
    "fullname": "贵池区",
    "level": 3,
    "parentId": "341700"
  },
  {
    "id": "341721",
    "areaId": "341721",
    "code": "341721",
    "name": "东至县",
    "fullname": "东至县",
    "level": 3,
    "parentId": "341700"
  },
  {
    "id": "341722",
    "areaId": "341722",
    "code": "341722",
    "name": "石台县",
    "fullname": "石台县",
    "level": 3,
    "parentId": "341700"
  },
  {
    "id": "341723",
    "areaId": "341723",
    "code": "341723",
    "name": "青阳县",
    "fullname": "青阳县",
    "level": 3,
    "parentId": "341700"
  },
  {
    "id": "341801",
    "areaId": "341801",
    "code": "341801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341802",
    "areaId": "341802",
    "code": "341802",
    "name": "宣州区",
    "fullname": "宣州区",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341821",
    "areaId": "341821",
    "code": "341821",
    "name": "郎溪县",
    "fullname": "郎溪县",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341823",
    "areaId": "341823",
    "code": "341823",
    "name": "泾县",
    "fullname": "泾县",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341824",
    "areaId": "341824",
    "code": "341824",
    "name": "绩溪县",
    "fullname": "绩溪县",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341825",
    "areaId": "341825",
    "code": "341825",
    "name": "旌德县",
    "fullname": "旌德县",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341871",
    "areaId": "341871",
    "code": "341871",
    "name": "宣城市经济开发区",
    "fullname": "宣城市经济开发区",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341881",
    "areaId": "341881",
    "code": "341881",
    "name": "宁国市",
    "fullname": "宁国市",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "341882",
    "areaId": "341882",
    "code": "341882",
    "name": "广德市",
    "fullname": "广德市",
    "level": 3,
    "parentId": "341800"
  },
  {
    "id": "350101",
    "areaId": "350101",
    "code": "350101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350102",
    "areaId": "350102",
    "code": "350102",
    "name": "鼓楼区",
    "fullname": "鼓楼区",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350103",
    "areaId": "350103",
    "code": "350103",
    "name": "台江区",
    "fullname": "台江区",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350104",
    "areaId": "350104",
    "code": "350104",
    "name": "仓山区",
    "fullname": "仓山区",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350105",
    "areaId": "350105",
    "code": "350105",
    "name": "马尾区",
    "fullname": "马尾区",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350111",
    "areaId": "350111",
    "code": "350111",
    "name": "晋安区",
    "fullname": "晋安区",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350112",
    "areaId": "350112",
    "code": "350112",
    "name": "长乐区",
    "fullname": "长乐区",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350121",
    "areaId": "350121",
    "code": "350121",
    "name": "闽侯县",
    "fullname": "闽侯县",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350122",
    "areaId": "350122",
    "code": "350122",
    "name": "连江县",
    "fullname": "连江县",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350123",
    "areaId": "350123",
    "code": "350123",
    "name": "罗源县",
    "fullname": "罗源县",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350124",
    "areaId": "350124",
    "code": "350124",
    "name": "闽清县",
    "fullname": "闽清县",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350125",
    "areaId": "350125",
    "code": "350125",
    "name": "永泰县",
    "fullname": "永泰县",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350128",
    "areaId": "350128",
    "code": "350128",
    "name": "平潭县",
    "fullname": "平潭县",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350181",
    "areaId": "350181",
    "code": "350181",
    "name": "福清市",
    "fullname": "福清市",
    "level": 3,
    "parentId": "350100"
  },
  {
    "id": "350201",
    "areaId": "350201",
    "code": "350201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350200"
  },
  {
    "id": "350203",
    "areaId": "350203",
    "code": "350203",
    "name": "思明区",
    "fullname": "思明区",
    "level": 3,
    "parentId": "350200"
  },
  {
    "id": "350205",
    "areaId": "350205",
    "code": "350205",
    "name": "海沧区",
    "fullname": "海沧区",
    "level": 3,
    "parentId": "350200"
  },
  {
    "id": "350206",
    "areaId": "350206",
    "code": "350206",
    "name": "湖里区",
    "fullname": "湖里区",
    "level": 3,
    "parentId": "350200"
  },
  {
    "id": "350211",
    "areaId": "350211",
    "code": "350211",
    "name": "集美区",
    "fullname": "集美区",
    "level": 3,
    "parentId": "350200"
  },
  {
    "id": "350212",
    "areaId": "350212",
    "code": "350212",
    "name": "同安区",
    "fullname": "同安区",
    "level": 3,
    "parentId": "350200"
  },
  {
    "id": "350213",
    "areaId": "350213",
    "code": "350213",
    "name": "翔安区",
    "fullname": "翔安区",
    "level": 3,
    "parentId": "350200"
  },
  {
    "id": "350301",
    "areaId": "350301",
    "code": "350301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350300"
  },
  {
    "id": "350302",
    "areaId": "350302",
    "code": "350302",
    "name": "城厢区",
    "fullname": "城厢区",
    "level": 3,
    "parentId": "350300"
  },
  {
    "id": "350303",
    "areaId": "350303",
    "code": "350303",
    "name": "涵江区",
    "fullname": "涵江区",
    "level": 3,
    "parentId": "350300"
  },
  {
    "id": "350304",
    "areaId": "350304",
    "code": "350304",
    "name": "荔城区",
    "fullname": "荔城区",
    "level": 3,
    "parentId": "350300"
  },
  {
    "id": "350305",
    "areaId": "350305",
    "code": "350305",
    "name": "秀屿区",
    "fullname": "秀屿区",
    "level": 3,
    "parentId": "350300"
  },
  {
    "id": "350322",
    "areaId": "350322",
    "code": "350322",
    "name": "仙游县",
    "fullname": "仙游县",
    "level": 3,
    "parentId": "350300"
  },
  {
    "id": "350401",
    "areaId": "350401",
    "code": "350401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350402",
    "areaId": "350402",
    "code": "350402",
    "name": "梅列区",
    "fullname": "梅列区",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350403",
    "areaId": "350403",
    "code": "350403",
    "name": "三元区",
    "fullname": "三元区",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350421",
    "areaId": "350421",
    "code": "350421",
    "name": "明溪县",
    "fullname": "明溪县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350423",
    "areaId": "350423",
    "code": "350423",
    "name": "清流县",
    "fullname": "清流县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350424",
    "areaId": "350424",
    "code": "350424",
    "name": "宁化县",
    "fullname": "宁化县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350425",
    "areaId": "350425",
    "code": "350425",
    "name": "大田县",
    "fullname": "大田县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350426",
    "areaId": "350426",
    "code": "350426",
    "name": "尤溪县",
    "fullname": "尤溪县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350427",
    "areaId": "350427",
    "code": "350427",
    "name": "沙县",
    "fullname": "沙县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350428",
    "areaId": "350428",
    "code": "350428",
    "name": "将乐县",
    "fullname": "将乐县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350429",
    "areaId": "350429",
    "code": "350429",
    "name": "泰宁县",
    "fullname": "泰宁县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350430",
    "areaId": "350430",
    "code": "350430",
    "name": "建宁县",
    "fullname": "建宁县",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350481",
    "areaId": "350481",
    "code": "350481",
    "name": "永安市",
    "fullname": "永安市",
    "level": 3,
    "parentId": "350400"
  },
  {
    "id": "350501",
    "areaId": "350501",
    "code": "350501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350502",
    "areaId": "350502",
    "code": "350502",
    "name": "鲤城区",
    "fullname": "鲤城区",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350503",
    "areaId": "350503",
    "code": "350503",
    "name": "丰泽区",
    "fullname": "丰泽区",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350504",
    "areaId": "350504",
    "code": "350504",
    "name": "洛江区",
    "fullname": "洛江区",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350505",
    "areaId": "350505",
    "code": "350505",
    "name": "泉港区",
    "fullname": "泉港区",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350521",
    "areaId": "350521",
    "code": "350521",
    "name": "惠安县",
    "fullname": "惠安县",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350524",
    "areaId": "350524",
    "code": "350524",
    "name": "安溪县",
    "fullname": "安溪县",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350525",
    "areaId": "350525",
    "code": "350525",
    "name": "永春县",
    "fullname": "永春县",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350526",
    "areaId": "350526",
    "code": "350526",
    "name": "德化县",
    "fullname": "德化县",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350527",
    "areaId": "350527",
    "code": "350527",
    "name": "金门县",
    "fullname": "金门县",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350581",
    "areaId": "350581",
    "code": "350581",
    "name": "石狮市",
    "fullname": "石狮市",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350582",
    "areaId": "350582",
    "code": "350582",
    "name": "晋江市",
    "fullname": "晋江市",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350583",
    "areaId": "350583",
    "code": "350583",
    "name": "南安市",
    "fullname": "南安市",
    "level": 3,
    "parentId": "350500"
  },
  {
    "id": "350601",
    "areaId": "350601",
    "code": "350601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350602",
    "areaId": "350602",
    "code": "350602",
    "name": "芗城区",
    "fullname": "芗城区",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350603",
    "areaId": "350603",
    "code": "350603",
    "name": "龙文区",
    "fullname": "龙文区",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350622",
    "areaId": "350622",
    "code": "350622",
    "name": "云霄县",
    "fullname": "云霄县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350623",
    "areaId": "350623",
    "code": "350623",
    "name": "漳浦县",
    "fullname": "漳浦县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350624",
    "areaId": "350624",
    "code": "350624",
    "name": "诏安县",
    "fullname": "诏安县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350625",
    "areaId": "350625",
    "code": "350625",
    "name": "长泰县",
    "fullname": "长泰县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350626",
    "areaId": "350626",
    "code": "350626",
    "name": "东山县",
    "fullname": "东山县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350627",
    "areaId": "350627",
    "code": "350627",
    "name": "南靖县",
    "fullname": "南靖县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350628",
    "areaId": "350628",
    "code": "350628",
    "name": "平和县",
    "fullname": "平和县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350629",
    "areaId": "350629",
    "code": "350629",
    "name": "华安县",
    "fullname": "华安县",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350681",
    "areaId": "350681",
    "code": "350681",
    "name": "龙海市",
    "fullname": "龙海市",
    "level": 3,
    "parentId": "350600"
  },
  {
    "id": "350701",
    "areaId": "350701",
    "code": "350701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350702",
    "areaId": "350702",
    "code": "350702",
    "name": "延平区",
    "fullname": "延平区",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350703",
    "areaId": "350703",
    "code": "350703",
    "name": "建阳区",
    "fullname": "建阳区",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350721",
    "areaId": "350721",
    "code": "350721",
    "name": "顺昌县",
    "fullname": "顺昌县",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350722",
    "areaId": "350722",
    "code": "350722",
    "name": "浦城县",
    "fullname": "浦城县",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350723",
    "areaId": "350723",
    "code": "350723",
    "name": "光泽县",
    "fullname": "光泽县",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350724",
    "areaId": "350724",
    "code": "350724",
    "name": "松溪县",
    "fullname": "松溪县",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350725",
    "areaId": "350725",
    "code": "350725",
    "name": "政和县",
    "fullname": "政和县",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350781",
    "areaId": "350781",
    "code": "350781",
    "name": "邵武市",
    "fullname": "邵武市",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350782",
    "areaId": "350782",
    "code": "350782",
    "name": "武夷山市",
    "fullname": "武夷山市",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350783",
    "areaId": "350783",
    "code": "350783",
    "name": "建瓯市",
    "fullname": "建瓯市",
    "level": 3,
    "parentId": "350700"
  },
  {
    "id": "350801",
    "areaId": "350801",
    "code": "350801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350802",
    "areaId": "350802",
    "code": "350802",
    "name": "新罗区",
    "fullname": "新罗区",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350803",
    "areaId": "350803",
    "code": "350803",
    "name": "永定区",
    "fullname": "永定区",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350821",
    "areaId": "350821",
    "code": "350821",
    "name": "长汀县",
    "fullname": "长汀县",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350823",
    "areaId": "350823",
    "code": "350823",
    "name": "上杭县",
    "fullname": "上杭县",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350824",
    "areaId": "350824",
    "code": "350824",
    "name": "武平县",
    "fullname": "武平县",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350825",
    "areaId": "350825",
    "code": "350825",
    "name": "连城县",
    "fullname": "连城县",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350881",
    "areaId": "350881",
    "code": "350881",
    "name": "漳平市",
    "fullname": "漳平市",
    "level": 3,
    "parentId": "350800"
  },
  {
    "id": "350901",
    "areaId": "350901",
    "code": "350901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350902",
    "areaId": "350902",
    "code": "350902",
    "name": "蕉城区",
    "fullname": "蕉城区",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350921",
    "areaId": "350921",
    "code": "350921",
    "name": "霞浦县",
    "fullname": "霞浦县",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350922",
    "areaId": "350922",
    "code": "350922",
    "name": "古田县",
    "fullname": "古田县",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350923",
    "areaId": "350923",
    "code": "350923",
    "name": "屏南县",
    "fullname": "屏南县",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350924",
    "areaId": "350924",
    "code": "350924",
    "name": "寿宁县",
    "fullname": "寿宁县",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350925",
    "areaId": "350925",
    "code": "350925",
    "name": "周宁县",
    "fullname": "周宁县",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350926",
    "areaId": "350926",
    "code": "350926",
    "name": "柘荣县",
    "fullname": "柘荣县",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350981",
    "areaId": "350981",
    "code": "350981",
    "name": "福安市",
    "fullname": "福安市",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "350982",
    "areaId": "350982",
    "code": "350982",
    "name": "福鼎市",
    "fullname": "福鼎市",
    "level": 3,
    "parentId": "350900"
  },
  {
    "id": "360101",
    "areaId": "360101",
    "code": "360101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360102",
    "areaId": "360102",
    "code": "360102",
    "name": "东湖区",
    "fullname": "东湖区",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360103",
    "areaId": "360103",
    "code": "360103",
    "name": "西湖区",
    "fullname": "西湖区",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360104",
    "areaId": "360104",
    "code": "360104",
    "name": "青云谱区",
    "fullname": "青云谱区",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360105",
    "areaId": "360105",
    "code": "360105",
    "name": "湾里区",
    "fullname": "湾里区",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360111",
    "areaId": "360111",
    "code": "360111",
    "name": "青山湖区",
    "fullname": "青山湖区",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360112",
    "areaId": "360112",
    "code": "360112",
    "name": "新建区",
    "fullname": "新建区",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360121",
    "areaId": "360121",
    "code": "360121",
    "name": "南昌县",
    "fullname": "南昌县",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360123",
    "areaId": "360123",
    "code": "360123",
    "name": "安义县",
    "fullname": "安义县",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360124",
    "areaId": "360124",
    "code": "360124",
    "name": "进贤县",
    "fullname": "进贤县",
    "level": 3,
    "parentId": "360100"
  },
  {
    "id": "360201",
    "areaId": "360201",
    "code": "360201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360200"
  },
  {
    "id": "360202",
    "areaId": "360202",
    "code": "360202",
    "name": "昌江区",
    "fullname": "昌江区",
    "level": 3,
    "parentId": "360200"
  },
  {
    "id": "360203",
    "areaId": "360203",
    "code": "360203",
    "name": "珠山区",
    "fullname": "珠山区",
    "level": 3,
    "parentId": "360200"
  },
  {
    "id": "360222",
    "areaId": "360222",
    "code": "360222",
    "name": "浮梁县",
    "fullname": "浮梁县",
    "level": 3,
    "parentId": "360200"
  },
  {
    "id": "360281",
    "areaId": "360281",
    "code": "360281",
    "name": "乐平市",
    "fullname": "乐平市",
    "level": 3,
    "parentId": "360200"
  },
  {
    "id": "360301",
    "areaId": "360301",
    "code": "360301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360300"
  },
  {
    "id": "360302",
    "areaId": "360302",
    "code": "360302",
    "name": "安源区",
    "fullname": "安源区",
    "level": 3,
    "parentId": "360300"
  },
  {
    "id": "360313",
    "areaId": "360313",
    "code": "360313",
    "name": "湘东区",
    "fullname": "湘东区",
    "level": 3,
    "parentId": "360300"
  },
  {
    "id": "360321",
    "areaId": "360321",
    "code": "360321",
    "name": "莲花县",
    "fullname": "莲花县",
    "level": 3,
    "parentId": "360300"
  },
  {
    "id": "360322",
    "areaId": "360322",
    "code": "360322",
    "name": "上栗县",
    "fullname": "上栗县",
    "level": 3,
    "parentId": "360300"
  },
  {
    "id": "360323",
    "areaId": "360323",
    "code": "360323",
    "name": "芦溪县",
    "fullname": "芦溪县",
    "level": 3,
    "parentId": "360300"
  },
  {
    "id": "360401",
    "areaId": "360401",
    "code": "360401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360402",
    "areaId": "360402",
    "code": "360402",
    "name": "濂溪区",
    "fullname": "濂溪区",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360403",
    "areaId": "360403",
    "code": "360403",
    "name": "浔阳区",
    "fullname": "浔阳区",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360404",
    "areaId": "360404",
    "code": "360404",
    "name": "柴桑区",
    "fullname": "柴桑区",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360423",
    "areaId": "360423",
    "code": "360423",
    "name": "武宁县",
    "fullname": "武宁县",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360424",
    "areaId": "360424",
    "code": "360424",
    "name": "修水县",
    "fullname": "修水县",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360425",
    "areaId": "360425",
    "code": "360425",
    "name": "永修县",
    "fullname": "永修县",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360426",
    "areaId": "360426",
    "code": "360426",
    "name": "德安县",
    "fullname": "德安县",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360428",
    "areaId": "360428",
    "code": "360428",
    "name": "都昌县",
    "fullname": "都昌县",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360429",
    "areaId": "360429",
    "code": "360429",
    "name": "湖口县",
    "fullname": "湖口县",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360430",
    "areaId": "360430",
    "code": "360430",
    "name": "彭泽县",
    "fullname": "彭泽县",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360481",
    "areaId": "360481",
    "code": "360481",
    "name": "瑞昌市",
    "fullname": "瑞昌市",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360482",
    "areaId": "360482",
    "code": "360482",
    "name": "共青城市",
    "fullname": "共青城市",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360483",
    "areaId": "360483",
    "code": "360483",
    "name": "庐山市",
    "fullname": "庐山市",
    "level": 3,
    "parentId": "360400"
  },
  {
    "id": "360501",
    "areaId": "360501",
    "code": "360501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360500"
  },
  {
    "id": "360502",
    "areaId": "360502",
    "code": "360502",
    "name": "渝水区",
    "fullname": "渝水区",
    "level": 3,
    "parentId": "360500"
  },
  {
    "id": "360521",
    "areaId": "360521",
    "code": "360521",
    "name": "分宜县",
    "fullname": "分宜县",
    "level": 3,
    "parentId": "360500"
  },
  {
    "id": "360601",
    "areaId": "360601",
    "code": "360601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360600"
  },
  {
    "id": "360602",
    "areaId": "360602",
    "code": "360602",
    "name": "月湖区",
    "fullname": "月湖区",
    "level": 3,
    "parentId": "360600"
  },
  {
    "id": "360603",
    "areaId": "360603",
    "code": "360603",
    "name": "余江区",
    "fullname": "余江区",
    "level": 3,
    "parentId": "360600"
  },
  {
    "id": "360681",
    "areaId": "360681",
    "code": "360681",
    "name": "贵溪市",
    "fullname": "贵溪市",
    "level": 3,
    "parentId": "360600"
  },
  {
    "id": "360701",
    "areaId": "360701",
    "code": "360701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360702",
    "areaId": "360702",
    "code": "360702",
    "name": "章贡区",
    "fullname": "章贡区",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360703",
    "areaId": "360703",
    "code": "360703",
    "name": "南康区",
    "fullname": "南康区",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360704",
    "areaId": "360704",
    "code": "360704",
    "name": "赣县区",
    "fullname": "赣县区",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360722",
    "areaId": "360722",
    "code": "360722",
    "name": "信丰县",
    "fullname": "信丰县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360723",
    "areaId": "360723",
    "code": "360723",
    "name": "大余县",
    "fullname": "大余县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360724",
    "areaId": "360724",
    "code": "360724",
    "name": "上犹县",
    "fullname": "上犹县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360725",
    "areaId": "360725",
    "code": "360725",
    "name": "崇义县",
    "fullname": "崇义县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360726",
    "areaId": "360726",
    "code": "360726",
    "name": "安远县",
    "fullname": "安远县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360727",
    "areaId": "360727",
    "code": "360727",
    "name": "龙南县",
    "fullname": "龙南县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360728",
    "areaId": "360728",
    "code": "360728",
    "name": "定南县",
    "fullname": "定南县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360729",
    "areaId": "360729",
    "code": "360729",
    "name": "全南县",
    "fullname": "全南县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360730",
    "areaId": "360730",
    "code": "360730",
    "name": "宁都县",
    "fullname": "宁都县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360731",
    "areaId": "360731",
    "code": "360731",
    "name": "于都县",
    "fullname": "于都县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360732",
    "areaId": "360732",
    "code": "360732",
    "name": "兴国县",
    "fullname": "兴国县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360733",
    "areaId": "360733",
    "code": "360733",
    "name": "会昌县",
    "fullname": "会昌县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360734",
    "areaId": "360734",
    "code": "360734",
    "name": "寻乌县",
    "fullname": "寻乌县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360735",
    "areaId": "360735",
    "code": "360735",
    "name": "石城县",
    "fullname": "石城县",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360781",
    "areaId": "360781",
    "code": "360781",
    "name": "瑞金市",
    "fullname": "瑞金市",
    "level": 3,
    "parentId": "360700"
  },
  {
    "id": "360801",
    "areaId": "360801",
    "code": "360801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360802",
    "areaId": "360802",
    "code": "360802",
    "name": "吉州区",
    "fullname": "吉州区",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360803",
    "areaId": "360803",
    "code": "360803",
    "name": "青原区",
    "fullname": "青原区",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360821",
    "areaId": "360821",
    "code": "360821",
    "name": "吉安县",
    "fullname": "吉安县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360822",
    "areaId": "360822",
    "code": "360822",
    "name": "吉水县",
    "fullname": "吉水县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360823",
    "areaId": "360823",
    "code": "360823",
    "name": "峡江县",
    "fullname": "峡江县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360824",
    "areaId": "360824",
    "code": "360824",
    "name": "新干县",
    "fullname": "新干县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360825",
    "areaId": "360825",
    "code": "360825",
    "name": "永丰县",
    "fullname": "永丰县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360826",
    "areaId": "360826",
    "code": "360826",
    "name": "泰和县",
    "fullname": "泰和县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360827",
    "areaId": "360827",
    "code": "360827",
    "name": "遂川县",
    "fullname": "遂川县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360828",
    "areaId": "360828",
    "code": "360828",
    "name": "万安县",
    "fullname": "万安县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360829",
    "areaId": "360829",
    "code": "360829",
    "name": "安福县",
    "fullname": "安福县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360830",
    "areaId": "360830",
    "code": "360830",
    "name": "永新县",
    "fullname": "永新县",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360881",
    "areaId": "360881",
    "code": "360881",
    "name": "井冈山市",
    "fullname": "井冈山市",
    "level": 3,
    "parentId": "360800"
  },
  {
    "id": "360901",
    "areaId": "360901",
    "code": "360901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360902",
    "areaId": "360902",
    "code": "360902",
    "name": "袁州区",
    "fullname": "袁州区",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360921",
    "areaId": "360921",
    "code": "360921",
    "name": "奉新县",
    "fullname": "奉新县",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360922",
    "areaId": "360922",
    "code": "360922",
    "name": "万载县",
    "fullname": "万载县",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360923",
    "areaId": "360923",
    "code": "360923",
    "name": "上高县",
    "fullname": "上高县",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360924",
    "areaId": "360924",
    "code": "360924",
    "name": "宜丰县",
    "fullname": "宜丰县",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360925",
    "areaId": "360925",
    "code": "360925",
    "name": "靖安县",
    "fullname": "靖安县",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360926",
    "areaId": "360926",
    "code": "360926",
    "name": "铜鼓县",
    "fullname": "铜鼓县",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360981",
    "areaId": "360981",
    "code": "360981",
    "name": "丰城市",
    "fullname": "丰城市",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360982",
    "areaId": "360982",
    "code": "360982",
    "name": "樟树市",
    "fullname": "樟树市",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "360983",
    "areaId": "360983",
    "code": "360983",
    "name": "高安市",
    "fullname": "高安市",
    "level": 3,
    "parentId": "360900"
  },
  {
    "id": "361001",
    "areaId": "361001",
    "code": "361001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361002",
    "areaId": "361002",
    "code": "361002",
    "name": "临川区",
    "fullname": "临川区",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361003",
    "areaId": "361003",
    "code": "361003",
    "name": "东乡区",
    "fullname": "东乡区",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361021",
    "areaId": "361021",
    "code": "361021",
    "name": "南城县",
    "fullname": "南城县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361022",
    "areaId": "361022",
    "code": "361022",
    "name": "黎川县",
    "fullname": "黎川县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361023",
    "areaId": "361023",
    "code": "361023",
    "name": "南丰县",
    "fullname": "南丰县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361024",
    "areaId": "361024",
    "code": "361024",
    "name": "崇仁县",
    "fullname": "崇仁县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361025",
    "areaId": "361025",
    "code": "361025",
    "name": "乐安县",
    "fullname": "乐安县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361026",
    "areaId": "361026",
    "code": "361026",
    "name": "宜黄县",
    "fullname": "宜黄县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361027",
    "areaId": "361027",
    "code": "361027",
    "name": "金溪县",
    "fullname": "金溪县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361028",
    "areaId": "361028",
    "code": "361028",
    "name": "资溪县",
    "fullname": "资溪县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361030",
    "areaId": "361030",
    "code": "361030",
    "name": "广昌县",
    "fullname": "广昌县",
    "level": 3,
    "parentId": "361000"
  },
  {
    "id": "361101",
    "areaId": "361101",
    "code": "361101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361102",
    "areaId": "361102",
    "code": "361102",
    "name": "信州区",
    "fullname": "信州区",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361103",
    "areaId": "361103",
    "code": "361103",
    "name": "广丰区",
    "fullname": "广丰区",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361104",
    "areaId": "361104",
    "code": "361104",
    "name": "广信区",
    "fullname": "广信区",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361123",
    "areaId": "361123",
    "code": "361123",
    "name": "玉山县",
    "fullname": "玉山县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361124",
    "areaId": "361124",
    "code": "361124",
    "name": "铅山县",
    "fullname": "铅山县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361125",
    "areaId": "361125",
    "code": "361125",
    "name": "横峰县",
    "fullname": "横峰县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361126",
    "areaId": "361126",
    "code": "361126",
    "name": "弋阳县",
    "fullname": "弋阳县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361127",
    "areaId": "361127",
    "code": "361127",
    "name": "余干县",
    "fullname": "余干县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361128",
    "areaId": "361128",
    "code": "361128",
    "name": "鄱阳县",
    "fullname": "鄱阳县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361129",
    "areaId": "361129",
    "code": "361129",
    "name": "万年县",
    "fullname": "万年县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361130",
    "areaId": "361130",
    "code": "361130",
    "name": "婺源县",
    "fullname": "婺源县",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "361181",
    "areaId": "361181",
    "code": "361181",
    "name": "德兴市",
    "fullname": "德兴市",
    "level": 3,
    "parentId": "361100"
  },
  {
    "id": "370101",
    "areaId": "370101",
    "code": "370101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370102",
    "areaId": "370102",
    "code": "370102",
    "name": "历下区",
    "fullname": "历下区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370103",
    "areaId": "370103",
    "code": "370103",
    "name": "市中区",
    "fullname": "市中区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370104",
    "areaId": "370104",
    "code": "370104",
    "name": "槐荫区",
    "fullname": "槐荫区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370105",
    "areaId": "370105",
    "code": "370105",
    "name": "天桥区",
    "fullname": "天桥区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370112",
    "areaId": "370112",
    "code": "370112",
    "name": "历城区",
    "fullname": "历城区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370113",
    "areaId": "370113",
    "code": "370113",
    "name": "长清区",
    "fullname": "长清区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370114",
    "areaId": "370114",
    "code": "370114",
    "name": "章丘区",
    "fullname": "章丘区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370115",
    "areaId": "370115",
    "code": "370115",
    "name": "济阳区",
    "fullname": "济阳区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370116",
    "areaId": "370116",
    "code": "370116",
    "name": "莱芜区",
    "fullname": "莱芜区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370117",
    "areaId": "370117",
    "code": "370117",
    "name": "钢城区",
    "fullname": "钢城区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370124",
    "areaId": "370124",
    "code": "370124",
    "name": "平阴县",
    "fullname": "平阴县",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370126",
    "areaId": "370126",
    "code": "370126",
    "name": "商河县",
    "fullname": "商河县",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370171",
    "areaId": "370171",
    "code": "370171",
    "name": "济南高新技术产业开发区",
    "fullname": "济南高新技术产业开发区",
    "level": 3,
    "parentId": "370100"
  },
  {
    "id": "370201",
    "areaId": "370201",
    "code": "370201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370202",
    "areaId": "370202",
    "code": "370202",
    "name": "市南区",
    "fullname": "市南区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370203",
    "areaId": "370203",
    "code": "370203",
    "name": "市北区",
    "fullname": "市北区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370211",
    "areaId": "370211",
    "code": "370211",
    "name": "黄岛区",
    "fullname": "黄岛区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370212",
    "areaId": "370212",
    "code": "370212",
    "name": "崂山区",
    "fullname": "崂山区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370213",
    "areaId": "370213",
    "code": "370213",
    "name": "李沧区",
    "fullname": "李沧区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370214",
    "areaId": "370214",
    "code": "370214",
    "name": "城阳区",
    "fullname": "城阳区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370215",
    "areaId": "370215",
    "code": "370215",
    "name": "即墨区",
    "fullname": "即墨区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370271",
    "areaId": "370271",
    "code": "370271",
    "name": "青岛高新技术产业开发区",
    "fullname": "青岛高新技术产业开发区",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370281",
    "areaId": "370281",
    "code": "370281",
    "name": "胶州市",
    "fullname": "胶州市",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370283",
    "areaId": "370283",
    "code": "370283",
    "name": "平度市",
    "fullname": "平度市",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370285",
    "areaId": "370285",
    "code": "370285",
    "name": "莱西市",
    "fullname": "莱西市",
    "level": 3,
    "parentId": "370200"
  },
  {
    "id": "370301",
    "areaId": "370301",
    "code": "370301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370302",
    "areaId": "370302",
    "code": "370302",
    "name": "淄川区",
    "fullname": "淄川区",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370303",
    "areaId": "370303",
    "code": "370303",
    "name": "张店区",
    "fullname": "张店区",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370304",
    "areaId": "370304",
    "code": "370304",
    "name": "博山区",
    "fullname": "博山区",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370305",
    "areaId": "370305",
    "code": "370305",
    "name": "临淄区",
    "fullname": "临淄区",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370306",
    "areaId": "370306",
    "code": "370306",
    "name": "周村区",
    "fullname": "周村区",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370321",
    "areaId": "370321",
    "code": "370321",
    "name": "桓台县",
    "fullname": "桓台县",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370322",
    "areaId": "370322",
    "code": "370322",
    "name": "高青县",
    "fullname": "高青县",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370323",
    "areaId": "370323",
    "code": "370323",
    "name": "沂源县",
    "fullname": "沂源县",
    "level": 3,
    "parentId": "370300"
  },
  {
    "id": "370401",
    "areaId": "370401",
    "code": "370401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370400"
  },
  {
    "id": "370402",
    "areaId": "370402",
    "code": "370402",
    "name": "市中区",
    "fullname": "市中区",
    "level": 3,
    "parentId": "370400"
  },
  {
    "id": "370403",
    "areaId": "370403",
    "code": "370403",
    "name": "薛城区",
    "fullname": "薛城区",
    "level": 3,
    "parentId": "370400"
  },
  {
    "id": "370404",
    "areaId": "370404",
    "code": "370404",
    "name": "峄城区",
    "fullname": "峄城区",
    "level": 3,
    "parentId": "370400"
  },
  {
    "id": "370405",
    "areaId": "370405",
    "code": "370405",
    "name": "台儿庄区",
    "fullname": "台儿庄区",
    "level": 3,
    "parentId": "370400"
  },
  {
    "id": "370406",
    "areaId": "370406",
    "code": "370406",
    "name": "山亭区",
    "fullname": "山亭区",
    "level": 3,
    "parentId": "370400"
  },
  {
    "id": "370481",
    "areaId": "370481",
    "code": "370481",
    "name": "滕州市",
    "fullname": "滕州市",
    "level": 3,
    "parentId": "370400"
  },
  {
    "id": "370501",
    "areaId": "370501",
    "code": "370501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370502",
    "areaId": "370502",
    "code": "370502",
    "name": "东营区",
    "fullname": "东营区",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370503",
    "areaId": "370503",
    "code": "370503",
    "name": "河口区",
    "fullname": "河口区",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370505",
    "areaId": "370505",
    "code": "370505",
    "name": "垦利区",
    "fullname": "垦利区",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370522",
    "areaId": "370522",
    "code": "370522",
    "name": "利津县",
    "fullname": "利津县",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370523",
    "areaId": "370523",
    "code": "370523",
    "name": "广饶县",
    "fullname": "广饶县",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370571",
    "areaId": "370571",
    "code": "370571",
    "name": "东营经济技术开发区",
    "fullname": "东营经济技术开发区",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370572",
    "areaId": "370572",
    "code": "370572",
    "name": "东营港经济开发区",
    "fullname": "东营港经济开发区",
    "level": 3,
    "parentId": "370500"
  },
  {
    "id": "370601",
    "areaId": "370601",
    "code": "370601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370602",
    "areaId": "370602",
    "code": "370602",
    "name": "芝罘区",
    "fullname": "芝罘区",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370611",
    "areaId": "370611",
    "code": "370611",
    "name": "福山区",
    "fullname": "福山区",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370612",
    "areaId": "370612",
    "code": "370612",
    "name": "牟平区",
    "fullname": "牟平区",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370613",
    "areaId": "370613",
    "code": "370613",
    "name": "莱山区",
    "fullname": "莱山区",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370634",
    "areaId": "370634",
    "code": "370634",
    "name": "长岛县",
    "fullname": "长岛县",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370671",
    "areaId": "370671",
    "code": "370671",
    "name": "烟台高新技术产业开发区",
    "fullname": "烟台高新技术产业开发区",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370672",
    "areaId": "370672",
    "code": "370672",
    "name": "烟台经济技术开发区",
    "fullname": "烟台经济技术开发区",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370681",
    "areaId": "370681",
    "code": "370681",
    "name": "龙口市",
    "fullname": "龙口市",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370682",
    "areaId": "370682",
    "code": "370682",
    "name": "莱阳市",
    "fullname": "莱阳市",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370683",
    "areaId": "370683",
    "code": "370683",
    "name": "莱州市",
    "fullname": "莱州市",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370684",
    "areaId": "370684",
    "code": "370684",
    "name": "蓬莱市",
    "fullname": "蓬莱市",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370685",
    "areaId": "370685",
    "code": "370685",
    "name": "招远市",
    "fullname": "招远市",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370686",
    "areaId": "370686",
    "code": "370686",
    "name": "栖霞市",
    "fullname": "栖霞市",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370687",
    "areaId": "370687",
    "code": "370687",
    "name": "海阳市",
    "fullname": "海阳市",
    "level": 3,
    "parentId": "370600"
  },
  {
    "id": "370701",
    "areaId": "370701",
    "code": "370701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370702",
    "areaId": "370702",
    "code": "370702",
    "name": "潍城区",
    "fullname": "潍城区",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370703",
    "areaId": "370703",
    "code": "370703",
    "name": "寒亭区",
    "fullname": "寒亭区",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370704",
    "areaId": "370704",
    "code": "370704",
    "name": "坊子区",
    "fullname": "坊子区",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370705",
    "areaId": "370705",
    "code": "370705",
    "name": "奎文区",
    "fullname": "奎文区",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370724",
    "areaId": "370724",
    "code": "370724",
    "name": "临朐县",
    "fullname": "临朐县",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370725",
    "areaId": "370725",
    "code": "370725",
    "name": "昌乐县",
    "fullname": "昌乐县",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370772",
    "areaId": "370772",
    "code": "370772",
    "name": "潍坊滨海经济技术开发区",
    "fullname": "潍坊滨海经济技术开发区",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370781",
    "areaId": "370781",
    "code": "370781",
    "name": "青州市",
    "fullname": "青州市",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370782",
    "areaId": "370782",
    "code": "370782",
    "name": "诸城市",
    "fullname": "诸城市",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370783",
    "areaId": "370783",
    "code": "370783",
    "name": "寿光市",
    "fullname": "寿光市",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370784",
    "areaId": "370784",
    "code": "370784",
    "name": "安丘市",
    "fullname": "安丘市",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370785",
    "areaId": "370785",
    "code": "370785",
    "name": "高密市",
    "fullname": "高密市",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370786",
    "areaId": "370786",
    "code": "370786",
    "name": "昌邑市",
    "fullname": "昌邑市",
    "level": 3,
    "parentId": "370700"
  },
  {
    "id": "370801",
    "areaId": "370801",
    "code": "370801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370811",
    "areaId": "370811",
    "code": "370811",
    "name": "任城区",
    "fullname": "任城区",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370812",
    "areaId": "370812",
    "code": "370812",
    "name": "兖州区",
    "fullname": "兖州区",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370826",
    "areaId": "370826",
    "code": "370826",
    "name": "微山县",
    "fullname": "微山县",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370827",
    "areaId": "370827",
    "code": "370827",
    "name": "鱼台县",
    "fullname": "鱼台县",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370828",
    "areaId": "370828",
    "code": "370828",
    "name": "金乡县",
    "fullname": "金乡县",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370829",
    "areaId": "370829",
    "code": "370829",
    "name": "嘉祥县",
    "fullname": "嘉祥县",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370830",
    "areaId": "370830",
    "code": "370830",
    "name": "汶上县",
    "fullname": "汶上县",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370831",
    "areaId": "370831",
    "code": "370831",
    "name": "泗水县",
    "fullname": "泗水县",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370832",
    "areaId": "370832",
    "code": "370832",
    "name": "梁山县",
    "fullname": "梁山县",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370871",
    "areaId": "370871",
    "code": "370871",
    "name": "济宁高新技术产业开发区",
    "fullname": "济宁高新技术产业开发区",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370881",
    "areaId": "370881",
    "code": "370881",
    "name": "曲阜市",
    "fullname": "曲阜市",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370883",
    "areaId": "370883",
    "code": "370883",
    "name": "邹城市",
    "fullname": "邹城市",
    "level": 3,
    "parentId": "370800"
  },
  {
    "id": "370901",
    "areaId": "370901",
    "code": "370901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "370900"
  },
  {
    "id": "370902",
    "areaId": "370902",
    "code": "370902",
    "name": "泰山区",
    "fullname": "泰山区",
    "level": 3,
    "parentId": "370900"
  },
  {
    "id": "370911",
    "areaId": "370911",
    "code": "370911",
    "name": "岱岳区",
    "fullname": "岱岳区",
    "level": 3,
    "parentId": "370900"
  },
  {
    "id": "370921",
    "areaId": "370921",
    "code": "370921",
    "name": "宁阳县",
    "fullname": "宁阳县",
    "level": 3,
    "parentId": "370900"
  },
  {
    "id": "370923",
    "areaId": "370923",
    "code": "370923",
    "name": "东平县",
    "fullname": "东平县",
    "level": 3,
    "parentId": "370900"
  },
  {
    "id": "370982",
    "areaId": "370982",
    "code": "370982",
    "name": "新泰市",
    "fullname": "新泰市",
    "level": 3,
    "parentId": "370900"
  },
  {
    "id": "370983",
    "areaId": "370983",
    "code": "370983",
    "name": "肥城市",
    "fullname": "肥城市",
    "level": 3,
    "parentId": "370900"
  },
  {
    "id": "371001",
    "areaId": "371001",
    "code": "371001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371002",
    "areaId": "371002",
    "code": "371002",
    "name": "环翠区",
    "fullname": "环翠区",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371003",
    "areaId": "371003",
    "code": "371003",
    "name": "文登区",
    "fullname": "文登区",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371071",
    "areaId": "371071",
    "code": "371071",
    "name": "威海火炬高技术产业开发区",
    "fullname": "威海火炬高技术产业开发区",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371072",
    "areaId": "371072",
    "code": "371072",
    "name": "威海经济技术开发区",
    "fullname": "威海经济技术开发区",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371073",
    "areaId": "371073",
    "code": "371073",
    "name": "威海临港经济技术开发区",
    "fullname": "威海临港经济技术开发区",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371082",
    "areaId": "371082",
    "code": "371082",
    "name": "荣成市",
    "fullname": "荣成市",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371083",
    "areaId": "371083",
    "code": "371083",
    "name": "乳山市",
    "fullname": "乳山市",
    "level": 3,
    "parentId": "371000"
  },
  {
    "id": "371101",
    "areaId": "371101",
    "code": "371101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "371100"
  },
  {
    "id": "371102",
    "areaId": "371102",
    "code": "371102",
    "name": "东港区",
    "fullname": "东港区",
    "level": 3,
    "parentId": "371100"
  },
  {
    "id": "371103",
    "areaId": "371103",
    "code": "371103",
    "name": "岚山区",
    "fullname": "岚山区",
    "level": 3,
    "parentId": "371100"
  },
  {
    "id": "371121",
    "areaId": "371121",
    "code": "371121",
    "name": "五莲县",
    "fullname": "五莲县",
    "level": 3,
    "parentId": "371100"
  },
  {
    "id": "371122",
    "areaId": "371122",
    "code": "371122",
    "name": "莒县",
    "fullname": "莒县",
    "level": 3,
    "parentId": "371100"
  },
  {
    "id": "371171",
    "areaId": "371171",
    "code": "371171",
    "name": "日照经济技术开发区",
    "fullname": "日照经济技术开发区",
    "level": 3,
    "parentId": "371100"
  },
  {
    "id": "371301",
    "areaId": "371301",
    "code": "371301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371302",
    "areaId": "371302",
    "code": "371302",
    "name": "兰山区",
    "fullname": "兰山区",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371311",
    "areaId": "371311",
    "code": "371311",
    "name": "罗庄区",
    "fullname": "罗庄区",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371312",
    "areaId": "371312",
    "code": "371312",
    "name": "河东区",
    "fullname": "河东区",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371321",
    "areaId": "371321",
    "code": "371321",
    "name": "沂南县",
    "fullname": "沂南县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371322",
    "areaId": "371322",
    "code": "371322",
    "name": "郯城县",
    "fullname": "郯城县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371323",
    "areaId": "371323",
    "code": "371323",
    "name": "沂水县",
    "fullname": "沂水县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371324",
    "areaId": "371324",
    "code": "371324",
    "name": "兰陵县",
    "fullname": "兰陵县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371325",
    "areaId": "371325",
    "code": "371325",
    "name": "费县",
    "fullname": "费县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371326",
    "areaId": "371326",
    "code": "371326",
    "name": "平邑县",
    "fullname": "平邑县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371327",
    "areaId": "371327",
    "code": "371327",
    "name": "莒南县",
    "fullname": "莒南县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371328",
    "areaId": "371328",
    "code": "371328",
    "name": "蒙阴县",
    "fullname": "蒙阴县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371329",
    "areaId": "371329",
    "code": "371329",
    "name": "临沭县",
    "fullname": "临沭县",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371371",
    "areaId": "371371",
    "code": "371371",
    "name": "临沂高新技术产业开发区",
    "fullname": "临沂高新技术产业开发区",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371372",
    "areaId": "371372",
    "code": "371372",
    "name": "临沂经济技术开发区",
    "fullname": "临沂经济技术开发区",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371373",
    "areaId": "371373",
    "code": "371373",
    "name": "临沂临港经济开发区",
    "fullname": "临沂临港经济开发区",
    "level": 3,
    "parentId": "371300"
  },
  {
    "id": "371401",
    "areaId": "371401",
    "code": "371401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371402",
    "areaId": "371402",
    "code": "371402",
    "name": "德城区",
    "fullname": "德城区",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371403",
    "areaId": "371403",
    "code": "371403",
    "name": "陵城区",
    "fullname": "陵城区",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371422",
    "areaId": "371422",
    "code": "371422",
    "name": "宁津县",
    "fullname": "宁津县",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371423",
    "areaId": "371423",
    "code": "371423",
    "name": "庆云县",
    "fullname": "庆云县",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371424",
    "areaId": "371424",
    "code": "371424",
    "name": "临邑县",
    "fullname": "临邑县",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371425",
    "areaId": "371425",
    "code": "371425",
    "name": "齐河县",
    "fullname": "齐河县",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371426",
    "areaId": "371426",
    "code": "371426",
    "name": "平原县",
    "fullname": "平原县",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371427",
    "areaId": "371427",
    "code": "371427",
    "name": "夏津县",
    "fullname": "夏津县",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371428",
    "areaId": "371428",
    "code": "371428",
    "name": "武城县",
    "fullname": "武城县",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371471",
    "areaId": "371471",
    "code": "371471",
    "name": "德州经济技术开发区",
    "fullname": "德州经济技术开发区",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371472",
    "areaId": "371472",
    "code": "371472",
    "name": "德州运河经济开发区",
    "fullname": "德州运河经济开发区",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371481",
    "areaId": "371481",
    "code": "371481",
    "name": "乐陵市",
    "fullname": "乐陵市",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371482",
    "areaId": "371482",
    "code": "371482",
    "name": "禹城市",
    "fullname": "禹城市",
    "level": 3,
    "parentId": "371400"
  },
  {
    "id": "371501",
    "areaId": "371501",
    "code": "371501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371502",
    "areaId": "371502",
    "code": "371502",
    "name": "东昌府区",
    "fullname": "东昌府区",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371503",
    "areaId": "371503",
    "code": "371503",
    "name": "茌平区",
    "fullname": "茌平区",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371521",
    "areaId": "371521",
    "code": "371521",
    "name": "阳谷县",
    "fullname": "阳谷县",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371522",
    "areaId": "371522",
    "code": "371522",
    "name": "莘县",
    "fullname": "莘县",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371524",
    "areaId": "371524",
    "code": "371524",
    "name": "东阿县",
    "fullname": "东阿县",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371525",
    "areaId": "371525",
    "code": "371525",
    "name": "冠县",
    "fullname": "冠县",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371526",
    "areaId": "371526",
    "code": "371526",
    "name": "高唐县",
    "fullname": "高唐县",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371581",
    "areaId": "371581",
    "code": "371581",
    "name": "临清市",
    "fullname": "临清市",
    "level": 3,
    "parentId": "371500"
  },
  {
    "id": "371601",
    "areaId": "371601",
    "code": "371601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371602",
    "areaId": "371602",
    "code": "371602",
    "name": "滨城区",
    "fullname": "滨城区",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371603",
    "areaId": "371603",
    "code": "371603",
    "name": "沾化区",
    "fullname": "沾化区",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371621",
    "areaId": "371621",
    "code": "371621",
    "name": "惠民县",
    "fullname": "惠民县",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371622",
    "areaId": "371622",
    "code": "371622",
    "name": "阳信县",
    "fullname": "阳信县",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371623",
    "areaId": "371623",
    "code": "371623",
    "name": "无棣县",
    "fullname": "无棣县",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371625",
    "areaId": "371625",
    "code": "371625",
    "name": "博兴县",
    "fullname": "博兴县",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371681",
    "areaId": "371681",
    "code": "371681",
    "name": "邹平市",
    "fullname": "邹平市",
    "level": 3,
    "parentId": "371600"
  },
  {
    "id": "371701",
    "areaId": "371701",
    "code": "371701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371702",
    "areaId": "371702",
    "code": "371702",
    "name": "牡丹区",
    "fullname": "牡丹区",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371703",
    "areaId": "371703",
    "code": "371703",
    "name": "定陶区",
    "fullname": "定陶区",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371721",
    "areaId": "371721",
    "code": "371721",
    "name": "曹县",
    "fullname": "曹县",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371722",
    "areaId": "371722",
    "code": "371722",
    "name": "单县",
    "fullname": "单县",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371723",
    "areaId": "371723",
    "code": "371723",
    "name": "成武县",
    "fullname": "成武县",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371724",
    "areaId": "371724",
    "code": "371724",
    "name": "巨野县",
    "fullname": "巨野县",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371725",
    "areaId": "371725",
    "code": "371725",
    "name": "郓城县",
    "fullname": "郓城县",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371726",
    "areaId": "371726",
    "code": "371726",
    "name": "鄄城县",
    "fullname": "鄄城县",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371728",
    "areaId": "371728",
    "code": "371728",
    "name": "东明县",
    "fullname": "东明县",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371771",
    "areaId": "371771",
    "code": "371771",
    "name": "菏泽经济技术开发区",
    "fullname": "菏泽经济技术开发区",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "371772",
    "areaId": "371772",
    "code": "371772",
    "name": "菏泽高新技术开发区",
    "fullname": "菏泽高新技术开发区",
    "level": 3,
    "parentId": "371700"
  },
  {
    "id": "410101",
    "areaId": "410101",
    "code": "410101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410102",
    "areaId": "410102",
    "code": "410102",
    "name": "中原区",
    "fullname": "中原区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410103",
    "areaId": "410103",
    "code": "410103",
    "name": "二七区",
    "fullname": "二七区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410104",
    "areaId": "410104",
    "code": "410104",
    "name": "管城回族区",
    "fullname": "管城回族区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410105",
    "areaId": "410105",
    "code": "410105",
    "name": "金水区",
    "fullname": "金水区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410106",
    "areaId": "410106",
    "code": "410106",
    "name": "上街区",
    "fullname": "上街区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410108",
    "areaId": "410108",
    "code": "410108",
    "name": "惠济区",
    "fullname": "惠济区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410122",
    "areaId": "410122",
    "code": "410122",
    "name": "中牟县",
    "fullname": "中牟县",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410171",
    "areaId": "410171",
    "code": "410171",
    "name": "郑州经济技术开发区",
    "fullname": "郑州经济技术开发区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410172",
    "areaId": "410172",
    "code": "410172",
    "name": "郑州高新技术产业开发区",
    "fullname": "郑州高新技术产业开发区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410173",
    "areaId": "410173",
    "code": "410173",
    "name": "郑州航空港经济综合实验区",
    "fullname": "郑州航空港经济综合实验区",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410181",
    "areaId": "410181",
    "code": "410181",
    "name": "巩义市",
    "fullname": "巩义市",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410182",
    "areaId": "410182",
    "code": "410182",
    "name": "荥阳市",
    "fullname": "荥阳市",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410183",
    "areaId": "410183",
    "code": "410183",
    "name": "新密市",
    "fullname": "新密市",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410184",
    "areaId": "410184",
    "code": "410184",
    "name": "新郑市",
    "fullname": "新郑市",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410185",
    "areaId": "410185",
    "code": "410185",
    "name": "登封市",
    "fullname": "登封市",
    "level": 3,
    "parentId": "410100"
  },
  {
    "id": "410201",
    "areaId": "410201",
    "code": "410201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410202",
    "areaId": "410202",
    "code": "410202",
    "name": "龙亭区",
    "fullname": "龙亭区",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410203",
    "areaId": "410203",
    "code": "410203",
    "name": "顺河回族区",
    "fullname": "顺河回族区",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410204",
    "areaId": "410204",
    "code": "410204",
    "name": "鼓楼区",
    "fullname": "鼓楼区",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410205",
    "areaId": "410205",
    "code": "410205",
    "name": "禹王台区",
    "fullname": "禹王台区",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410212",
    "areaId": "410212",
    "code": "410212",
    "name": "祥符区",
    "fullname": "祥符区",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410221",
    "areaId": "410221",
    "code": "410221",
    "name": "杞县",
    "fullname": "杞县",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410222",
    "areaId": "410222",
    "code": "410222",
    "name": "通许县",
    "fullname": "通许县",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410223",
    "areaId": "410223",
    "code": "410223",
    "name": "尉氏县",
    "fullname": "尉氏县",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410225",
    "areaId": "410225",
    "code": "410225",
    "name": "兰考县",
    "fullname": "兰考县",
    "level": 3,
    "parentId": "410200"
  },
  {
    "id": "410301",
    "areaId": "410301",
    "code": "410301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410302",
    "areaId": "410302",
    "code": "410302",
    "name": "老城区",
    "fullname": "老城区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410303",
    "areaId": "410303",
    "code": "410303",
    "name": "西工区",
    "fullname": "西工区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410304",
    "areaId": "410304",
    "code": "410304",
    "name": "瀍河回族区",
    "fullname": "瀍河回族区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410305",
    "areaId": "410305",
    "code": "410305",
    "name": "涧西区",
    "fullname": "涧西区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410306",
    "areaId": "410306",
    "code": "410306",
    "name": "吉利区",
    "fullname": "吉利区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410311",
    "areaId": "410311",
    "code": "410311",
    "name": "洛龙区",
    "fullname": "洛龙区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410322",
    "areaId": "410322",
    "code": "410322",
    "name": "孟津县",
    "fullname": "孟津县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410323",
    "areaId": "410323",
    "code": "410323",
    "name": "新安县",
    "fullname": "新安县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410324",
    "areaId": "410324",
    "code": "410324",
    "name": "栾川县",
    "fullname": "栾川县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410325",
    "areaId": "410325",
    "code": "410325",
    "name": "嵩县",
    "fullname": "嵩县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410326",
    "areaId": "410326",
    "code": "410326",
    "name": "汝阳县",
    "fullname": "汝阳县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410327",
    "areaId": "410327",
    "code": "410327",
    "name": "宜阳县",
    "fullname": "宜阳县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410328",
    "areaId": "410328",
    "code": "410328",
    "name": "洛宁县",
    "fullname": "洛宁县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410329",
    "areaId": "410329",
    "code": "410329",
    "name": "伊川县",
    "fullname": "伊川县",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410371",
    "areaId": "410371",
    "code": "410371",
    "name": "洛阳高新技术产业开发区",
    "fullname": "洛阳高新技术产业开发区",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410381",
    "areaId": "410381",
    "code": "410381",
    "name": "偃师市",
    "fullname": "偃师市",
    "level": 3,
    "parentId": "410300"
  },
  {
    "id": "410401",
    "areaId": "410401",
    "code": "410401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410402",
    "areaId": "410402",
    "code": "410402",
    "name": "新华区",
    "fullname": "新华区",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410403",
    "areaId": "410403",
    "code": "410403",
    "name": "卫东区",
    "fullname": "卫东区",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410404",
    "areaId": "410404",
    "code": "410404",
    "name": "石龙区",
    "fullname": "石龙区",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410411",
    "areaId": "410411",
    "code": "410411",
    "name": "湛河区",
    "fullname": "湛河区",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410421",
    "areaId": "410421",
    "code": "410421",
    "name": "宝丰县",
    "fullname": "宝丰县",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410422",
    "areaId": "410422",
    "code": "410422",
    "name": "叶县",
    "fullname": "叶县",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410423",
    "areaId": "410423",
    "code": "410423",
    "name": "鲁山县",
    "fullname": "鲁山县",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410425",
    "areaId": "410425",
    "code": "410425",
    "name": "郏县",
    "fullname": "郏县",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410471",
    "areaId": "410471",
    "code": "410471",
    "name": "平顶山高新技术产业开发区",
    "fullname": "平顶山高新技术产业开发区",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410472",
    "areaId": "410472",
    "code": "410472",
    "name": "平顶山市城乡一体化示范区",
    "fullname": "平顶山市城乡一体化示范区",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410481",
    "areaId": "410481",
    "code": "410481",
    "name": "舞钢市",
    "fullname": "舞钢市",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410482",
    "areaId": "410482",
    "code": "410482",
    "name": "汝州市",
    "fullname": "汝州市",
    "level": 3,
    "parentId": "410400"
  },
  {
    "id": "410501",
    "areaId": "410501",
    "code": "410501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410502",
    "areaId": "410502",
    "code": "410502",
    "name": "文峰区",
    "fullname": "文峰区",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410503",
    "areaId": "410503",
    "code": "410503",
    "name": "北关区",
    "fullname": "北关区",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410505",
    "areaId": "410505",
    "code": "410505",
    "name": "殷都区",
    "fullname": "殷都区",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410506",
    "areaId": "410506",
    "code": "410506",
    "name": "龙安区",
    "fullname": "龙安区",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410522",
    "areaId": "410522",
    "code": "410522",
    "name": "安阳县",
    "fullname": "安阳县",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410523",
    "areaId": "410523",
    "code": "410523",
    "name": "汤阴县",
    "fullname": "汤阴县",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410526",
    "areaId": "410526",
    "code": "410526",
    "name": "滑县",
    "fullname": "滑县",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410527",
    "areaId": "410527",
    "code": "410527",
    "name": "内黄县",
    "fullname": "内黄县",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410571",
    "areaId": "410571",
    "code": "410571",
    "name": "安阳高新技术产业开发区",
    "fullname": "安阳高新技术产业开发区",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410581",
    "areaId": "410581",
    "code": "410581",
    "name": "林州市",
    "fullname": "林州市",
    "level": 3,
    "parentId": "410500"
  },
  {
    "id": "410601",
    "areaId": "410601",
    "code": "410601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410600"
  },
  {
    "id": "410602",
    "areaId": "410602",
    "code": "410602",
    "name": "鹤山区",
    "fullname": "鹤山区",
    "level": 3,
    "parentId": "410600"
  },
  {
    "id": "410603",
    "areaId": "410603",
    "code": "410603",
    "name": "山城区",
    "fullname": "山城区",
    "level": 3,
    "parentId": "410600"
  },
  {
    "id": "410611",
    "areaId": "410611",
    "code": "410611",
    "name": "淇滨区",
    "fullname": "淇滨区",
    "level": 3,
    "parentId": "410600"
  },
  {
    "id": "410621",
    "areaId": "410621",
    "code": "410621",
    "name": "浚县",
    "fullname": "浚县",
    "level": 3,
    "parentId": "410600"
  },
  {
    "id": "410622",
    "areaId": "410622",
    "code": "410622",
    "name": "淇县",
    "fullname": "淇县",
    "level": 3,
    "parentId": "410600"
  },
  {
    "id": "410671",
    "areaId": "410671",
    "code": "410671",
    "name": "鹤壁经济技术开发区",
    "fullname": "鹤壁经济技术开发区",
    "level": 3,
    "parentId": "410600"
  },
  {
    "id": "410701",
    "areaId": "410701",
    "code": "410701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410702",
    "areaId": "410702",
    "code": "410702",
    "name": "红旗区",
    "fullname": "红旗区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410703",
    "areaId": "410703",
    "code": "410703",
    "name": "卫滨区",
    "fullname": "卫滨区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410704",
    "areaId": "410704",
    "code": "410704",
    "name": "凤泉区",
    "fullname": "凤泉区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410711",
    "areaId": "410711",
    "code": "410711",
    "name": "牧野区",
    "fullname": "牧野区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410721",
    "areaId": "410721",
    "code": "410721",
    "name": "新乡县",
    "fullname": "新乡县",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410724",
    "areaId": "410724",
    "code": "410724",
    "name": "获嘉县",
    "fullname": "获嘉县",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410725",
    "areaId": "410725",
    "code": "410725",
    "name": "原阳县",
    "fullname": "原阳县",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410726",
    "areaId": "410726",
    "code": "410726",
    "name": "延津县",
    "fullname": "延津县",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410727",
    "areaId": "410727",
    "code": "410727",
    "name": "封丘县",
    "fullname": "封丘县",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410771",
    "areaId": "410771",
    "code": "410771",
    "name": "新乡高新技术产业开发区",
    "fullname": "新乡高新技术产业开发区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410772",
    "areaId": "410772",
    "code": "410772",
    "name": "新乡经济技术开发区",
    "fullname": "新乡经济技术开发区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410773",
    "areaId": "410773",
    "code": "410773",
    "name": "新乡市平原城乡一体化示范区",
    "fullname": "新乡市平原城乡一体化示范区",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410781",
    "areaId": "410781",
    "code": "410781",
    "name": "卫辉市",
    "fullname": "卫辉市",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410782",
    "areaId": "410782",
    "code": "410782",
    "name": "辉县市",
    "fullname": "辉县市",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410783",
    "areaId": "410783",
    "code": "410783",
    "name": "长垣市",
    "fullname": "长垣市",
    "level": 3,
    "parentId": "410700"
  },
  {
    "id": "410801",
    "areaId": "410801",
    "code": "410801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410802",
    "areaId": "410802",
    "code": "410802",
    "name": "解放区",
    "fullname": "解放区",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410803",
    "areaId": "410803",
    "code": "410803",
    "name": "中站区",
    "fullname": "中站区",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410804",
    "areaId": "410804",
    "code": "410804",
    "name": "马村区",
    "fullname": "马村区",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410811",
    "areaId": "410811",
    "code": "410811",
    "name": "山阳区",
    "fullname": "山阳区",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410821",
    "areaId": "410821",
    "code": "410821",
    "name": "修武县",
    "fullname": "修武县",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410822",
    "areaId": "410822",
    "code": "410822",
    "name": "博爱县",
    "fullname": "博爱县",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410823",
    "areaId": "410823",
    "code": "410823",
    "name": "武陟县",
    "fullname": "武陟县",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410825",
    "areaId": "410825",
    "code": "410825",
    "name": "温县",
    "fullname": "温县",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410871",
    "areaId": "410871",
    "code": "410871",
    "name": "焦作城乡一体化示范区",
    "fullname": "焦作城乡一体化示范区",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410882",
    "areaId": "410882",
    "code": "410882",
    "name": "沁阳市",
    "fullname": "沁阳市",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410883",
    "areaId": "410883",
    "code": "410883",
    "name": "孟州市",
    "fullname": "孟州市",
    "level": 3,
    "parentId": "410800"
  },
  {
    "id": "410901",
    "areaId": "410901",
    "code": "410901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410902",
    "areaId": "410902",
    "code": "410902",
    "name": "华龙区",
    "fullname": "华龙区",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410922",
    "areaId": "410922",
    "code": "410922",
    "name": "清丰县",
    "fullname": "清丰县",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410923",
    "areaId": "410923",
    "code": "410923",
    "name": "南乐县",
    "fullname": "南乐县",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410926",
    "areaId": "410926",
    "code": "410926",
    "name": "范县",
    "fullname": "范县",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410927",
    "areaId": "410927",
    "code": "410927",
    "name": "台前县",
    "fullname": "台前县",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410928",
    "areaId": "410928",
    "code": "410928",
    "name": "濮阳县",
    "fullname": "濮阳县",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410971",
    "areaId": "410971",
    "code": "410971",
    "name": "河南濮阳工业园区",
    "fullname": "河南濮阳工业园区",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "410972",
    "areaId": "410972",
    "code": "410972",
    "name": "濮阳经济技术开发区",
    "fullname": "濮阳经济技术开发区",
    "level": 3,
    "parentId": "410900"
  },
  {
    "id": "411001",
    "areaId": "411001",
    "code": "411001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411002",
    "areaId": "411002",
    "code": "411002",
    "name": "魏都区",
    "fullname": "魏都区",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411003",
    "areaId": "411003",
    "code": "411003",
    "name": "建安区",
    "fullname": "建安区",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411024",
    "areaId": "411024",
    "code": "411024",
    "name": "鄢陵县",
    "fullname": "鄢陵县",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411025",
    "areaId": "411025",
    "code": "411025",
    "name": "襄城县",
    "fullname": "襄城县",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411071",
    "areaId": "411071",
    "code": "411071",
    "name": "许昌经济技术开发区",
    "fullname": "许昌经济技术开发区",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411081",
    "areaId": "411081",
    "code": "411081",
    "name": "禹州市",
    "fullname": "禹州市",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411082",
    "areaId": "411082",
    "code": "411082",
    "name": "长葛市",
    "fullname": "长葛市",
    "level": 3,
    "parentId": "411000"
  },
  {
    "id": "411101",
    "areaId": "411101",
    "code": "411101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411100"
  },
  {
    "id": "411102",
    "areaId": "411102",
    "code": "411102",
    "name": "源汇区",
    "fullname": "源汇区",
    "level": 3,
    "parentId": "411100"
  },
  {
    "id": "411103",
    "areaId": "411103",
    "code": "411103",
    "name": "郾城区",
    "fullname": "郾城区",
    "level": 3,
    "parentId": "411100"
  },
  {
    "id": "411104",
    "areaId": "411104",
    "code": "411104",
    "name": "召陵区",
    "fullname": "召陵区",
    "level": 3,
    "parentId": "411100"
  },
  {
    "id": "411121",
    "areaId": "411121",
    "code": "411121",
    "name": "舞阳县",
    "fullname": "舞阳县",
    "level": 3,
    "parentId": "411100"
  },
  {
    "id": "411122",
    "areaId": "411122",
    "code": "411122",
    "name": "临颍县",
    "fullname": "临颍县",
    "level": 3,
    "parentId": "411100"
  },
  {
    "id": "411171",
    "areaId": "411171",
    "code": "411171",
    "name": "漯河经济技术开发区",
    "fullname": "漯河经济技术开发区",
    "level": 3,
    "parentId": "411100"
  },
  {
    "id": "411201",
    "areaId": "411201",
    "code": "411201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411202",
    "areaId": "411202",
    "code": "411202",
    "name": "湖滨区",
    "fullname": "湖滨区",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411203",
    "areaId": "411203",
    "code": "411203",
    "name": "陕州区",
    "fullname": "陕州区",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411221",
    "areaId": "411221",
    "code": "411221",
    "name": "渑池县",
    "fullname": "渑池县",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411224",
    "areaId": "411224",
    "code": "411224",
    "name": "卢氏县",
    "fullname": "卢氏县",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411271",
    "areaId": "411271",
    "code": "411271",
    "name": "河南三门峡经济开发区",
    "fullname": "河南三门峡经济开发区",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411281",
    "areaId": "411281",
    "code": "411281",
    "name": "义马市",
    "fullname": "义马市",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411282",
    "areaId": "411282",
    "code": "411282",
    "name": "灵宝市",
    "fullname": "灵宝市",
    "level": 3,
    "parentId": "411200"
  },
  {
    "id": "411301",
    "areaId": "411301",
    "code": "411301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411302",
    "areaId": "411302",
    "code": "411302",
    "name": "宛城区",
    "fullname": "宛城区",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411303",
    "areaId": "411303",
    "code": "411303",
    "name": "卧龙区",
    "fullname": "卧龙区",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411321",
    "areaId": "411321",
    "code": "411321",
    "name": "南召县",
    "fullname": "南召县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411322",
    "areaId": "411322",
    "code": "411322",
    "name": "方城县",
    "fullname": "方城县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411323",
    "areaId": "411323",
    "code": "411323",
    "name": "西峡县",
    "fullname": "西峡县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411324",
    "areaId": "411324",
    "code": "411324",
    "name": "镇平县",
    "fullname": "镇平县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411325",
    "areaId": "411325",
    "code": "411325",
    "name": "内乡县",
    "fullname": "内乡县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411326",
    "areaId": "411326",
    "code": "411326",
    "name": "淅川县",
    "fullname": "淅川县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411327",
    "areaId": "411327",
    "code": "411327",
    "name": "社旗县",
    "fullname": "社旗县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411328",
    "areaId": "411328",
    "code": "411328",
    "name": "唐河县",
    "fullname": "唐河县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411329",
    "areaId": "411329",
    "code": "411329",
    "name": "新野县",
    "fullname": "新野县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411330",
    "areaId": "411330",
    "code": "411330",
    "name": "桐柏县",
    "fullname": "桐柏县",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411371",
    "areaId": "411371",
    "code": "411371",
    "name": "南阳高新技术产业开发区",
    "fullname": "南阳高新技术产业开发区",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411372",
    "areaId": "411372",
    "code": "411372",
    "name": "南阳市城乡一体化示范区",
    "fullname": "南阳市城乡一体化示范区",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411381",
    "areaId": "411381",
    "code": "411381",
    "name": "邓州市",
    "fullname": "邓州市",
    "level": 3,
    "parentId": "411300"
  },
  {
    "id": "411401",
    "areaId": "411401",
    "code": "411401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411402",
    "areaId": "411402",
    "code": "411402",
    "name": "梁园区",
    "fullname": "梁园区",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411403",
    "areaId": "411403",
    "code": "411403",
    "name": "睢阳区",
    "fullname": "睢阳区",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411421",
    "areaId": "411421",
    "code": "411421",
    "name": "民权县",
    "fullname": "民权县",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411422",
    "areaId": "411422",
    "code": "411422",
    "name": "睢县",
    "fullname": "睢县",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411423",
    "areaId": "411423",
    "code": "411423",
    "name": "宁陵县",
    "fullname": "宁陵县",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411424",
    "areaId": "411424",
    "code": "411424",
    "name": "柘城县",
    "fullname": "柘城县",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411425",
    "areaId": "411425",
    "code": "411425",
    "name": "虞城县",
    "fullname": "虞城县",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411426",
    "areaId": "411426",
    "code": "411426",
    "name": "夏邑县",
    "fullname": "夏邑县",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411471",
    "areaId": "411471",
    "code": "411471",
    "name": "豫东综合物流产业聚集区",
    "fullname": "豫东综合物流产业聚集区",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411472",
    "areaId": "411472",
    "code": "411472",
    "name": "河南商丘经济开发区",
    "fullname": "河南商丘经济开发区",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411481",
    "areaId": "411481",
    "code": "411481",
    "name": "永城市",
    "fullname": "永城市",
    "level": 3,
    "parentId": "411400"
  },
  {
    "id": "411501",
    "areaId": "411501",
    "code": "411501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411502",
    "areaId": "411502",
    "code": "411502",
    "name": "浉河区",
    "fullname": "浉河区",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411503",
    "areaId": "411503",
    "code": "411503",
    "name": "平桥区",
    "fullname": "平桥区",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411521",
    "areaId": "411521",
    "code": "411521",
    "name": "罗山县",
    "fullname": "罗山县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411522",
    "areaId": "411522",
    "code": "411522",
    "name": "光山县",
    "fullname": "光山县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411523",
    "areaId": "411523",
    "code": "411523",
    "name": "新县",
    "fullname": "新县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411524",
    "areaId": "411524",
    "code": "411524",
    "name": "商城县",
    "fullname": "商城县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411525",
    "areaId": "411525",
    "code": "411525",
    "name": "固始县",
    "fullname": "固始县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411526",
    "areaId": "411526",
    "code": "411526",
    "name": "潢川县",
    "fullname": "潢川县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411527",
    "areaId": "411527",
    "code": "411527",
    "name": "淮滨县",
    "fullname": "淮滨县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411528",
    "areaId": "411528",
    "code": "411528",
    "name": "息县",
    "fullname": "息县",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411571",
    "areaId": "411571",
    "code": "411571",
    "name": "信阳高新技术产业开发区",
    "fullname": "信阳高新技术产业开发区",
    "level": 3,
    "parentId": "411500"
  },
  {
    "id": "411601",
    "areaId": "411601",
    "code": "411601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411602",
    "areaId": "411602",
    "code": "411602",
    "name": "川汇区",
    "fullname": "川汇区",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411603",
    "areaId": "411603",
    "code": "411603",
    "name": "淮阳区",
    "fullname": "淮阳区",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411621",
    "areaId": "411621",
    "code": "411621",
    "name": "扶沟县",
    "fullname": "扶沟县",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411622",
    "areaId": "411622",
    "code": "411622",
    "name": "西华县",
    "fullname": "西华县",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411623",
    "areaId": "411623",
    "code": "411623",
    "name": "商水县",
    "fullname": "商水县",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411624",
    "areaId": "411624",
    "code": "411624",
    "name": "沈丘县",
    "fullname": "沈丘县",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411625",
    "areaId": "411625",
    "code": "411625",
    "name": "郸城县",
    "fullname": "郸城县",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411627",
    "areaId": "411627",
    "code": "411627",
    "name": "太康县",
    "fullname": "太康县",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411628",
    "areaId": "411628",
    "code": "411628",
    "name": "鹿邑县",
    "fullname": "鹿邑县",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411671",
    "areaId": "411671",
    "code": "411671",
    "name": "河南周口经济开发区",
    "fullname": "河南周口经济开发区",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411681",
    "areaId": "411681",
    "code": "411681",
    "name": "项城市",
    "fullname": "项城市",
    "level": 3,
    "parentId": "411600"
  },
  {
    "id": "411701",
    "areaId": "411701",
    "code": "411701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411702",
    "areaId": "411702",
    "code": "411702",
    "name": "驿城区",
    "fullname": "驿城区",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411721",
    "areaId": "411721",
    "code": "411721",
    "name": "西平县",
    "fullname": "西平县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411722",
    "areaId": "411722",
    "code": "411722",
    "name": "上蔡县",
    "fullname": "上蔡县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411723",
    "areaId": "411723",
    "code": "411723",
    "name": "平舆县",
    "fullname": "平舆县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411724",
    "areaId": "411724",
    "code": "411724",
    "name": "正阳县",
    "fullname": "正阳县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411725",
    "areaId": "411725",
    "code": "411725",
    "name": "确山县",
    "fullname": "确山县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411726",
    "areaId": "411726",
    "code": "411726",
    "name": "泌阳县",
    "fullname": "泌阳县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411727",
    "areaId": "411727",
    "code": "411727",
    "name": "汝南县",
    "fullname": "汝南县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411728",
    "areaId": "411728",
    "code": "411728",
    "name": "遂平县",
    "fullname": "遂平县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411729",
    "areaId": "411729",
    "code": "411729",
    "name": "新蔡县",
    "fullname": "新蔡县",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "411771",
    "areaId": "411771",
    "code": "411771",
    "name": "河南驻马店经济开发区",
    "fullname": "河南驻马店经济开发区",
    "level": 3,
    "parentId": "411700"
  },
  {
    "id": "419001",
    "areaId": "419001",
    "code": "419001",
    "name": "济源市",
    "fullname": "济源市",
    "level": 3,
    "parentId": "419000"
  },
  {
    "id": "420101",
    "areaId": "420101",
    "code": "420101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420102",
    "areaId": "420102",
    "code": "420102",
    "name": "江岸区",
    "fullname": "江岸区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420103",
    "areaId": "420103",
    "code": "420103",
    "name": "江汉区",
    "fullname": "江汉区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420104",
    "areaId": "420104",
    "code": "420104",
    "name": "硚口区",
    "fullname": "硚口区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420105",
    "areaId": "420105",
    "code": "420105",
    "name": "汉阳区",
    "fullname": "汉阳区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420106",
    "areaId": "420106",
    "code": "420106",
    "name": "武昌区",
    "fullname": "武昌区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420107",
    "areaId": "420107",
    "code": "420107",
    "name": "青山区",
    "fullname": "青山区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420111",
    "areaId": "420111",
    "code": "420111",
    "name": "洪山区",
    "fullname": "洪山区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420112",
    "areaId": "420112",
    "code": "420112",
    "name": "东西湖区",
    "fullname": "东西湖区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420113",
    "areaId": "420113",
    "code": "420113",
    "name": "汉南区",
    "fullname": "汉南区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420114",
    "areaId": "420114",
    "code": "420114",
    "name": "蔡甸区",
    "fullname": "蔡甸区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420115",
    "areaId": "420115",
    "code": "420115",
    "name": "江夏区",
    "fullname": "江夏区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420116",
    "areaId": "420116",
    "code": "420116",
    "name": "黄陂区",
    "fullname": "黄陂区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420117",
    "areaId": "420117",
    "code": "420117",
    "name": "新洲区",
    "fullname": "新洲区",
    "level": 3,
    "parentId": "420100"
  },
  {
    "id": "420201",
    "areaId": "420201",
    "code": "420201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420200"
  },
  {
    "id": "420202",
    "areaId": "420202",
    "code": "420202",
    "name": "黄石港区",
    "fullname": "黄石港区",
    "level": 3,
    "parentId": "420200"
  },
  {
    "id": "420203",
    "areaId": "420203",
    "code": "420203",
    "name": "西塞山区",
    "fullname": "西塞山区",
    "level": 3,
    "parentId": "420200"
  },
  {
    "id": "420204",
    "areaId": "420204",
    "code": "420204",
    "name": "下陆区",
    "fullname": "下陆区",
    "level": 3,
    "parentId": "420200"
  },
  {
    "id": "420205",
    "areaId": "420205",
    "code": "420205",
    "name": "铁山区",
    "fullname": "铁山区",
    "level": 3,
    "parentId": "420200"
  },
  {
    "id": "420222",
    "areaId": "420222",
    "code": "420222",
    "name": "阳新县",
    "fullname": "阳新县",
    "level": 3,
    "parentId": "420200"
  },
  {
    "id": "420281",
    "areaId": "420281",
    "code": "420281",
    "name": "大冶市",
    "fullname": "大冶市",
    "level": 3,
    "parentId": "420200"
  },
  {
    "id": "420301",
    "areaId": "420301",
    "code": "420301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420302",
    "areaId": "420302",
    "code": "420302",
    "name": "茅箭区",
    "fullname": "茅箭区",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420303",
    "areaId": "420303",
    "code": "420303",
    "name": "张湾区",
    "fullname": "张湾区",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420304",
    "areaId": "420304",
    "code": "420304",
    "name": "郧阳区",
    "fullname": "郧阳区",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420322",
    "areaId": "420322",
    "code": "420322",
    "name": "郧西县",
    "fullname": "郧西县",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420323",
    "areaId": "420323",
    "code": "420323",
    "name": "竹山县",
    "fullname": "竹山县",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420324",
    "areaId": "420324",
    "code": "420324",
    "name": "竹溪县",
    "fullname": "竹溪县",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420325",
    "areaId": "420325",
    "code": "420325",
    "name": "房县",
    "fullname": "房县",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420381",
    "areaId": "420381",
    "code": "420381",
    "name": "丹江口市",
    "fullname": "丹江口市",
    "level": 3,
    "parentId": "420300"
  },
  {
    "id": "420501",
    "areaId": "420501",
    "code": "420501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420502",
    "areaId": "420502",
    "code": "420502",
    "name": "西陵区",
    "fullname": "西陵区",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420503",
    "areaId": "420503",
    "code": "420503",
    "name": "伍家岗区",
    "fullname": "伍家岗区",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420504",
    "areaId": "420504",
    "code": "420504",
    "name": "点军区",
    "fullname": "点军区",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420505",
    "areaId": "420505",
    "code": "420505",
    "name": "猇亭区",
    "fullname": "猇亭区",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420506",
    "areaId": "420506",
    "code": "420506",
    "name": "夷陵区",
    "fullname": "夷陵区",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420525",
    "areaId": "420525",
    "code": "420525",
    "name": "远安县",
    "fullname": "远安县",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420526",
    "areaId": "420526",
    "code": "420526",
    "name": "兴山县",
    "fullname": "兴山县",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420527",
    "areaId": "420527",
    "code": "420527",
    "name": "秭归县",
    "fullname": "秭归县",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420528",
    "areaId": "420528",
    "code": "420528",
    "name": "长阳土家族自治县",
    "fullname": "长阳土家族自治县",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420529",
    "areaId": "420529",
    "code": "420529",
    "name": "五峰土家族自治县",
    "fullname": "五峰土家族自治县",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420581",
    "areaId": "420581",
    "code": "420581",
    "name": "宜都市",
    "fullname": "宜都市",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420582",
    "areaId": "420582",
    "code": "420582",
    "name": "当阳市",
    "fullname": "当阳市",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420583",
    "areaId": "420583",
    "code": "420583",
    "name": "枝江市",
    "fullname": "枝江市",
    "level": 3,
    "parentId": "420500"
  },
  {
    "id": "420601",
    "areaId": "420601",
    "code": "420601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420602",
    "areaId": "420602",
    "code": "420602",
    "name": "襄城区",
    "fullname": "襄城区",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420606",
    "areaId": "420606",
    "code": "420606",
    "name": "樊城区",
    "fullname": "樊城区",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420607",
    "areaId": "420607",
    "code": "420607",
    "name": "襄州区",
    "fullname": "襄州区",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420624",
    "areaId": "420624",
    "code": "420624",
    "name": "南漳县",
    "fullname": "南漳县",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420625",
    "areaId": "420625",
    "code": "420625",
    "name": "谷城县",
    "fullname": "谷城县",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420626",
    "areaId": "420626",
    "code": "420626",
    "name": "保康县",
    "fullname": "保康县",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420682",
    "areaId": "420682",
    "code": "420682",
    "name": "老河口市",
    "fullname": "老河口市",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420683",
    "areaId": "420683",
    "code": "420683",
    "name": "枣阳市",
    "fullname": "枣阳市",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420684",
    "areaId": "420684",
    "code": "420684",
    "name": "宜城市",
    "fullname": "宜城市",
    "level": 3,
    "parentId": "420600"
  },
  {
    "id": "420701",
    "areaId": "420701",
    "code": "420701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420700"
  },
  {
    "id": "420702",
    "areaId": "420702",
    "code": "420702",
    "name": "梁子湖区",
    "fullname": "梁子湖区",
    "level": 3,
    "parentId": "420700"
  },
  {
    "id": "420703",
    "areaId": "420703",
    "code": "420703",
    "name": "华容区",
    "fullname": "华容区",
    "level": 3,
    "parentId": "420700"
  },
  {
    "id": "420704",
    "areaId": "420704",
    "code": "420704",
    "name": "鄂城区",
    "fullname": "鄂城区",
    "level": 3,
    "parentId": "420700"
  },
  {
    "id": "420801",
    "areaId": "420801",
    "code": "420801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420800"
  },
  {
    "id": "420802",
    "areaId": "420802",
    "code": "420802",
    "name": "东宝区",
    "fullname": "东宝区",
    "level": 3,
    "parentId": "420800"
  },
  {
    "id": "420804",
    "areaId": "420804",
    "code": "420804",
    "name": "掇刀区",
    "fullname": "掇刀区",
    "level": 3,
    "parentId": "420800"
  },
  {
    "id": "420822",
    "areaId": "420822",
    "code": "420822",
    "name": "沙洋县",
    "fullname": "沙洋县",
    "level": 3,
    "parentId": "420800"
  },
  {
    "id": "420881",
    "areaId": "420881",
    "code": "420881",
    "name": "钟祥市",
    "fullname": "钟祥市",
    "level": 3,
    "parentId": "420800"
  },
  {
    "id": "420882",
    "areaId": "420882",
    "code": "420882",
    "name": "京山市",
    "fullname": "京山市",
    "level": 3,
    "parentId": "420800"
  },
  {
    "id": "420901",
    "areaId": "420901",
    "code": "420901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "420902",
    "areaId": "420902",
    "code": "420902",
    "name": "孝南区",
    "fullname": "孝南区",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "420921",
    "areaId": "420921",
    "code": "420921",
    "name": "孝昌县",
    "fullname": "孝昌县",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "420922",
    "areaId": "420922",
    "code": "420922",
    "name": "大悟县",
    "fullname": "大悟县",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "420923",
    "areaId": "420923",
    "code": "420923",
    "name": "云梦县",
    "fullname": "云梦县",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "420981",
    "areaId": "420981",
    "code": "420981",
    "name": "应城市",
    "fullname": "应城市",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "420982",
    "areaId": "420982",
    "code": "420982",
    "name": "安陆市",
    "fullname": "安陆市",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "420984",
    "areaId": "420984",
    "code": "420984",
    "name": "汉川市",
    "fullname": "汉川市",
    "level": 3,
    "parentId": "420900"
  },
  {
    "id": "421001",
    "areaId": "421001",
    "code": "421001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421002",
    "areaId": "421002",
    "code": "421002",
    "name": "沙市区",
    "fullname": "沙市区",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421003",
    "areaId": "421003",
    "code": "421003",
    "name": "荆州区",
    "fullname": "荆州区",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421022",
    "areaId": "421022",
    "code": "421022",
    "name": "公安县",
    "fullname": "公安县",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421023",
    "areaId": "421023",
    "code": "421023",
    "name": "监利县",
    "fullname": "监利县",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421024",
    "areaId": "421024",
    "code": "421024",
    "name": "江陵县",
    "fullname": "江陵县",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421071",
    "areaId": "421071",
    "code": "421071",
    "name": "荆州经济技术开发区",
    "fullname": "荆州经济技术开发区",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421081",
    "areaId": "421081",
    "code": "421081",
    "name": "石首市",
    "fullname": "石首市",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421083",
    "areaId": "421083",
    "code": "421083",
    "name": "洪湖市",
    "fullname": "洪湖市",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421087",
    "areaId": "421087",
    "code": "421087",
    "name": "松滋市",
    "fullname": "松滋市",
    "level": 3,
    "parentId": "421000"
  },
  {
    "id": "421101",
    "areaId": "421101",
    "code": "421101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421102",
    "areaId": "421102",
    "code": "421102",
    "name": "黄州区",
    "fullname": "黄州区",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421121",
    "areaId": "421121",
    "code": "421121",
    "name": "团风县",
    "fullname": "团风县",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421122",
    "areaId": "421122",
    "code": "421122",
    "name": "红安县",
    "fullname": "红安县",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421123",
    "areaId": "421123",
    "code": "421123",
    "name": "罗田县",
    "fullname": "罗田县",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421124",
    "areaId": "421124",
    "code": "421124",
    "name": "英山县",
    "fullname": "英山县",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421125",
    "areaId": "421125",
    "code": "421125",
    "name": "浠水县",
    "fullname": "浠水县",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421126",
    "areaId": "421126",
    "code": "421126",
    "name": "蕲春县",
    "fullname": "蕲春县",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421127",
    "areaId": "421127",
    "code": "421127",
    "name": "黄梅县",
    "fullname": "黄梅县",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421171",
    "areaId": "421171",
    "code": "421171",
    "name": "龙感湖管理区",
    "fullname": "龙感湖管理区",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421181",
    "areaId": "421181",
    "code": "421181",
    "name": "麻城市",
    "fullname": "麻城市",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421182",
    "areaId": "421182",
    "code": "421182",
    "name": "武穴市",
    "fullname": "武穴市",
    "level": 3,
    "parentId": "421100"
  },
  {
    "id": "421201",
    "areaId": "421201",
    "code": "421201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "421200"
  },
  {
    "id": "421202",
    "areaId": "421202",
    "code": "421202",
    "name": "咸安区",
    "fullname": "咸安区",
    "level": 3,
    "parentId": "421200"
  },
  {
    "id": "421221",
    "areaId": "421221",
    "code": "421221",
    "name": "嘉鱼县",
    "fullname": "嘉鱼县",
    "level": 3,
    "parentId": "421200"
  },
  {
    "id": "421222",
    "areaId": "421222",
    "code": "421222",
    "name": "通城县",
    "fullname": "通城县",
    "level": 3,
    "parentId": "421200"
  },
  {
    "id": "421223",
    "areaId": "421223",
    "code": "421223",
    "name": "崇阳县",
    "fullname": "崇阳县",
    "level": 3,
    "parentId": "421200"
  },
  {
    "id": "421224",
    "areaId": "421224",
    "code": "421224",
    "name": "通山县",
    "fullname": "通山县",
    "level": 3,
    "parentId": "421200"
  },
  {
    "id": "421281",
    "areaId": "421281",
    "code": "421281",
    "name": "赤壁市",
    "fullname": "赤壁市",
    "level": 3,
    "parentId": "421200"
  },
  {
    "id": "421301",
    "areaId": "421301",
    "code": "421301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "421300"
  },
  {
    "id": "421303",
    "areaId": "421303",
    "code": "421303",
    "name": "曾都区",
    "fullname": "曾都区",
    "level": 3,
    "parentId": "421300"
  },
  {
    "id": "421321",
    "areaId": "421321",
    "code": "421321",
    "name": "随县",
    "fullname": "随县",
    "level": 3,
    "parentId": "421300"
  },
  {
    "id": "421381",
    "areaId": "421381",
    "code": "421381",
    "name": "广水市",
    "fullname": "广水市",
    "level": 3,
    "parentId": "421300"
  },
  {
    "id": "422801",
    "areaId": "422801",
    "code": "422801",
    "name": "恩施市",
    "fullname": "恩施市",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "422802",
    "areaId": "422802",
    "code": "422802",
    "name": "利川市",
    "fullname": "利川市",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "422822",
    "areaId": "422822",
    "code": "422822",
    "name": "建始县",
    "fullname": "建始县",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "422823",
    "areaId": "422823",
    "code": "422823",
    "name": "巴东县",
    "fullname": "巴东县",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "422825",
    "areaId": "422825",
    "code": "422825",
    "name": "宣恩县",
    "fullname": "宣恩县",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "422826",
    "areaId": "422826",
    "code": "422826",
    "name": "咸丰县",
    "fullname": "咸丰县",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "422827",
    "areaId": "422827",
    "code": "422827",
    "name": "来凤县",
    "fullname": "来凤县",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "422828",
    "areaId": "422828",
    "code": "422828",
    "name": "鹤峰县",
    "fullname": "鹤峰县",
    "level": 3,
    "parentId": "422800"
  },
  {
    "id": "429004",
    "areaId": "429004",
    "code": "429004",
    "name": "仙桃市",
    "fullname": "仙桃市",
    "level": 3,
    "parentId": "429000"
  },
  {
    "id": "429005",
    "areaId": "429005",
    "code": "429005",
    "name": "潜江市",
    "fullname": "潜江市",
    "level": 3,
    "parentId": "429000"
  },
  {
    "id": "429006",
    "areaId": "429006",
    "code": "429006",
    "name": "天门市",
    "fullname": "天门市",
    "level": 3,
    "parentId": "429000"
  },
  {
    "id": "429021",
    "areaId": "429021",
    "code": "429021",
    "name": "神农架林区",
    "fullname": "神农架林区",
    "level": 3,
    "parentId": "429000"
  },
  {
    "id": "430101",
    "areaId": "430101",
    "code": "430101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430102",
    "areaId": "430102",
    "code": "430102",
    "name": "芙蓉区",
    "fullname": "芙蓉区",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430103",
    "areaId": "430103",
    "code": "430103",
    "name": "天心区",
    "fullname": "天心区",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430104",
    "areaId": "430104",
    "code": "430104",
    "name": "岳麓区",
    "fullname": "岳麓区",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430105",
    "areaId": "430105",
    "code": "430105",
    "name": "开福区",
    "fullname": "开福区",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430111",
    "areaId": "430111",
    "code": "430111",
    "name": "雨花区",
    "fullname": "雨花区",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430112",
    "areaId": "430112",
    "code": "430112",
    "name": "望城区",
    "fullname": "望城区",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430121",
    "areaId": "430121",
    "code": "430121",
    "name": "长沙县",
    "fullname": "长沙县",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430181",
    "areaId": "430181",
    "code": "430181",
    "name": "浏阳市",
    "fullname": "浏阳市",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430182",
    "areaId": "430182",
    "code": "430182",
    "name": "宁乡市",
    "fullname": "宁乡市",
    "level": 3,
    "parentId": "430100"
  },
  {
    "id": "430201",
    "areaId": "430201",
    "code": "430201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430202",
    "areaId": "430202",
    "code": "430202",
    "name": "荷塘区",
    "fullname": "荷塘区",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430203",
    "areaId": "430203",
    "code": "430203",
    "name": "芦淞区",
    "fullname": "芦淞区",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430204",
    "areaId": "430204",
    "code": "430204",
    "name": "石峰区",
    "fullname": "石峰区",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430211",
    "areaId": "430211",
    "code": "430211",
    "name": "天元区",
    "fullname": "天元区",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430212",
    "areaId": "430212",
    "code": "430212",
    "name": "渌口区",
    "fullname": "渌口区",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430223",
    "areaId": "430223",
    "code": "430223",
    "name": "攸县",
    "fullname": "攸县",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430224",
    "areaId": "430224",
    "code": "430224",
    "name": "茶陵县",
    "fullname": "茶陵县",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430225",
    "areaId": "430225",
    "code": "430225",
    "name": "炎陵县",
    "fullname": "炎陵县",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430271",
    "areaId": "430271",
    "code": "430271",
    "name": "云龙示范区",
    "fullname": "云龙示范区",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430281",
    "areaId": "430281",
    "code": "430281",
    "name": "醴陵市",
    "fullname": "醴陵市",
    "level": 3,
    "parentId": "430200"
  },
  {
    "id": "430301",
    "areaId": "430301",
    "code": "430301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430302",
    "areaId": "430302",
    "code": "430302",
    "name": "雨湖区",
    "fullname": "雨湖区",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430304",
    "areaId": "430304",
    "code": "430304",
    "name": "岳塘区",
    "fullname": "岳塘区",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430321",
    "areaId": "430321",
    "code": "430321",
    "name": "湘潭县",
    "fullname": "湘潭县",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430371",
    "areaId": "430371",
    "code": "430371",
    "name": "湖南湘潭高新技术产业园区",
    "fullname": "湖南湘潭高新技术产业园区",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430372",
    "areaId": "430372",
    "code": "430372",
    "name": "湘潭昭山示范区",
    "fullname": "湘潭昭山示范区",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430373",
    "areaId": "430373",
    "code": "430373",
    "name": "湘潭九华示范区",
    "fullname": "湘潭九华示范区",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430381",
    "areaId": "430381",
    "code": "430381",
    "name": "湘乡市",
    "fullname": "湘乡市",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430382",
    "areaId": "430382",
    "code": "430382",
    "name": "韶山市",
    "fullname": "韶山市",
    "level": 3,
    "parentId": "430300"
  },
  {
    "id": "430401",
    "areaId": "430401",
    "code": "430401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430405",
    "areaId": "430405",
    "code": "430405",
    "name": "珠晖区",
    "fullname": "珠晖区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430406",
    "areaId": "430406",
    "code": "430406",
    "name": "雁峰区",
    "fullname": "雁峰区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430407",
    "areaId": "430407",
    "code": "430407",
    "name": "石鼓区",
    "fullname": "石鼓区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430408",
    "areaId": "430408",
    "code": "430408",
    "name": "蒸湘区",
    "fullname": "蒸湘区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430412",
    "areaId": "430412",
    "code": "430412",
    "name": "南岳区",
    "fullname": "南岳区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430421",
    "areaId": "430421",
    "code": "430421",
    "name": "衡阳县",
    "fullname": "衡阳县",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430422",
    "areaId": "430422",
    "code": "430422",
    "name": "衡南县",
    "fullname": "衡南县",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430423",
    "areaId": "430423",
    "code": "430423",
    "name": "衡山县",
    "fullname": "衡山县",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430424",
    "areaId": "430424",
    "code": "430424",
    "name": "衡东县",
    "fullname": "衡东县",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430426",
    "areaId": "430426",
    "code": "430426",
    "name": "祁东县",
    "fullname": "祁东县",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430471",
    "areaId": "430471",
    "code": "430471",
    "name": "衡阳综合保税区",
    "fullname": "衡阳综合保税区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430472",
    "areaId": "430472",
    "code": "430472",
    "name": "湖南衡阳高新技术产业园区",
    "fullname": "湖南衡阳高新技术产业园区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430473",
    "areaId": "430473",
    "code": "430473",
    "name": "湖南衡阳松木经济开发区",
    "fullname": "湖南衡阳松木经济开发区",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430481",
    "areaId": "430481",
    "code": "430481",
    "name": "耒阳市",
    "fullname": "耒阳市",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430482",
    "areaId": "430482",
    "code": "430482",
    "name": "常宁市",
    "fullname": "常宁市",
    "level": 3,
    "parentId": "430400"
  },
  {
    "id": "430501",
    "areaId": "430501",
    "code": "430501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430502",
    "areaId": "430502",
    "code": "430502",
    "name": "双清区",
    "fullname": "双清区",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430503",
    "areaId": "430503",
    "code": "430503",
    "name": "大祥区",
    "fullname": "大祥区",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430511",
    "areaId": "430511",
    "code": "430511",
    "name": "北塔区",
    "fullname": "北塔区",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430522",
    "areaId": "430522",
    "code": "430522",
    "name": "新邵县",
    "fullname": "新邵县",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430523",
    "areaId": "430523",
    "code": "430523",
    "name": "邵阳县",
    "fullname": "邵阳县",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430524",
    "areaId": "430524",
    "code": "430524",
    "name": "隆回县",
    "fullname": "隆回县",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430525",
    "areaId": "430525",
    "code": "430525",
    "name": "洞口县",
    "fullname": "洞口县",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430527",
    "areaId": "430527",
    "code": "430527",
    "name": "绥宁县",
    "fullname": "绥宁县",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430528",
    "areaId": "430528",
    "code": "430528",
    "name": "新宁县",
    "fullname": "新宁县",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430529",
    "areaId": "430529",
    "code": "430529",
    "name": "城步苗族自治县",
    "fullname": "城步苗族自治县",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430581",
    "areaId": "430581",
    "code": "430581",
    "name": "武冈市",
    "fullname": "武冈市",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430582",
    "areaId": "430582",
    "code": "430582",
    "name": "邵东市",
    "fullname": "邵东市",
    "level": 3,
    "parentId": "430500"
  },
  {
    "id": "430601",
    "areaId": "430601",
    "code": "430601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430602",
    "areaId": "430602",
    "code": "430602",
    "name": "岳阳楼区",
    "fullname": "岳阳楼区",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430603",
    "areaId": "430603",
    "code": "430603",
    "name": "云溪区",
    "fullname": "云溪区",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430611",
    "areaId": "430611",
    "code": "430611",
    "name": "君山区",
    "fullname": "君山区",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430621",
    "areaId": "430621",
    "code": "430621",
    "name": "岳阳县",
    "fullname": "岳阳县",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430623",
    "areaId": "430623",
    "code": "430623",
    "name": "华容县",
    "fullname": "华容县",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430624",
    "areaId": "430624",
    "code": "430624",
    "name": "湘阴县",
    "fullname": "湘阴县",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430626",
    "areaId": "430626",
    "code": "430626",
    "name": "平江县",
    "fullname": "平江县",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430671",
    "areaId": "430671",
    "code": "430671",
    "name": "岳阳市屈原管理区",
    "fullname": "岳阳市屈原管理区",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430681",
    "areaId": "430681",
    "code": "430681",
    "name": "汨罗市",
    "fullname": "汨罗市",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430682",
    "areaId": "430682",
    "code": "430682",
    "name": "临湘市",
    "fullname": "临湘市",
    "level": 3,
    "parentId": "430600"
  },
  {
    "id": "430701",
    "areaId": "430701",
    "code": "430701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430702",
    "areaId": "430702",
    "code": "430702",
    "name": "武陵区",
    "fullname": "武陵区",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430703",
    "areaId": "430703",
    "code": "430703",
    "name": "鼎城区",
    "fullname": "鼎城区",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430721",
    "areaId": "430721",
    "code": "430721",
    "name": "安乡县",
    "fullname": "安乡县",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430722",
    "areaId": "430722",
    "code": "430722",
    "name": "汉寿县",
    "fullname": "汉寿县",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430723",
    "areaId": "430723",
    "code": "430723",
    "name": "澧县",
    "fullname": "澧县",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430724",
    "areaId": "430724",
    "code": "430724",
    "name": "临澧县",
    "fullname": "临澧县",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430725",
    "areaId": "430725",
    "code": "430725",
    "name": "桃源县",
    "fullname": "桃源县",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430726",
    "areaId": "430726",
    "code": "430726",
    "name": "石门县",
    "fullname": "石门县",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430771",
    "areaId": "430771",
    "code": "430771",
    "name": "常德市西洞庭管理区",
    "fullname": "常德市西洞庭管理区",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430781",
    "areaId": "430781",
    "code": "430781",
    "name": "津市市",
    "fullname": "津市市",
    "level": 3,
    "parentId": "430700"
  },
  {
    "id": "430801",
    "areaId": "430801",
    "code": "430801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430800"
  },
  {
    "id": "430802",
    "areaId": "430802",
    "code": "430802",
    "name": "永定区",
    "fullname": "永定区",
    "level": 3,
    "parentId": "430800"
  },
  {
    "id": "430811",
    "areaId": "430811",
    "code": "430811",
    "name": "武陵源区",
    "fullname": "武陵源区",
    "level": 3,
    "parentId": "430800"
  },
  {
    "id": "430821",
    "areaId": "430821",
    "code": "430821",
    "name": "慈利县",
    "fullname": "慈利县",
    "level": 3,
    "parentId": "430800"
  },
  {
    "id": "430822",
    "areaId": "430822",
    "code": "430822",
    "name": "桑植县",
    "fullname": "桑植县",
    "level": 3,
    "parentId": "430800"
  },
  {
    "id": "430901",
    "areaId": "430901",
    "code": "430901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430902",
    "areaId": "430902",
    "code": "430902",
    "name": "资阳区",
    "fullname": "资阳区",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430903",
    "areaId": "430903",
    "code": "430903",
    "name": "赫山区",
    "fullname": "赫山区",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430921",
    "areaId": "430921",
    "code": "430921",
    "name": "南县",
    "fullname": "南县",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430922",
    "areaId": "430922",
    "code": "430922",
    "name": "桃江县",
    "fullname": "桃江县",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430923",
    "areaId": "430923",
    "code": "430923",
    "name": "安化县",
    "fullname": "安化县",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430971",
    "areaId": "430971",
    "code": "430971",
    "name": "益阳市大通湖管理区",
    "fullname": "益阳市大通湖管理区",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430972",
    "areaId": "430972",
    "code": "430972",
    "name": "湖南益阳高新技术产业园区",
    "fullname": "湖南益阳高新技术产业园区",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "430981",
    "areaId": "430981",
    "code": "430981",
    "name": "沅江市",
    "fullname": "沅江市",
    "level": 3,
    "parentId": "430900"
  },
  {
    "id": "431001",
    "areaId": "431001",
    "code": "431001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431002",
    "areaId": "431002",
    "code": "431002",
    "name": "北湖区",
    "fullname": "北湖区",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431003",
    "areaId": "431003",
    "code": "431003",
    "name": "苏仙区",
    "fullname": "苏仙区",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431021",
    "areaId": "431021",
    "code": "431021",
    "name": "桂阳县",
    "fullname": "桂阳县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431022",
    "areaId": "431022",
    "code": "431022",
    "name": "宜章县",
    "fullname": "宜章县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431023",
    "areaId": "431023",
    "code": "431023",
    "name": "永兴县",
    "fullname": "永兴县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431024",
    "areaId": "431024",
    "code": "431024",
    "name": "嘉禾县",
    "fullname": "嘉禾县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431025",
    "areaId": "431025",
    "code": "431025",
    "name": "临武县",
    "fullname": "临武县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431026",
    "areaId": "431026",
    "code": "431026",
    "name": "汝城县",
    "fullname": "汝城县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431027",
    "areaId": "431027",
    "code": "431027",
    "name": "桂东县",
    "fullname": "桂东县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431028",
    "areaId": "431028",
    "code": "431028",
    "name": "安仁县",
    "fullname": "安仁县",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431081",
    "areaId": "431081",
    "code": "431081",
    "name": "资兴市",
    "fullname": "资兴市",
    "level": 3,
    "parentId": "431000"
  },
  {
    "id": "431101",
    "areaId": "431101",
    "code": "431101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431102",
    "areaId": "431102",
    "code": "431102",
    "name": "零陵区",
    "fullname": "零陵区",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431103",
    "areaId": "431103",
    "code": "431103",
    "name": "冷水滩区",
    "fullname": "冷水滩区",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431121",
    "areaId": "431121",
    "code": "431121",
    "name": "祁阳县",
    "fullname": "祁阳县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431122",
    "areaId": "431122",
    "code": "431122",
    "name": "东安县",
    "fullname": "东安县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431123",
    "areaId": "431123",
    "code": "431123",
    "name": "双牌县",
    "fullname": "双牌县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431124",
    "areaId": "431124",
    "code": "431124",
    "name": "道县",
    "fullname": "道县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431125",
    "areaId": "431125",
    "code": "431125",
    "name": "江永县",
    "fullname": "江永县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431126",
    "areaId": "431126",
    "code": "431126",
    "name": "宁远县",
    "fullname": "宁远县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431127",
    "areaId": "431127",
    "code": "431127",
    "name": "蓝山县",
    "fullname": "蓝山县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431128",
    "areaId": "431128",
    "code": "431128",
    "name": "新田县",
    "fullname": "新田县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431129",
    "areaId": "431129",
    "code": "431129",
    "name": "江华瑶族自治县",
    "fullname": "江华瑶族自治县",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431171",
    "areaId": "431171",
    "code": "431171",
    "name": "永州经济技术开发区",
    "fullname": "永州经济技术开发区",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431172",
    "areaId": "431172",
    "code": "431172",
    "name": "永州市金洞管理区",
    "fullname": "永州市金洞管理区",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431173",
    "areaId": "431173",
    "code": "431173",
    "name": "永州市回龙圩管理区",
    "fullname": "永州市回龙圩管理区",
    "level": 3,
    "parentId": "431100"
  },
  {
    "id": "431201",
    "areaId": "431201",
    "code": "431201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431202",
    "areaId": "431202",
    "code": "431202",
    "name": "鹤城区",
    "fullname": "鹤城区",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431221",
    "areaId": "431221",
    "code": "431221",
    "name": "中方县",
    "fullname": "中方县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431222",
    "areaId": "431222",
    "code": "431222",
    "name": "沅陵县",
    "fullname": "沅陵县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431223",
    "areaId": "431223",
    "code": "431223",
    "name": "辰溪县",
    "fullname": "辰溪县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431224",
    "areaId": "431224",
    "code": "431224",
    "name": "溆浦县",
    "fullname": "溆浦县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431225",
    "areaId": "431225",
    "code": "431225",
    "name": "会同县",
    "fullname": "会同县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431226",
    "areaId": "431226",
    "code": "431226",
    "name": "麻阳苗族自治县",
    "fullname": "麻阳苗族自治县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431227",
    "areaId": "431227",
    "code": "431227",
    "name": "新晃侗族自治县",
    "fullname": "新晃侗族自治县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431228",
    "areaId": "431228",
    "code": "431228",
    "name": "芷江侗族自治县",
    "fullname": "芷江侗族自治县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431229",
    "areaId": "431229",
    "code": "431229",
    "name": "靖州苗族侗族自治县",
    "fullname": "靖州苗族侗族自治县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431230",
    "areaId": "431230",
    "code": "431230",
    "name": "通道侗族自治县",
    "fullname": "通道侗族自治县",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431271",
    "areaId": "431271",
    "code": "431271",
    "name": "怀化市洪江管理区",
    "fullname": "怀化市洪江管理区",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431281",
    "areaId": "431281",
    "code": "431281",
    "name": "洪江市",
    "fullname": "洪江市",
    "level": 3,
    "parentId": "431200"
  },
  {
    "id": "431301",
    "areaId": "431301",
    "code": "431301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "431300"
  },
  {
    "id": "431302",
    "areaId": "431302",
    "code": "431302",
    "name": "娄星区",
    "fullname": "娄星区",
    "level": 3,
    "parentId": "431300"
  },
  {
    "id": "431321",
    "areaId": "431321",
    "code": "431321",
    "name": "双峰县",
    "fullname": "双峰县",
    "level": 3,
    "parentId": "431300"
  },
  {
    "id": "431322",
    "areaId": "431322",
    "code": "431322",
    "name": "新化县",
    "fullname": "新化县",
    "level": 3,
    "parentId": "431300"
  },
  {
    "id": "431381",
    "areaId": "431381",
    "code": "431381",
    "name": "冷水江市",
    "fullname": "冷水江市",
    "level": 3,
    "parentId": "431300"
  },
  {
    "id": "431382",
    "areaId": "431382",
    "code": "431382",
    "name": "涟源市",
    "fullname": "涟源市",
    "level": 3,
    "parentId": "431300"
  },
  {
    "id": "433101",
    "areaId": "433101",
    "code": "433101",
    "name": "吉首市",
    "fullname": "吉首市",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433122",
    "areaId": "433122",
    "code": "433122",
    "name": "泸溪县",
    "fullname": "泸溪县",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433123",
    "areaId": "433123",
    "code": "433123",
    "name": "凤凰县",
    "fullname": "凤凰县",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433124",
    "areaId": "433124",
    "code": "433124",
    "name": "花垣县",
    "fullname": "花垣县",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433125",
    "areaId": "433125",
    "code": "433125",
    "name": "保靖县",
    "fullname": "保靖县",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433126",
    "areaId": "433126",
    "code": "433126",
    "name": "古丈县",
    "fullname": "古丈县",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433127",
    "areaId": "433127",
    "code": "433127",
    "name": "永顺县",
    "fullname": "永顺县",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433130",
    "areaId": "433130",
    "code": "433130",
    "name": "龙山县",
    "fullname": "龙山县",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "433173",
    "areaId": "433173",
    "code": "433173",
    "name": "湖南永顺经济开发区",
    "fullname": "湖南永顺经济开发区",
    "level": 3,
    "parentId": "433100"
  },
  {
    "id": "440101",
    "areaId": "440101",
    "code": "440101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440103",
    "areaId": "440103",
    "code": "440103",
    "name": "荔湾区",
    "fullname": "荔湾区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440104",
    "areaId": "440104",
    "code": "440104",
    "name": "越秀区",
    "fullname": "越秀区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440105",
    "areaId": "440105",
    "code": "440105",
    "name": "海珠区",
    "fullname": "海珠区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440106",
    "areaId": "440106",
    "code": "440106",
    "name": "天河区",
    "fullname": "天河区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440111",
    "areaId": "440111",
    "code": "440111",
    "name": "白云区",
    "fullname": "白云区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440112",
    "areaId": "440112",
    "code": "440112",
    "name": "黄埔区",
    "fullname": "黄埔区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440113",
    "areaId": "440113",
    "code": "440113",
    "name": "番禺区",
    "fullname": "番禺区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440114",
    "areaId": "440114",
    "code": "440114",
    "name": "花都区",
    "fullname": "花都区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440115",
    "areaId": "440115",
    "code": "440115",
    "name": "南沙区",
    "fullname": "南沙区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440117",
    "areaId": "440117",
    "code": "440117",
    "name": "从化区",
    "fullname": "从化区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440118",
    "areaId": "440118",
    "code": "440118",
    "name": "增城区",
    "fullname": "增城区",
    "level": 3,
    "parentId": "440100"
  },
  {
    "id": "440201",
    "areaId": "440201",
    "code": "440201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440203",
    "areaId": "440203",
    "code": "440203",
    "name": "武江区",
    "fullname": "武江区",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440204",
    "areaId": "440204",
    "code": "440204",
    "name": "浈江区",
    "fullname": "浈江区",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440205",
    "areaId": "440205",
    "code": "440205",
    "name": "曲江区",
    "fullname": "曲江区",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440222",
    "areaId": "440222",
    "code": "440222",
    "name": "始兴县",
    "fullname": "始兴县",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440224",
    "areaId": "440224",
    "code": "440224",
    "name": "仁化县",
    "fullname": "仁化县",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440229",
    "areaId": "440229",
    "code": "440229",
    "name": "翁源县",
    "fullname": "翁源县",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440232",
    "areaId": "440232",
    "code": "440232",
    "name": "乳源瑶族自治县",
    "fullname": "乳源瑶族自治县",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440233",
    "areaId": "440233",
    "code": "440233",
    "name": "新丰县",
    "fullname": "新丰县",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440281",
    "areaId": "440281",
    "code": "440281",
    "name": "乐昌市",
    "fullname": "乐昌市",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440282",
    "areaId": "440282",
    "code": "440282",
    "name": "南雄市",
    "fullname": "南雄市",
    "level": 3,
    "parentId": "440200"
  },
  {
    "id": "440301",
    "areaId": "440301",
    "code": "440301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440303",
    "areaId": "440303",
    "code": "440303",
    "name": "罗湖区",
    "fullname": "罗湖区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440304",
    "areaId": "440304",
    "code": "440304",
    "name": "福田区",
    "fullname": "福田区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440305",
    "areaId": "440305",
    "code": "440305",
    "name": "南山区",
    "fullname": "南山区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440306",
    "areaId": "440306",
    "code": "440306",
    "name": "宝安区",
    "fullname": "宝安区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440307",
    "areaId": "440307",
    "code": "440307",
    "name": "龙岗区",
    "fullname": "龙岗区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440308",
    "areaId": "440308",
    "code": "440308",
    "name": "盐田区",
    "fullname": "盐田区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440309",
    "areaId": "440309",
    "code": "440309",
    "name": "龙华区",
    "fullname": "龙华区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440310",
    "areaId": "440310",
    "code": "440310",
    "name": "坪山区",
    "fullname": "坪山区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440311",
    "areaId": "440311",
    "code": "440311",
    "name": "光明区",
    "fullname": "光明区",
    "level": 3,
    "parentId": "440300"
  },
  {
    "id": "440401",
    "areaId": "440401",
    "code": "440401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440400"
  },
  {
    "id": "440402",
    "areaId": "440402",
    "code": "440402",
    "name": "香洲区",
    "fullname": "香洲区",
    "level": 3,
    "parentId": "440400"
  },
  {
    "id": "440403",
    "areaId": "440403",
    "code": "440403",
    "name": "斗门区",
    "fullname": "斗门区",
    "level": 3,
    "parentId": "440400"
  },
  {
    "id": "440404",
    "areaId": "440404",
    "code": "440404",
    "name": "金湾区",
    "fullname": "金湾区",
    "level": 3,
    "parentId": "440400"
  },
  {
    "id": "440501",
    "areaId": "440501",
    "code": "440501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440507",
    "areaId": "440507",
    "code": "440507",
    "name": "龙湖区",
    "fullname": "龙湖区",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440511",
    "areaId": "440511",
    "code": "440511",
    "name": "金平区",
    "fullname": "金平区",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440512",
    "areaId": "440512",
    "code": "440512",
    "name": "濠江区",
    "fullname": "濠江区",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440513",
    "areaId": "440513",
    "code": "440513",
    "name": "潮阳区",
    "fullname": "潮阳区",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440514",
    "areaId": "440514",
    "code": "440514",
    "name": "潮南区",
    "fullname": "潮南区",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440515",
    "areaId": "440515",
    "code": "440515",
    "name": "澄海区",
    "fullname": "澄海区",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440523",
    "areaId": "440523",
    "code": "440523",
    "name": "南澳县",
    "fullname": "南澳县",
    "level": 3,
    "parentId": "440500"
  },
  {
    "id": "440601",
    "areaId": "440601",
    "code": "440601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440600"
  },
  {
    "id": "440604",
    "areaId": "440604",
    "code": "440604",
    "name": "禅城区",
    "fullname": "禅城区",
    "level": 3,
    "parentId": "440600"
  },
  {
    "id": "440605",
    "areaId": "440605",
    "code": "440605",
    "name": "南海区",
    "fullname": "南海区",
    "level": 3,
    "parentId": "440600"
  },
  {
    "id": "440606",
    "areaId": "440606",
    "code": "440606",
    "name": "顺德区",
    "fullname": "顺德区",
    "level": 3,
    "parentId": "440600"
  },
  {
    "id": "440607",
    "areaId": "440607",
    "code": "440607",
    "name": "三水区",
    "fullname": "三水区",
    "level": 3,
    "parentId": "440600"
  },
  {
    "id": "440608",
    "areaId": "440608",
    "code": "440608",
    "name": "高明区",
    "fullname": "高明区",
    "level": 3,
    "parentId": "440600"
  },
  {
    "id": "440701",
    "areaId": "440701",
    "code": "440701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440703",
    "areaId": "440703",
    "code": "440703",
    "name": "蓬江区",
    "fullname": "蓬江区",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440704",
    "areaId": "440704",
    "code": "440704",
    "name": "江海区",
    "fullname": "江海区",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440705",
    "areaId": "440705",
    "code": "440705",
    "name": "新会区",
    "fullname": "新会区",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440781",
    "areaId": "440781",
    "code": "440781",
    "name": "台山市",
    "fullname": "台山市",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440783",
    "areaId": "440783",
    "code": "440783",
    "name": "开平市",
    "fullname": "开平市",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440784",
    "areaId": "440784",
    "code": "440784",
    "name": "鹤山市",
    "fullname": "鹤山市",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440785",
    "areaId": "440785",
    "code": "440785",
    "name": "恩平市",
    "fullname": "恩平市",
    "level": 3,
    "parentId": "440700"
  },
  {
    "id": "440801",
    "areaId": "440801",
    "code": "440801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440802",
    "areaId": "440802",
    "code": "440802",
    "name": "赤坎区",
    "fullname": "赤坎区",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440803",
    "areaId": "440803",
    "code": "440803",
    "name": "霞山区",
    "fullname": "霞山区",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440804",
    "areaId": "440804",
    "code": "440804",
    "name": "坡头区",
    "fullname": "坡头区",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440811",
    "areaId": "440811",
    "code": "440811",
    "name": "麻章区",
    "fullname": "麻章区",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440823",
    "areaId": "440823",
    "code": "440823",
    "name": "遂溪县",
    "fullname": "遂溪县",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440825",
    "areaId": "440825",
    "code": "440825",
    "name": "徐闻县",
    "fullname": "徐闻县",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440881",
    "areaId": "440881",
    "code": "440881",
    "name": "廉江市",
    "fullname": "廉江市",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440882",
    "areaId": "440882",
    "code": "440882",
    "name": "雷州市",
    "fullname": "雷州市",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440883",
    "areaId": "440883",
    "code": "440883",
    "name": "吴川市",
    "fullname": "吴川市",
    "level": 3,
    "parentId": "440800"
  },
  {
    "id": "440901",
    "areaId": "440901",
    "code": "440901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "440900"
  },
  {
    "id": "440902",
    "areaId": "440902",
    "code": "440902",
    "name": "茂南区",
    "fullname": "茂南区",
    "level": 3,
    "parentId": "440900"
  },
  {
    "id": "440904",
    "areaId": "440904",
    "code": "440904",
    "name": "电白区",
    "fullname": "电白区",
    "level": 3,
    "parentId": "440900"
  },
  {
    "id": "440981",
    "areaId": "440981",
    "code": "440981",
    "name": "高州市",
    "fullname": "高州市",
    "level": 3,
    "parentId": "440900"
  },
  {
    "id": "440982",
    "areaId": "440982",
    "code": "440982",
    "name": "化州市",
    "fullname": "化州市",
    "level": 3,
    "parentId": "440900"
  },
  {
    "id": "440983",
    "areaId": "440983",
    "code": "440983",
    "name": "信宜市",
    "fullname": "信宜市",
    "level": 3,
    "parentId": "440900"
  },
  {
    "id": "441201",
    "areaId": "441201",
    "code": "441201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441202",
    "areaId": "441202",
    "code": "441202",
    "name": "端州区",
    "fullname": "端州区",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441203",
    "areaId": "441203",
    "code": "441203",
    "name": "鼎湖区",
    "fullname": "鼎湖区",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441204",
    "areaId": "441204",
    "code": "441204",
    "name": "高要区",
    "fullname": "高要区",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441223",
    "areaId": "441223",
    "code": "441223",
    "name": "广宁县",
    "fullname": "广宁县",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441224",
    "areaId": "441224",
    "code": "441224",
    "name": "怀集县",
    "fullname": "怀集县",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441225",
    "areaId": "441225",
    "code": "441225",
    "name": "封开县",
    "fullname": "封开县",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441226",
    "areaId": "441226",
    "code": "441226",
    "name": "德庆县",
    "fullname": "德庆县",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441284",
    "areaId": "441284",
    "code": "441284",
    "name": "四会市",
    "fullname": "四会市",
    "level": 3,
    "parentId": "441200"
  },
  {
    "id": "441301",
    "areaId": "441301",
    "code": "441301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "441300"
  },
  {
    "id": "441302",
    "areaId": "441302",
    "code": "441302",
    "name": "惠城区",
    "fullname": "惠城区",
    "level": 3,
    "parentId": "441300"
  },
  {
    "id": "441303",
    "areaId": "441303",
    "code": "441303",
    "name": "惠阳区",
    "fullname": "惠阳区",
    "level": 3,
    "parentId": "441300"
  },
  {
    "id": "441322",
    "areaId": "441322",
    "code": "441322",
    "name": "博罗县",
    "fullname": "博罗县",
    "level": 3,
    "parentId": "441300"
  },
  {
    "id": "441323",
    "areaId": "441323",
    "code": "441323",
    "name": "惠东县",
    "fullname": "惠东县",
    "level": 3,
    "parentId": "441300"
  },
  {
    "id": "441324",
    "areaId": "441324",
    "code": "441324",
    "name": "龙门县",
    "fullname": "龙门县",
    "level": 3,
    "parentId": "441300"
  },
  {
    "id": "441401",
    "areaId": "441401",
    "code": "441401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441402",
    "areaId": "441402",
    "code": "441402",
    "name": "梅江区",
    "fullname": "梅江区",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441403",
    "areaId": "441403",
    "code": "441403",
    "name": "梅县区",
    "fullname": "梅县区",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441422",
    "areaId": "441422",
    "code": "441422",
    "name": "大埔县",
    "fullname": "大埔县",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441423",
    "areaId": "441423",
    "code": "441423",
    "name": "丰顺县",
    "fullname": "丰顺县",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441424",
    "areaId": "441424",
    "code": "441424",
    "name": "五华县",
    "fullname": "五华县",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441426",
    "areaId": "441426",
    "code": "441426",
    "name": "平远县",
    "fullname": "平远县",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441427",
    "areaId": "441427",
    "code": "441427",
    "name": "蕉岭县",
    "fullname": "蕉岭县",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441481",
    "areaId": "441481",
    "code": "441481",
    "name": "兴宁市",
    "fullname": "兴宁市",
    "level": 3,
    "parentId": "441400"
  },
  {
    "id": "441501",
    "areaId": "441501",
    "code": "441501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "441500"
  },
  {
    "id": "441502",
    "areaId": "441502",
    "code": "441502",
    "name": "城区",
    "fullname": "城区",
    "level": 3,
    "parentId": "441500"
  },
  {
    "id": "441521",
    "areaId": "441521",
    "code": "441521",
    "name": "海丰县",
    "fullname": "海丰县",
    "level": 3,
    "parentId": "441500"
  },
  {
    "id": "441523",
    "areaId": "441523",
    "code": "441523",
    "name": "陆河县",
    "fullname": "陆河县",
    "level": 3,
    "parentId": "441500"
  },
  {
    "id": "441581",
    "areaId": "441581",
    "code": "441581",
    "name": "陆丰市",
    "fullname": "陆丰市",
    "level": 3,
    "parentId": "441500"
  },
  {
    "id": "441601",
    "areaId": "441601",
    "code": "441601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "441600"
  },
  {
    "id": "441602",
    "areaId": "441602",
    "code": "441602",
    "name": "源城区",
    "fullname": "源城区",
    "level": 3,
    "parentId": "441600"
  },
  {
    "id": "441621",
    "areaId": "441621",
    "code": "441621",
    "name": "紫金县",
    "fullname": "紫金县",
    "level": 3,
    "parentId": "441600"
  },
  {
    "id": "441622",
    "areaId": "441622",
    "code": "441622",
    "name": "龙川县",
    "fullname": "龙川县",
    "level": 3,
    "parentId": "441600"
  },
  {
    "id": "441623",
    "areaId": "441623",
    "code": "441623",
    "name": "连平县",
    "fullname": "连平县",
    "level": 3,
    "parentId": "441600"
  },
  {
    "id": "441624",
    "areaId": "441624",
    "code": "441624",
    "name": "和平县",
    "fullname": "和平县",
    "level": 3,
    "parentId": "441600"
  },
  {
    "id": "441625",
    "areaId": "441625",
    "code": "441625",
    "name": "东源县",
    "fullname": "东源县",
    "level": 3,
    "parentId": "441600"
  },
  {
    "id": "441701",
    "areaId": "441701",
    "code": "441701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "441700"
  },
  {
    "id": "441702",
    "areaId": "441702",
    "code": "441702",
    "name": "江城区",
    "fullname": "江城区",
    "level": 3,
    "parentId": "441700"
  },
  {
    "id": "441704",
    "areaId": "441704",
    "code": "441704",
    "name": "阳东区",
    "fullname": "阳东区",
    "level": 3,
    "parentId": "441700"
  },
  {
    "id": "441721",
    "areaId": "441721",
    "code": "441721",
    "name": "阳西县",
    "fullname": "阳西县",
    "level": 3,
    "parentId": "441700"
  },
  {
    "id": "441781",
    "areaId": "441781",
    "code": "441781",
    "name": "阳春市",
    "fullname": "阳春市",
    "level": 3,
    "parentId": "441700"
  },
  {
    "id": "441801",
    "areaId": "441801",
    "code": "441801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441802",
    "areaId": "441802",
    "code": "441802",
    "name": "清城区",
    "fullname": "清城区",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441803",
    "areaId": "441803",
    "code": "441803",
    "name": "清新区",
    "fullname": "清新区",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441821",
    "areaId": "441821",
    "code": "441821",
    "name": "佛冈县",
    "fullname": "佛冈县",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441823",
    "areaId": "441823",
    "code": "441823",
    "name": "阳山县",
    "fullname": "阳山县",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441825",
    "areaId": "441825",
    "code": "441825",
    "name": "连山壮族瑶族自治县",
    "fullname": "连山壮族瑶族自治县",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441826",
    "areaId": "441826",
    "code": "441826",
    "name": "连南瑶族自治县",
    "fullname": "连南瑶族自治县",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441881",
    "areaId": "441881",
    "code": "441881",
    "name": "英德市",
    "fullname": "英德市",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441882",
    "areaId": "441882",
    "code": "441882",
    "name": "连州市",
    "fullname": "连州市",
    "level": 3,
    "parentId": "441800"
  },
  {
    "id": "441900003",
    "areaId": "441900003",
    "code": "441900003",
    "name": "东城街道",
    "fullname": "东城街道",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900004",
    "areaId": "441900004",
    "code": "441900004",
    "name": "南城街道",
    "fullname": "南城街道",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900005",
    "areaId": "441900005",
    "code": "441900005",
    "name": "万江街道",
    "fullname": "万江街道",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900006",
    "areaId": "441900006",
    "code": "441900006",
    "name": "莞城街道",
    "fullname": "莞城街道",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900101",
    "areaId": "441900101",
    "code": "441900101",
    "name": "石碣镇",
    "fullname": "石碣镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900102",
    "areaId": "441900102",
    "code": "441900102",
    "name": "石龙镇",
    "fullname": "石龙镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900103",
    "areaId": "441900103",
    "code": "441900103",
    "name": "茶山镇",
    "fullname": "茶山镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900104",
    "areaId": "441900104",
    "code": "441900104",
    "name": "石排镇",
    "fullname": "石排镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900105",
    "areaId": "441900105",
    "code": "441900105",
    "name": "企石镇",
    "fullname": "企石镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900106",
    "areaId": "441900106",
    "code": "441900106",
    "name": "横沥镇",
    "fullname": "横沥镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900107",
    "areaId": "441900107",
    "code": "441900107",
    "name": "桥头镇",
    "fullname": "桥头镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900108",
    "areaId": "441900108",
    "code": "441900108",
    "name": "谢岗镇",
    "fullname": "谢岗镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900109",
    "areaId": "441900109",
    "code": "441900109",
    "name": "东坑镇",
    "fullname": "东坑镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900110",
    "areaId": "441900110",
    "code": "441900110",
    "name": "常平镇",
    "fullname": "常平镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900111",
    "areaId": "441900111",
    "code": "441900111",
    "name": "寮步镇",
    "fullname": "寮步镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900112",
    "areaId": "441900112",
    "code": "441900112",
    "name": "樟木头镇",
    "fullname": "樟木头镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900113",
    "areaId": "441900113",
    "code": "441900113",
    "name": "大朗镇",
    "fullname": "大朗镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900114",
    "areaId": "441900114",
    "code": "441900114",
    "name": "黄江镇",
    "fullname": "黄江镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900115",
    "areaId": "441900115",
    "code": "441900115",
    "name": "清溪镇",
    "fullname": "清溪镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900116",
    "areaId": "441900116",
    "code": "441900116",
    "name": "塘厦镇",
    "fullname": "塘厦镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900117",
    "areaId": "441900117",
    "code": "441900117",
    "name": "凤岗镇",
    "fullname": "凤岗镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900118",
    "areaId": "441900118",
    "code": "441900118",
    "name": "大岭山镇",
    "fullname": "大岭山镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900119",
    "areaId": "441900119",
    "code": "441900119",
    "name": "长安镇",
    "fullname": "长安镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900121",
    "areaId": "441900121",
    "code": "441900121",
    "name": "虎门镇",
    "fullname": "虎门镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900122",
    "areaId": "441900122",
    "code": "441900122",
    "name": "厚街镇",
    "fullname": "厚街镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900123",
    "areaId": "441900123",
    "code": "441900123",
    "name": "沙田镇",
    "fullname": "沙田镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900124",
    "areaId": "441900124",
    "code": "441900124",
    "name": "道滘镇",
    "fullname": "道滘镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900125",
    "areaId": "441900125",
    "code": "441900125",
    "name": "洪梅镇",
    "fullname": "洪梅镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900126",
    "areaId": "441900126",
    "code": "441900126",
    "name": "麻涌镇",
    "fullname": "麻涌镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900127",
    "areaId": "441900127",
    "code": "441900127",
    "name": "望牛墩镇",
    "fullname": "望牛墩镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900128",
    "areaId": "441900128",
    "code": "441900128",
    "name": "中堂镇",
    "fullname": "中堂镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900129",
    "areaId": "441900129",
    "code": "441900129",
    "name": "高埗镇",
    "fullname": "高埗镇",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900401",
    "areaId": "441900401",
    "code": "441900401",
    "name": "松山湖",
    "fullname": "松山湖",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900402",
    "areaId": "441900402",
    "code": "441900402",
    "name": "东莞港",
    "fullname": "东莞港",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "441900403",
    "areaId": "441900403",
    "code": "441900403",
    "name": "东莞生态园",
    "fullname": "东莞生态园",
    "level": 3,
    "parentId": "441900"
  },
  {
    "id": "442000001",
    "areaId": "442000001",
    "code": "442000001",
    "name": "石岐街道",
    "fullname": "石岐街道",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000002",
    "areaId": "442000002",
    "code": "442000002",
    "name": "东区街道",
    "fullname": "东区街道",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000003",
    "areaId": "442000003",
    "code": "442000003",
    "name": "中山港街道",
    "fullname": "中山港街道",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000004",
    "areaId": "442000004",
    "code": "442000004",
    "name": "西区街道",
    "fullname": "西区街道",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000005",
    "areaId": "442000005",
    "code": "442000005",
    "name": "南区街道",
    "fullname": "南区街道",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000006",
    "areaId": "442000006",
    "code": "442000006",
    "name": "五桂山街道",
    "fullname": "五桂山街道",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000100",
    "areaId": "442000100",
    "code": "442000100",
    "name": "小榄镇",
    "fullname": "小榄镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000101",
    "areaId": "442000101",
    "code": "442000101",
    "name": "黄圃镇",
    "fullname": "黄圃镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000102",
    "areaId": "442000102",
    "code": "442000102",
    "name": "民众镇",
    "fullname": "民众镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000103",
    "areaId": "442000103",
    "code": "442000103",
    "name": "东凤镇",
    "fullname": "东凤镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000104",
    "areaId": "442000104",
    "code": "442000104",
    "name": "东升镇",
    "fullname": "东升镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000105",
    "areaId": "442000105",
    "code": "442000105",
    "name": "古镇镇",
    "fullname": "古镇镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000106",
    "areaId": "442000106",
    "code": "442000106",
    "name": "沙溪镇",
    "fullname": "沙溪镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000107",
    "areaId": "442000107",
    "code": "442000107",
    "name": "坦洲镇",
    "fullname": "坦洲镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000108",
    "areaId": "442000108",
    "code": "442000108",
    "name": "港口镇",
    "fullname": "港口镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000109",
    "areaId": "442000109",
    "code": "442000109",
    "name": "三角镇",
    "fullname": "三角镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000110",
    "areaId": "442000110",
    "code": "442000110",
    "name": "横栏镇",
    "fullname": "横栏镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000111",
    "areaId": "442000111",
    "code": "442000111",
    "name": "南头镇",
    "fullname": "南头镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000112",
    "areaId": "442000112",
    "code": "442000112",
    "name": "阜沙镇",
    "fullname": "阜沙镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000113",
    "areaId": "442000113",
    "code": "442000113",
    "name": "南朗镇",
    "fullname": "南朗镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000114",
    "areaId": "442000114",
    "code": "442000114",
    "name": "三乡镇",
    "fullname": "三乡镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000115",
    "areaId": "442000115",
    "code": "442000115",
    "name": "板芙镇",
    "fullname": "板芙镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000116",
    "areaId": "442000116",
    "code": "442000116",
    "name": "大涌镇",
    "fullname": "大涌镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "442000117",
    "areaId": "442000117",
    "code": "442000117",
    "name": "神湾镇",
    "fullname": "神湾镇",
    "level": 3,
    "parentId": "442000"
  },
  {
    "id": "445101",
    "areaId": "445101",
    "code": "445101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "445100"
  },
  {
    "id": "445102",
    "areaId": "445102",
    "code": "445102",
    "name": "湘桥区",
    "fullname": "湘桥区",
    "level": 3,
    "parentId": "445100"
  },
  {
    "id": "445103",
    "areaId": "445103",
    "code": "445103",
    "name": "潮安区",
    "fullname": "潮安区",
    "level": 3,
    "parentId": "445100"
  },
  {
    "id": "445122",
    "areaId": "445122",
    "code": "445122",
    "name": "饶平县",
    "fullname": "饶平县",
    "level": 3,
    "parentId": "445100"
  },
  {
    "id": "445201",
    "areaId": "445201",
    "code": "445201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "445200"
  },
  {
    "id": "445202",
    "areaId": "445202",
    "code": "445202",
    "name": "榕城区",
    "fullname": "榕城区",
    "level": 3,
    "parentId": "445200"
  },
  {
    "id": "445203",
    "areaId": "445203",
    "code": "445203",
    "name": "揭东区",
    "fullname": "揭东区",
    "level": 3,
    "parentId": "445200"
  },
  {
    "id": "445222",
    "areaId": "445222",
    "code": "445222",
    "name": "揭西县",
    "fullname": "揭西县",
    "level": 3,
    "parentId": "445200"
  },
  {
    "id": "445224",
    "areaId": "445224",
    "code": "445224",
    "name": "惠来县",
    "fullname": "惠来县",
    "level": 3,
    "parentId": "445200"
  },
  {
    "id": "445281",
    "areaId": "445281",
    "code": "445281",
    "name": "普宁市",
    "fullname": "普宁市",
    "level": 3,
    "parentId": "445200"
  },
  {
    "id": "445301",
    "areaId": "445301",
    "code": "445301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "445300"
  },
  {
    "id": "445302",
    "areaId": "445302",
    "code": "445302",
    "name": "云城区",
    "fullname": "云城区",
    "level": 3,
    "parentId": "445300"
  },
  {
    "id": "445303",
    "areaId": "445303",
    "code": "445303",
    "name": "云安区",
    "fullname": "云安区",
    "level": 3,
    "parentId": "445300"
  },
  {
    "id": "445321",
    "areaId": "445321",
    "code": "445321",
    "name": "新兴县",
    "fullname": "新兴县",
    "level": 3,
    "parentId": "445300"
  },
  {
    "id": "445322",
    "areaId": "445322",
    "code": "445322",
    "name": "郁南县",
    "fullname": "郁南县",
    "level": 3,
    "parentId": "445300"
  },
  {
    "id": "445381",
    "areaId": "445381",
    "code": "445381",
    "name": "罗定市",
    "fullname": "罗定市",
    "level": 3,
    "parentId": "445300"
  },
  {
    "id": "450101",
    "areaId": "450101",
    "code": "450101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450102",
    "areaId": "450102",
    "code": "450102",
    "name": "兴宁区",
    "fullname": "兴宁区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450103",
    "areaId": "450103",
    "code": "450103",
    "name": "青秀区",
    "fullname": "青秀区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450105",
    "areaId": "450105",
    "code": "450105",
    "name": "江南区",
    "fullname": "江南区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450107",
    "areaId": "450107",
    "code": "450107",
    "name": "西乡塘区",
    "fullname": "西乡塘区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450108",
    "areaId": "450108",
    "code": "450108",
    "name": "良庆区",
    "fullname": "良庆区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450109",
    "areaId": "450109",
    "code": "450109",
    "name": "邕宁区",
    "fullname": "邕宁区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450110",
    "areaId": "450110",
    "code": "450110",
    "name": "武鸣区",
    "fullname": "武鸣区",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450123",
    "areaId": "450123",
    "code": "450123",
    "name": "隆安县",
    "fullname": "隆安县",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450124",
    "areaId": "450124",
    "code": "450124",
    "name": "马山县",
    "fullname": "马山县",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450125",
    "areaId": "450125",
    "code": "450125",
    "name": "上林县",
    "fullname": "上林县",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450126",
    "areaId": "450126",
    "code": "450126",
    "name": "宾阳县",
    "fullname": "宾阳县",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450127",
    "areaId": "450127",
    "code": "450127",
    "name": "横县",
    "fullname": "横县",
    "level": 3,
    "parentId": "450100"
  },
  {
    "id": "450201",
    "areaId": "450201",
    "code": "450201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450202",
    "areaId": "450202",
    "code": "450202",
    "name": "城中区",
    "fullname": "城中区",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450203",
    "areaId": "450203",
    "code": "450203",
    "name": "鱼峰区",
    "fullname": "鱼峰区",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450204",
    "areaId": "450204",
    "code": "450204",
    "name": "柳南区",
    "fullname": "柳南区",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450205",
    "areaId": "450205",
    "code": "450205",
    "name": "柳北区",
    "fullname": "柳北区",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450206",
    "areaId": "450206",
    "code": "450206",
    "name": "柳江区",
    "fullname": "柳江区",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450222",
    "areaId": "450222",
    "code": "450222",
    "name": "柳城县",
    "fullname": "柳城县",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450223",
    "areaId": "450223",
    "code": "450223",
    "name": "鹿寨县",
    "fullname": "鹿寨县",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450224",
    "areaId": "450224",
    "code": "450224",
    "name": "融安县",
    "fullname": "融安县",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450225",
    "areaId": "450225",
    "code": "450225",
    "name": "融水苗族自治县",
    "fullname": "融水苗族自治县",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450226",
    "areaId": "450226",
    "code": "450226",
    "name": "三江侗族自治县",
    "fullname": "三江侗族自治县",
    "level": 3,
    "parentId": "450200"
  },
  {
    "id": "450301",
    "areaId": "450301",
    "code": "450301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450302",
    "areaId": "450302",
    "code": "450302",
    "name": "秀峰区",
    "fullname": "秀峰区",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450303",
    "areaId": "450303",
    "code": "450303",
    "name": "叠彩区",
    "fullname": "叠彩区",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450304",
    "areaId": "450304",
    "code": "450304",
    "name": "象山区",
    "fullname": "象山区",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450305",
    "areaId": "450305",
    "code": "450305",
    "name": "七星区",
    "fullname": "七星区",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450311",
    "areaId": "450311",
    "code": "450311",
    "name": "雁山区",
    "fullname": "雁山区",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450312",
    "areaId": "450312",
    "code": "450312",
    "name": "临桂区",
    "fullname": "临桂区",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450321",
    "areaId": "450321",
    "code": "450321",
    "name": "阳朔县",
    "fullname": "阳朔县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450323",
    "areaId": "450323",
    "code": "450323",
    "name": "灵川县",
    "fullname": "灵川县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450324",
    "areaId": "450324",
    "code": "450324",
    "name": "全州县",
    "fullname": "全州县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450325",
    "areaId": "450325",
    "code": "450325",
    "name": "兴安县",
    "fullname": "兴安县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450326",
    "areaId": "450326",
    "code": "450326",
    "name": "永福县",
    "fullname": "永福县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450327",
    "areaId": "450327",
    "code": "450327",
    "name": "灌阳县",
    "fullname": "灌阳县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450328",
    "areaId": "450328",
    "code": "450328",
    "name": "龙胜各族自治县",
    "fullname": "龙胜各族自治县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450329",
    "areaId": "450329",
    "code": "450329",
    "name": "资源县",
    "fullname": "资源县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450330",
    "areaId": "450330",
    "code": "450330",
    "name": "平乐县",
    "fullname": "平乐县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450332",
    "areaId": "450332",
    "code": "450332",
    "name": "恭城瑶族自治县",
    "fullname": "恭城瑶族自治县",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450381",
    "areaId": "450381",
    "code": "450381",
    "name": "荔浦市",
    "fullname": "荔浦市",
    "level": 3,
    "parentId": "450300"
  },
  {
    "id": "450401",
    "areaId": "450401",
    "code": "450401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450403",
    "areaId": "450403",
    "code": "450403",
    "name": "万秀区",
    "fullname": "万秀区",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450405",
    "areaId": "450405",
    "code": "450405",
    "name": "长洲区",
    "fullname": "长洲区",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450406",
    "areaId": "450406",
    "code": "450406",
    "name": "龙圩区",
    "fullname": "龙圩区",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450421",
    "areaId": "450421",
    "code": "450421",
    "name": "苍梧县",
    "fullname": "苍梧县",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450422",
    "areaId": "450422",
    "code": "450422",
    "name": "藤县",
    "fullname": "藤县",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450423",
    "areaId": "450423",
    "code": "450423",
    "name": "蒙山县",
    "fullname": "蒙山县",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450481",
    "areaId": "450481",
    "code": "450481",
    "name": "岑溪市",
    "fullname": "岑溪市",
    "level": 3,
    "parentId": "450400"
  },
  {
    "id": "450501",
    "areaId": "450501",
    "code": "450501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450500"
  },
  {
    "id": "450502",
    "areaId": "450502",
    "code": "450502",
    "name": "海城区",
    "fullname": "海城区",
    "level": 3,
    "parentId": "450500"
  },
  {
    "id": "450503",
    "areaId": "450503",
    "code": "450503",
    "name": "银海区",
    "fullname": "银海区",
    "level": 3,
    "parentId": "450500"
  },
  {
    "id": "450512",
    "areaId": "450512",
    "code": "450512",
    "name": "铁山港区",
    "fullname": "铁山港区",
    "level": 3,
    "parentId": "450500"
  },
  {
    "id": "450521",
    "areaId": "450521",
    "code": "450521",
    "name": "合浦县",
    "fullname": "合浦县",
    "level": 3,
    "parentId": "450500"
  },
  {
    "id": "450601",
    "areaId": "450601",
    "code": "450601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450600"
  },
  {
    "id": "450602",
    "areaId": "450602",
    "code": "450602",
    "name": "港口区",
    "fullname": "港口区",
    "level": 3,
    "parentId": "450600"
  },
  {
    "id": "450603",
    "areaId": "450603",
    "code": "450603",
    "name": "防城区",
    "fullname": "防城区",
    "level": 3,
    "parentId": "450600"
  },
  {
    "id": "450621",
    "areaId": "450621",
    "code": "450621",
    "name": "上思县",
    "fullname": "上思县",
    "level": 3,
    "parentId": "450600"
  },
  {
    "id": "450681",
    "areaId": "450681",
    "code": "450681",
    "name": "东兴市",
    "fullname": "东兴市",
    "level": 3,
    "parentId": "450600"
  },
  {
    "id": "450701",
    "areaId": "450701",
    "code": "450701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450700"
  },
  {
    "id": "450702",
    "areaId": "450702",
    "code": "450702",
    "name": "钦南区",
    "fullname": "钦南区",
    "level": 3,
    "parentId": "450700"
  },
  {
    "id": "450703",
    "areaId": "450703",
    "code": "450703",
    "name": "钦北区",
    "fullname": "钦北区",
    "level": 3,
    "parentId": "450700"
  },
  {
    "id": "450721",
    "areaId": "450721",
    "code": "450721",
    "name": "灵山县",
    "fullname": "灵山县",
    "level": 3,
    "parentId": "450700"
  },
  {
    "id": "450722",
    "areaId": "450722",
    "code": "450722",
    "name": "浦北县",
    "fullname": "浦北县",
    "level": 3,
    "parentId": "450700"
  },
  {
    "id": "450801",
    "areaId": "450801",
    "code": "450801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450800"
  },
  {
    "id": "450802",
    "areaId": "450802",
    "code": "450802",
    "name": "港北区",
    "fullname": "港北区",
    "level": 3,
    "parentId": "450800"
  },
  {
    "id": "450803",
    "areaId": "450803",
    "code": "450803",
    "name": "港南区",
    "fullname": "港南区",
    "level": 3,
    "parentId": "450800"
  },
  {
    "id": "450804",
    "areaId": "450804",
    "code": "450804",
    "name": "覃塘区",
    "fullname": "覃塘区",
    "level": 3,
    "parentId": "450800"
  },
  {
    "id": "450821",
    "areaId": "450821",
    "code": "450821",
    "name": "平南县",
    "fullname": "平南县",
    "level": 3,
    "parentId": "450800"
  },
  {
    "id": "450881",
    "areaId": "450881",
    "code": "450881",
    "name": "桂平市",
    "fullname": "桂平市",
    "level": 3,
    "parentId": "450800"
  },
  {
    "id": "450901",
    "areaId": "450901",
    "code": "450901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "450902",
    "areaId": "450902",
    "code": "450902",
    "name": "玉州区",
    "fullname": "玉州区",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "450903",
    "areaId": "450903",
    "code": "450903",
    "name": "福绵区",
    "fullname": "福绵区",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "450921",
    "areaId": "450921",
    "code": "450921",
    "name": "容县",
    "fullname": "容县",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "450922",
    "areaId": "450922",
    "code": "450922",
    "name": "陆川县",
    "fullname": "陆川县",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "450923",
    "areaId": "450923",
    "code": "450923",
    "name": "博白县",
    "fullname": "博白县",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "450924",
    "areaId": "450924",
    "code": "450924",
    "name": "兴业县",
    "fullname": "兴业县",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "450981",
    "areaId": "450981",
    "code": "450981",
    "name": "北流市",
    "fullname": "北流市",
    "level": 3,
    "parentId": "450900"
  },
  {
    "id": "451001",
    "areaId": "451001",
    "code": "451001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451002",
    "areaId": "451002",
    "code": "451002",
    "name": "右江区",
    "fullname": "右江区",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451003",
    "areaId": "451003",
    "code": "451003",
    "name": "田阳区",
    "fullname": "田阳区",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451022",
    "areaId": "451022",
    "code": "451022",
    "name": "田东县",
    "fullname": "田东县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451023",
    "areaId": "451023",
    "code": "451023",
    "name": "平果县",
    "fullname": "平果县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451024",
    "areaId": "451024",
    "code": "451024",
    "name": "德保县",
    "fullname": "德保县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451026",
    "areaId": "451026",
    "code": "451026",
    "name": "那坡县",
    "fullname": "那坡县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451027",
    "areaId": "451027",
    "code": "451027",
    "name": "凌云县",
    "fullname": "凌云县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451028",
    "areaId": "451028",
    "code": "451028",
    "name": "乐业县",
    "fullname": "乐业县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451029",
    "areaId": "451029",
    "code": "451029",
    "name": "田林县",
    "fullname": "田林县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451030",
    "areaId": "451030",
    "code": "451030",
    "name": "西林县",
    "fullname": "西林县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451031",
    "areaId": "451031",
    "code": "451031",
    "name": "隆林各族自治县",
    "fullname": "隆林各族自治县",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451081",
    "areaId": "451081",
    "code": "451081",
    "name": "靖西市",
    "fullname": "靖西市",
    "level": 3,
    "parentId": "451000"
  },
  {
    "id": "451101",
    "areaId": "451101",
    "code": "451101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "451100"
  },
  {
    "id": "451102",
    "areaId": "451102",
    "code": "451102",
    "name": "八步区",
    "fullname": "八步区",
    "level": 3,
    "parentId": "451100"
  },
  {
    "id": "451103",
    "areaId": "451103",
    "code": "451103",
    "name": "平桂区",
    "fullname": "平桂区",
    "level": 3,
    "parentId": "451100"
  },
  {
    "id": "451121",
    "areaId": "451121",
    "code": "451121",
    "name": "昭平县",
    "fullname": "昭平县",
    "level": 3,
    "parentId": "451100"
  },
  {
    "id": "451122",
    "areaId": "451122",
    "code": "451122",
    "name": "钟山县",
    "fullname": "钟山县",
    "level": 3,
    "parentId": "451100"
  },
  {
    "id": "451123",
    "areaId": "451123",
    "code": "451123",
    "name": "富川瑶族自治县",
    "fullname": "富川瑶族自治县",
    "level": 3,
    "parentId": "451100"
  },
  {
    "id": "451201",
    "areaId": "451201",
    "code": "451201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451202",
    "areaId": "451202",
    "code": "451202",
    "name": "金城江区",
    "fullname": "金城江区",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451203",
    "areaId": "451203",
    "code": "451203",
    "name": "宜州区",
    "fullname": "宜州区",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451221",
    "areaId": "451221",
    "code": "451221",
    "name": "南丹县",
    "fullname": "南丹县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451222",
    "areaId": "451222",
    "code": "451222",
    "name": "天峨县",
    "fullname": "天峨县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451223",
    "areaId": "451223",
    "code": "451223",
    "name": "凤山县",
    "fullname": "凤山县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451224",
    "areaId": "451224",
    "code": "451224",
    "name": "东兰县",
    "fullname": "东兰县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451225",
    "areaId": "451225",
    "code": "451225",
    "name": "罗城仫佬族自治县",
    "fullname": "罗城仫佬族自治县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451226",
    "areaId": "451226",
    "code": "451226",
    "name": "环江毛南族自治县",
    "fullname": "环江毛南族自治县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451227",
    "areaId": "451227",
    "code": "451227",
    "name": "巴马瑶族自治县",
    "fullname": "巴马瑶族自治县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451228",
    "areaId": "451228",
    "code": "451228",
    "name": "都安瑶族自治县",
    "fullname": "都安瑶族自治县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451229",
    "areaId": "451229",
    "code": "451229",
    "name": "大化瑶族自治县",
    "fullname": "大化瑶族自治县",
    "level": 3,
    "parentId": "451200"
  },
  {
    "id": "451301",
    "areaId": "451301",
    "code": "451301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "451300"
  },
  {
    "id": "451302",
    "areaId": "451302",
    "code": "451302",
    "name": "兴宾区",
    "fullname": "兴宾区",
    "level": 3,
    "parentId": "451300"
  },
  {
    "id": "451321",
    "areaId": "451321",
    "code": "451321",
    "name": "忻城县",
    "fullname": "忻城县",
    "level": 3,
    "parentId": "451300"
  },
  {
    "id": "451322",
    "areaId": "451322",
    "code": "451322",
    "name": "象州县",
    "fullname": "象州县",
    "level": 3,
    "parentId": "451300"
  },
  {
    "id": "451323",
    "areaId": "451323",
    "code": "451323",
    "name": "武宣县",
    "fullname": "武宣县",
    "level": 3,
    "parentId": "451300"
  },
  {
    "id": "451324",
    "areaId": "451324",
    "code": "451324",
    "name": "金秀瑶族自治县",
    "fullname": "金秀瑶族自治县",
    "level": 3,
    "parentId": "451300"
  },
  {
    "id": "451381",
    "areaId": "451381",
    "code": "451381",
    "name": "合山市",
    "fullname": "合山市",
    "level": 3,
    "parentId": "451300"
  },
  {
    "id": "451401",
    "areaId": "451401",
    "code": "451401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "451402",
    "areaId": "451402",
    "code": "451402",
    "name": "江州区",
    "fullname": "江州区",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "451421",
    "areaId": "451421",
    "code": "451421",
    "name": "扶绥县",
    "fullname": "扶绥县",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "451422",
    "areaId": "451422",
    "code": "451422",
    "name": "宁明县",
    "fullname": "宁明县",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "451423",
    "areaId": "451423",
    "code": "451423",
    "name": "龙州县",
    "fullname": "龙州县",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "451424",
    "areaId": "451424",
    "code": "451424",
    "name": "大新县",
    "fullname": "大新县",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "451425",
    "areaId": "451425",
    "code": "451425",
    "name": "天等县",
    "fullname": "天等县",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "451481",
    "areaId": "451481",
    "code": "451481",
    "name": "凭祥市",
    "fullname": "凭祥市",
    "level": 3,
    "parentId": "451400"
  },
  {
    "id": "460101",
    "areaId": "460101",
    "code": "460101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "460100"
  },
  {
    "id": "460105",
    "areaId": "460105",
    "code": "460105",
    "name": "秀英区",
    "fullname": "秀英区",
    "level": 3,
    "parentId": "460100"
  },
  {
    "id": "460106",
    "areaId": "460106",
    "code": "460106",
    "name": "龙华区",
    "fullname": "龙华区",
    "level": 3,
    "parentId": "460100"
  },
  {
    "id": "460107",
    "areaId": "460107",
    "code": "460107",
    "name": "琼山区",
    "fullname": "琼山区",
    "level": 3,
    "parentId": "460100"
  },
  {
    "id": "460108",
    "areaId": "460108",
    "code": "460108",
    "name": "美兰区",
    "fullname": "美兰区",
    "level": 3,
    "parentId": "460100"
  },
  {
    "id": "460201",
    "areaId": "460201",
    "code": "460201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "460200"
  },
  {
    "id": "460202",
    "areaId": "460202",
    "code": "460202",
    "name": "海棠区",
    "fullname": "海棠区",
    "level": 3,
    "parentId": "460200"
  },
  {
    "id": "460203",
    "areaId": "460203",
    "code": "460203",
    "name": "吉阳区",
    "fullname": "吉阳区",
    "level": 3,
    "parentId": "460200"
  },
  {
    "id": "460204",
    "areaId": "460204",
    "code": "460204",
    "name": "天涯区",
    "fullname": "天涯区",
    "level": 3,
    "parentId": "460200"
  },
  {
    "id": "460205",
    "areaId": "460205",
    "code": "460205",
    "name": "崖州区",
    "fullname": "崖州区",
    "level": 3,
    "parentId": "460200"
  },
  {
    "id": "460321",
    "areaId": "460321",
    "code": "460321",
    "name": "西沙群岛",
    "fullname": "西沙群岛",
    "level": 3,
    "parentId": "460300"
  },
  {
    "id": "460322",
    "areaId": "460322",
    "code": "460322",
    "name": "南沙群岛",
    "fullname": "南沙群岛",
    "level": 3,
    "parentId": "460300"
  },
  {
    "id": "460323",
    "areaId": "460323",
    "code": "460323",
    "name": "中沙群岛的岛礁及其海域",
    "fullname": "中沙群岛的岛礁及其海域",
    "level": 3,
    "parentId": "460300"
  },
  {
    "id": "460400100",
    "areaId": "460400100",
    "code": "460400100",
    "name": "那大镇",
    "fullname": "那大镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400101",
    "areaId": "460400101",
    "code": "460400101",
    "name": "和庆镇",
    "fullname": "和庆镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400102",
    "areaId": "460400102",
    "code": "460400102",
    "name": "南丰镇",
    "fullname": "南丰镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400103",
    "areaId": "460400103",
    "code": "460400103",
    "name": "大成镇",
    "fullname": "大成镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400104",
    "areaId": "460400104",
    "code": "460400104",
    "name": "雅星镇",
    "fullname": "雅星镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400105",
    "areaId": "460400105",
    "code": "460400105",
    "name": "兰洋镇",
    "fullname": "兰洋镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400106",
    "areaId": "460400106",
    "code": "460400106",
    "name": "光村镇",
    "fullname": "光村镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400107",
    "areaId": "460400107",
    "code": "460400107",
    "name": "木棠镇",
    "fullname": "木棠镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400108",
    "areaId": "460400108",
    "code": "460400108",
    "name": "海头镇",
    "fullname": "海头镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400109",
    "areaId": "460400109",
    "code": "460400109",
    "name": "峨蔓镇",
    "fullname": "峨蔓镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400111",
    "areaId": "460400111",
    "code": "460400111",
    "name": "王五镇",
    "fullname": "王五镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400112",
    "areaId": "460400112",
    "code": "460400112",
    "name": "白马井镇",
    "fullname": "白马井镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400113",
    "areaId": "460400113",
    "code": "460400113",
    "name": "中和镇",
    "fullname": "中和镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400114",
    "areaId": "460400114",
    "code": "460400114",
    "name": "排浦镇",
    "fullname": "排浦镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400115",
    "areaId": "460400115",
    "code": "460400115",
    "name": "东成镇",
    "fullname": "东成镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400116",
    "areaId": "460400116",
    "code": "460400116",
    "name": "新州镇",
    "fullname": "新州镇",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400499",
    "areaId": "460400499",
    "code": "460400499",
    "name": "洋浦经济开发区",
    "fullname": "洋浦经济开发区",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "460400500",
    "areaId": "460400500",
    "code": "460400500",
    "name": "华南热作学院",
    "fullname": "华南热作学院",
    "level": 3,
    "parentId": "460400"
  },
  {
    "id": "469001",
    "areaId": "469001",
    "code": "469001",
    "name": "五指山市",
    "fullname": "五指山市",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469002",
    "areaId": "469002",
    "code": "469002",
    "name": "琼海市",
    "fullname": "琼海市",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469005",
    "areaId": "469005",
    "code": "469005",
    "name": "文昌市",
    "fullname": "文昌市",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469006",
    "areaId": "469006",
    "code": "469006",
    "name": "万宁市",
    "fullname": "万宁市",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469007",
    "areaId": "469007",
    "code": "469007",
    "name": "东方市",
    "fullname": "东方市",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469021",
    "areaId": "469021",
    "code": "469021",
    "name": "定安县",
    "fullname": "定安县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469022",
    "areaId": "469022",
    "code": "469022",
    "name": "屯昌县",
    "fullname": "屯昌县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469023",
    "areaId": "469023",
    "code": "469023",
    "name": "澄迈县",
    "fullname": "澄迈县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469024",
    "areaId": "469024",
    "code": "469024",
    "name": "临高县",
    "fullname": "临高县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469025",
    "areaId": "469025",
    "code": "469025",
    "name": "白沙黎族自治县",
    "fullname": "白沙黎族自治县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469026",
    "areaId": "469026",
    "code": "469026",
    "name": "昌江黎族自治县",
    "fullname": "昌江黎族自治县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469027",
    "areaId": "469027",
    "code": "469027",
    "name": "乐东黎族自治县",
    "fullname": "乐东黎族自治县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469028",
    "areaId": "469028",
    "code": "469028",
    "name": "陵水黎族自治县",
    "fullname": "陵水黎族自治县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469029",
    "areaId": "469029",
    "code": "469029",
    "name": "保亭黎族苗族自治县",
    "fullname": "保亭黎族苗族自治县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "469030",
    "areaId": "469030",
    "code": "469030",
    "name": "琼中黎族苗族自治县",
    "fullname": "琼中黎族苗族自治县",
    "level": 3,
    "parentId": "469000"
  },
  {
    "id": "500101",
    "areaId": "500101",
    "code": "500101",
    "name": "万州区",
    "fullname": "万州区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500102",
    "areaId": "500102",
    "code": "500102",
    "name": "涪陵区",
    "fullname": "涪陵区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500103",
    "areaId": "500103",
    "code": "500103",
    "name": "渝中区",
    "fullname": "渝中区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500104",
    "areaId": "500104",
    "code": "500104",
    "name": "大渡口区",
    "fullname": "大渡口区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500105",
    "areaId": "500105",
    "code": "500105",
    "name": "江北区",
    "fullname": "江北区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500106",
    "areaId": "500106",
    "code": "500106",
    "name": "沙坪坝区",
    "fullname": "沙坪坝区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500107",
    "areaId": "500107",
    "code": "500107",
    "name": "九龙坡区",
    "fullname": "九龙坡区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500108",
    "areaId": "500108",
    "code": "500108",
    "name": "南岸区",
    "fullname": "南岸区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500109",
    "areaId": "500109",
    "code": "500109",
    "name": "北碚区",
    "fullname": "北碚区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500110",
    "areaId": "500110",
    "code": "500110",
    "name": "綦江区",
    "fullname": "綦江区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500111",
    "areaId": "500111",
    "code": "500111",
    "name": "大足区",
    "fullname": "大足区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500112",
    "areaId": "500112",
    "code": "500112",
    "name": "渝北区",
    "fullname": "渝北区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500113",
    "areaId": "500113",
    "code": "500113",
    "name": "巴南区",
    "fullname": "巴南区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500114",
    "areaId": "500114",
    "code": "500114",
    "name": "黔江区",
    "fullname": "黔江区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500115",
    "areaId": "500115",
    "code": "500115",
    "name": "长寿区",
    "fullname": "长寿区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500116",
    "areaId": "500116",
    "code": "500116",
    "name": "江津区",
    "fullname": "江津区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500117",
    "areaId": "500117",
    "code": "500117",
    "name": "合川区",
    "fullname": "合川区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500118",
    "areaId": "500118",
    "code": "500118",
    "name": "永川区",
    "fullname": "永川区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500119",
    "areaId": "500119",
    "code": "500119",
    "name": "南川区",
    "fullname": "南川区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500120",
    "areaId": "500120",
    "code": "500120",
    "name": "璧山区",
    "fullname": "璧山区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500151",
    "areaId": "500151",
    "code": "500151",
    "name": "铜梁区",
    "fullname": "铜梁区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500152",
    "areaId": "500152",
    "code": "500152",
    "name": "潼南区",
    "fullname": "潼南区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500153",
    "areaId": "500153",
    "code": "500153",
    "name": "荣昌区",
    "fullname": "荣昌区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500154",
    "areaId": "500154",
    "code": "500154",
    "name": "开州区",
    "fullname": "开州区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500155",
    "areaId": "500155",
    "code": "500155",
    "name": "梁平区",
    "fullname": "梁平区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500156",
    "areaId": "500156",
    "code": "500156",
    "name": "武隆区",
    "fullname": "武隆区",
    "level": 3,
    "parentId": "500100"
  },
  {
    "id": "500229",
    "areaId": "500229",
    "code": "500229",
    "name": "城口县",
    "fullname": "城口县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500230",
    "areaId": "500230",
    "code": "500230",
    "name": "丰都县",
    "fullname": "丰都县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500231",
    "areaId": "500231",
    "code": "500231",
    "name": "垫江县",
    "fullname": "垫江县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500233",
    "areaId": "500233",
    "code": "500233",
    "name": "忠县",
    "fullname": "忠县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500235",
    "areaId": "500235",
    "code": "500235",
    "name": "云阳县",
    "fullname": "云阳县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500236",
    "areaId": "500236",
    "code": "500236",
    "name": "奉节县",
    "fullname": "奉节县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500237",
    "areaId": "500237",
    "code": "500237",
    "name": "巫山县",
    "fullname": "巫山县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500238",
    "areaId": "500238",
    "code": "500238",
    "name": "巫溪县",
    "fullname": "巫溪县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500240",
    "areaId": "500240",
    "code": "500240",
    "name": "石柱土家族自治县",
    "fullname": "石柱土家族自治县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500241",
    "areaId": "500241",
    "code": "500241",
    "name": "秀山土家族苗族自治县",
    "fullname": "秀山土家族苗族自治县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500242",
    "areaId": "500242",
    "code": "500242",
    "name": "酉阳土家族苗族自治县",
    "fullname": "酉阳土家族苗族自治县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "500243",
    "areaId": "500243",
    "code": "500243",
    "name": "彭水苗族土家族自治县",
    "fullname": "彭水苗族土家族自治县",
    "level": 3,
    "parentId": "500200"
  },
  {
    "id": "510101",
    "areaId": "510101",
    "code": "510101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510104",
    "areaId": "510104",
    "code": "510104",
    "name": "锦江区",
    "fullname": "锦江区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510105",
    "areaId": "510105",
    "code": "510105",
    "name": "青羊区",
    "fullname": "青羊区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510106",
    "areaId": "510106",
    "code": "510106",
    "name": "金牛区",
    "fullname": "金牛区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510107",
    "areaId": "510107",
    "code": "510107",
    "name": "武侯区",
    "fullname": "武侯区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510108",
    "areaId": "510108",
    "code": "510108",
    "name": "成华区",
    "fullname": "成华区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510112",
    "areaId": "510112",
    "code": "510112",
    "name": "龙泉驿区",
    "fullname": "龙泉驿区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510113",
    "areaId": "510113",
    "code": "510113",
    "name": "青白江区",
    "fullname": "青白江区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510114",
    "areaId": "510114",
    "code": "510114",
    "name": "新都区",
    "fullname": "新都区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510115",
    "areaId": "510115",
    "code": "510115",
    "name": "温江区",
    "fullname": "温江区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510116",
    "areaId": "510116",
    "code": "510116",
    "name": "双流区",
    "fullname": "双流区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510117",
    "areaId": "510117",
    "code": "510117",
    "name": "郫都区",
    "fullname": "郫都区",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510121",
    "areaId": "510121",
    "code": "510121",
    "name": "金堂县",
    "fullname": "金堂县",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510129",
    "areaId": "510129",
    "code": "510129",
    "name": "大邑县",
    "fullname": "大邑县",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510131",
    "areaId": "510131",
    "code": "510131",
    "name": "蒲江县",
    "fullname": "蒲江县",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510132",
    "areaId": "510132",
    "code": "510132",
    "name": "新津县",
    "fullname": "新津县",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510181",
    "areaId": "510181",
    "code": "510181",
    "name": "都江堰市",
    "fullname": "都江堰市",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510182",
    "areaId": "510182",
    "code": "510182",
    "name": "彭州市",
    "fullname": "彭州市",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510183",
    "areaId": "510183",
    "code": "510183",
    "name": "邛崃市",
    "fullname": "邛崃市",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510184",
    "areaId": "510184",
    "code": "510184",
    "name": "崇州市",
    "fullname": "崇州市",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510185",
    "areaId": "510185",
    "code": "510185",
    "name": "简阳市",
    "fullname": "简阳市",
    "level": 3,
    "parentId": "510100"
  },
  {
    "id": "510301",
    "areaId": "510301",
    "code": "510301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510300"
  },
  {
    "id": "510302",
    "areaId": "510302",
    "code": "510302",
    "name": "自流井区",
    "fullname": "自流井区",
    "level": 3,
    "parentId": "510300"
  },
  {
    "id": "510303",
    "areaId": "510303",
    "code": "510303",
    "name": "贡井区",
    "fullname": "贡井区",
    "level": 3,
    "parentId": "510300"
  },
  {
    "id": "510304",
    "areaId": "510304",
    "code": "510304",
    "name": "大安区",
    "fullname": "大安区",
    "level": 3,
    "parentId": "510300"
  },
  {
    "id": "510311",
    "areaId": "510311",
    "code": "510311",
    "name": "沿滩区",
    "fullname": "沿滩区",
    "level": 3,
    "parentId": "510300"
  },
  {
    "id": "510321",
    "areaId": "510321",
    "code": "510321",
    "name": "荣县",
    "fullname": "荣县",
    "level": 3,
    "parentId": "510300"
  },
  {
    "id": "510322",
    "areaId": "510322",
    "code": "510322",
    "name": "富顺县",
    "fullname": "富顺县",
    "level": 3,
    "parentId": "510300"
  },
  {
    "id": "510401",
    "areaId": "510401",
    "code": "510401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510400"
  },
  {
    "id": "510402",
    "areaId": "510402",
    "code": "510402",
    "name": "东区",
    "fullname": "东区",
    "level": 3,
    "parentId": "510400"
  },
  {
    "id": "510403",
    "areaId": "510403",
    "code": "510403",
    "name": "西区",
    "fullname": "西区",
    "level": 3,
    "parentId": "510400"
  },
  {
    "id": "510411",
    "areaId": "510411",
    "code": "510411",
    "name": "仁和区",
    "fullname": "仁和区",
    "level": 3,
    "parentId": "510400"
  },
  {
    "id": "510421",
    "areaId": "510421",
    "code": "510421",
    "name": "米易县",
    "fullname": "米易县",
    "level": 3,
    "parentId": "510400"
  },
  {
    "id": "510422",
    "areaId": "510422",
    "code": "510422",
    "name": "盐边县",
    "fullname": "盐边县",
    "level": 3,
    "parentId": "510400"
  },
  {
    "id": "510501",
    "areaId": "510501",
    "code": "510501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510502",
    "areaId": "510502",
    "code": "510502",
    "name": "江阳区",
    "fullname": "江阳区",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510503",
    "areaId": "510503",
    "code": "510503",
    "name": "纳溪区",
    "fullname": "纳溪区",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510504",
    "areaId": "510504",
    "code": "510504",
    "name": "龙马潭区",
    "fullname": "龙马潭区",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510521",
    "areaId": "510521",
    "code": "510521",
    "name": "泸县",
    "fullname": "泸县",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510522",
    "areaId": "510522",
    "code": "510522",
    "name": "合江县",
    "fullname": "合江县",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510524",
    "areaId": "510524",
    "code": "510524",
    "name": "叙永县",
    "fullname": "叙永县",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510525",
    "areaId": "510525",
    "code": "510525",
    "name": "古蔺县",
    "fullname": "古蔺县",
    "level": 3,
    "parentId": "510500"
  },
  {
    "id": "510601",
    "areaId": "510601",
    "code": "510601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510600"
  },
  {
    "id": "510603",
    "areaId": "510603",
    "code": "510603",
    "name": "旌阳区",
    "fullname": "旌阳区",
    "level": 3,
    "parentId": "510600"
  },
  {
    "id": "510604",
    "areaId": "510604",
    "code": "510604",
    "name": "罗江区",
    "fullname": "罗江区",
    "level": 3,
    "parentId": "510600"
  },
  {
    "id": "510623",
    "areaId": "510623",
    "code": "510623",
    "name": "中江县",
    "fullname": "中江县",
    "level": 3,
    "parentId": "510600"
  },
  {
    "id": "510681",
    "areaId": "510681",
    "code": "510681",
    "name": "广汉市",
    "fullname": "广汉市",
    "level": 3,
    "parentId": "510600"
  },
  {
    "id": "510682",
    "areaId": "510682",
    "code": "510682",
    "name": "什邡市",
    "fullname": "什邡市",
    "level": 3,
    "parentId": "510600"
  },
  {
    "id": "510683",
    "areaId": "510683",
    "code": "510683",
    "name": "绵竹市",
    "fullname": "绵竹市",
    "level": 3,
    "parentId": "510600"
  },
  {
    "id": "510701",
    "areaId": "510701",
    "code": "510701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510703",
    "areaId": "510703",
    "code": "510703",
    "name": "涪城区",
    "fullname": "涪城区",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510704",
    "areaId": "510704",
    "code": "510704",
    "name": "游仙区",
    "fullname": "游仙区",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510705",
    "areaId": "510705",
    "code": "510705",
    "name": "安州区",
    "fullname": "安州区",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510722",
    "areaId": "510722",
    "code": "510722",
    "name": "三台县",
    "fullname": "三台县",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510723",
    "areaId": "510723",
    "code": "510723",
    "name": "盐亭县",
    "fullname": "盐亭县",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510725",
    "areaId": "510725",
    "code": "510725",
    "name": "梓潼县",
    "fullname": "梓潼县",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510726",
    "areaId": "510726",
    "code": "510726",
    "name": "北川羌族自治县",
    "fullname": "北川羌族自治县",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510727",
    "areaId": "510727",
    "code": "510727",
    "name": "平武县",
    "fullname": "平武县",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510781",
    "areaId": "510781",
    "code": "510781",
    "name": "江油市",
    "fullname": "江油市",
    "level": 3,
    "parentId": "510700"
  },
  {
    "id": "510801",
    "areaId": "510801",
    "code": "510801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510802",
    "areaId": "510802",
    "code": "510802",
    "name": "利州区",
    "fullname": "利州区",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510811",
    "areaId": "510811",
    "code": "510811",
    "name": "昭化区",
    "fullname": "昭化区",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510812",
    "areaId": "510812",
    "code": "510812",
    "name": "朝天区",
    "fullname": "朝天区",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510821",
    "areaId": "510821",
    "code": "510821",
    "name": "旺苍县",
    "fullname": "旺苍县",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510822",
    "areaId": "510822",
    "code": "510822",
    "name": "青川县",
    "fullname": "青川县",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510823",
    "areaId": "510823",
    "code": "510823",
    "name": "剑阁县",
    "fullname": "剑阁县",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510824",
    "areaId": "510824",
    "code": "510824",
    "name": "苍溪县",
    "fullname": "苍溪县",
    "level": 3,
    "parentId": "510800"
  },
  {
    "id": "510901",
    "areaId": "510901",
    "code": "510901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "510900"
  },
  {
    "id": "510903",
    "areaId": "510903",
    "code": "510903",
    "name": "船山区",
    "fullname": "船山区",
    "level": 3,
    "parentId": "510900"
  },
  {
    "id": "510904",
    "areaId": "510904",
    "code": "510904",
    "name": "安居区",
    "fullname": "安居区",
    "level": 3,
    "parentId": "510900"
  },
  {
    "id": "510921",
    "areaId": "510921",
    "code": "510921",
    "name": "蓬溪县",
    "fullname": "蓬溪县",
    "level": 3,
    "parentId": "510900"
  },
  {
    "id": "510923",
    "areaId": "510923",
    "code": "510923",
    "name": "大英县",
    "fullname": "大英县",
    "level": 3,
    "parentId": "510900"
  },
  {
    "id": "510981",
    "areaId": "510981",
    "code": "510981",
    "name": "射洪市",
    "fullname": "射洪市",
    "level": 3,
    "parentId": "510900"
  },
  {
    "id": "511001",
    "areaId": "511001",
    "code": "511001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511000"
  },
  {
    "id": "511002",
    "areaId": "511002",
    "code": "511002",
    "name": "市中区",
    "fullname": "市中区",
    "level": 3,
    "parentId": "511000"
  },
  {
    "id": "511011",
    "areaId": "511011",
    "code": "511011",
    "name": "东兴区",
    "fullname": "东兴区",
    "level": 3,
    "parentId": "511000"
  },
  {
    "id": "511024",
    "areaId": "511024",
    "code": "511024",
    "name": "威远县",
    "fullname": "威远县",
    "level": 3,
    "parentId": "511000"
  },
  {
    "id": "511025",
    "areaId": "511025",
    "code": "511025",
    "name": "资中县",
    "fullname": "资中县",
    "level": 3,
    "parentId": "511000"
  },
  {
    "id": "511071",
    "areaId": "511071",
    "code": "511071",
    "name": "内江经济开发区",
    "fullname": "内江经济开发区",
    "level": 3,
    "parentId": "511000"
  },
  {
    "id": "511083",
    "areaId": "511083",
    "code": "511083",
    "name": "隆昌市",
    "fullname": "隆昌市",
    "level": 3,
    "parentId": "511000"
  },
  {
    "id": "511101",
    "areaId": "511101",
    "code": "511101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511102",
    "areaId": "511102",
    "code": "511102",
    "name": "市中区",
    "fullname": "市中区",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511111",
    "areaId": "511111",
    "code": "511111",
    "name": "沙湾区",
    "fullname": "沙湾区",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511112",
    "areaId": "511112",
    "code": "511112",
    "name": "五通桥区",
    "fullname": "五通桥区",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511113",
    "areaId": "511113",
    "code": "511113",
    "name": "金口河区",
    "fullname": "金口河区",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511123",
    "areaId": "511123",
    "code": "511123",
    "name": "犍为县",
    "fullname": "犍为县",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511124",
    "areaId": "511124",
    "code": "511124",
    "name": "井研县",
    "fullname": "井研县",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511126",
    "areaId": "511126",
    "code": "511126",
    "name": "夹江县",
    "fullname": "夹江县",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511129",
    "areaId": "511129",
    "code": "511129",
    "name": "沐川县",
    "fullname": "沐川县",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511132",
    "areaId": "511132",
    "code": "511132",
    "name": "峨边彝族自治县",
    "fullname": "峨边彝族自治县",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511133",
    "areaId": "511133",
    "code": "511133",
    "name": "马边彝族自治县",
    "fullname": "马边彝族自治县",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511181",
    "areaId": "511181",
    "code": "511181",
    "name": "峨眉山市",
    "fullname": "峨眉山市",
    "level": 3,
    "parentId": "511100"
  },
  {
    "id": "511301",
    "areaId": "511301",
    "code": "511301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511302",
    "areaId": "511302",
    "code": "511302",
    "name": "顺庆区",
    "fullname": "顺庆区",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511303",
    "areaId": "511303",
    "code": "511303",
    "name": "高坪区",
    "fullname": "高坪区",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511304",
    "areaId": "511304",
    "code": "511304",
    "name": "嘉陵区",
    "fullname": "嘉陵区",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511321",
    "areaId": "511321",
    "code": "511321",
    "name": "南部县",
    "fullname": "南部县",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511322",
    "areaId": "511322",
    "code": "511322",
    "name": "营山县",
    "fullname": "营山县",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511323",
    "areaId": "511323",
    "code": "511323",
    "name": "蓬安县",
    "fullname": "蓬安县",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511324",
    "areaId": "511324",
    "code": "511324",
    "name": "仪陇县",
    "fullname": "仪陇县",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511325",
    "areaId": "511325",
    "code": "511325",
    "name": "西充县",
    "fullname": "西充县",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511381",
    "areaId": "511381",
    "code": "511381",
    "name": "阆中市",
    "fullname": "阆中市",
    "level": 3,
    "parentId": "511300"
  },
  {
    "id": "511401",
    "areaId": "511401",
    "code": "511401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511400"
  },
  {
    "id": "511402",
    "areaId": "511402",
    "code": "511402",
    "name": "东坡区",
    "fullname": "东坡区",
    "level": 3,
    "parentId": "511400"
  },
  {
    "id": "511403",
    "areaId": "511403",
    "code": "511403",
    "name": "彭山区",
    "fullname": "彭山区",
    "level": 3,
    "parentId": "511400"
  },
  {
    "id": "511421",
    "areaId": "511421",
    "code": "511421",
    "name": "仁寿县",
    "fullname": "仁寿县",
    "level": 3,
    "parentId": "511400"
  },
  {
    "id": "511423",
    "areaId": "511423",
    "code": "511423",
    "name": "洪雅县",
    "fullname": "洪雅县",
    "level": 3,
    "parentId": "511400"
  },
  {
    "id": "511424",
    "areaId": "511424",
    "code": "511424",
    "name": "丹棱县",
    "fullname": "丹棱县",
    "level": 3,
    "parentId": "511400"
  },
  {
    "id": "511425",
    "areaId": "511425",
    "code": "511425",
    "name": "青神县",
    "fullname": "青神县",
    "level": 3,
    "parentId": "511400"
  },
  {
    "id": "511501",
    "areaId": "511501",
    "code": "511501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511502",
    "areaId": "511502",
    "code": "511502",
    "name": "翠屏区",
    "fullname": "翠屏区",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511503",
    "areaId": "511503",
    "code": "511503",
    "name": "南溪区",
    "fullname": "南溪区",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511504",
    "areaId": "511504",
    "code": "511504",
    "name": "叙州区",
    "fullname": "叙州区",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511523",
    "areaId": "511523",
    "code": "511523",
    "name": "江安县",
    "fullname": "江安县",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511524",
    "areaId": "511524",
    "code": "511524",
    "name": "长宁县",
    "fullname": "长宁县",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511525",
    "areaId": "511525",
    "code": "511525",
    "name": "高县",
    "fullname": "高县",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511526",
    "areaId": "511526",
    "code": "511526",
    "name": "珙县",
    "fullname": "珙县",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511527",
    "areaId": "511527",
    "code": "511527",
    "name": "筠连县",
    "fullname": "筠连县",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511528",
    "areaId": "511528",
    "code": "511528",
    "name": "兴文县",
    "fullname": "兴文县",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511529",
    "areaId": "511529",
    "code": "511529",
    "name": "屏山县",
    "fullname": "屏山县",
    "level": 3,
    "parentId": "511500"
  },
  {
    "id": "511601",
    "areaId": "511601",
    "code": "511601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511600"
  },
  {
    "id": "511602",
    "areaId": "511602",
    "code": "511602",
    "name": "广安区",
    "fullname": "广安区",
    "level": 3,
    "parentId": "511600"
  },
  {
    "id": "511603",
    "areaId": "511603",
    "code": "511603",
    "name": "前锋区",
    "fullname": "前锋区",
    "level": 3,
    "parentId": "511600"
  },
  {
    "id": "511621",
    "areaId": "511621",
    "code": "511621",
    "name": "岳池县",
    "fullname": "岳池县",
    "level": 3,
    "parentId": "511600"
  },
  {
    "id": "511622",
    "areaId": "511622",
    "code": "511622",
    "name": "武胜县",
    "fullname": "武胜县",
    "level": 3,
    "parentId": "511600"
  },
  {
    "id": "511623",
    "areaId": "511623",
    "code": "511623",
    "name": "邻水县",
    "fullname": "邻水县",
    "level": 3,
    "parentId": "511600"
  },
  {
    "id": "511681",
    "areaId": "511681",
    "code": "511681",
    "name": "华蓥市",
    "fullname": "华蓥市",
    "level": 3,
    "parentId": "511600"
  },
  {
    "id": "511701",
    "areaId": "511701",
    "code": "511701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511702",
    "areaId": "511702",
    "code": "511702",
    "name": "通川区",
    "fullname": "通川区",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511703",
    "areaId": "511703",
    "code": "511703",
    "name": "达川区",
    "fullname": "达川区",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511722",
    "areaId": "511722",
    "code": "511722",
    "name": "宣汉县",
    "fullname": "宣汉县",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511723",
    "areaId": "511723",
    "code": "511723",
    "name": "开江县",
    "fullname": "开江县",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511724",
    "areaId": "511724",
    "code": "511724",
    "name": "大竹县",
    "fullname": "大竹县",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511725",
    "areaId": "511725",
    "code": "511725",
    "name": "渠县",
    "fullname": "渠县",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511771",
    "areaId": "511771",
    "code": "511771",
    "name": "达州经济开发区",
    "fullname": "达州经济开发区",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511781",
    "areaId": "511781",
    "code": "511781",
    "name": "万源市",
    "fullname": "万源市",
    "level": 3,
    "parentId": "511700"
  },
  {
    "id": "511801",
    "areaId": "511801",
    "code": "511801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511802",
    "areaId": "511802",
    "code": "511802",
    "name": "雨城区",
    "fullname": "雨城区",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511803",
    "areaId": "511803",
    "code": "511803",
    "name": "名山区",
    "fullname": "名山区",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511822",
    "areaId": "511822",
    "code": "511822",
    "name": "荥经县",
    "fullname": "荥经县",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511823",
    "areaId": "511823",
    "code": "511823",
    "name": "汉源县",
    "fullname": "汉源县",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511824",
    "areaId": "511824",
    "code": "511824",
    "name": "石棉县",
    "fullname": "石棉县",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511825",
    "areaId": "511825",
    "code": "511825",
    "name": "天全县",
    "fullname": "天全县",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511826",
    "areaId": "511826",
    "code": "511826",
    "name": "芦山县",
    "fullname": "芦山县",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511827",
    "areaId": "511827",
    "code": "511827",
    "name": "宝兴县",
    "fullname": "宝兴县",
    "level": 3,
    "parentId": "511800"
  },
  {
    "id": "511901",
    "areaId": "511901",
    "code": "511901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "511900"
  },
  {
    "id": "511902",
    "areaId": "511902",
    "code": "511902",
    "name": "巴州区",
    "fullname": "巴州区",
    "level": 3,
    "parentId": "511900"
  },
  {
    "id": "511903",
    "areaId": "511903",
    "code": "511903",
    "name": "恩阳区",
    "fullname": "恩阳区",
    "level": 3,
    "parentId": "511900"
  },
  {
    "id": "511921",
    "areaId": "511921",
    "code": "511921",
    "name": "通江县",
    "fullname": "通江县",
    "level": 3,
    "parentId": "511900"
  },
  {
    "id": "511922",
    "areaId": "511922",
    "code": "511922",
    "name": "南江县",
    "fullname": "南江县",
    "level": 3,
    "parentId": "511900"
  },
  {
    "id": "511923",
    "areaId": "511923",
    "code": "511923",
    "name": "平昌县",
    "fullname": "平昌县",
    "level": 3,
    "parentId": "511900"
  },
  {
    "id": "511971",
    "areaId": "511971",
    "code": "511971",
    "name": "巴中经济开发区",
    "fullname": "巴中经济开发区",
    "level": 3,
    "parentId": "511900"
  },
  {
    "id": "512001",
    "areaId": "512001",
    "code": "512001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "512000"
  },
  {
    "id": "512002",
    "areaId": "512002",
    "code": "512002",
    "name": "雁江区",
    "fullname": "雁江区",
    "level": 3,
    "parentId": "512000"
  },
  {
    "id": "512021",
    "areaId": "512021",
    "code": "512021",
    "name": "安岳县",
    "fullname": "安岳县",
    "level": 3,
    "parentId": "512000"
  },
  {
    "id": "512022",
    "areaId": "512022",
    "code": "512022",
    "name": "乐至县",
    "fullname": "乐至县",
    "level": 3,
    "parentId": "512000"
  },
  {
    "id": "513201",
    "areaId": "513201",
    "code": "513201",
    "name": "马尔康市",
    "fullname": "马尔康市",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513221",
    "areaId": "513221",
    "code": "513221",
    "name": "汶川县",
    "fullname": "汶川县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513222",
    "areaId": "513222",
    "code": "513222",
    "name": "理县",
    "fullname": "理县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513223",
    "areaId": "513223",
    "code": "513223",
    "name": "茂县",
    "fullname": "茂县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513224",
    "areaId": "513224",
    "code": "513224",
    "name": "松潘县",
    "fullname": "松潘县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513225",
    "areaId": "513225",
    "code": "513225",
    "name": "九寨沟县",
    "fullname": "九寨沟县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513226",
    "areaId": "513226",
    "code": "513226",
    "name": "金川县",
    "fullname": "金川县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513227",
    "areaId": "513227",
    "code": "513227",
    "name": "小金县",
    "fullname": "小金县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513228",
    "areaId": "513228",
    "code": "513228",
    "name": "黑水县",
    "fullname": "黑水县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513230",
    "areaId": "513230",
    "code": "513230",
    "name": "壤塘县",
    "fullname": "壤塘县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513231",
    "areaId": "513231",
    "code": "513231",
    "name": "阿坝县",
    "fullname": "阿坝县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513232",
    "areaId": "513232",
    "code": "513232",
    "name": "若尔盖县",
    "fullname": "若尔盖县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513233",
    "areaId": "513233",
    "code": "513233",
    "name": "红原县",
    "fullname": "红原县",
    "level": 3,
    "parentId": "513200"
  },
  {
    "id": "513301",
    "areaId": "513301",
    "code": "513301",
    "name": "康定市",
    "fullname": "康定市",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513322",
    "areaId": "513322",
    "code": "513322",
    "name": "泸定县",
    "fullname": "泸定县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513323",
    "areaId": "513323",
    "code": "513323",
    "name": "丹巴县",
    "fullname": "丹巴县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513324",
    "areaId": "513324",
    "code": "513324",
    "name": "九龙县",
    "fullname": "九龙县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513325",
    "areaId": "513325",
    "code": "513325",
    "name": "雅江县",
    "fullname": "雅江县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513326",
    "areaId": "513326",
    "code": "513326",
    "name": "道孚县",
    "fullname": "道孚县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513327",
    "areaId": "513327",
    "code": "513327",
    "name": "炉霍县",
    "fullname": "炉霍县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513328",
    "areaId": "513328",
    "code": "513328",
    "name": "甘孜县",
    "fullname": "甘孜县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513329",
    "areaId": "513329",
    "code": "513329",
    "name": "新龙县",
    "fullname": "新龙县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513330",
    "areaId": "513330",
    "code": "513330",
    "name": "德格县",
    "fullname": "德格县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513331",
    "areaId": "513331",
    "code": "513331",
    "name": "白玉县",
    "fullname": "白玉县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513332",
    "areaId": "513332",
    "code": "513332",
    "name": "石渠县",
    "fullname": "石渠县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513333",
    "areaId": "513333",
    "code": "513333",
    "name": "色达县",
    "fullname": "色达县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513334",
    "areaId": "513334",
    "code": "513334",
    "name": "理塘县",
    "fullname": "理塘县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513335",
    "areaId": "513335",
    "code": "513335",
    "name": "巴塘县",
    "fullname": "巴塘县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513336",
    "areaId": "513336",
    "code": "513336",
    "name": "乡城县",
    "fullname": "乡城县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513337",
    "areaId": "513337",
    "code": "513337",
    "name": "稻城县",
    "fullname": "稻城县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513338",
    "areaId": "513338",
    "code": "513338",
    "name": "得荣县",
    "fullname": "得荣县",
    "level": 3,
    "parentId": "513300"
  },
  {
    "id": "513401",
    "areaId": "513401",
    "code": "513401",
    "name": "西昌市",
    "fullname": "西昌市",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513422",
    "areaId": "513422",
    "code": "513422",
    "name": "木里藏族自治县",
    "fullname": "木里藏族自治县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513423",
    "areaId": "513423",
    "code": "513423",
    "name": "盐源县",
    "fullname": "盐源县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513424",
    "areaId": "513424",
    "code": "513424",
    "name": "德昌县",
    "fullname": "德昌县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513425",
    "areaId": "513425",
    "code": "513425",
    "name": "会理县",
    "fullname": "会理县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513426",
    "areaId": "513426",
    "code": "513426",
    "name": "会东县",
    "fullname": "会东县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513427",
    "areaId": "513427",
    "code": "513427",
    "name": "宁南县",
    "fullname": "宁南县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513428",
    "areaId": "513428",
    "code": "513428",
    "name": "普格县",
    "fullname": "普格县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513429",
    "areaId": "513429",
    "code": "513429",
    "name": "布拖县",
    "fullname": "布拖县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513430",
    "areaId": "513430",
    "code": "513430",
    "name": "金阳县",
    "fullname": "金阳县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513431",
    "areaId": "513431",
    "code": "513431",
    "name": "昭觉县",
    "fullname": "昭觉县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513432",
    "areaId": "513432",
    "code": "513432",
    "name": "喜德县",
    "fullname": "喜德县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513433",
    "areaId": "513433",
    "code": "513433",
    "name": "冕宁县",
    "fullname": "冕宁县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513434",
    "areaId": "513434",
    "code": "513434",
    "name": "越西县",
    "fullname": "越西县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513435",
    "areaId": "513435",
    "code": "513435",
    "name": "甘洛县",
    "fullname": "甘洛县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513436",
    "areaId": "513436",
    "code": "513436",
    "name": "美姑县",
    "fullname": "美姑县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "513437",
    "areaId": "513437",
    "code": "513437",
    "name": "雷波县",
    "fullname": "雷波县",
    "level": 3,
    "parentId": "513400"
  },
  {
    "id": "520101",
    "areaId": "520101",
    "code": "520101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520102",
    "areaId": "520102",
    "code": "520102",
    "name": "南明区",
    "fullname": "南明区",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520103",
    "areaId": "520103",
    "code": "520103",
    "name": "云岩区",
    "fullname": "云岩区",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520111",
    "areaId": "520111",
    "code": "520111",
    "name": "花溪区",
    "fullname": "花溪区",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520112",
    "areaId": "520112",
    "code": "520112",
    "name": "乌当区",
    "fullname": "乌当区",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520113",
    "areaId": "520113",
    "code": "520113",
    "name": "白云区",
    "fullname": "白云区",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520115",
    "areaId": "520115",
    "code": "520115",
    "name": "观山湖区",
    "fullname": "观山湖区",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520121",
    "areaId": "520121",
    "code": "520121",
    "name": "开阳县",
    "fullname": "开阳县",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520122",
    "areaId": "520122",
    "code": "520122",
    "name": "息烽县",
    "fullname": "息烽县",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520123",
    "areaId": "520123",
    "code": "520123",
    "name": "修文县",
    "fullname": "修文县",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520181",
    "areaId": "520181",
    "code": "520181",
    "name": "清镇市",
    "fullname": "清镇市",
    "level": 3,
    "parentId": "520100"
  },
  {
    "id": "520201",
    "areaId": "520201",
    "code": "520201",
    "name": "钟山区",
    "fullname": "钟山区",
    "level": 3,
    "parentId": "520200"
  },
  {
    "id": "520203",
    "areaId": "520203",
    "code": "520203",
    "name": "六枝特区",
    "fullname": "六枝特区",
    "level": 3,
    "parentId": "520200"
  },
  {
    "id": "520221",
    "areaId": "520221",
    "code": "520221",
    "name": "水城县",
    "fullname": "水城县",
    "level": 3,
    "parentId": "520200"
  },
  {
    "id": "520281",
    "areaId": "520281",
    "code": "520281",
    "name": "盘州市",
    "fullname": "盘州市",
    "level": 3,
    "parentId": "520200"
  },
  {
    "id": "520301",
    "areaId": "520301",
    "code": "520301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520302",
    "areaId": "520302",
    "code": "520302",
    "name": "红花岗区",
    "fullname": "红花岗区",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520303",
    "areaId": "520303",
    "code": "520303",
    "name": "汇川区",
    "fullname": "汇川区",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520304",
    "areaId": "520304",
    "code": "520304",
    "name": "播州区",
    "fullname": "播州区",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520322",
    "areaId": "520322",
    "code": "520322",
    "name": "桐梓县",
    "fullname": "桐梓县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520323",
    "areaId": "520323",
    "code": "520323",
    "name": "绥阳县",
    "fullname": "绥阳县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520324",
    "areaId": "520324",
    "code": "520324",
    "name": "正安县",
    "fullname": "正安县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520325",
    "areaId": "520325",
    "code": "520325",
    "name": "道真仡佬族苗族自治县",
    "fullname": "道真仡佬族苗族自治县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520326",
    "areaId": "520326",
    "code": "520326",
    "name": "务川仡佬族苗族自治县",
    "fullname": "务川仡佬族苗族自治县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520327",
    "areaId": "520327",
    "code": "520327",
    "name": "凤冈县",
    "fullname": "凤冈县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520328",
    "areaId": "520328",
    "code": "520328",
    "name": "湄潭县",
    "fullname": "湄潭县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520329",
    "areaId": "520329",
    "code": "520329",
    "name": "余庆县",
    "fullname": "余庆县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520330",
    "areaId": "520330",
    "code": "520330",
    "name": "习水县",
    "fullname": "习水县",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520381",
    "areaId": "520381",
    "code": "520381",
    "name": "赤水市",
    "fullname": "赤水市",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520382",
    "areaId": "520382",
    "code": "520382",
    "name": "仁怀市",
    "fullname": "仁怀市",
    "level": 3,
    "parentId": "520300"
  },
  {
    "id": "520401",
    "areaId": "520401",
    "code": "520401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "520400"
  },
  {
    "id": "520402",
    "areaId": "520402",
    "code": "520402",
    "name": "西秀区",
    "fullname": "西秀区",
    "level": 3,
    "parentId": "520400"
  },
  {
    "id": "520403",
    "areaId": "520403",
    "code": "520403",
    "name": "平坝区",
    "fullname": "平坝区",
    "level": 3,
    "parentId": "520400"
  },
  {
    "id": "520422",
    "areaId": "520422",
    "code": "520422",
    "name": "普定县",
    "fullname": "普定县",
    "level": 3,
    "parentId": "520400"
  },
  {
    "id": "520423",
    "areaId": "520423",
    "code": "520423",
    "name": "镇宁布依族苗族自治县",
    "fullname": "镇宁布依族苗族自治县",
    "level": 3,
    "parentId": "520400"
  },
  {
    "id": "520424",
    "areaId": "520424",
    "code": "520424",
    "name": "关岭布依族苗族自治县",
    "fullname": "关岭布依族苗族自治县",
    "level": 3,
    "parentId": "520400"
  },
  {
    "id": "520425",
    "areaId": "520425",
    "code": "520425",
    "name": "紫云苗族布依族自治县",
    "fullname": "紫云苗族布依族自治县",
    "level": 3,
    "parentId": "520400"
  },
  {
    "id": "520501",
    "areaId": "520501",
    "code": "520501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520502",
    "areaId": "520502",
    "code": "520502",
    "name": "七星关区",
    "fullname": "七星关区",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520521",
    "areaId": "520521",
    "code": "520521",
    "name": "大方县",
    "fullname": "大方县",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520522",
    "areaId": "520522",
    "code": "520522",
    "name": "黔西县",
    "fullname": "黔西县",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520523",
    "areaId": "520523",
    "code": "520523",
    "name": "金沙县",
    "fullname": "金沙县",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520524",
    "areaId": "520524",
    "code": "520524",
    "name": "织金县",
    "fullname": "织金县",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520525",
    "areaId": "520525",
    "code": "520525",
    "name": "纳雍县",
    "fullname": "纳雍县",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520526",
    "areaId": "520526",
    "code": "520526",
    "name": "威宁彝族回族苗族自治县",
    "fullname": "威宁彝族回族苗族自治县",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520527",
    "areaId": "520527",
    "code": "520527",
    "name": "赫章县",
    "fullname": "赫章县",
    "level": 3,
    "parentId": "520500"
  },
  {
    "id": "520601",
    "areaId": "520601",
    "code": "520601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520602",
    "areaId": "520602",
    "code": "520602",
    "name": "碧江区",
    "fullname": "碧江区",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520603",
    "areaId": "520603",
    "code": "520603",
    "name": "万山区",
    "fullname": "万山区",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520621",
    "areaId": "520621",
    "code": "520621",
    "name": "江口县",
    "fullname": "江口县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520622",
    "areaId": "520622",
    "code": "520622",
    "name": "玉屏侗族自治县",
    "fullname": "玉屏侗族自治县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520623",
    "areaId": "520623",
    "code": "520623",
    "name": "石阡县",
    "fullname": "石阡县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520624",
    "areaId": "520624",
    "code": "520624",
    "name": "思南县",
    "fullname": "思南县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520625",
    "areaId": "520625",
    "code": "520625",
    "name": "印江土家族苗族自治县",
    "fullname": "印江土家族苗族自治县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520626",
    "areaId": "520626",
    "code": "520626",
    "name": "德江县",
    "fullname": "德江县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520627",
    "areaId": "520627",
    "code": "520627",
    "name": "沿河土家族自治县",
    "fullname": "沿河土家族自治县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "520628",
    "areaId": "520628",
    "code": "520628",
    "name": "松桃苗族自治县",
    "fullname": "松桃苗族自治县",
    "level": 3,
    "parentId": "520600"
  },
  {
    "id": "522301",
    "areaId": "522301",
    "code": "522301",
    "name": "兴义市",
    "fullname": "兴义市",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522302",
    "areaId": "522302",
    "code": "522302",
    "name": "兴仁市",
    "fullname": "兴仁市",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522323",
    "areaId": "522323",
    "code": "522323",
    "name": "普安县",
    "fullname": "普安县",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522324",
    "areaId": "522324",
    "code": "522324",
    "name": "晴隆县",
    "fullname": "晴隆县",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522325",
    "areaId": "522325",
    "code": "522325",
    "name": "贞丰县",
    "fullname": "贞丰县",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522326",
    "areaId": "522326",
    "code": "522326",
    "name": "望谟县",
    "fullname": "望谟县",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522327",
    "areaId": "522327",
    "code": "522327",
    "name": "册亨县",
    "fullname": "册亨县",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522328",
    "areaId": "522328",
    "code": "522328",
    "name": "安龙县",
    "fullname": "安龙县",
    "level": 3,
    "parentId": "522300"
  },
  {
    "id": "522601",
    "areaId": "522601",
    "code": "522601",
    "name": "凯里市",
    "fullname": "凯里市",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522622",
    "areaId": "522622",
    "code": "522622",
    "name": "黄平县",
    "fullname": "黄平县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522623",
    "areaId": "522623",
    "code": "522623",
    "name": "施秉县",
    "fullname": "施秉县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522624",
    "areaId": "522624",
    "code": "522624",
    "name": "三穗县",
    "fullname": "三穗县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522625",
    "areaId": "522625",
    "code": "522625",
    "name": "镇远县",
    "fullname": "镇远县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522626",
    "areaId": "522626",
    "code": "522626",
    "name": "岑巩县",
    "fullname": "岑巩县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522627",
    "areaId": "522627",
    "code": "522627",
    "name": "天柱县",
    "fullname": "天柱县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522628",
    "areaId": "522628",
    "code": "522628",
    "name": "锦屏县",
    "fullname": "锦屏县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522629",
    "areaId": "522629",
    "code": "522629",
    "name": "剑河县",
    "fullname": "剑河县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522630",
    "areaId": "522630",
    "code": "522630",
    "name": "台江县",
    "fullname": "台江县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522631",
    "areaId": "522631",
    "code": "522631",
    "name": "黎平县",
    "fullname": "黎平县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522632",
    "areaId": "522632",
    "code": "522632",
    "name": "榕江县",
    "fullname": "榕江县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522633",
    "areaId": "522633",
    "code": "522633",
    "name": "从江县",
    "fullname": "从江县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522634",
    "areaId": "522634",
    "code": "522634",
    "name": "雷山县",
    "fullname": "雷山县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522635",
    "areaId": "522635",
    "code": "522635",
    "name": "麻江县",
    "fullname": "麻江县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522636",
    "areaId": "522636",
    "code": "522636",
    "name": "丹寨县",
    "fullname": "丹寨县",
    "level": 3,
    "parentId": "522600"
  },
  {
    "id": "522701",
    "areaId": "522701",
    "code": "522701",
    "name": "都匀市",
    "fullname": "都匀市",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522702",
    "areaId": "522702",
    "code": "522702",
    "name": "福泉市",
    "fullname": "福泉市",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522722",
    "areaId": "522722",
    "code": "522722",
    "name": "荔波县",
    "fullname": "荔波县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522723",
    "areaId": "522723",
    "code": "522723",
    "name": "贵定县",
    "fullname": "贵定县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522725",
    "areaId": "522725",
    "code": "522725",
    "name": "瓮安县",
    "fullname": "瓮安县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522726",
    "areaId": "522726",
    "code": "522726",
    "name": "独山县",
    "fullname": "独山县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522727",
    "areaId": "522727",
    "code": "522727",
    "name": "平塘县",
    "fullname": "平塘县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522728",
    "areaId": "522728",
    "code": "522728",
    "name": "罗甸县",
    "fullname": "罗甸县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522729",
    "areaId": "522729",
    "code": "522729",
    "name": "长顺县",
    "fullname": "长顺县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522730",
    "areaId": "522730",
    "code": "522730",
    "name": "龙里县",
    "fullname": "龙里县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522731",
    "areaId": "522731",
    "code": "522731",
    "name": "惠水县",
    "fullname": "惠水县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "522732",
    "areaId": "522732",
    "code": "522732",
    "name": "三都水族自治县",
    "fullname": "三都水族自治县",
    "level": 3,
    "parentId": "522700"
  },
  {
    "id": "530101",
    "areaId": "530101",
    "code": "530101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530102",
    "areaId": "530102",
    "code": "530102",
    "name": "五华区",
    "fullname": "五华区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530103",
    "areaId": "530103",
    "code": "530103",
    "name": "盘龙区",
    "fullname": "盘龙区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530111",
    "areaId": "530111",
    "code": "530111",
    "name": "官渡区",
    "fullname": "官渡区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530112",
    "areaId": "530112",
    "code": "530112",
    "name": "西山区",
    "fullname": "西山区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530113",
    "areaId": "530113",
    "code": "530113",
    "name": "东川区",
    "fullname": "东川区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530114",
    "areaId": "530114",
    "code": "530114",
    "name": "呈贡区",
    "fullname": "呈贡区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530115",
    "areaId": "530115",
    "code": "530115",
    "name": "晋宁区",
    "fullname": "晋宁区",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530124",
    "areaId": "530124",
    "code": "530124",
    "name": "富民县",
    "fullname": "富民县",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530125",
    "areaId": "530125",
    "code": "530125",
    "name": "宜良县",
    "fullname": "宜良县",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530126",
    "areaId": "530126",
    "code": "530126",
    "name": "石林彝族自治县",
    "fullname": "石林彝族自治县",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530127",
    "areaId": "530127",
    "code": "530127",
    "name": "嵩明县",
    "fullname": "嵩明县",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530128",
    "areaId": "530128",
    "code": "530128",
    "name": "禄劝彝族苗族自治县",
    "fullname": "禄劝彝族苗族自治县",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530129",
    "areaId": "530129",
    "code": "530129",
    "name": "寻甸回族彝族自治县",
    "fullname": "寻甸回族彝族自治县",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530181",
    "areaId": "530181",
    "code": "530181",
    "name": "安宁市",
    "fullname": "安宁市",
    "level": 3,
    "parentId": "530100"
  },
  {
    "id": "530301",
    "areaId": "530301",
    "code": "530301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530302",
    "areaId": "530302",
    "code": "530302",
    "name": "麒麟区",
    "fullname": "麒麟区",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530303",
    "areaId": "530303",
    "code": "530303",
    "name": "沾益区",
    "fullname": "沾益区",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530304",
    "areaId": "530304",
    "code": "530304",
    "name": "马龙区",
    "fullname": "马龙区",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530322",
    "areaId": "530322",
    "code": "530322",
    "name": "陆良县",
    "fullname": "陆良县",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530323",
    "areaId": "530323",
    "code": "530323",
    "name": "师宗县",
    "fullname": "师宗县",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530324",
    "areaId": "530324",
    "code": "530324",
    "name": "罗平县",
    "fullname": "罗平县",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530325",
    "areaId": "530325",
    "code": "530325",
    "name": "富源县",
    "fullname": "富源县",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530326",
    "areaId": "530326",
    "code": "530326",
    "name": "会泽县",
    "fullname": "会泽县",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530381",
    "areaId": "530381",
    "code": "530381",
    "name": "宣威市",
    "fullname": "宣威市",
    "level": 3,
    "parentId": "530300"
  },
  {
    "id": "530401",
    "areaId": "530401",
    "code": "530401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530402",
    "areaId": "530402",
    "code": "530402",
    "name": "红塔区",
    "fullname": "红塔区",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530403",
    "areaId": "530403",
    "code": "530403",
    "name": "江川区",
    "fullname": "江川区",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530422",
    "areaId": "530422",
    "code": "530422",
    "name": "澄江县",
    "fullname": "澄江县",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530423",
    "areaId": "530423",
    "code": "530423",
    "name": "通海县",
    "fullname": "通海县",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530424",
    "areaId": "530424",
    "code": "530424",
    "name": "华宁县",
    "fullname": "华宁县",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530425",
    "areaId": "530425",
    "code": "530425",
    "name": "易门县",
    "fullname": "易门县",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530426",
    "areaId": "530426",
    "code": "530426",
    "name": "峨山彝族自治县",
    "fullname": "峨山彝族自治县",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530427",
    "areaId": "530427",
    "code": "530427",
    "name": "新平彝族傣族自治县",
    "fullname": "新平彝族傣族自治县",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530428",
    "areaId": "530428",
    "code": "530428",
    "name": "元江哈尼族彝族傣族自治县",
    "fullname": "元江哈尼族彝族傣族自治县",
    "level": 3,
    "parentId": "530400"
  },
  {
    "id": "530501",
    "areaId": "530501",
    "code": "530501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530500"
  },
  {
    "id": "530502",
    "areaId": "530502",
    "code": "530502",
    "name": "隆阳区",
    "fullname": "隆阳区",
    "level": 3,
    "parentId": "530500"
  },
  {
    "id": "530521",
    "areaId": "530521",
    "code": "530521",
    "name": "施甸县",
    "fullname": "施甸县",
    "level": 3,
    "parentId": "530500"
  },
  {
    "id": "530523",
    "areaId": "530523",
    "code": "530523",
    "name": "龙陵县",
    "fullname": "龙陵县",
    "level": 3,
    "parentId": "530500"
  },
  {
    "id": "530524",
    "areaId": "530524",
    "code": "530524",
    "name": "昌宁县",
    "fullname": "昌宁县",
    "level": 3,
    "parentId": "530500"
  },
  {
    "id": "530581",
    "areaId": "530581",
    "code": "530581",
    "name": "腾冲市",
    "fullname": "腾冲市",
    "level": 3,
    "parentId": "530500"
  },
  {
    "id": "530601",
    "areaId": "530601",
    "code": "530601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530602",
    "areaId": "530602",
    "code": "530602",
    "name": "昭阳区",
    "fullname": "昭阳区",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530621",
    "areaId": "530621",
    "code": "530621",
    "name": "鲁甸县",
    "fullname": "鲁甸县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530622",
    "areaId": "530622",
    "code": "530622",
    "name": "巧家县",
    "fullname": "巧家县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530623",
    "areaId": "530623",
    "code": "530623",
    "name": "盐津县",
    "fullname": "盐津县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530624",
    "areaId": "530624",
    "code": "530624",
    "name": "大关县",
    "fullname": "大关县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530625",
    "areaId": "530625",
    "code": "530625",
    "name": "永善县",
    "fullname": "永善县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530626",
    "areaId": "530626",
    "code": "530626",
    "name": "绥江县",
    "fullname": "绥江县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530627",
    "areaId": "530627",
    "code": "530627",
    "name": "镇雄县",
    "fullname": "镇雄县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530628",
    "areaId": "530628",
    "code": "530628",
    "name": "彝良县",
    "fullname": "彝良县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530629",
    "areaId": "530629",
    "code": "530629",
    "name": "威信县",
    "fullname": "威信县",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530681",
    "areaId": "530681",
    "code": "530681",
    "name": "水富市",
    "fullname": "水富市",
    "level": 3,
    "parentId": "530600"
  },
  {
    "id": "530701",
    "areaId": "530701",
    "code": "530701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530700"
  },
  {
    "id": "530702",
    "areaId": "530702",
    "code": "530702",
    "name": "古城区",
    "fullname": "古城区",
    "level": 3,
    "parentId": "530700"
  },
  {
    "id": "530721",
    "areaId": "530721",
    "code": "530721",
    "name": "玉龙纳西族自治县",
    "fullname": "玉龙纳西族自治县",
    "level": 3,
    "parentId": "530700"
  },
  {
    "id": "530722",
    "areaId": "530722",
    "code": "530722",
    "name": "永胜县",
    "fullname": "永胜县",
    "level": 3,
    "parentId": "530700"
  },
  {
    "id": "530723",
    "areaId": "530723",
    "code": "530723",
    "name": "华坪县",
    "fullname": "华坪县",
    "level": 3,
    "parentId": "530700"
  },
  {
    "id": "530724",
    "areaId": "530724",
    "code": "530724",
    "name": "宁蒗彝族自治县",
    "fullname": "宁蒗彝族自治县",
    "level": 3,
    "parentId": "530700"
  },
  {
    "id": "530801",
    "areaId": "530801",
    "code": "530801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530802",
    "areaId": "530802",
    "code": "530802",
    "name": "思茅区",
    "fullname": "思茅区",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530821",
    "areaId": "530821",
    "code": "530821",
    "name": "宁洱哈尼族彝族自治县",
    "fullname": "宁洱哈尼族彝族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530822",
    "areaId": "530822",
    "code": "530822",
    "name": "墨江哈尼族自治县",
    "fullname": "墨江哈尼族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530823",
    "areaId": "530823",
    "code": "530823",
    "name": "景东彝族自治县",
    "fullname": "景东彝族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530824",
    "areaId": "530824",
    "code": "530824",
    "name": "景谷傣族彝族自治县",
    "fullname": "景谷傣族彝族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530825",
    "areaId": "530825",
    "code": "530825",
    "name": "镇沅彝族哈尼族拉祜族自治县",
    "fullname": "镇沅彝族哈尼族拉祜族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530826",
    "areaId": "530826",
    "code": "530826",
    "name": "江城哈尼族彝族自治县",
    "fullname": "江城哈尼族彝族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530827",
    "areaId": "530827",
    "code": "530827",
    "name": "孟连傣族拉祜族佤族自治县",
    "fullname": "孟连傣族拉祜族佤族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530828",
    "areaId": "530828",
    "code": "530828",
    "name": "澜沧拉祜族自治县",
    "fullname": "澜沧拉祜族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530829",
    "areaId": "530829",
    "code": "530829",
    "name": "西盟佤族自治县",
    "fullname": "西盟佤族自治县",
    "level": 3,
    "parentId": "530800"
  },
  {
    "id": "530901",
    "areaId": "530901",
    "code": "530901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530902",
    "areaId": "530902",
    "code": "530902",
    "name": "临翔区",
    "fullname": "临翔区",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530921",
    "areaId": "530921",
    "code": "530921",
    "name": "凤庆县",
    "fullname": "凤庆县",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530922",
    "areaId": "530922",
    "code": "530922",
    "name": "云县",
    "fullname": "云县",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530923",
    "areaId": "530923",
    "code": "530923",
    "name": "永德县",
    "fullname": "永德县",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530924",
    "areaId": "530924",
    "code": "530924",
    "name": "镇康县",
    "fullname": "镇康县",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530925",
    "areaId": "530925",
    "code": "530925",
    "name": "双江拉祜族佤族布朗族傣族自治县",
    "fullname": "双江拉祜族佤族布朗族傣族自治县",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530926",
    "areaId": "530926",
    "code": "530926",
    "name": "耿马傣族佤族自治县",
    "fullname": "耿马傣族佤族自治县",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "530927",
    "areaId": "530927",
    "code": "530927",
    "name": "沧源佤族自治县",
    "fullname": "沧源佤族自治县",
    "level": 3,
    "parentId": "530900"
  },
  {
    "id": "532301",
    "areaId": "532301",
    "code": "532301",
    "name": "楚雄市",
    "fullname": "楚雄市",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532322",
    "areaId": "532322",
    "code": "532322",
    "name": "双柏县",
    "fullname": "双柏县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532323",
    "areaId": "532323",
    "code": "532323",
    "name": "牟定县",
    "fullname": "牟定县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532324",
    "areaId": "532324",
    "code": "532324",
    "name": "南华县",
    "fullname": "南华县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532325",
    "areaId": "532325",
    "code": "532325",
    "name": "姚安县",
    "fullname": "姚安县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532326",
    "areaId": "532326",
    "code": "532326",
    "name": "大姚县",
    "fullname": "大姚县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532327",
    "areaId": "532327",
    "code": "532327",
    "name": "永仁县",
    "fullname": "永仁县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532328",
    "areaId": "532328",
    "code": "532328",
    "name": "元谋县",
    "fullname": "元谋县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532329",
    "areaId": "532329",
    "code": "532329",
    "name": "武定县",
    "fullname": "武定县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532331",
    "areaId": "532331",
    "code": "532331",
    "name": "禄丰县",
    "fullname": "禄丰县",
    "level": 3,
    "parentId": "532300"
  },
  {
    "id": "532501",
    "areaId": "532501",
    "code": "532501",
    "name": "个旧市",
    "fullname": "个旧市",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532502",
    "areaId": "532502",
    "code": "532502",
    "name": "开远市",
    "fullname": "开远市",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532503",
    "areaId": "532503",
    "code": "532503",
    "name": "蒙自市",
    "fullname": "蒙自市",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532504",
    "areaId": "532504",
    "code": "532504",
    "name": "弥勒市",
    "fullname": "弥勒市",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532523",
    "areaId": "532523",
    "code": "532523",
    "name": "屏边苗族自治县",
    "fullname": "屏边苗族自治县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532524",
    "areaId": "532524",
    "code": "532524",
    "name": "建水县",
    "fullname": "建水县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532525",
    "areaId": "532525",
    "code": "532525",
    "name": "石屏县",
    "fullname": "石屏县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532527",
    "areaId": "532527",
    "code": "532527",
    "name": "泸西县",
    "fullname": "泸西县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532528",
    "areaId": "532528",
    "code": "532528",
    "name": "元阳县",
    "fullname": "元阳县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532529",
    "areaId": "532529",
    "code": "532529",
    "name": "红河县",
    "fullname": "红河县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532530",
    "areaId": "532530",
    "code": "532530",
    "name": "金平苗族瑶族傣族自治县",
    "fullname": "金平苗族瑶族傣族自治县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532531",
    "areaId": "532531",
    "code": "532531",
    "name": "绿春县",
    "fullname": "绿春县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532532",
    "areaId": "532532",
    "code": "532532",
    "name": "河口瑶族自治县",
    "fullname": "河口瑶族自治县",
    "level": 3,
    "parentId": "532500"
  },
  {
    "id": "532601",
    "areaId": "532601",
    "code": "532601",
    "name": "文山市",
    "fullname": "文山市",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532622",
    "areaId": "532622",
    "code": "532622",
    "name": "砚山县",
    "fullname": "砚山县",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532623",
    "areaId": "532623",
    "code": "532623",
    "name": "西畴县",
    "fullname": "西畴县",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532624",
    "areaId": "532624",
    "code": "532624",
    "name": "麻栗坡县",
    "fullname": "麻栗坡县",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532625",
    "areaId": "532625",
    "code": "532625",
    "name": "马关县",
    "fullname": "马关县",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532626",
    "areaId": "532626",
    "code": "532626",
    "name": "丘北县",
    "fullname": "丘北县",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532627",
    "areaId": "532627",
    "code": "532627",
    "name": "广南县",
    "fullname": "广南县",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532628",
    "areaId": "532628",
    "code": "532628",
    "name": "富宁县",
    "fullname": "富宁县",
    "level": 3,
    "parentId": "532600"
  },
  {
    "id": "532801",
    "areaId": "532801",
    "code": "532801",
    "name": "景洪市",
    "fullname": "景洪市",
    "level": 3,
    "parentId": "532800"
  },
  {
    "id": "532822",
    "areaId": "532822",
    "code": "532822",
    "name": "勐海县",
    "fullname": "勐海县",
    "level": 3,
    "parentId": "532800"
  },
  {
    "id": "532823",
    "areaId": "532823",
    "code": "532823",
    "name": "勐腊县",
    "fullname": "勐腊县",
    "level": 3,
    "parentId": "532800"
  },
  {
    "id": "532901",
    "areaId": "532901",
    "code": "532901",
    "name": "大理市",
    "fullname": "大理市",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532922",
    "areaId": "532922",
    "code": "532922",
    "name": "漾濞彝族自治县",
    "fullname": "漾濞彝族自治县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532923",
    "areaId": "532923",
    "code": "532923",
    "name": "祥云县",
    "fullname": "祥云县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532924",
    "areaId": "532924",
    "code": "532924",
    "name": "宾川县",
    "fullname": "宾川县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532925",
    "areaId": "532925",
    "code": "532925",
    "name": "弥渡县",
    "fullname": "弥渡县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532926",
    "areaId": "532926",
    "code": "532926",
    "name": "南涧彝族自治县",
    "fullname": "南涧彝族自治县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532927",
    "areaId": "532927",
    "code": "532927",
    "name": "巍山彝族回族自治县",
    "fullname": "巍山彝族回族自治县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532928",
    "areaId": "532928",
    "code": "532928",
    "name": "永平县",
    "fullname": "永平县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532929",
    "areaId": "532929",
    "code": "532929",
    "name": "云龙县",
    "fullname": "云龙县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532930",
    "areaId": "532930",
    "code": "532930",
    "name": "洱源县",
    "fullname": "洱源县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532931",
    "areaId": "532931",
    "code": "532931",
    "name": "剑川县",
    "fullname": "剑川县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "532932",
    "areaId": "532932",
    "code": "532932",
    "name": "鹤庆县",
    "fullname": "鹤庆县",
    "level": 3,
    "parentId": "532900"
  },
  {
    "id": "533102",
    "areaId": "533102",
    "code": "533102",
    "name": "瑞丽市",
    "fullname": "瑞丽市",
    "level": 3,
    "parentId": "533100"
  },
  {
    "id": "533103",
    "areaId": "533103",
    "code": "533103",
    "name": "芒市",
    "fullname": "芒市",
    "level": 3,
    "parentId": "533100"
  },
  {
    "id": "533122",
    "areaId": "533122",
    "code": "533122",
    "name": "梁河县",
    "fullname": "梁河县",
    "level": 3,
    "parentId": "533100"
  },
  {
    "id": "533123",
    "areaId": "533123",
    "code": "533123",
    "name": "盈江县",
    "fullname": "盈江县",
    "level": 3,
    "parentId": "533100"
  },
  {
    "id": "533124",
    "areaId": "533124",
    "code": "533124",
    "name": "陇川县",
    "fullname": "陇川县",
    "level": 3,
    "parentId": "533100"
  },
  {
    "id": "533301",
    "areaId": "533301",
    "code": "533301",
    "name": "泸水市",
    "fullname": "泸水市",
    "level": 3,
    "parentId": "533300"
  },
  {
    "id": "533323",
    "areaId": "533323",
    "code": "533323",
    "name": "福贡县",
    "fullname": "福贡县",
    "level": 3,
    "parentId": "533300"
  },
  {
    "id": "533324",
    "areaId": "533324",
    "code": "533324",
    "name": "贡山独龙族怒族自治县",
    "fullname": "贡山独龙族怒族自治县",
    "level": 3,
    "parentId": "533300"
  },
  {
    "id": "533325",
    "areaId": "533325",
    "code": "533325",
    "name": "兰坪白族普米族自治县",
    "fullname": "兰坪白族普米族自治县",
    "level": 3,
    "parentId": "533300"
  },
  {
    "id": "533401",
    "areaId": "533401",
    "code": "533401",
    "name": "香格里拉市",
    "fullname": "香格里拉市",
    "level": 3,
    "parentId": "533400"
  },
  {
    "id": "533422",
    "areaId": "533422",
    "code": "533422",
    "name": "德钦县",
    "fullname": "德钦县",
    "level": 3,
    "parentId": "533400"
  },
  {
    "id": "533423",
    "areaId": "533423",
    "code": "533423",
    "name": "维西傈僳族自治县",
    "fullname": "维西傈僳族自治县",
    "level": 3,
    "parentId": "533400"
  },
  {
    "id": "540101",
    "areaId": "540101",
    "code": "540101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540102",
    "areaId": "540102",
    "code": "540102",
    "name": "城关区",
    "fullname": "城关区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540103",
    "areaId": "540103",
    "code": "540103",
    "name": "堆龙德庆区",
    "fullname": "堆龙德庆区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540104",
    "areaId": "540104",
    "code": "540104",
    "name": "达孜区",
    "fullname": "达孜区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540121",
    "areaId": "540121",
    "code": "540121",
    "name": "林周县",
    "fullname": "林周县",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540122",
    "areaId": "540122",
    "code": "540122",
    "name": "当雄县",
    "fullname": "当雄县",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540123",
    "areaId": "540123",
    "code": "540123",
    "name": "尼木县",
    "fullname": "尼木县",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540124",
    "areaId": "540124",
    "code": "540124",
    "name": "曲水县",
    "fullname": "曲水县",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540127",
    "areaId": "540127",
    "code": "540127",
    "name": "墨竹工卡县",
    "fullname": "墨竹工卡县",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540171",
    "areaId": "540171",
    "code": "540171",
    "name": "格尔木藏青工业园区",
    "fullname": "格尔木藏青工业园区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540172",
    "areaId": "540172",
    "code": "540172",
    "name": "拉萨经济技术开发区",
    "fullname": "拉萨经济技术开发区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540173",
    "areaId": "540173",
    "code": "540173",
    "name": "西藏文化旅游创意园区",
    "fullname": "西藏文化旅游创意园区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540174",
    "areaId": "540174",
    "code": "540174",
    "name": "达孜工业园区",
    "fullname": "达孜工业园区",
    "level": 3,
    "parentId": "540100"
  },
  {
    "id": "540202",
    "areaId": "540202",
    "code": "540202",
    "name": "桑珠孜区",
    "fullname": "桑珠孜区",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540221",
    "areaId": "540221",
    "code": "540221",
    "name": "南木林县",
    "fullname": "南木林县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540222",
    "areaId": "540222",
    "code": "540222",
    "name": "江孜县",
    "fullname": "江孜县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540223",
    "areaId": "540223",
    "code": "540223",
    "name": "定日县",
    "fullname": "定日县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540224",
    "areaId": "540224",
    "code": "540224",
    "name": "萨迦县",
    "fullname": "萨迦县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540225",
    "areaId": "540225",
    "code": "540225",
    "name": "拉孜县",
    "fullname": "拉孜县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540226",
    "areaId": "540226",
    "code": "540226",
    "name": "昂仁县",
    "fullname": "昂仁县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540227",
    "areaId": "540227",
    "code": "540227",
    "name": "谢通门县",
    "fullname": "谢通门县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540228",
    "areaId": "540228",
    "code": "540228",
    "name": "白朗县",
    "fullname": "白朗县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540229",
    "areaId": "540229",
    "code": "540229",
    "name": "仁布县",
    "fullname": "仁布县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540230",
    "areaId": "540230",
    "code": "540230",
    "name": "康马县",
    "fullname": "康马县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540231",
    "areaId": "540231",
    "code": "540231",
    "name": "定结县",
    "fullname": "定结县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540232",
    "areaId": "540232",
    "code": "540232",
    "name": "仲巴县",
    "fullname": "仲巴县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540233",
    "areaId": "540233",
    "code": "540233",
    "name": "亚东县",
    "fullname": "亚东县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540234",
    "areaId": "540234",
    "code": "540234",
    "name": "吉隆县",
    "fullname": "吉隆县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540235",
    "areaId": "540235",
    "code": "540235",
    "name": "聂拉木县",
    "fullname": "聂拉木县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540236",
    "areaId": "540236",
    "code": "540236",
    "name": "萨嘎县",
    "fullname": "萨嘎县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540237",
    "areaId": "540237",
    "code": "540237",
    "name": "岗巴县",
    "fullname": "岗巴县",
    "level": 3,
    "parentId": "540200"
  },
  {
    "id": "540302",
    "areaId": "540302",
    "code": "540302",
    "name": "卡若区",
    "fullname": "卡若区",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540321",
    "areaId": "540321",
    "code": "540321",
    "name": "江达县",
    "fullname": "江达县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540322",
    "areaId": "540322",
    "code": "540322",
    "name": "贡觉县",
    "fullname": "贡觉县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540323",
    "areaId": "540323",
    "code": "540323",
    "name": "类乌齐县",
    "fullname": "类乌齐县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540324",
    "areaId": "540324",
    "code": "540324",
    "name": "丁青县",
    "fullname": "丁青县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540325",
    "areaId": "540325",
    "code": "540325",
    "name": "察雅县",
    "fullname": "察雅县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540326",
    "areaId": "540326",
    "code": "540326",
    "name": "八宿县",
    "fullname": "八宿县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540327",
    "areaId": "540327",
    "code": "540327",
    "name": "左贡县",
    "fullname": "左贡县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540328",
    "areaId": "540328",
    "code": "540328",
    "name": "芒康县",
    "fullname": "芒康县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540329",
    "areaId": "540329",
    "code": "540329",
    "name": "洛隆县",
    "fullname": "洛隆县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540330",
    "areaId": "540330",
    "code": "540330",
    "name": "边坝县",
    "fullname": "边坝县",
    "level": 3,
    "parentId": "540300"
  },
  {
    "id": "540402",
    "areaId": "540402",
    "code": "540402",
    "name": "巴宜区",
    "fullname": "巴宜区",
    "level": 3,
    "parentId": "540400"
  },
  {
    "id": "540421",
    "areaId": "540421",
    "code": "540421",
    "name": "工布江达县",
    "fullname": "工布江达县",
    "level": 3,
    "parentId": "540400"
  },
  {
    "id": "540422",
    "areaId": "540422",
    "code": "540422",
    "name": "米林县",
    "fullname": "米林县",
    "level": 3,
    "parentId": "540400"
  },
  {
    "id": "540423",
    "areaId": "540423",
    "code": "540423",
    "name": "墨脱县",
    "fullname": "墨脱县",
    "level": 3,
    "parentId": "540400"
  },
  {
    "id": "540424",
    "areaId": "540424",
    "code": "540424",
    "name": "波密县",
    "fullname": "波密县",
    "level": 3,
    "parentId": "540400"
  },
  {
    "id": "540425",
    "areaId": "540425",
    "code": "540425",
    "name": "察隅县",
    "fullname": "察隅县",
    "level": 3,
    "parentId": "540400"
  },
  {
    "id": "540426",
    "areaId": "540426",
    "code": "540426",
    "name": "朗县",
    "fullname": "朗县",
    "level": 3,
    "parentId": "540400"
  },
  {
    "id": "540501",
    "areaId": "540501",
    "code": "540501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540502",
    "areaId": "540502",
    "code": "540502",
    "name": "乃东区",
    "fullname": "乃东区",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540521",
    "areaId": "540521",
    "code": "540521",
    "name": "扎囊县",
    "fullname": "扎囊县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540522",
    "areaId": "540522",
    "code": "540522",
    "name": "贡嘎县",
    "fullname": "贡嘎县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540523",
    "areaId": "540523",
    "code": "540523",
    "name": "桑日县",
    "fullname": "桑日县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540524",
    "areaId": "540524",
    "code": "540524",
    "name": "琼结县",
    "fullname": "琼结县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540525",
    "areaId": "540525",
    "code": "540525",
    "name": "曲松县",
    "fullname": "曲松县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540526",
    "areaId": "540526",
    "code": "540526",
    "name": "措美县",
    "fullname": "措美县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540527",
    "areaId": "540527",
    "code": "540527",
    "name": "洛扎县",
    "fullname": "洛扎县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540528",
    "areaId": "540528",
    "code": "540528",
    "name": "加查县",
    "fullname": "加查县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540529",
    "areaId": "540529",
    "code": "540529",
    "name": "隆子县",
    "fullname": "隆子县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540530",
    "areaId": "540530",
    "code": "540530",
    "name": "错那县",
    "fullname": "错那县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540531",
    "areaId": "540531",
    "code": "540531",
    "name": "浪卡子县",
    "fullname": "浪卡子县",
    "level": 3,
    "parentId": "540500"
  },
  {
    "id": "540602",
    "areaId": "540602",
    "code": "540602",
    "name": "色尼区",
    "fullname": "色尼区",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540621",
    "areaId": "540621",
    "code": "540621",
    "name": "嘉黎县",
    "fullname": "嘉黎县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540622",
    "areaId": "540622",
    "code": "540622",
    "name": "比如县",
    "fullname": "比如县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540623",
    "areaId": "540623",
    "code": "540623",
    "name": "聂荣县",
    "fullname": "聂荣县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540624",
    "areaId": "540624",
    "code": "540624",
    "name": "安多县",
    "fullname": "安多县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540625",
    "areaId": "540625",
    "code": "540625",
    "name": "申扎县",
    "fullname": "申扎县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540626",
    "areaId": "540626",
    "code": "540626",
    "name": "索县",
    "fullname": "索县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540627",
    "areaId": "540627",
    "code": "540627",
    "name": "班戈县",
    "fullname": "班戈县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540628",
    "areaId": "540628",
    "code": "540628",
    "name": "巴青县",
    "fullname": "巴青县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540629",
    "areaId": "540629",
    "code": "540629",
    "name": "尼玛县",
    "fullname": "尼玛县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "540630",
    "areaId": "540630",
    "code": "540630",
    "name": "双湖县",
    "fullname": "双湖县",
    "level": 3,
    "parentId": "540600"
  },
  {
    "id": "542521",
    "areaId": "542521",
    "code": "542521",
    "name": "普兰县",
    "fullname": "普兰县",
    "level": 3,
    "parentId": "542500"
  },
  {
    "id": "542522",
    "areaId": "542522",
    "code": "542522",
    "name": "札达县",
    "fullname": "札达县",
    "level": 3,
    "parentId": "542500"
  },
  {
    "id": "542523",
    "areaId": "542523",
    "code": "542523",
    "name": "噶尔县",
    "fullname": "噶尔县",
    "level": 3,
    "parentId": "542500"
  },
  {
    "id": "542524",
    "areaId": "542524",
    "code": "542524",
    "name": "日土县",
    "fullname": "日土县",
    "level": 3,
    "parentId": "542500"
  },
  {
    "id": "542525",
    "areaId": "542525",
    "code": "542525",
    "name": "革吉县",
    "fullname": "革吉县",
    "level": 3,
    "parentId": "542500"
  },
  {
    "id": "542526",
    "areaId": "542526",
    "code": "542526",
    "name": "改则县",
    "fullname": "改则县",
    "level": 3,
    "parentId": "542500"
  },
  {
    "id": "542527",
    "areaId": "542527",
    "code": "542527",
    "name": "措勤县",
    "fullname": "措勤县",
    "level": 3,
    "parentId": "542500"
  },
  {
    "id": "610101",
    "areaId": "610101",
    "code": "610101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610102",
    "areaId": "610102",
    "code": "610102",
    "name": "新城区",
    "fullname": "新城区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610103",
    "areaId": "610103",
    "code": "610103",
    "name": "碑林区",
    "fullname": "碑林区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610104",
    "areaId": "610104",
    "code": "610104",
    "name": "莲湖区",
    "fullname": "莲湖区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610111",
    "areaId": "610111",
    "code": "610111",
    "name": "灞桥区",
    "fullname": "灞桥区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610112",
    "areaId": "610112",
    "code": "610112",
    "name": "未央区",
    "fullname": "未央区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610113",
    "areaId": "610113",
    "code": "610113",
    "name": "雁塔区",
    "fullname": "雁塔区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610114",
    "areaId": "610114",
    "code": "610114",
    "name": "阎良区",
    "fullname": "阎良区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610115",
    "areaId": "610115",
    "code": "610115",
    "name": "临潼区",
    "fullname": "临潼区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610116",
    "areaId": "610116",
    "code": "610116",
    "name": "长安区",
    "fullname": "长安区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610117",
    "areaId": "610117",
    "code": "610117",
    "name": "高陵区",
    "fullname": "高陵区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610118",
    "areaId": "610118",
    "code": "610118",
    "name": "鄠邑区",
    "fullname": "鄠邑区",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610122",
    "areaId": "610122",
    "code": "610122",
    "name": "蓝田县",
    "fullname": "蓝田县",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610124",
    "areaId": "610124",
    "code": "610124",
    "name": "周至县",
    "fullname": "周至县",
    "level": 3,
    "parentId": "610100"
  },
  {
    "id": "610201",
    "areaId": "610201",
    "code": "610201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610200"
  },
  {
    "id": "610202",
    "areaId": "610202",
    "code": "610202",
    "name": "王益区",
    "fullname": "王益区",
    "level": 3,
    "parentId": "610200"
  },
  {
    "id": "610203",
    "areaId": "610203",
    "code": "610203",
    "name": "印台区",
    "fullname": "印台区",
    "level": 3,
    "parentId": "610200"
  },
  {
    "id": "610204",
    "areaId": "610204",
    "code": "610204",
    "name": "耀州区",
    "fullname": "耀州区",
    "level": 3,
    "parentId": "610200"
  },
  {
    "id": "610222",
    "areaId": "610222",
    "code": "610222",
    "name": "宜君县",
    "fullname": "宜君县",
    "level": 3,
    "parentId": "610200"
  },
  {
    "id": "610301",
    "areaId": "610301",
    "code": "610301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610302",
    "areaId": "610302",
    "code": "610302",
    "name": "渭滨区",
    "fullname": "渭滨区",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610303",
    "areaId": "610303",
    "code": "610303",
    "name": "金台区",
    "fullname": "金台区",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610304",
    "areaId": "610304",
    "code": "610304",
    "name": "陈仓区",
    "fullname": "陈仓区",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610322",
    "areaId": "610322",
    "code": "610322",
    "name": "凤翔县",
    "fullname": "凤翔县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610323",
    "areaId": "610323",
    "code": "610323",
    "name": "岐山县",
    "fullname": "岐山县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610324",
    "areaId": "610324",
    "code": "610324",
    "name": "扶风县",
    "fullname": "扶风县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610326",
    "areaId": "610326",
    "code": "610326",
    "name": "眉县",
    "fullname": "眉县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610327",
    "areaId": "610327",
    "code": "610327",
    "name": "陇县",
    "fullname": "陇县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610328",
    "areaId": "610328",
    "code": "610328",
    "name": "千阳县",
    "fullname": "千阳县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610329",
    "areaId": "610329",
    "code": "610329",
    "name": "麟游县",
    "fullname": "麟游县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610330",
    "areaId": "610330",
    "code": "610330",
    "name": "凤县",
    "fullname": "凤县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610331",
    "areaId": "610331",
    "code": "610331",
    "name": "太白县",
    "fullname": "太白县",
    "level": 3,
    "parentId": "610300"
  },
  {
    "id": "610401",
    "areaId": "610401",
    "code": "610401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610402",
    "areaId": "610402",
    "code": "610402",
    "name": "秦都区",
    "fullname": "秦都区",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610403",
    "areaId": "610403",
    "code": "610403",
    "name": "杨陵区",
    "fullname": "杨陵区",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610404",
    "areaId": "610404",
    "code": "610404",
    "name": "渭城区",
    "fullname": "渭城区",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610422",
    "areaId": "610422",
    "code": "610422",
    "name": "三原县",
    "fullname": "三原县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610423",
    "areaId": "610423",
    "code": "610423",
    "name": "泾阳县",
    "fullname": "泾阳县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610424",
    "areaId": "610424",
    "code": "610424",
    "name": "乾县",
    "fullname": "乾县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610425",
    "areaId": "610425",
    "code": "610425",
    "name": "礼泉县",
    "fullname": "礼泉县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610426",
    "areaId": "610426",
    "code": "610426",
    "name": "永寿县",
    "fullname": "永寿县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610428",
    "areaId": "610428",
    "code": "610428",
    "name": "长武县",
    "fullname": "长武县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610429",
    "areaId": "610429",
    "code": "610429",
    "name": "旬邑县",
    "fullname": "旬邑县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610430",
    "areaId": "610430",
    "code": "610430",
    "name": "淳化县",
    "fullname": "淳化县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610431",
    "areaId": "610431",
    "code": "610431",
    "name": "武功县",
    "fullname": "武功县",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610481",
    "areaId": "610481",
    "code": "610481",
    "name": "兴平市",
    "fullname": "兴平市",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610482",
    "areaId": "610482",
    "code": "610482",
    "name": "彬州市",
    "fullname": "彬州市",
    "level": 3,
    "parentId": "610400"
  },
  {
    "id": "610501",
    "areaId": "610501",
    "code": "610501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610502",
    "areaId": "610502",
    "code": "610502",
    "name": "临渭区",
    "fullname": "临渭区",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610503",
    "areaId": "610503",
    "code": "610503",
    "name": "华州区",
    "fullname": "华州区",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610522",
    "areaId": "610522",
    "code": "610522",
    "name": "潼关县",
    "fullname": "潼关县",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610523",
    "areaId": "610523",
    "code": "610523",
    "name": "大荔县",
    "fullname": "大荔县",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610524",
    "areaId": "610524",
    "code": "610524",
    "name": "合阳县",
    "fullname": "合阳县",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610525",
    "areaId": "610525",
    "code": "610525",
    "name": "澄城县",
    "fullname": "澄城县",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610526",
    "areaId": "610526",
    "code": "610526",
    "name": "蒲城县",
    "fullname": "蒲城县",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610527",
    "areaId": "610527",
    "code": "610527",
    "name": "白水县",
    "fullname": "白水县",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610528",
    "areaId": "610528",
    "code": "610528",
    "name": "富平县",
    "fullname": "富平县",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610581",
    "areaId": "610581",
    "code": "610581",
    "name": "韩城市",
    "fullname": "韩城市",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610582",
    "areaId": "610582",
    "code": "610582",
    "name": "华阴市",
    "fullname": "华阴市",
    "level": 3,
    "parentId": "610500"
  },
  {
    "id": "610601",
    "areaId": "610601",
    "code": "610601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610602",
    "areaId": "610602",
    "code": "610602",
    "name": "宝塔区",
    "fullname": "宝塔区",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610603",
    "areaId": "610603",
    "code": "610603",
    "name": "安塞区",
    "fullname": "安塞区",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610621",
    "areaId": "610621",
    "code": "610621",
    "name": "延长县",
    "fullname": "延长县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610622",
    "areaId": "610622",
    "code": "610622",
    "name": "延川县",
    "fullname": "延川县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610625",
    "areaId": "610625",
    "code": "610625",
    "name": "志丹县",
    "fullname": "志丹县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610626",
    "areaId": "610626",
    "code": "610626",
    "name": "吴起县",
    "fullname": "吴起县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610627",
    "areaId": "610627",
    "code": "610627",
    "name": "甘泉县",
    "fullname": "甘泉县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610628",
    "areaId": "610628",
    "code": "610628",
    "name": "富县",
    "fullname": "富县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610629",
    "areaId": "610629",
    "code": "610629",
    "name": "洛川县",
    "fullname": "洛川县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610630",
    "areaId": "610630",
    "code": "610630",
    "name": "宜川县",
    "fullname": "宜川县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610631",
    "areaId": "610631",
    "code": "610631",
    "name": "黄龙县",
    "fullname": "黄龙县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610632",
    "areaId": "610632",
    "code": "610632",
    "name": "黄陵县",
    "fullname": "黄陵县",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610681",
    "areaId": "610681",
    "code": "610681",
    "name": "子长市",
    "fullname": "子长市",
    "level": 3,
    "parentId": "610600"
  },
  {
    "id": "610701",
    "areaId": "610701",
    "code": "610701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610702",
    "areaId": "610702",
    "code": "610702",
    "name": "汉台区",
    "fullname": "汉台区",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610703",
    "areaId": "610703",
    "code": "610703",
    "name": "南郑区",
    "fullname": "南郑区",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610722",
    "areaId": "610722",
    "code": "610722",
    "name": "城固县",
    "fullname": "城固县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610723",
    "areaId": "610723",
    "code": "610723",
    "name": "洋县",
    "fullname": "洋县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610724",
    "areaId": "610724",
    "code": "610724",
    "name": "西乡县",
    "fullname": "西乡县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610725",
    "areaId": "610725",
    "code": "610725",
    "name": "勉县",
    "fullname": "勉县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610726",
    "areaId": "610726",
    "code": "610726",
    "name": "宁强县",
    "fullname": "宁强县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610727",
    "areaId": "610727",
    "code": "610727",
    "name": "略阳县",
    "fullname": "略阳县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610728",
    "areaId": "610728",
    "code": "610728",
    "name": "镇巴县",
    "fullname": "镇巴县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610729",
    "areaId": "610729",
    "code": "610729",
    "name": "留坝县",
    "fullname": "留坝县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610730",
    "areaId": "610730",
    "code": "610730",
    "name": "佛坪县",
    "fullname": "佛坪县",
    "level": 3,
    "parentId": "610700"
  },
  {
    "id": "610801",
    "areaId": "610801",
    "code": "610801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610802",
    "areaId": "610802",
    "code": "610802",
    "name": "榆阳区",
    "fullname": "榆阳区",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610803",
    "areaId": "610803",
    "code": "610803",
    "name": "横山区",
    "fullname": "横山区",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610822",
    "areaId": "610822",
    "code": "610822",
    "name": "府谷县",
    "fullname": "府谷县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610824",
    "areaId": "610824",
    "code": "610824",
    "name": "靖边县",
    "fullname": "靖边县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610825",
    "areaId": "610825",
    "code": "610825",
    "name": "定边县",
    "fullname": "定边县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610826",
    "areaId": "610826",
    "code": "610826",
    "name": "绥德县",
    "fullname": "绥德县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610827",
    "areaId": "610827",
    "code": "610827",
    "name": "米脂县",
    "fullname": "米脂县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610828",
    "areaId": "610828",
    "code": "610828",
    "name": "佳县",
    "fullname": "佳县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610829",
    "areaId": "610829",
    "code": "610829",
    "name": "吴堡县",
    "fullname": "吴堡县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610830",
    "areaId": "610830",
    "code": "610830",
    "name": "清涧县",
    "fullname": "清涧县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610831",
    "areaId": "610831",
    "code": "610831",
    "name": "子洲县",
    "fullname": "子洲县",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610881",
    "areaId": "610881",
    "code": "610881",
    "name": "神木市",
    "fullname": "神木市",
    "level": 3,
    "parentId": "610800"
  },
  {
    "id": "610901",
    "areaId": "610901",
    "code": "610901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610902",
    "areaId": "610902",
    "code": "610902",
    "name": "汉滨区",
    "fullname": "汉滨区",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610921",
    "areaId": "610921",
    "code": "610921",
    "name": "汉阴县",
    "fullname": "汉阴县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610922",
    "areaId": "610922",
    "code": "610922",
    "name": "石泉县",
    "fullname": "石泉县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610923",
    "areaId": "610923",
    "code": "610923",
    "name": "宁陕县",
    "fullname": "宁陕县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610924",
    "areaId": "610924",
    "code": "610924",
    "name": "紫阳县",
    "fullname": "紫阳县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610925",
    "areaId": "610925",
    "code": "610925",
    "name": "岚皋县",
    "fullname": "岚皋县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610926",
    "areaId": "610926",
    "code": "610926",
    "name": "平利县",
    "fullname": "平利县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610927",
    "areaId": "610927",
    "code": "610927",
    "name": "镇坪县",
    "fullname": "镇坪县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610928",
    "areaId": "610928",
    "code": "610928",
    "name": "旬阳县",
    "fullname": "旬阳县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "610929",
    "areaId": "610929",
    "code": "610929",
    "name": "白河县",
    "fullname": "白河县",
    "level": 3,
    "parentId": "610900"
  },
  {
    "id": "611001",
    "areaId": "611001",
    "code": "611001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "611002",
    "areaId": "611002",
    "code": "611002",
    "name": "商州区",
    "fullname": "商州区",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "611021",
    "areaId": "611021",
    "code": "611021",
    "name": "洛南县",
    "fullname": "洛南县",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "611022",
    "areaId": "611022",
    "code": "611022",
    "name": "丹凤县",
    "fullname": "丹凤县",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "611023",
    "areaId": "611023",
    "code": "611023",
    "name": "商南县",
    "fullname": "商南县",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "611024",
    "areaId": "611024",
    "code": "611024",
    "name": "山阳县",
    "fullname": "山阳县",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "611025",
    "areaId": "611025",
    "code": "611025",
    "name": "镇安县",
    "fullname": "镇安县",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "611026",
    "areaId": "611026",
    "code": "611026",
    "name": "柞水县",
    "fullname": "柞水县",
    "level": 3,
    "parentId": "611000"
  },
  {
    "id": "620101",
    "areaId": "620101",
    "code": "620101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620102",
    "areaId": "620102",
    "code": "620102",
    "name": "城关区",
    "fullname": "城关区",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620103",
    "areaId": "620103",
    "code": "620103",
    "name": "七里河区",
    "fullname": "七里河区",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620104",
    "areaId": "620104",
    "code": "620104",
    "name": "西固区",
    "fullname": "西固区",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620105",
    "areaId": "620105",
    "code": "620105",
    "name": "安宁区",
    "fullname": "安宁区",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620111",
    "areaId": "620111",
    "code": "620111",
    "name": "红古区",
    "fullname": "红古区",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620121",
    "areaId": "620121",
    "code": "620121",
    "name": "永登县",
    "fullname": "永登县",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620122",
    "areaId": "620122",
    "code": "620122",
    "name": "皋兰县",
    "fullname": "皋兰县",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620123",
    "areaId": "620123",
    "code": "620123",
    "name": "榆中县",
    "fullname": "榆中县",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620171",
    "areaId": "620171",
    "code": "620171",
    "name": "兰州新区",
    "fullname": "兰州新区",
    "level": 3,
    "parentId": "620100"
  },
  {
    "id": "620201",
    "areaId": "620201",
    "code": "620201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620200"
  },
  {
    "id": "620301",
    "areaId": "620301",
    "code": "620301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620300"
  },
  {
    "id": "620302",
    "areaId": "620302",
    "code": "620302",
    "name": "金川区",
    "fullname": "金川区",
    "level": 3,
    "parentId": "620300"
  },
  {
    "id": "620321",
    "areaId": "620321",
    "code": "620321",
    "name": "永昌县",
    "fullname": "永昌县",
    "level": 3,
    "parentId": "620300"
  },
  {
    "id": "620401",
    "areaId": "620401",
    "code": "620401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620400"
  },
  {
    "id": "620402",
    "areaId": "620402",
    "code": "620402",
    "name": "白银区",
    "fullname": "白银区",
    "level": 3,
    "parentId": "620400"
  },
  {
    "id": "620403",
    "areaId": "620403",
    "code": "620403",
    "name": "平川区",
    "fullname": "平川区",
    "level": 3,
    "parentId": "620400"
  },
  {
    "id": "620421",
    "areaId": "620421",
    "code": "620421",
    "name": "靖远县",
    "fullname": "靖远县",
    "level": 3,
    "parentId": "620400"
  },
  {
    "id": "620422",
    "areaId": "620422",
    "code": "620422",
    "name": "会宁县",
    "fullname": "会宁县",
    "level": 3,
    "parentId": "620400"
  },
  {
    "id": "620423",
    "areaId": "620423",
    "code": "620423",
    "name": "景泰县",
    "fullname": "景泰县",
    "level": 3,
    "parentId": "620400"
  },
  {
    "id": "620501",
    "areaId": "620501",
    "code": "620501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620502",
    "areaId": "620502",
    "code": "620502",
    "name": "秦州区",
    "fullname": "秦州区",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620503",
    "areaId": "620503",
    "code": "620503",
    "name": "麦积区",
    "fullname": "麦积区",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620521",
    "areaId": "620521",
    "code": "620521",
    "name": "清水县",
    "fullname": "清水县",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620522",
    "areaId": "620522",
    "code": "620522",
    "name": "秦安县",
    "fullname": "秦安县",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620523",
    "areaId": "620523",
    "code": "620523",
    "name": "甘谷县",
    "fullname": "甘谷县",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620524",
    "areaId": "620524",
    "code": "620524",
    "name": "武山县",
    "fullname": "武山县",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620525",
    "areaId": "620525",
    "code": "620525",
    "name": "张家川回族自治县",
    "fullname": "张家川回族自治县",
    "level": 3,
    "parentId": "620500"
  },
  {
    "id": "620601",
    "areaId": "620601",
    "code": "620601",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620600"
  },
  {
    "id": "620602",
    "areaId": "620602",
    "code": "620602",
    "name": "凉州区",
    "fullname": "凉州区",
    "level": 3,
    "parentId": "620600"
  },
  {
    "id": "620621",
    "areaId": "620621",
    "code": "620621",
    "name": "民勤县",
    "fullname": "民勤县",
    "level": 3,
    "parentId": "620600"
  },
  {
    "id": "620622",
    "areaId": "620622",
    "code": "620622",
    "name": "古浪县",
    "fullname": "古浪县",
    "level": 3,
    "parentId": "620600"
  },
  {
    "id": "620623",
    "areaId": "620623",
    "code": "620623",
    "name": "天祝藏族自治县",
    "fullname": "天祝藏族自治县",
    "level": 3,
    "parentId": "620600"
  },
  {
    "id": "620701",
    "areaId": "620701",
    "code": "620701",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620700"
  },
  {
    "id": "620702",
    "areaId": "620702",
    "code": "620702",
    "name": "甘州区",
    "fullname": "甘州区",
    "level": 3,
    "parentId": "620700"
  },
  {
    "id": "620721",
    "areaId": "620721",
    "code": "620721",
    "name": "肃南裕固族自治县",
    "fullname": "肃南裕固族自治县",
    "level": 3,
    "parentId": "620700"
  },
  {
    "id": "620722",
    "areaId": "620722",
    "code": "620722",
    "name": "民乐县",
    "fullname": "民乐县",
    "level": 3,
    "parentId": "620700"
  },
  {
    "id": "620723",
    "areaId": "620723",
    "code": "620723",
    "name": "临泽县",
    "fullname": "临泽县",
    "level": 3,
    "parentId": "620700"
  },
  {
    "id": "620724",
    "areaId": "620724",
    "code": "620724",
    "name": "高台县",
    "fullname": "高台县",
    "level": 3,
    "parentId": "620700"
  },
  {
    "id": "620725",
    "areaId": "620725",
    "code": "620725",
    "name": "山丹县",
    "fullname": "山丹县",
    "level": 3,
    "parentId": "620700"
  },
  {
    "id": "620801",
    "areaId": "620801",
    "code": "620801",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620802",
    "areaId": "620802",
    "code": "620802",
    "name": "崆峒区",
    "fullname": "崆峒区",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620821",
    "areaId": "620821",
    "code": "620821",
    "name": "泾川县",
    "fullname": "泾川县",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620822",
    "areaId": "620822",
    "code": "620822",
    "name": "灵台县",
    "fullname": "灵台县",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620823",
    "areaId": "620823",
    "code": "620823",
    "name": "崇信县",
    "fullname": "崇信县",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620825",
    "areaId": "620825",
    "code": "620825",
    "name": "庄浪县",
    "fullname": "庄浪县",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620826",
    "areaId": "620826",
    "code": "620826",
    "name": "静宁县",
    "fullname": "静宁县",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620881",
    "areaId": "620881",
    "code": "620881",
    "name": "华亭市",
    "fullname": "华亭市",
    "level": 3,
    "parentId": "620800"
  },
  {
    "id": "620901",
    "areaId": "620901",
    "code": "620901",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "620902",
    "areaId": "620902",
    "code": "620902",
    "name": "肃州区",
    "fullname": "肃州区",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "620921",
    "areaId": "620921",
    "code": "620921",
    "name": "金塔县",
    "fullname": "金塔县",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "620922",
    "areaId": "620922",
    "code": "620922",
    "name": "瓜州县",
    "fullname": "瓜州县",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "620923",
    "areaId": "620923",
    "code": "620923",
    "name": "肃北蒙古族自治县",
    "fullname": "肃北蒙古族自治县",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "620924",
    "areaId": "620924",
    "code": "620924",
    "name": "阿克塞哈萨克族自治县",
    "fullname": "阿克塞哈萨克族自治县",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "620981",
    "areaId": "620981",
    "code": "620981",
    "name": "玉门市",
    "fullname": "玉门市",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "620982",
    "areaId": "620982",
    "code": "620982",
    "name": "敦煌市",
    "fullname": "敦煌市",
    "level": 3,
    "parentId": "620900"
  },
  {
    "id": "621001",
    "areaId": "621001",
    "code": "621001",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621002",
    "areaId": "621002",
    "code": "621002",
    "name": "西峰区",
    "fullname": "西峰区",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621021",
    "areaId": "621021",
    "code": "621021",
    "name": "庆城县",
    "fullname": "庆城县",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621022",
    "areaId": "621022",
    "code": "621022",
    "name": "环县",
    "fullname": "环县",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621023",
    "areaId": "621023",
    "code": "621023",
    "name": "华池县",
    "fullname": "华池县",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621024",
    "areaId": "621024",
    "code": "621024",
    "name": "合水县",
    "fullname": "合水县",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621025",
    "areaId": "621025",
    "code": "621025",
    "name": "正宁县",
    "fullname": "正宁县",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621026",
    "areaId": "621026",
    "code": "621026",
    "name": "宁县",
    "fullname": "宁县",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621027",
    "areaId": "621027",
    "code": "621027",
    "name": "镇原县",
    "fullname": "镇原县",
    "level": 3,
    "parentId": "621000"
  },
  {
    "id": "621101",
    "areaId": "621101",
    "code": "621101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621102",
    "areaId": "621102",
    "code": "621102",
    "name": "安定区",
    "fullname": "安定区",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621121",
    "areaId": "621121",
    "code": "621121",
    "name": "通渭县",
    "fullname": "通渭县",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621122",
    "areaId": "621122",
    "code": "621122",
    "name": "陇西县",
    "fullname": "陇西县",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621123",
    "areaId": "621123",
    "code": "621123",
    "name": "渭源县",
    "fullname": "渭源县",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621124",
    "areaId": "621124",
    "code": "621124",
    "name": "临洮县",
    "fullname": "临洮县",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621125",
    "areaId": "621125",
    "code": "621125",
    "name": "漳县",
    "fullname": "漳县",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621126",
    "areaId": "621126",
    "code": "621126",
    "name": "岷县",
    "fullname": "岷县",
    "level": 3,
    "parentId": "621100"
  },
  {
    "id": "621201",
    "areaId": "621201",
    "code": "621201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621202",
    "areaId": "621202",
    "code": "621202",
    "name": "武都区",
    "fullname": "武都区",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621221",
    "areaId": "621221",
    "code": "621221",
    "name": "成县",
    "fullname": "成县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621222",
    "areaId": "621222",
    "code": "621222",
    "name": "文县",
    "fullname": "文县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621223",
    "areaId": "621223",
    "code": "621223",
    "name": "宕昌县",
    "fullname": "宕昌县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621224",
    "areaId": "621224",
    "code": "621224",
    "name": "康县",
    "fullname": "康县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621225",
    "areaId": "621225",
    "code": "621225",
    "name": "西和县",
    "fullname": "西和县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621226",
    "areaId": "621226",
    "code": "621226",
    "name": "礼县",
    "fullname": "礼县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621227",
    "areaId": "621227",
    "code": "621227",
    "name": "徽县",
    "fullname": "徽县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "621228",
    "areaId": "621228",
    "code": "621228",
    "name": "两当县",
    "fullname": "两当县",
    "level": 3,
    "parentId": "621200"
  },
  {
    "id": "622901",
    "areaId": "622901",
    "code": "622901",
    "name": "临夏市",
    "fullname": "临夏市",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "622921",
    "areaId": "622921",
    "code": "622921",
    "name": "临夏县",
    "fullname": "临夏县",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "622922",
    "areaId": "622922",
    "code": "622922",
    "name": "康乐县",
    "fullname": "康乐县",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "622923",
    "areaId": "622923",
    "code": "622923",
    "name": "永靖县",
    "fullname": "永靖县",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "622924",
    "areaId": "622924",
    "code": "622924",
    "name": "广河县",
    "fullname": "广河县",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "622925",
    "areaId": "622925",
    "code": "622925",
    "name": "和政县",
    "fullname": "和政县",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "622926",
    "areaId": "622926",
    "code": "622926",
    "name": "东乡族自治县",
    "fullname": "东乡族自治县",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "622927",
    "areaId": "622927",
    "code": "622927",
    "name": "积石山保安族东乡族撒拉族自治县",
    "fullname": "积石山保安族东乡族撒拉族自治县",
    "level": 3,
    "parentId": "622900"
  },
  {
    "id": "623001",
    "areaId": "623001",
    "code": "623001",
    "name": "合作市",
    "fullname": "合作市",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "623021",
    "areaId": "623021",
    "code": "623021",
    "name": "临潭县",
    "fullname": "临潭县",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "623022",
    "areaId": "623022",
    "code": "623022",
    "name": "卓尼县",
    "fullname": "卓尼县",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "623023",
    "areaId": "623023",
    "code": "623023",
    "name": "舟曲县",
    "fullname": "舟曲县",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "623024",
    "areaId": "623024",
    "code": "623024",
    "name": "迭部县",
    "fullname": "迭部县",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "623025",
    "areaId": "623025",
    "code": "623025",
    "name": "玛曲县",
    "fullname": "玛曲县",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "623026",
    "areaId": "623026",
    "code": "623026",
    "name": "碌曲县",
    "fullname": "碌曲县",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "623027",
    "areaId": "623027",
    "code": "623027",
    "name": "夏河县",
    "fullname": "夏河县",
    "level": 3,
    "parentId": "623000"
  },
  {
    "id": "630101",
    "areaId": "630101",
    "code": "630101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630102",
    "areaId": "630102",
    "code": "630102",
    "name": "城东区",
    "fullname": "城东区",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630103",
    "areaId": "630103",
    "code": "630103",
    "name": "城中区",
    "fullname": "城中区",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630104",
    "areaId": "630104",
    "code": "630104",
    "name": "城西区",
    "fullname": "城西区",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630105",
    "areaId": "630105",
    "code": "630105",
    "name": "城北区",
    "fullname": "城北区",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630121",
    "areaId": "630121",
    "code": "630121",
    "name": "大通回族土族自治县",
    "fullname": "大通回族土族自治县",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630122",
    "areaId": "630122",
    "code": "630122",
    "name": "湟中县",
    "fullname": "湟中县",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630123",
    "areaId": "630123",
    "code": "630123",
    "name": "湟源县",
    "fullname": "湟源县",
    "level": 3,
    "parentId": "630100"
  },
  {
    "id": "630202",
    "areaId": "630202",
    "code": "630202",
    "name": "乐都区",
    "fullname": "乐都区",
    "level": 3,
    "parentId": "630200"
  },
  {
    "id": "630203",
    "areaId": "630203",
    "code": "630203",
    "name": "平安区",
    "fullname": "平安区",
    "level": 3,
    "parentId": "630200"
  },
  {
    "id": "630222",
    "areaId": "630222",
    "code": "630222",
    "name": "民和回族土族自治县",
    "fullname": "民和回族土族自治县",
    "level": 3,
    "parentId": "630200"
  },
  {
    "id": "630223",
    "areaId": "630223",
    "code": "630223",
    "name": "互助土族自治县",
    "fullname": "互助土族自治县",
    "level": 3,
    "parentId": "630200"
  },
  {
    "id": "630224",
    "areaId": "630224",
    "code": "630224",
    "name": "化隆回族自治县",
    "fullname": "化隆回族自治县",
    "level": 3,
    "parentId": "630200"
  },
  {
    "id": "630225",
    "areaId": "630225",
    "code": "630225",
    "name": "循化撒拉族自治县",
    "fullname": "循化撒拉族自治县",
    "level": 3,
    "parentId": "630200"
  },
  {
    "id": "632221",
    "areaId": "632221",
    "code": "632221",
    "name": "门源回族自治县",
    "fullname": "门源回族自治县",
    "level": 3,
    "parentId": "632200"
  },
  {
    "id": "632222",
    "areaId": "632222",
    "code": "632222",
    "name": "祁连县",
    "fullname": "祁连县",
    "level": 3,
    "parentId": "632200"
  },
  {
    "id": "632223",
    "areaId": "632223",
    "code": "632223",
    "name": "海晏县",
    "fullname": "海晏县",
    "level": 3,
    "parentId": "632200"
  },
  {
    "id": "632224",
    "areaId": "632224",
    "code": "632224",
    "name": "刚察县",
    "fullname": "刚察县",
    "level": 3,
    "parentId": "632200"
  },
  {
    "id": "632321",
    "areaId": "632321",
    "code": "632321",
    "name": "同仁县",
    "fullname": "同仁县",
    "level": 3,
    "parentId": "632300"
  },
  {
    "id": "632322",
    "areaId": "632322",
    "code": "632322",
    "name": "尖扎县",
    "fullname": "尖扎县",
    "level": 3,
    "parentId": "632300"
  },
  {
    "id": "632323",
    "areaId": "632323",
    "code": "632323",
    "name": "泽库县",
    "fullname": "泽库县",
    "level": 3,
    "parentId": "632300"
  },
  {
    "id": "632324",
    "areaId": "632324",
    "code": "632324",
    "name": "河南蒙古族自治县",
    "fullname": "河南蒙古族自治县",
    "level": 3,
    "parentId": "632300"
  },
  {
    "id": "632521",
    "areaId": "632521",
    "code": "632521",
    "name": "共和县",
    "fullname": "共和县",
    "level": 3,
    "parentId": "632500"
  },
  {
    "id": "632522",
    "areaId": "632522",
    "code": "632522",
    "name": "同德县",
    "fullname": "同德县",
    "level": 3,
    "parentId": "632500"
  },
  {
    "id": "632523",
    "areaId": "632523",
    "code": "632523",
    "name": "贵德县",
    "fullname": "贵德县",
    "level": 3,
    "parentId": "632500"
  },
  {
    "id": "632524",
    "areaId": "632524",
    "code": "632524",
    "name": "兴海县",
    "fullname": "兴海县",
    "level": 3,
    "parentId": "632500"
  },
  {
    "id": "632525",
    "areaId": "632525",
    "code": "632525",
    "name": "贵南县",
    "fullname": "贵南县",
    "level": 3,
    "parentId": "632500"
  },
  {
    "id": "632621",
    "areaId": "632621",
    "code": "632621",
    "name": "玛沁县",
    "fullname": "玛沁县",
    "level": 3,
    "parentId": "632600"
  },
  {
    "id": "632622",
    "areaId": "632622",
    "code": "632622",
    "name": "班玛县",
    "fullname": "班玛县",
    "level": 3,
    "parentId": "632600"
  },
  {
    "id": "632623",
    "areaId": "632623",
    "code": "632623",
    "name": "甘德县",
    "fullname": "甘德县",
    "level": 3,
    "parentId": "632600"
  },
  {
    "id": "632624",
    "areaId": "632624",
    "code": "632624",
    "name": "达日县",
    "fullname": "达日县",
    "level": 3,
    "parentId": "632600"
  },
  {
    "id": "632625",
    "areaId": "632625",
    "code": "632625",
    "name": "久治县",
    "fullname": "久治县",
    "level": 3,
    "parentId": "632600"
  },
  {
    "id": "632626",
    "areaId": "632626",
    "code": "632626",
    "name": "玛多县",
    "fullname": "玛多县",
    "level": 3,
    "parentId": "632600"
  },
  {
    "id": "632701",
    "areaId": "632701",
    "code": "632701",
    "name": "玉树市",
    "fullname": "玉树市",
    "level": 3,
    "parentId": "632700"
  },
  {
    "id": "632722",
    "areaId": "632722",
    "code": "632722",
    "name": "杂多县",
    "fullname": "杂多县",
    "level": 3,
    "parentId": "632700"
  },
  {
    "id": "632723",
    "areaId": "632723",
    "code": "632723",
    "name": "称多县",
    "fullname": "称多县",
    "level": 3,
    "parentId": "632700"
  },
  {
    "id": "632724",
    "areaId": "632724",
    "code": "632724",
    "name": "治多县",
    "fullname": "治多县",
    "level": 3,
    "parentId": "632700"
  },
  {
    "id": "632725",
    "areaId": "632725",
    "code": "632725",
    "name": "囊谦县",
    "fullname": "囊谦县",
    "level": 3,
    "parentId": "632700"
  },
  {
    "id": "632726",
    "areaId": "632726",
    "code": "632726",
    "name": "曲麻莱县",
    "fullname": "曲麻莱县",
    "level": 3,
    "parentId": "632700"
  },
  {
    "id": "632801",
    "areaId": "632801",
    "code": "632801",
    "name": "格尔木市",
    "fullname": "格尔木市",
    "level": 3,
    "parentId": "632800"
  },
  {
    "id": "632802",
    "areaId": "632802",
    "code": "632802",
    "name": "德令哈市",
    "fullname": "德令哈市",
    "level": 3,
    "parentId": "632800"
  },
  {
    "id": "632803",
    "areaId": "632803",
    "code": "632803",
    "name": "茫崖市",
    "fullname": "茫崖市",
    "level": 3,
    "parentId": "632800"
  },
  {
    "id": "632821",
    "areaId": "632821",
    "code": "632821",
    "name": "乌兰县",
    "fullname": "乌兰县",
    "level": 3,
    "parentId": "632800"
  },
  {
    "id": "632822",
    "areaId": "632822",
    "code": "632822",
    "name": "都兰县",
    "fullname": "都兰县",
    "level": 3,
    "parentId": "632800"
  },
  {
    "id": "632823",
    "areaId": "632823",
    "code": "632823",
    "name": "天峻县",
    "fullname": "天峻县",
    "level": 3,
    "parentId": "632800"
  },
  {
    "id": "632857",
    "areaId": "632857",
    "code": "632857",
    "name": "大柴旦行政委员会",
    "fullname": "大柴旦行政委员会",
    "level": 3,
    "parentId": "632800"
  },
  {
    "id": "640101",
    "areaId": "640101",
    "code": "640101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "640100"
  },
  {
    "id": "640104",
    "areaId": "640104",
    "code": "640104",
    "name": "兴庆区",
    "fullname": "兴庆区",
    "level": 3,
    "parentId": "640100"
  },
  {
    "id": "640105",
    "areaId": "640105",
    "code": "640105",
    "name": "西夏区",
    "fullname": "西夏区",
    "level": 3,
    "parentId": "640100"
  },
  {
    "id": "640106",
    "areaId": "640106",
    "code": "640106",
    "name": "金凤区",
    "fullname": "金凤区",
    "level": 3,
    "parentId": "640100"
  },
  {
    "id": "640121",
    "areaId": "640121",
    "code": "640121",
    "name": "永宁县",
    "fullname": "永宁县",
    "level": 3,
    "parentId": "640100"
  },
  {
    "id": "640122",
    "areaId": "640122",
    "code": "640122",
    "name": "贺兰县",
    "fullname": "贺兰县",
    "level": 3,
    "parentId": "640100"
  },
  {
    "id": "640181",
    "areaId": "640181",
    "code": "640181",
    "name": "灵武市",
    "fullname": "灵武市",
    "level": 3,
    "parentId": "640100"
  },
  {
    "id": "640201",
    "areaId": "640201",
    "code": "640201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "640200"
  },
  {
    "id": "640202",
    "areaId": "640202",
    "code": "640202",
    "name": "大武口区",
    "fullname": "大武口区",
    "level": 3,
    "parentId": "640200"
  },
  {
    "id": "640205",
    "areaId": "640205",
    "code": "640205",
    "name": "惠农区",
    "fullname": "惠农区",
    "level": 3,
    "parentId": "640200"
  },
  {
    "id": "640221",
    "areaId": "640221",
    "code": "640221",
    "name": "平罗县",
    "fullname": "平罗县",
    "level": 3,
    "parentId": "640200"
  },
  {
    "id": "640301",
    "areaId": "640301",
    "code": "640301",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "640300"
  },
  {
    "id": "640302",
    "areaId": "640302",
    "code": "640302",
    "name": "利通区",
    "fullname": "利通区",
    "level": 3,
    "parentId": "640300"
  },
  {
    "id": "640303",
    "areaId": "640303",
    "code": "640303",
    "name": "红寺堡区",
    "fullname": "红寺堡区",
    "level": 3,
    "parentId": "640300"
  },
  {
    "id": "640323",
    "areaId": "640323",
    "code": "640323",
    "name": "盐池县",
    "fullname": "盐池县",
    "level": 3,
    "parentId": "640300"
  },
  {
    "id": "640324",
    "areaId": "640324",
    "code": "640324",
    "name": "同心县",
    "fullname": "同心县",
    "level": 3,
    "parentId": "640300"
  },
  {
    "id": "640381",
    "areaId": "640381",
    "code": "640381",
    "name": "青铜峡市",
    "fullname": "青铜峡市",
    "level": 3,
    "parentId": "640300"
  },
  {
    "id": "640401",
    "areaId": "640401",
    "code": "640401",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "640400"
  },
  {
    "id": "640402",
    "areaId": "640402",
    "code": "640402",
    "name": "原州区",
    "fullname": "原州区",
    "level": 3,
    "parentId": "640400"
  },
  {
    "id": "640422",
    "areaId": "640422",
    "code": "640422",
    "name": "西吉县",
    "fullname": "西吉县",
    "level": 3,
    "parentId": "640400"
  },
  {
    "id": "640423",
    "areaId": "640423",
    "code": "640423",
    "name": "隆德县",
    "fullname": "隆德县",
    "level": 3,
    "parentId": "640400"
  },
  {
    "id": "640424",
    "areaId": "640424",
    "code": "640424",
    "name": "泾源县",
    "fullname": "泾源县",
    "level": 3,
    "parentId": "640400"
  },
  {
    "id": "640425",
    "areaId": "640425",
    "code": "640425",
    "name": "彭阳县",
    "fullname": "彭阳县",
    "level": 3,
    "parentId": "640400"
  },
  {
    "id": "640501",
    "areaId": "640501",
    "code": "640501",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "640500"
  },
  {
    "id": "640502",
    "areaId": "640502",
    "code": "640502",
    "name": "沙坡头区",
    "fullname": "沙坡头区",
    "level": 3,
    "parentId": "640500"
  },
  {
    "id": "640521",
    "areaId": "640521",
    "code": "640521",
    "name": "中宁县",
    "fullname": "中宁县",
    "level": 3,
    "parentId": "640500"
  },
  {
    "id": "640522",
    "areaId": "640522",
    "code": "640522",
    "name": "海原县",
    "fullname": "海原县",
    "level": 3,
    "parentId": "640500"
  },
  {
    "id": "650101",
    "areaId": "650101",
    "code": "650101",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650102",
    "areaId": "650102",
    "code": "650102",
    "name": "天山区",
    "fullname": "天山区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650103",
    "areaId": "650103",
    "code": "650103",
    "name": "沙依巴克区",
    "fullname": "沙依巴克区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650104",
    "areaId": "650104",
    "code": "650104",
    "name": "新市区",
    "fullname": "新市区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650105",
    "areaId": "650105",
    "code": "650105",
    "name": "水磨沟区",
    "fullname": "水磨沟区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650106",
    "areaId": "650106",
    "code": "650106",
    "name": "头屯河区",
    "fullname": "头屯河区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650107",
    "areaId": "650107",
    "code": "650107",
    "name": "达坂城区",
    "fullname": "达坂城区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650109",
    "areaId": "650109",
    "code": "650109",
    "name": "米东区",
    "fullname": "米东区",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650121",
    "areaId": "650121",
    "code": "650121",
    "name": "乌鲁木齐县",
    "fullname": "乌鲁木齐县",
    "level": 3,
    "parentId": "650100"
  },
  {
    "id": "650201",
    "areaId": "650201",
    "code": "650201",
    "name": "市辖区",
    "fullname": "市辖区",
    "level": 3,
    "parentId": "650200"
  },
  {
    "id": "650202",
    "areaId": "650202",
    "code": "650202",
    "name": "独山子区",
    "fullname": "独山子区",
    "level": 3,
    "parentId": "650200"
  },
  {
    "id": "650203",
    "areaId": "650203",
    "code": "650203",
    "name": "克拉玛依区",
    "fullname": "克拉玛依区",
    "level": 3,
    "parentId": "650200"
  },
  {
    "id": "650204",
    "areaId": "650204",
    "code": "650204",
    "name": "白碱滩区",
    "fullname": "白碱滩区",
    "level": 3,
    "parentId": "650200"
  },
  {
    "id": "650205",
    "areaId": "650205",
    "code": "650205",
    "name": "乌尔禾区",
    "fullname": "乌尔禾区",
    "level": 3,
    "parentId": "650200"
  },
  {
    "id": "650402",
    "areaId": "650402",
    "code": "650402",
    "name": "高昌区",
    "fullname": "高昌区",
    "level": 3,
    "parentId": "650400"
  },
  {
    "id": "650421",
    "areaId": "650421",
    "code": "650421",
    "name": "鄯善县",
    "fullname": "鄯善县",
    "level": 3,
    "parentId": "650400"
  },
  {
    "id": "650422",
    "areaId": "650422",
    "code": "650422",
    "name": "托克逊县",
    "fullname": "托克逊县",
    "level": 3,
    "parentId": "650400"
  },
  {
    "id": "650502",
    "areaId": "650502",
    "code": "650502",
    "name": "伊州区",
    "fullname": "伊州区",
    "level": 3,
    "parentId": "650500"
  },
  {
    "id": "650521",
    "areaId": "650521",
    "code": "650521",
    "name": "巴里坤哈萨克自治县",
    "fullname": "巴里坤哈萨克自治县",
    "level": 3,
    "parentId": "650500"
  },
  {
    "id": "650522",
    "areaId": "650522",
    "code": "650522",
    "name": "伊吾县",
    "fullname": "伊吾县",
    "level": 3,
    "parentId": "650500"
  },
  {
    "id": "652301",
    "areaId": "652301",
    "code": "652301",
    "name": "昌吉市",
    "fullname": "昌吉市",
    "level": 3,
    "parentId": "652300"
  },
  {
    "id": "652302",
    "areaId": "652302",
    "code": "652302",
    "name": "阜康市",
    "fullname": "阜康市",
    "level": 3,
    "parentId": "652300"
  },
  {
    "id": "652323",
    "areaId": "652323",
    "code": "652323",
    "name": "呼图壁县",
    "fullname": "呼图壁县",
    "level": 3,
    "parentId": "652300"
  },
  {
    "id": "652324",
    "areaId": "652324",
    "code": "652324",
    "name": "玛纳斯县",
    "fullname": "玛纳斯县",
    "level": 3,
    "parentId": "652300"
  },
  {
    "id": "652325",
    "areaId": "652325",
    "code": "652325",
    "name": "奇台县",
    "fullname": "奇台县",
    "level": 3,
    "parentId": "652300"
  },
  {
    "id": "652327",
    "areaId": "652327",
    "code": "652327",
    "name": "吉木萨尔县",
    "fullname": "吉木萨尔县",
    "level": 3,
    "parentId": "652300"
  },
  {
    "id": "652328",
    "areaId": "652328",
    "code": "652328",
    "name": "木垒哈萨克自治县",
    "fullname": "木垒哈萨克自治县",
    "level": 3,
    "parentId": "652300"
  },
  {
    "id": "652701",
    "areaId": "652701",
    "code": "652701",
    "name": "博乐市",
    "fullname": "博乐市",
    "level": 3,
    "parentId": "652700"
  },
  {
    "id": "652702",
    "areaId": "652702",
    "code": "652702",
    "name": "阿拉山口市",
    "fullname": "阿拉山口市",
    "level": 3,
    "parentId": "652700"
  },
  {
    "id": "652722",
    "areaId": "652722",
    "code": "652722",
    "name": "精河县",
    "fullname": "精河县",
    "level": 3,
    "parentId": "652700"
  },
  {
    "id": "652723",
    "areaId": "652723",
    "code": "652723",
    "name": "温泉县",
    "fullname": "温泉县",
    "level": 3,
    "parentId": "652700"
  },
  {
    "id": "652801",
    "areaId": "652801",
    "code": "652801",
    "name": "库尔勒市",
    "fullname": "库尔勒市",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652822",
    "areaId": "652822",
    "code": "652822",
    "name": "轮台县",
    "fullname": "轮台县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652823",
    "areaId": "652823",
    "code": "652823",
    "name": "尉犁县",
    "fullname": "尉犁县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652824",
    "areaId": "652824",
    "code": "652824",
    "name": "若羌县",
    "fullname": "若羌县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652825",
    "areaId": "652825",
    "code": "652825",
    "name": "且末县",
    "fullname": "且末县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652826",
    "areaId": "652826",
    "code": "652826",
    "name": "焉耆回族自治县",
    "fullname": "焉耆回族自治县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652827",
    "areaId": "652827",
    "code": "652827",
    "name": "和静县",
    "fullname": "和静县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652828",
    "areaId": "652828",
    "code": "652828",
    "name": "和硕县",
    "fullname": "和硕县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652829",
    "areaId": "652829",
    "code": "652829",
    "name": "博湖县",
    "fullname": "博湖县",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652871",
    "areaId": "652871",
    "code": "652871",
    "name": "库尔勒经济技术开发区",
    "fullname": "库尔勒经济技术开发区",
    "level": 3,
    "parentId": "652800"
  },
  {
    "id": "652901",
    "areaId": "652901",
    "code": "652901",
    "name": "阿克苏市",
    "fullname": "阿克苏市",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652922",
    "areaId": "652922",
    "code": "652922",
    "name": "温宿县",
    "fullname": "温宿县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652923",
    "areaId": "652923",
    "code": "652923",
    "name": "库车县",
    "fullname": "库车县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652924",
    "areaId": "652924",
    "code": "652924",
    "name": "沙雅县",
    "fullname": "沙雅县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652925",
    "areaId": "652925",
    "code": "652925",
    "name": "新和县",
    "fullname": "新和县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652926",
    "areaId": "652926",
    "code": "652926",
    "name": "拜城县",
    "fullname": "拜城县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652927",
    "areaId": "652927",
    "code": "652927",
    "name": "乌什县",
    "fullname": "乌什县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652928",
    "areaId": "652928",
    "code": "652928",
    "name": "阿瓦提县",
    "fullname": "阿瓦提县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "652929",
    "areaId": "652929",
    "code": "652929",
    "name": "柯坪县",
    "fullname": "柯坪县",
    "level": 3,
    "parentId": "652900"
  },
  {
    "id": "653001",
    "areaId": "653001",
    "code": "653001",
    "name": "阿图什市",
    "fullname": "阿图什市",
    "level": 3,
    "parentId": "653000"
  },
  {
    "id": "653022",
    "areaId": "653022",
    "code": "653022",
    "name": "阿克陶县",
    "fullname": "阿克陶县",
    "level": 3,
    "parentId": "653000"
  },
  {
    "id": "653023",
    "areaId": "653023",
    "code": "653023",
    "name": "阿合奇县",
    "fullname": "阿合奇县",
    "level": 3,
    "parentId": "653000"
  },
  {
    "id": "653024",
    "areaId": "653024",
    "code": "653024",
    "name": "乌恰县",
    "fullname": "乌恰县",
    "level": 3,
    "parentId": "653000"
  },
  {
    "id": "653101",
    "areaId": "653101",
    "code": "653101",
    "name": "喀什市",
    "fullname": "喀什市",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653121",
    "areaId": "653121",
    "code": "653121",
    "name": "疏附县",
    "fullname": "疏附县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653122",
    "areaId": "653122",
    "code": "653122",
    "name": "疏勒县",
    "fullname": "疏勒县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653123",
    "areaId": "653123",
    "code": "653123",
    "name": "英吉沙县",
    "fullname": "英吉沙县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653124",
    "areaId": "653124",
    "code": "653124",
    "name": "泽普县",
    "fullname": "泽普县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653125",
    "areaId": "653125",
    "code": "653125",
    "name": "莎车县",
    "fullname": "莎车县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653126",
    "areaId": "653126",
    "code": "653126",
    "name": "叶城县",
    "fullname": "叶城县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653127",
    "areaId": "653127",
    "code": "653127",
    "name": "麦盖提县",
    "fullname": "麦盖提县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653128",
    "areaId": "653128",
    "code": "653128",
    "name": "岳普湖县",
    "fullname": "岳普湖县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653129",
    "areaId": "653129",
    "code": "653129",
    "name": "伽师县",
    "fullname": "伽师县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653130",
    "areaId": "653130",
    "code": "653130",
    "name": "巴楚县",
    "fullname": "巴楚县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653131",
    "areaId": "653131",
    "code": "653131",
    "name": "塔什库尔干塔吉克自治县",
    "fullname": "塔什库尔干塔吉克自治县",
    "level": 3,
    "parentId": "653100"
  },
  {
    "id": "653201",
    "areaId": "653201",
    "code": "653201",
    "name": "和田市",
    "fullname": "和田市",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "653221",
    "areaId": "653221",
    "code": "653221",
    "name": "和田县",
    "fullname": "和田县",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "653222",
    "areaId": "653222",
    "code": "653222",
    "name": "墨玉县",
    "fullname": "墨玉县",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "653223",
    "areaId": "653223",
    "code": "653223",
    "name": "皮山县",
    "fullname": "皮山县",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "653224",
    "areaId": "653224",
    "code": "653224",
    "name": "洛浦县",
    "fullname": "洛浦县",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "653225",
    "areaId": "653225",
    "code": "653225",
    "name": "策勒县",
    "fullname": "策勒县",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "653226",
    "areaId": "653226",
    "code": "653226",
    "name": "于田县",
    "fullname": "于田县",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "653227",
    "areaId": "653227",
    "code": "653227",
    "name": "民丰县",
    "fullname": "民丰县",
    "level": 3,
    "parentId": "653200"
  },
  {
    "id": "654002",
    "areaId": "654002",
    "code": "654002",
    "name": "伊宁市",
    "fullname": "伊宁市",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654003",
    "areaId": "654003",
    "code": "654003",
    "name": "奎屯市",
    "fullname": "奎屯市",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654004",
    "areaId": "654004",
    "code": "654004",
    "name": "霍尔果斯市",
    "fullname": "霍尔果斯市",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654021",
    "areaId": "654021",
    "code": "654021",
    "name": "伊宁县",
    "fullname": "伊宁县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654022",
    "areaId": "654022",
    "code": "654022",
    "name": "察布查尔锡伯自治县",
    "fullname": "察布查尔锡伯自治县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654023",
    "areaId": "654023",
    "code": "654023",
    "name": "霍城县",
    "fullname": "霍城县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654024",
    "areaId": "654024",
    "code": "654024",
    "name": "巩留县",
    "fullname": "巩留县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654025",
    "areaId": "654025",
    "code": "654025",
    "name": "新源县",
    "fullname": "新源县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654026",
    "areaId": "654026",
    "code": "654026",
    "name": "昭苏县",
    "fullname": "昭苏县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654027",
    "areaId": "654027",
    "code": "654027",
    "name": "特克斯县",
    "fullname": "特克斯县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654028",
    "areaId": "654028",
    "code": "654028",
    "name": "尼勒克县",
    "fullname": "尼勒克县",
    "level": 3,
    "parentId": "654000"
  },
  {
    "id": "654201",
    "areaId": "654201",
    "code": "654201",
    "name": "塔城市",
    "fullname": "塔城市",
    "level": 3,
    "parentId": "654200"
  },
  {
    "id": "654202",
    "areaId": "654202",
    "code": "654202",
    "name": "乌苏市",
    "fullname": "乌苏市",
    "level": 3,
    "parentId": "654200"
  },
  {
    "id": "654221",
    "areaId": "654221",
    "code": "654221",
    "name": "额敏县",
    "fullname": "额敏县",
    "level": 3,
    "parentId": "654200"
  },
  {
    "id": "654223",
    "areaId": "654223",
    "code": "654223",
    "name": "沙湾县",
    "fullname": "沙湾县",
    "level": 3,
    "parentId": "654200"
  },
  {
    "id": "654224",
    "areaId": "654224",
    "code": "654224",
    "name": "托里县",
    "fullname": "托里县",
    "level": 3,
    "parentId": "654200"
  },
  {
    "id": "654225",
    "areaId": "654225",
    "code": "654225",
    "name": "裕民县",
    "fullname": "裕民县",
    "level": 3,
    "parentId": "654200"
  },
  {
    "id": "654226",
    "areaId": "654226",
    "code": "654226",
    "name": "和布克赛尔蒙古自治县",
    "fullname": "和布克赛尔蒙古自治县",
    "level": 3,
    "parentId": "654200"
  },
  {
    "id": "654301",
    "areaId": "654301",
    "code": "654301",
    "name": "阿勒泰市",
    "fullname": "阿勒泰市",
    "level": 3,
    "parentId": "654300"
  },
  {
    "id": "654321",
    "areaId": "654321",
    "code": "654321",
    "name": "布尔津县",
    "fullname": "布尔津县",
    "level": 3,
    "parentId": "654300"
  },
  {
    "id": "654322",
    "areaId": "654322",
    "code": "654322",
    "name": "富蕴县",
    "fullname": "富蕴县",
    "level": 3,
    "parentId": "654300"
  },
  {
    "id": "654323",
    "areaId": "654323",
    "code": "654323",
    "name": "福海县",
    "fullname": "福海县",
    "level": 3,
    "parentId": "654300"
  },
  {
    "id": "654324",
    "areaId": "654324",
    "code": "654324",
    "name": "哈巴河县",
    "fullname": "哈巴河县",
    "level": 3,
    "parentId": "654300"
  },
  {
    "id": "654325",
    "areaId": "654325",
    "code": "654325",
    "name": "青河县",
    "fullname": "青河县",
    "level": 3,
    "parentId": "654300"
  },
  {
    "id": "654326",
    "areaId": "654326",
    "code": "654326",
    "name": "吉木乃县",
    "fullname": "吉木乃县",
    "level": 3,
    "parentId": "654300"
  },
  {
    "id": "659001",
    "areaId": "659001",
    "code": "659001",
    "name": "石河子市",
    "fullname": "石河子市",
    "level": 3,
    "parentId": "659000"
  },
  {
    "id": "659002",
    "areaId": "659002",
    "code": "659002",
    "name": "阿拉尔市",
    "fullname": "阿拉尔市",
    "level": 3,
    "parentId": "659000"
  },
  {
    "id": "659003",
    "areaId": "659003",
    "code": "659003",
    "name": "图木舒克市",
    "fullname": "图木舒克市",
    "level": 3,
    "parentId": "659000"
  },
  {
    "id": "659004",
    "areaId": "659004",
    "code": "659004",
    "name": "五家渠市",
    "fullname": "五家渠市",
    "level": 3,
    "parentId": "659000"
  },
  {
    "id": "659006",
    "areaId": "659006",
    "code": "659006",
    "name": "铁门关市",
    "fullname": "铁门关市",
    "level": 3,
    "parentId": "659000"
  },
  {
    "id": "710101",
    "areaId": "710101",
    "code": "710101",
    "name": "内湖区",
    "fullname": "内湖区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710102",
    "areaId": "710102",
    "code": "710102",
    "name": "南港区",
    "fullname": "南港区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710103",
    "areaId": "710103",
    "code": "710103",
    "name": "中正区",
    "fullname": "中正区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710104",
    "areaId": "710104",
    "code": "710104",
    "name": "松山区",
    "fullname": "松山区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710105",
    "areaId": "710105",
    "code": "710105",
    "name": "信义区",
    "fullname": "信义区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710106",
    "areaId": "710106",
    "code": "710106",
    "name": "大安区",
    "fullname": "大安区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710107",
    "areaId": "710107",
    "code": "710107",
    "name": "中山区",
    "fullname": "中山区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710108",
    "areaId": "710108",
    "code": "710108",
    "name": "文山区",
    "fullname": "文山区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710109",
    "areaId": "710109",
    "code": "710109",
    "name": "大同区",
    "fullname": "大同区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710110",
    "areaId": "710110",
    "code": "710110",
    "name": "万华区",
    "fullname": "万华区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710111",
    "areaId": "710111",
    "code": "710111",
    "name": "士林区",
    "fullname": "士林区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710112",
    "areaId": "710112",
    "code": "710112",
    "name": "北投区",
    "fullname": "北投区",
    "level": 3,
    "parentId": "710100"
  },
  {
    "id": "710201",
    "areaId": "710201",
    "code": "710201",
    "name": "新兴区",
    "fullname": "新兴区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710202",
    "areaId": "710202",
    "code": "710202",
    "name": "前金区",
    "fullname": "前金区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710203",
    "areaId": "710203",
    "code": "710203",
    "name": "芩雅区",
    "fullname": "芩雅区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710204",
    "areaId": "710204",
    "code": "710204",
    "name": "盐埕区",
    "fullname": "盐埕区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710205",
    "areaId": "710205",
    "code": "710205",
    "name": "鼓山区",
    "fullname": "鼓山区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710206",
    "areaId": "710206",
    "code": "710206",
    "name": "旗津区",
    "fullname": "旗津区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710207",
    "areaId": "710207",
    "code": "710207",
    "name": "前镇区",
    "fullname": "前镇区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710208",
    "areaId": "710208",
    "code": "710208",
    "name": "三民区",
    "fullname": "三民区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710209",
    "areaId": "710209",
    "code": "710209",
    "name": "左营区",
    "fullname": "左营区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710210",
    "areaId": "710210",
    "code": "710210",
    "name": "楠梓区",
    "fullname": "楠梓区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710211",
    "areaId": "710211",
    "code": "710211",
    "name": "小港区",
    "fullname": "小港区",
    "level": 3,
    "parentId": "710200"
  },
  {
    "id": "710301",
    "areaId": "710301",
    "code": "710301",
    "name": "仁爱区",
    "fullname": "仁爱区",
    "level": 3,
    "parentId": "710300"
  },
  {
    "id": "710302",
    "areaId": "710302",
    "code": "710302",
    "name": "信义区",
    "fullname": "信义区",
    "level": 3,
    "parentId": "710300"
  },
  {
    "id": "710303",
    "areaId": "710303",
    "code": "710303",
    "name": "中正区",
    "fullname": "中正区",
    "level": 3,
    "parentId": "710300"
  },
  {
    "id": "710304",
    "areaId": "710304",
    "code": "710304",
    "name": "暖暖区",
    "fullname": "暖暖区",
    "level": 3,
    "parentId": "710300"
  },
  {
    "id": "710305",
    "areaId": "710305",
    "code": "710305",
    "name": "安乐区",
    "fullname": "安乐区",
    "level": 3,
    "parentId": "710300"
  },
  {
    "id": "710307",
    "areaId": "710307",
    "code": "710307",
    "name": "七堵区",
    "fullname": "七堵区",
    "level": 3,
    "parentId": "710300"
  },
  {
    "id": "710301",
    "areaId": "710301",
    "code": "710301",
    "name": "中区",
    "fullname": "中区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710302",
    "areaId": "710302",
    "code": "710302",
    "name": "东区",
    "fullname": "东区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710303",
    "areaId": "710303",
    "code": "710303",
    "name": "南区",
    "fullname": "南区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710304",
    "areaId": "710304",
    "code": "710304",
    "name": "西区",
    "fullname": "西区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710305",
    "areaId": "710305",
    "code": "710305",
    "name": "北区",
    "fullname": "北区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710306",
    "areaId": "710306",
    "code": "710306",
    "name": "北屯区",
    "fullname": "北屯区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710307",
    "areaId": "710307",
    "code": "710307",
    "name": "西屯区",
    "fullname": "西屯区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710308",
    "areaId": "710308",
    "code": "710308",
    "name": "南屯区",
    "fullname": "南屯区",
    "level": 3,
    "parentId": "710400"
  },
  {
    "id": "710501",
    "areaId": "710501",
    "code": "710501",
    "name": "中西区",
    "fullname": "中西区",
    "level": 3,
    "parentId": "710500"
  },
  {
    "id": "710502",
    "areaId": "710502",
    "code": "710502",
    "name": "东区",
    "fullname": "东区",
    "level": 3,
    "parentId": "710500"
  },
  {
    "id": "710503",
    "areaId": "710503",
    "code": "710503",
    "name": "南区",
    "fullname": "南区",
    "level": 3,
    "parentId": "710500"
  },
  {
    "id": "710504",
    "areaId": "710504",
    "code": "710504",
    "name": "北区",
    "fullname": "北区",
    "level": 3,
    "parentId": "710500"
  },
  {
    "id": "710505",
    "areaId": "710505",
    "code": "710505",
    "name": "安平区",
    "fullname": "安平区",
    "level": 3,
    "parentId": "710500"
  },
  {
    "id": "710506",
    "areaId": "710506",
    "code": "710506",
    "name": "安南区",
    "fullname": "安南区",
    "level": 3,
    "parentId": "710500"
  },
  {
    "id": "710601",
    "areaId": "710601",
    "code": "710601",
    "name": "东区",
    "fullname": "东区",
    "level": 3,
    "parentId": "710600"
  },
  {
    "id": "710602",
    "areaId": "710602",
    "code": "710602",
    "name": "北区",
    "fullname": "北区",
    "level": 3,
    "parentId": "710600"
  },
  {
    "id": "710603",
    "areaId": "710603",
    "code": "710603",
    "name": "香山区",
    "fullname": "香山区",
    "level": 3,
    "parentId": "710600"
  },
  {
    "id": "710701",
    "areaId": "710701",
    "code": "710701",
    "name": "东区",
    "fullname": "东区",
    "level": 3,
    "parentId": "710700"
  },
  {
    "id": "710702",
    "areaId": "710702",
    "code": "710702",
    "name": "西区",
    "fullname": "西区",
    "level": 3,
    "parentId": "710700"
  }
]

// Mock 处理器函数
function mockGetProvinceList() {
  return createMockResponse(provinces)
}

function mockGetCityList(provinceId: string) {
  const cityList = cities.filter(city => city.parentId === provinceId)
  return createMockResponse(cityList)
}

function mockGetDistrictList(cityId: string) {
  const countyList = counties.filter(county => county.parentId === cityId)
  return createMockResponse(countyList)
}

// 导出 Mock 处理器
export default [
  {
    url: '/sysArea/listByPid/0',
    response: mockGetProvinceList
  },
  {
    url: '/sysArea/listByPid/:pid',
    response: (params: any) => {
      const pid = params.pid
      console.log('Mock area: listByPid called with pid:', pid)
      if (pid === '0') {
        return mockGetProvinceList()
      } else if (provinces.some(p => p.areaId === pid)) {
        return mockGetCityList(pid)
      } else if (cities.some(c => c.areaId === pid)) {
        return mockGetDistrictList(pid)
      } else {
        return createMockResponse([])
      }
    }
  },
  {
    url: '/sysArea/cityList',
    response: (params: any) => {
      const keyword = (params?.keyword || '').toString().trim()
      const filtered = keyword
        ? cities.filter(c => c.name.includes(keyword) || c.fullname.includes(keyword) || c.code.includes(keyword))
        : cities
      return createMockListResponse({ rows: filtered, total: filtered.length })
    }
  }
]

// 导出数据供其他模块使用
export { provinces, cities, counties }
