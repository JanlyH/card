import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [
        //  淘宝订单
        {
            path: '/card/tbTrades',
            component: r => {
                require.ensure([], () => r(require('src/pages/tbTrades')), 'card')
            }
        },

        //  自定义订单
        {
            path: '/card/customizeTrades',
            component: r => {
                require.ensure([], () => r(require('src/pages/customizeTrades')), 'card')
            }
        }
    ]
})
