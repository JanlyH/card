<template>
    <div class="trades-list">
        <el-form inline label-position="right" label-width="90px">
            <el-row>
                <el-col :span="8" v-if="showStatus">
                    <el-form-item label="订单状态：">
                        <el-select v-model="activeStatus" placeholder="请选择状态" @change="statusChange" popper-class="status-option">
                            <el-option v-for="(item, index) in tradeStatus" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="activeStatus === 4">
                    <el-form-item label="激活时间：" >
                        <el-date-picker
                            v-model="time"
                            type="daterange"
                            @change="timeChange"
                            placeholder="选择时间范围">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单号查询：">
                        <el-input
                            :placeholder="type === 'tb' ? '请输入订单号快捷搜索' : '请输入订单号/买家旺旺/手机号快捷搜索'"
                            icon="search"
                            @keyup.native.enter="search"
                            :on-icon-click="search"
                            v-model="searchContent">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="list" v-if="items.length > 0" v-loading="loading" element-loading-text="拼命加载中">
            <el-checkbox-group v-model="checkList" @change="handleCheckTrade">
                <div class="item" v-for="(item, index) in items">
                    <div class="item-head">
                        <el-row :gutter="12">
                            <el-col :span="7">
                                <el-checkbox :label="item.tid">
                                    <span class="item-id">订单编号：{{item.tid}}</span>
                                </el-checkbox>
                            </el-col>
                            <el-col :span="4" v-if="type === 'tb'">金额：<em>￥{{item.payment}}</em></el-col>
                            <el-col :span="3" v-if="type === 'tb'">
                                <span v-if="item.status === 'WAIT_BUYER_PAY'" class="primary">[待付款]</span>
                                <span v-if="item.status === 'WAIT_SELLER_SEND_GOODS'" class="primary">[待发货]</span>
                                <span v-if="item.status === 'WAIT_BUYER_CONFIRM_GOODS'" class="primary">[已发货]</span>
                                <span v-if="item.status === 'TRADE_FINISHED'" class="success">[已成功]</span>
                            </el-col>
                            <el-col :span="6">
                                买家旺旺：
                                <a target="_blank" class="wangwang" :href="`http://amos.alicdn.com/getcid.aw?v=2&uid=${encodeURI(item.buyerNick)}&site=cntaobao&s=2&groupid=0&charset=utf-8`">
                                    {{item.buyerNick}}
                                    <img border="0" :src="`http://amos.alicdn.com/online.aw?v=2&uid=${encodeURI(item.buyerNick)}&site=cntaobao&s=2&charset=utf-8`">
                                </a>
                            </el-col>
                            <el-col :span="9" v-if="type === 'customize'">联系电话：{{item.receivePhone}}</el-col>
                            <el-col :span="2" v-if="type === 'customize' && statusList[item.tid] && +statusList[item.tid].activeStep === 0">
                                <el-button type="primary" size="small" @click="delOrder(item.tid)">删除订单</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="item-body">
                        <el-row>
                            <el-col :span="12">
                                <div class="orders" v-for="order in item.orders" v-if="type === 'tb'">
                                    <div class="order-pic">
                                        <img :src="order.picPath">
                                    </div>
                                    <div class="order-detailes">
                                        <div class="order-title">
                                            <el-button type="text">{{order.title}}</el-button>
                                        </div>
                                        <el-row>
                                            <el-col :span="8">原价：￥{{order.price}}</el-col>
                                            <el-col :span="8">数量：￥{{order.num}}</el-col>
                                            <el-col :span="8">实付：￥{{order.totalFee}}</el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="detailed-address" v-if="type === 'customize'">
                                    <ul>
                                        <li class="buyer">{{item.receiveName}}</li>
                                        <li class="phone">{{item.receivePhone}}</li>
                                        <li class="address">{{item.receiveAddress}}</li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="trade-steps" :style="{height: (item.orders ? item.orders.length : 1) * 111 + 'px'}">
                                    <el-steps space="25%" :active="statusList[item.tid].activeStep ? statusList[item.tid].activeStep : 1" finish-status="success" v-if="statusList[item.tid]">
                                        <el-step>
                                            <div slot="title" class="step-title">提交预开卡信息</div>
                                            <div slot="description" v-if="statusList[item.tid] && +statusList[item.tid].orderStatus > 0">
                                                <div class="status success">已提交</div>
                                            </div>
                                            <div slot="description" v-else>
                                                <div class="status failed">未提交</div>
                                                <div class="more">
                                                    <el-button type="text" @click="copyLink(item.tid)">复制开卡链接</el-button>
                                                    <el-button type="text" @click="remindUse(item.tid)">提醒买家开卡</el-button>
                                                </div>
                                            </div>
                                        </el-step>
                                        <el-step>
                                            <div slot="title" class="step-title">审核预开卡信息</div>
                                            <div slot="description"  v-if="statusList[item.tid].activeStep > 0">
                                                <div v-if="statusList[item.tid] && +statusList[item.tid].orderStatus > 1 && +statusList[item.tid].orderStatus !== 5">
                                                    <div class="status success">已审核</div>
                                                </div>
                                                <div v-else>
                                                    <div class="status failed">未审核</div>
                                                    <div class="more">
                                                        <el-button type="text" @click="copyLink(item.tid)">复制开卡链接</el-button>
                                                        <el-button type="text" @click="remindUse(item.tid)">提醒买家开卡</el-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-step>
                                        <el-step>
                                            <div slot="title" class="step-title">发卡并跟踪物流</div>
                                            <div slot="description" v-if="statusList[item.tid].activeStep > 1">
                                                <div v-if="statusList[item.tid] && +statusList[item.tid].orderStatus > 2 && +statusList[item.tid].orderStatus !== 5">
                                                    <div class="status success">已发卡</div>
                                                    <el-button type="text" @click="showLogistics(statusList[item.tid].logisticsNo)">查看物流信息</el-button>
                                                    <div class="tips">发货时间：</div>
                                                    <div class="tips" style="width: 180px;">{{statusList[item.tid].logisticsTime}}</div>
                                                </div>
                                                <div v-else>
                                                    <div class="status failed">未发卡</div>
                                                    <div class="more">
                                                        <div class="tips">等待运营商发卡</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-step>
                                        <el-step>
                                            <div slot="title" class="step-title">激活并使用话卡</div>
                                            <div slot="description"  v-if="statusList[item.tid].activeStep > 2">
                                                <div v-if="statusList[item.tid] && +statusList[item.tid].orderStatus === 3">
                                                    <div class="status failed">未激活</div>
                                                    <!--<el-button type="text">短信提醒激活</el-button>-->
                                                </div>
                                                <div v-if="statusList[item.tid] && +statusList[item.tid].orderStatus === 6">
                                                    <div class="status failed">激活失败</div>
                                                    <!--<el-button type="text">短信提醒激活</el-button>-->
                                                </div>
                                                <div v-if="statusList[item.tid] && +statusList[item.tid].orderStatus === 4">
                                                    <div class="status success">已激活</div>
                                                    <!--<div class="more">
                                                        <div class="tips">等待运营商发卡</div>
                                                    </div>-->
                                                </div>
                                            </div>
                                        </el-step>
                                    </el-steps>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-checkbox-group>
            <el-row>
                <el-col :span="12">
                    <el-checkbox v-model="checkAll" @change="handleCheckAll" style="margin-right: 12px;">本页全选</el-checkbox>
                    <el-button type="primary" size="small" @click="remindUse(checkList)">提醒开卡</el-button>
                </el-col>
                <el-col :span="12" v-if="totalCount > 10">
                    <el-pagination
                        @current-change="pageChange"
                        :current-page="pageNo"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
        <div class="not-found" v-if="items.length === 0">暂无数据</div>
        <el-dialog
            title="复制开卡链接"
            :visible.sync="copyDialog"
            size="tiny">
            <el-input v-model="tradeLink"></el-input>
            <span slot="footer">
                <el-button @click="copyDialog = false">取 消</el-button>
                <el-button type="primary" v-clipboard="tradeLink" @success="copySuccess">复 制</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="物流信息"
            :visible.sync="logisticsDialog">
            <time-line>
                <time-line-item v-for="(item, index) in logisticsData" :key="index">
                    <div style="margin-bottom: 4px;">{{item.time}}</div>
                    <div>{{item.content}}</div>
                </time-line-item>
            </time-line>
        </el-dialog>
    </div>
