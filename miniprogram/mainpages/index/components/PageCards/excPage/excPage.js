// mainpages/PageCards/excPage/excPage.js
Component({
  /**
   * Component properties
   */
  properties: {
    exclist: Array
  },

  /**
   * Component initial data
   */
  data: {
    exclist: []
  },
  lifetimes: {
    attached: function () {
      this.setData({
        exclist: this.properties.exclist
      })
    }
  },
  /**
   * Component methods
   */
  methods: {

  }
})
