import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        //  淘宝订单
        {
            path: '/',
            component: r => {
                require.ensure([], () => r(require('src/pages/tbTrades')))
            }
        },

        //  自定义订单
        {
            path: '/customize',
            component: r => {
                require.ensure([], () => r(require('src/pages/customizeTrades')))
            }
        },

        //  订单跟踪
        {
            path: '/follow',
            component: r => {
                require.ensure([], () => r(require('src/pages/followTrades')))
            }
        }
    ]
})
