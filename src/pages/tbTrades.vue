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
            <el-form inline label-position="right" label-width="100px">
                <el-form-item label="单号查询：">
                    <el-input
                        placeholder="请输入订单号快捷搜索"
                        icon="search"
                        @keyup.native.enter="search"
                        :on-icon-click="search"
                        v-model="tid">
                    </el-input>
                </el-form-item>
            </el-form>
            <el-tab-pane label="待付款订单" name="WAIT_BUYER_PAY">
                <trades-list
                    :items="WAIT_BUYER_PAY.items"
                    :page-no="WAIT_BUYER_PAY.pageNo"
                    type="tb"
                    @page-change="pageChange"
                    :total-count="WAIT_BUYER_PAY.totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="待发货订单" name="WAIT_SELLER_SEND_GOODS">
                <trades-list
                    :items="WAIT_SELLER_SEND_GOODS.items"
                    :page-no="WAIT_SELLER_SEND_GOODS.pageNo"
                    type="tb"
                    @page-change="pageChange"
                    :total-count="WAIT_SELLER_SEND_GOODS.totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="已发货订单" name="WAIT_BUYER_CONFIRM_GOODS">
                <trades-list
                    :items="WAIT_BUYER_CONFIRM_GOODS.items"
                    :page-no="WAIT_BUYER_CONFIRM_GOODS.pageNo"
                    type="tb"
                    @page-change="pageChange"
                    :total-count="WAIT_BUYER_CONFIRM_GOODS.totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="已成功订单" name="TRADE_FINISHED">
                <trades-list
                    :items="TRADE_FINISHED.items"
                    :page-no="TRADE_FINISHED.pageNo"
                    type="tb"
                    @page-change="pageChange"
                    :total-count="TRADE_FINISHED.totalCount">
                </trades-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {Tabs, TabPane, Form, FormItem, DatePicker, Button, Input, Select, Option, Menu, MenuItem, Row, Col} from 'element-ui'
import tips from 'src/components/common/tips'
import pageHead from 'src/components/common/pageHead'
import tradesList from 'src/components/common/tradesList'
import axios from 'axios'
export default {
    name: 'tbTrades',
    data () {
        return {
            activeTab: 'WAIT_BUYER_PAY',
            activeStatus: '',
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
            tid: '',
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
            }
        }
    },
    created () {
        this.getItems()
    },
    computed: {
        postData () {
            return {
                tid: this.tid,
                status: this.activeTab,
                pageNo: this[this.activeTab].pageNo,
                pageSize: 10,
                fromTag: 1
            }
        }
    },
    methods: {
        getItems () {
            axios.post('/tradeList.post', this.postData)
            .then(res => {
                if (res.data.status === 1) {
                    let data = res.data.data
                    let target = this[this.activeTab]
                    target.items = data.tradeList || []
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
        },
        search () {
            this.getItems()
        }
    },
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [DatePicker.name]: DatePicker,
        [Button.name]: Button,
        [Input.name]: Input,
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [Select.name]: Select,
        [Option.name]: Option,
        [Menu.name]: Menu,
        [MenuItem.name]: MenuItem,
        [Row.name]: Row,
        [Col.name]: Col,
        tips,
        pageHead,
        tradesList
    }
}
</script>
