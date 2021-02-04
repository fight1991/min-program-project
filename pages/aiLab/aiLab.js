// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        winWidth: 0,
        winHeight: 0,
        currentTab: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        let that = this;

        /**
         * 获取系统信息
         */
        wx.getSystemInfo({

            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }

        });
    },
    bindChange: function (e) {

        let that = this;
        that.setData({currentTab: e.detail.current});

    },
    switchNav: function (e) {

        let that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})