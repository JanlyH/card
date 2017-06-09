<template>
    <div class="customize-trades">
        <page-head position="权益中心-自定义发卡"></page-head>
        <tips>
            <ul>
                <li>通过线下渠道、站外渠道或一笔订单中需要发放多张话卡的，请在本页面添加新的话卡订单，填写必要信息后，复制开卡链接给消费者；</li>
                <li>因业务限制，软件内仅提供订单查询服务，暂不支持激活卡后的费用结算体系，如需相关帮助，请联系商业合作负责人。</li>
            </ul>
        </tips>
        <el-tabs v-model="activeTab" @tab-click="tabChange">
            <el-tab-pane label="管理我的订单" name="1">
                <trades-list
                    :items="items"
                    :page-no="pageNo"
                    show-status
                    type="customize"
                    :from-tag="2"
                    :loading="loading"
                    @page-change="pageChange"
                    @del-order="delOrder"
                    @search="search"
                    @status-change="statusChange"
                    @time-change="timeChange"
                    :total-count="totalCount">
                </trades-list>
            </el-tab-pane>
            <el-tab-pane label="添加新订单" name="2">
                <div class="customize-form">
                    <el-form :model="newTrade" :rules="rules" label-width="120px" ref="newTrade">
                        <el-form-item label="买家昵称：">
                            <el-row>
                                <el-col :span="6">
                                    <el-input v-model="newTrade.nick"></el-input>
                                </el-col>
                                <el-col :span="18">
                                    <span class="tips optional">选填，方便您联系</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="收货人姓名：" prop="name">
                            <el-row>
                                <el-col :span="6">
                                    <el-input v-model="newTrade.name"></el-input>
                                </el-col>
                                <el-col :span="18">
                                    <span class="tips require">必填，注册开卡需要</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="收货人电话：" prop="phoneNo">
                            <el-row>
                                <el-col :span="6">
                                    <el-input v-model="newTrade.phoneNo"></el-input>
                                </el-col>
                                <el-col :span="18">
                                    <span class="tips require">必填，注册开卡需要</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="收货地址：">
                            <citys @change="addressChange" ref="address"></citys>
                        </el-form-item>
                        <el-form-item label="收货地址：">
                            <el-tabs type="card">
                                <el-tab-pane label="宝贝团专属卡">
                                    <el-table :data="bbtCard.data" style="width: 100%;" border>
                                        <el-table-column label="基本月租" prop="1" width="80" header-align="center"></el-table-column>
                                        <el-table-column label="入网首月赠送" prop="2" width="100" header-align="center"></el-table-column>
                                        <el-table-column label="视频免流" prop="3" header-align="center"></el-table-column>
                                        <el-table-column label="省内流量" prop="4" width="110" header-align="center"></el-table-column>
                                        <el-table-column label="省内自动递增包" prop="5" header-align="center"></el-table-column>
                                        <el-table-column label="国内流量" prop="6" width="100" header-align="center"></el-table-column>
                                        <el-table-column label="国内通话" prop="7" width="100" header-align="center"></el-table-column>
                                        <el-table-column label="被叫" prop="8" width="80" header-align="center"></el-table-column>
                                    </el-table>
                                    <div class="plan-tips"><i class="el-icon-information"></i>入网首月免月租。可选业务包：</div>
                                    <div class="plan-option">
                                        <el-checkbox v-model="bbtCard.voice">语音包：10元包100分钟省内免费拨打长市话</el-checkbox>
                                    </div>
                                    <div class="plan-option">
                                        <el-checkbox v-model="bbtCard.caller">来电+炫铃包：6元的来电显示+炫铃包</el-checkbox>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="宝贝团日租卡">
                                    <el-table :data="dailyBbtCard.data" style="width: 100%;" border>
                                        <el-table-column label="基本月租" prop="1" width="80" header-align="center"></el-table-column>
                                        <el-table-column label="入网首月赠送" prop="2" width="100" header-align="center"></el-table-column>
                                        <el-table-column label="省内自动递增包" prop="3" header-align="center"></el-table-column>
                                        <el-table-column label="赠送业务" prop="4" header-align="center"></el-table-column>
                                        <el-table-column label="国内流量" prop="5" width="100" header-align="center"></el-table-column>
                                        <el-table-column label="国内通话" prop="6" width="100" header-align="center"></el-table-column>
                                        <el-table-column label="被叫" prop="7" width="100" header-align="center"></el-table-column>
                                    </el-table>
                                    <div class="plan-tips"><i class="el-icon-information"></i>入网首月免月租。可选业务包：</div>
                                    <div class="plan-option">
                                        <el-checkbox v-model="dailyBbtCard.voice">语音包：10元包100分钟省内免费拨打长市话</el-checkbox>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center;">
                        <el-button type="primary" @click="submit">确定并提交</el-button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {Tabs, TabPane, Form, FormItem, DatePicker, Button, Input, Select, Option, Row, Col, Table, TableColumn, Checkbox, Message} from 'element-ui'
