const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {

  return await db.collection('QueData').where({
    _id: event.id
  }).update({
    data: {
      question: event.question
    }
  })
}