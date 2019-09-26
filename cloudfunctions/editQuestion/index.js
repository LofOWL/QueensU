const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {

  return await db.collection(event.database).where({
    _id: event.id
  }).update({
    data: {
      up: event.up,
      down: event.down,
      total: event.total
    }
  })
}