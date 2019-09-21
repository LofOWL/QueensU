// mainpages/PageCards/carPage/carPage.js
Component({
  /**
   * Component properties
   */
  properties: {
    carlist: Array

  },

  /**
   * Component initial data
   */
  data: {
    carlist: []
  },
  lifetimes: {
    attached: function () {
      this.setData({
        carlist: this.properties.carlist
      })
    }
  },
  /**
   * Component methods
   */
  methods: {

  }
})
