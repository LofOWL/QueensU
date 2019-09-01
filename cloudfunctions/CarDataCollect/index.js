const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  
  return await db.collection('CarDataCollect').where({
    date: event.date,
    from: event.from,
    to: event.to,
    carType: event.carType
  }).update({
    data: {
      count: event.count
    }
  })
}