import tips from 'src/components/common/tips'
import pageHead from 'src/components/common/pageHead'
import tradesList from 'src/components/common/tradesList'
import axios from 'axios'
import citys from 'src/components/common/citys'
export default {
    name: 'customizeTrades',
    data () {
        return {
            activeTab: '1',
            loading: false,
            //  待付款订单
            items: [],
            pageNo: 1,
            totalCount: 10,
            selection: [],
            searchContent: '',
            orderStatus: 0,
            newTrade: {
                nick: '',
                name: '',
                phoneNo: '',
                address: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
                ],
                phoneNo: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            /^1(3|4|5|7|8)[0-9]\d{8}$/.test(value) ? callback() : callback(new Error('请输入正确的手机号码'))
                        },
                        trigger: 'blur'
                    }
                ]
            },
            bbtCard: {
                data: [{
                    '1': '20元',
                    '2': '1GB省内流量',
                    '3': '腾讯、优酷、PPTV三合一视频免流（40GB流量封顶）',
                    '4': '1GB（可转结）',
                    '5': '5元/500MB（当月有效，不可转结）',
                    '6': '0.27元/MB；60元/GB',
                    '7': '0.19元/分钟',
                    '8': '国内免费'
                }],
                voice: false,
                caller: false
            },
            dailyBbtCard: {
                data: [{
                    '1': '6元',
                    '2': '1GB省内流量',
                    '3': '1元包500M当日省内流量；超出原价递增。（不结转次日使用）',
                    '4': '6元的来电显示+炫铃',
                    '5': '0.27元/MB；60元/GB',
                    '6': '0.2元/分钟',
                    '7': '国内免费'
                }],
                voice: false
            }
        }
    },
    created () {
        this.getItems()
    },
    computed: {
        postData () {
            let data = {
                orderStatus: this.orderStatus === 0 ? '' : this.orderStatus,
                pageNo: this.pageNo,
                pageSize: 10,
                fromTag: 2,
                tid: '',
                buyerNick: '',
                receivePhone: ''
            }
            if (this.searchContent.indexOf('BBT') > -1) {
                data.tid = this.searchContent
            } else if (/^1(3|4|5|7|8)[0-9]\d{8}$/.test(this.searchContent)) {
                data.receivePhone = this.searchContent
            } else {
                data.buyerNick = this.searchContent
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
                    this.items = data.bbtTradeList || []
                    this.totalCount = data.totalCount
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        tabChange (tab) {

        },
        pageChange (pageNo) {
            this[this.activeTab].pageNo = pageNo
            this.getItems()
        },
        search (val) {
            this.searchContent = val
            this.getItems()
        },
        addressChange (address) {
            this.newTrade.address = address
        },
        submit () {
            console.log(this.$refs.address.getValidateResult())
            this.$refs.address.$refs.form.validate(addressValid => {
                this.$refs.newTrade.validate(tradeValid => {
                    if (addressValid && tradeValid) {
                        let postData = {
                            tariffId: 'OPPO123',
                            ywbId: '',
                            receiveAddress: this.newTrade.address,
                            receivePhone: this.newTrade.phoneNo,
                            receiveName: this.newTrade.name,
                            buyerNick: this.newTrade.nick
                        }
                        axios.post('/createOrder.post', postData)
                        .then(res => {
                            if (+res.data.status === 1) {
                                Message.success({
                                    showClose: true,
                                    message: '创建成功'
                                })
                                // this.activeTab = '1'
                                this.getItems()
                            } else {
                                Message.error({
                                    showClose: true,
                                    message: res.data.message
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                })
            })
        },
        delOrder () {
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
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [DatePicker.name]: DatePicker,
        [Button.name]: Button,
        [Input.name]: Input,
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [Select.name]: Select,
        [Option.name]: Option,
        [Row.name]: Row,
        [Col.name]: Col,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Checkbox.name]: Checkbox,
        tips,
        pageHead,
        tradesList,
        citys
    }
}
</script>

<style lang="scss">
@import '../assets/scss/common';
.customize-trades{
    .customize-form{
        .tips{
            margin-left: 20px;
            &.optional{
                color: $secondary;
            }
            &.require{
                color: $danger;
            }
        }
        .el-tabs--border-card{
            box-shadow: none;
        }
        .el-table .cell, .el-table th>div{
            padding-left: 8px;
            padding-right: 8px;
        }
    }
    .plan-tips{
        margin-top: 10px;
        i{
            color: #20a0ff;
            margin-right: 4px;
        }
    }
}
</style>
