var loc = ["Kingston", "Toronto", "Montreal", "Waterloo", "Ottawa"]

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getToday() {
  var date = new Date()
  var year = date.getFullYear()
  var endyear = date.getFullYear() + 3
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function getCarTime(athis) {
  var date = new Date()
  var year = date.getFullYear()
  var endyear = date.getFullYear() + 3
  var month = date.getMonth() + 1
  var day = date.getDate()
  console.log("get into getCarTime")
  console.log([year, month, day].map(formatNumber).join('-'))
  athis.setData({
    date: [year, month, day].map(formatNumber).join('-'),
    createDate: [year, month, day].map(formatNumber).join('-'),
    endDate: [endyear, month, day].map(formatNumber).join('-'),
  })
}

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    carlist: [],
    carIndex: 0,
    nowDate: "2019-01-01",
    endDate: "",
    date: "",
    mulloc: [loc, loc],
    mulInex: [0, 0],
    cfrom: "Kingston",
    cto: "Kingston",
    carType: "找车",
  },
  lifetimes: {
    attached: function () {
      getCarTime(this)
    }
  },
  /**
   * Component methods
   */
  methods: {
    // search for the car date
    carselectDate: function (e) {
      this.setData({
        date: e.detail.value
      })
    },
    // search for the car location
    carselectLocation: function (e) {
      this.setData({
        mulIndex: e.detail.value,
        cfrom: loc[e.detail.value[0]],
        cto: loc[e.detail.value[1]]
      })
    },
    // car select type
    carselectType: function (e) {
      this.setData({
        carType: e.detail.value
      })
    },
    onFind: function () {
      var data = {
        "type": "carSearch",
        "carType": this.data.carType,
        "from": this.data.cfrom,
        "to" : this.data.cto,
        "date": this.data.date
      }
      this.triggerEvent('compclick', data)
    }
  }
})
