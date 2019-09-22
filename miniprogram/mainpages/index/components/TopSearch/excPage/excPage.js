// mainpages/TopSearch/excPage/excPage.js
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
    goods: "",
    excType: "出售"
  },

  /**
   * Component methods
   */
  methods: {
    inputGoods: function (e) {
      console.log(e.detail.value)
      this.setData({
        goods: e.detail.value
      })
    },
    excselectType: function (e) {
      console.log(e.detail.value)
      this.setData({
        excType: e.detail.value
      })
      console.log(this.data.excType)
    },
    onFind: function (){
      var data = {
        "type" : "excSearch",
        "goods" : this.data.goods,
        "excType" : this.data.excType
      }
      this.triggerEvent('compclick', data) 
    }
  }
})
