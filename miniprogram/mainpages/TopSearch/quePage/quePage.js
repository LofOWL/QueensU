function queDataToDatabase(athis) {
  const db = wx.cloud.database()
  db.collection('QueData').add({
    data: {
      question: athis.data.question,
      up: 0,
      down: 0,
      total: 0
    },
    success: res => {
      athis.setData({
        queUpdate: true,
        question: ""
      })
      console.log("get inside")
      var data = {
        "type" : "queSearch"
      }
      athis.triggerEvent('compclick', data) 
    },
    fail: err => {
      athis.setData({
        queUpdate: true,
        question: ""
      })
    }
  })
}

Component({
  /**
   * Component properties
   */
  properties: {
    quelist: Array
  },

  /**
   * Component initial data
   */
  data: {
    queUpdate: true,
    question: "",
  },

  /**
   * Component methods
   */
  methods: {
    inputQuestion: function (e) {
      this.setData({
        question: e.detail.value
      })
    },
    queSubmit: function () {
      this.setData({
        queUpdate: false
      })
      queDataToDatabase(this)
    }
  }
})