</template>

<script>
import {CheckboxGroup, Checkbox, Form, FormItem, DatePicker, Pagination, Row, Col, Button, Steps, Step, Message, Input, Dialog, Select, Option, Loading} from 'element-ui'
import timeLine from './timeLine'
import timeLineItem from './timeLineItem'
import vueClipboards from 'vue-clipboards'
import Vue from 'vue'
import axios from 'axios'
Vue.use(vueClipboards)
Vue.use(Loading)
export default {
    name: 'ordersList',
    props: {
        pageNo: Number,
        totalCount: Number,
        type: String,
        loading: false,
        items: {
            type: Array,
            default () {
                return []
            }
        },
        showStatus: {
            type: Boolean,
            default: false
        },
        fromTag: Number,
        statusListFromFollow: Object
    },
    data () {
        return {
            time: [],
            searchContent: '',
            logisticsDialog: false,
            checkList: [],
            statusList: {},
            tradeLink: '',
            copyDialog: false,
            activeStatus: 0,
            logisticsData: [],
            tradeStatus: [
                {
                    value: 0,
                    label: '全部'
                },
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
            ]
        }
    },
    computed: {
        tids () {
            return this.items.map(item => {
                return item.tidStr
            })
        },
        checkAll () {
            let count = 0
            this.items.forEach(item => {
                if (this.checkList.indexOf(item.tidStr) > -1) {
                    count += 1
                }
            })
            return this.items.length === count
        }
    },
    methods: {
        //  切换分页
        pageChange (pageNo) {
            this.$emit('page-change', pageNo)
        },

        //  全选发生变化
        handleCheckAll (event) {
            if (event.target.checked) {
                this.checkList = this.items.map(item => item.tid)
            } else {
                this.checkList = []
            }
        },

        //  勾选发生变化
        handleCheckTrade (val) {
            this.checkList = val
        },

        //  删除订单
        delOrder (tid) {
            axios.get('deleteOrder.get', {
                params: {
                    tid: tid
                }
            })
            .then(res => {
                if (res.data.status === 1) {
                    Message.success({
                        showClose: true,
                        message: '删除成功'
                    })
                    this.$emit('del-order')
                } else {
                    Message.error({
                        showClose: true,
                        message: res.data.msg
                    })
                }
            })
        },

        //  复制成功回调
        copySuccess (e) {
            this.copyDialog = false
            Message.success({
                showClose: true,
                message: '复制成功！'
            })
            console.log(e)
        },

        //  复制链接
        copyLink (tid) {
            axios.get('/generateOrderUrl.get', {
                params: {
                    tariffId: 'OPPO01',
                    ywbId: '',
                    tid: tid
                }
            })
            .then(res => {
                if (res.data.status === 1) {
                    this.copyDialog = true
                    this.tradeLink = res.data.data.url
                }
            })
        },

        //  提醒开卡
        remindUse (tid) {
            axios.get('sendOrderMsg.get', {
                params: {
                    tariffId: 'OPPO01',
                    ywbId: '',
                    tid: tid
                }
            })
            .then(res => {
                if (res.data.status === 1) {
                    Message.success({
                        showClose: true,
                        message: '已提醒买家开卡'
                    })
                }
                if (res.data.status === 0) {
                    Message.error({
                        showClose: true,
                        message: '24小时内只能提醒一次'
                    })
                }
                if (res.data.status === -1) {
                    Message.error({
                        showClose: true,
                        message: res.data.msg
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        },

        //  搜索
        search () {
            this.$emit('search', this.searchContent)
        },

        //  状态查询
        statusChange (val) {
            this.$emit('status-change', val)
        },

        //  激活时间查询
        timeChange (val) {
            this.$emit('time-change', val)
        },

        //  查看物流信息
        showLogistics (id) {
            axios.get('/getLoginsticsInfo.get', {
                params: {
                    logisticNo: id
                }
            })
            .then(res => {
                if (+res.data.status === 1) {
                    this.logisticsDialog = true
                    this.logisticsData = res.data.data.map(item => {
                        let time = new Date(+(item.time + '000'))
                        let format = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
                        return {
                            time: format,
                            content: item.desc
                        }
                    })
                } else {
                    Message.err({
                        showClose: true,
                        message: res.data.msg
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    watch: {
        statusListFromFollow (val) {
            if (this.fromTag === 3) {
                this.statusList = val
            }
        },
        tids (val, oldVal) {
            if (this.fromTag !== 3) {
                this.statusList = {}
                //  请求订单流程状态
                axios.post('/getCardOrdersByTids.post', val)
                .then(res => {
                    if (res.data.status === 1) {
                        let data = res.data.data
                        val.forEach((item, index) => {
                            this.$set(this.statusList, item, data[item] ? data[item] : {orderStatus: 0})
                            let status
                            if (data[item] !== undefined) {
                                if (+data[item].orderStatus === 0) {
                                    status = 0
                                } else if (+data[item].orderStatus === 5 || +data[item].orderStatus === 1) {
                                    status = 1
                                } else if (+data[item].orderStatus === 2) {
                                    status = 2
                                } else if (+data[item].orderStatus === 6 || +data[item].orderStatus === 3) {
                                    status = 3
                                } else if (+data[item].orderStatus === 4) {
                                    status = 4
                                } else {
                                    status = 0
                                }
                            } else {
                                status = 0
                            }
                            this.$set(this.statusList[item], 'activeStep', status)
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
        }
    },
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [DatePicker.name]: DatePicker,
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Pagination.name]: Pagination,
        [Row.name]: Row,
        [Col.name]: Col,
        [Button.name]: Button,
        [Steps.name]: Steps,
        [Step.name]: Step,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
        [Dialog.name]: Dialog,
        timeLineItem,
        timeLine
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/common';
.trades-list{
    .el-pagination{
        text-align: right;
    }
    .list{
        .item{
            border: 1px solid $bdc;
            margin-bottom: 16px;
            .wangwang{
                color: $primary;
                text-decoration: none;
                img{
                    vertical-align: middle;
                    margin-left: 4px;
                }
            }
            .item-head{
                box-sizing: border-box;
                padding: 0 12px;
                height: 44px;
                line-height: 44px;
                background-color: $darkWhite;
            }
            .item-body{
                padding: 12px;
            }
            .item-id{
                margin-left: 8px;
                user-select: initial;
            }
            em{
                color: $danger;
            }
            .success{
                color: $success;
            }
            .primary{
                color: $primary;
            }
            .orders{
                float: left;
                padding: 10px 0;
                height: 90px;
                border-bottom: 1px solid $light-bdc;
                &:last-child{
                    border-bottom: 0;
                }
                .order-pic{
                    float: left;
                    width: 90px;
                    margin-right: 16px;
                    img{
                        max-width: 90px;
                        max-height: 90px;
                    }
                }
                .order-detailes{
                    float: left;
                    width: 360px;
                }
                .order-title{
                    height: 60px;
                    button{
                        padding: 0;
                        text-align: left;
                        white-space: pre-wrap;
                        line-height: 24px;
                    }
                }
            }
            .trade-steps{
                display: table;
                width: 100%;
                padding-left: 16px;
                border-left: 1px solid $bdc;
                .step-title{
                    color: #5e6d82;
                }
                .el-step__head{
                    width: 20px;
                    height: 20px;
                }
                .el-step__icon{
                    line-height: 20px;
                    .el-icon-check{
                        font-size: 12px;
                    }
                }
                .el-step__line.is-horizontal{
                    left: 22px;
                }
                .el-steps{
                    display: table-cell;
                    vertical-align: middle;
                }
                button{
                    padding: 0;
                    margin: 0;
                    padding-bottom: 8px;
                }
                .status{
                    margin-bottom: 8px;
                    &.success{
                        color: $success;
                    }
                    &.failed{
                        color: $danger;
                    }
                }
                .tips{
                    color: $secondary;
                }
            }
            .detailed-address{
                li{
                    position: relative;
                    margin-bottom: 10px;
                    height: 20px;
                    line-height: 20px;
                    padding-left: 100px;
                    &:after{
                        position: absolute;
                        left: 0;
                    }
                    &.buyer:after{
                        content: '收货人姓名：';
                    }
                    &.phone:after{
                        content: '收货人电话：';
                    }
                    &.address:after{
                        content: '收货人地址：';
                    }
                }
            }
        }
    }
    .not-found{
        padding: 60px 0;
        text-align: center;
    }
}
</style>
