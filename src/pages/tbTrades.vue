<template>
    <div class="tb-trades">
        <page-head position="权益中心-宝贝团话卡合作"></page-head>
        <tips>
            <ul>
                <li>您在淘宝生成的订单，如果需要给用户发放话卡，请在本页面搜索订单并选择套餐，然后复制开卡链接给消费者去开卡；</li>
                <li>因业务限制，一笔订单只能关联一张电话卡的开卡信息；如需给一笔订单发放多张电话卡，请手动录入剩余开卡信息；</li>
                <li>因业务限制，软件内仅提供查询服务，暂不支持激活卡后的费用结算体系，如需相关帮助，请联系商业合作负责人。</li>
            </ul>
        </tips>
        <el-tabs v-model="activeTab" @tab-click="tabChange">
            <el-tab-pane label="待付款订单" name="WAIT_BUYER_PAY">
                <trades-list
                    :items="WAIT_BUYER_PAY.items"
                    :page-no="WAIT_BUYER_PAY.pageNo"
                    type="tb"
                    :from-tag="1"
                    :loading="loading"
                    @page-change="pageChange"
                    @search="search"
                    :total-count="WAIT_BUYER_PAY.totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="待发货订单" name="WAIT_SELLER_SEND_GOODS">
                <trades-list
                    :items="WAIT_SELLER_SEND_GOODS.items"
                    :page-no="WAIT_SELLER_SEND_GOODS.pageNo"
                    type="tb"
                    :from-tag="1"
                    :loading="loading"
                    @page-change="pageChange"
                    @search="search"
                    :total-count="WAIT_SELLER_SEND_GOODS.totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="已发货订单" name="WAIT_BUYER_CONFIRM_GOODS">
                <trades-list
                    :items="WAIT_BUYER_CONFIRM_GOODS.items"
                    :page-no="WAIT_BUYER_CONFIRM_GOODS.pageNo"
                    type="tb"
                    :from-tag="1"
                    :loading="loading"
                    @page-change="pageChange"
                    @search="search"
                    :total-count="WAIT_BUYER_CONFIRM_GOODS.totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="已成功订单" name="TRADE_FINISHED">
                <trades-list
                    :items="TRADE_FINISHED.items"
                    :page-no="TRADE_FINISHED.pageNo"
                    type="tb"
                    :from-tag="1"
                    :loading="loading"
                    @page-change="pageChange"
                    @search="search"
                    :total-count="TRADE_FINISHED.totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="话卡跟踪" name="TRADE_FOLLOW">
                <trades-list
                    :items="TRADE_FOLLOW.items"
                    :page-no="TRADE_FOLLOW.pageNo"
                    type="tb"
                    show-status
                    :from-tag="3"
                    :loading="loading"
                    :status-list-from-follow="statusList"
                    @page-change="pageChange"
                    @search="search"
                    @time-change="timeChange"
                    @status-change="statusChange"
                    :total-count="TRADE_FOLLOW.totalCount">
                </trades-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {Tabs, TabPane} from 'element-ui'
import tips from 'src/components/common/tips'
import pageHead from 'src/components/common/pageHead'
import tradesList from 'src/components/common/tradesList'
import axios from 'axios'
export default {
    name: 'tbTrades',
    data () {
        return {
            activeTab: 'WAIT_BUYER_PAY',
            loading: false,
            orderStatus: '',
            statusList: {},
            tradeStatus: [
                {
                    value: 1,
                    label: '开卡信息已提交'
                }, {
                    value: 2,
                    label: '开卡信息审核通过'
                }, {
                    value: 5,
                    label: '开卡信息审核失败'
                }, {
                    value: 3,
                    label: '话卡已发货'
                }, {
                    value: 4,
                    label: '话卡已激活'
                }, {
                    value: 6,
                    label: '话卡激活失败'
                }
            ],
            //  时间范围
            time: [],
            //  搜索内容
            searchContent: '',
            //  待付款订单
            WAIT_BUYER_PAY: {
                items: [],
                pageNo: 1,
                totalCount: 10,
                selection: []
            },
            //  待发货订单
            WAIT_SELLER_SEND_GOODS: {
                items: [],
                pageNo: 1,
                totalCount: 10,
                selection: []
            },
            //  已发货订单
            WAIT_BUYER_CONFIRM_GOODS: {
                items: [],
                pageNo: 1,
                totalCount: 10,
                selection: []
            },
            //  已成功订单
            TRADE_FINISHED: {
                items: [],
                pageNo: 1,
                totalCount: 10,
                selection: []
            },
            //  话卡跟踪
            TRADE_FOLLOW: {
                items: [],
                pageNo: 1,
                totalCount: 10,
                selection: []
            }
        }
    },
    created () {
        this.getItems()
    },
    computed: {
        postData () {
            let data = {
                status: this.activeTab,
                pageNo: this[this.activeTab].pageNo,
                pageSize: 10,
                fromTag: 1,
                buyerNick: '',
                receivePhone: '',
                tid: this.searchContent
            }
            if (this.activeTab === 'TRADE_FOLLOW') {
                data.status = ''
                data.fromTag = 3
                data.orderStatus = this.orderStatus === 0 ? '' : this.orderStatus
                if (this.orderStatus === 4) {
                    data.enabledStartTime = this.time[0] || ''
                    data.enabledEndTime = this.time[1] || ''
                }
            }
            return data
        }
    },
    methods: {
        getItems () {
            this.loading = true
            axios.post('/tradeList.post', this.postData)
            .then(res => {
                if (res.data.status === 1) {
                    this.loading = false
                    let data = res.data.data
                    let target = this[this.activeTab]
                    let list = data.tradeList
                    if (this.activeTab === 'TRADE_FOLLOW') {
                        list.forEach((item, index) => {
                            let bbtTrade = data.bbtTradeList[index]
                            this.$set(this.statusList, bbtTrade.tid, bbtTrade || {orderStatus: 0})
                            let status
                            if (+bbtTrade.orderStatus === 0) {
                                status = 0
                            } else if (+bbtTrade.orderStatus === 5 || +bbtTrade.orderStatus === 1) {
                                status = 1
                            } else if (+bbtTrade.orderStatus === 2) {
                                status = 2
                            } else if (+bbtTrade.orderStatus === 6 || +bbtTrade.orderStatus === 3) {
                                status = 3
                            } else if (+bbtTrade.orderStatus === 4) {
                                status = 4
                            } else {
                                status = 0
                            }
                            this.$set(this.statusList[bbtTrade.tid], 'activeStep', status)
                        })
                    }
                    target.items = list || []
                    target.totalCount = data.totalCount
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        tabChange (tab) {
            if (this[tab.name].items.length === 0) {
                this.getItems()
            }
        },
        pageChange (pageNo) {
            this[this.activeTab].pageNo = pageNo
            this.getItems()
        },
        search (val) {
            this.searchContent = val
            this.getItems()
        },
        timeChange (val) {
            this.time = val.split(' - ')
            this.getItems()
        },
        statusChange (val) {
            this.orderStatus = val
            this.getItems()
        }
    },
    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        tips,
        pageHead,
        tradesList
    }
}
</script>
