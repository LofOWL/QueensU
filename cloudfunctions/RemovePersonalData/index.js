const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {

  return await db.collection(event.name).where({
    _openid: event.openid,
    _id: event.id 
  }).update({
    data: {
      count: event.count
    }
  })
}