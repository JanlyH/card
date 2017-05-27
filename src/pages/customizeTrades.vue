<template>
    <div class="customize-trades">
        <page-head position="权益中心-宝贝团话卡合作"></page-head>
        <tips>
            <ul>
                <li>通过线下渠道、站外渠道或一笔订单中需要发放多张话卡的，请在本页面添加新的话卡订单，填写必要信息后，复制开卡链接给消费者；</li>
                <li>因业务限制，软件内仅提供订单查询服务，暂不支持激活卡后的费用结算体系，如需相关帮助，请联系商业合作负责人。</li>
            </ul>
        </tips>
        <el-tabs v-model="activeTab" @tab-click="tabChange">
            <el-form inline label-position="right" label-width="100px" v-if="activeTab === '1'">
                <el-form-item label="订单状态：">
                    <el-select v-model="activeStatus" placeholder="请选择状态">
                        <el-option v-for="(item, index) in tradeStatus" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="激活失败：" v-if="activeStatus === 4">
                    <el-date-picker
                        v-model="time"
                        type="datetimerange"
                        placeholder="选择时间范围">
                    </el-date-picker>
                </el-form-item>
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
            <el-tab-pane label="管理我的订单" name="1">
                <trades-list
                    :items="items"
                    :page-no="pageNo"
                    type="customize"
                    @page-change="pageChange"
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
                            <citys :province="newTrade.address.province" :city="newTrade.address.city" :detail="newTrade.address.detail" @change="addressChange"></citys>
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
                        <el-button type="primary">确定并提交</el-button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {Tabs, TabPane, Form, FormItem, DatePicker, Button, Input, Select, Option, Menu, MenuItem, Row, Col, Table, TableColumn, Checkbox} from 'element-ui'
import tips from 'src/components/common/tips'
import pageHead from 'src/components/common/pageHead'
import tradesList from 'src/components/common/tradesList'
import axios from 'axios'
import citys from 'src/components/common/citys'
export default {
    name: 'customizeTrades',
    data () {
        return {
            activeTab: '2',
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
            items: [],
            pageNo: 1,
            totalCount: 10,
            selection: [],
            newTrade: {
                nick: '',
                name: '',
                phoneNo: '',
                address: {
                    province: '',
                    city: '',
                    detail: ''
                }
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
            return {
                tid: this.tid,
                pageNo: this.pageNo,
                pageSize: 10,
                fromTag: 2
            }
        }
    },
    methods: {
        getItems () {
            axios.post('/tradeList.post', this.postData)
            .then(res => {
                if (res.data.status === 1) {
                    let data = res.data.data
                    this.items = data.tradeList || []
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
        },
        search () {
            this.getItems()
        },
        addressChange (val) {
            console.log(val)
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
