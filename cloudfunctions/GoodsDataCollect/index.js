const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {

  return await db.collection('GoodsDataCollect').where({
    goods: event.goods,
    excType: event.excType
  }).update({
    data: {
      count: event.count
    }
  })
}
