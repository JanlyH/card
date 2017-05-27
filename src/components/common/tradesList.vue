<template>
    <div class="trades-list">
        <div class="list">
            <el-checkbox-group v-model="checkList">
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
                            <el-col :span="9" v-if="type === 'customize'">联系电话：</el-col>
                            <el-col :span="2" v-if="type === 'customize'">
                                <el-button type="primary" size="small">删除订单</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="item-body">
                        <el-row>
                            <el-col :span="12">
                                <div class="orders" v-for="order in item.orders">
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
                            </el-col>
                            <el-col :span="12">
                                <div class="trade-steps" :style="{height: item.orders.length * 100 + 'px'}">
                                    <el-steps space="25%" :active="statusList[item.tid].activeStep ? statusList[item.tid].activeStep : 1" finish-status="success" v-if="statusList[item.tid]">
                                        <el-step>
                                            <div slot="title" class="step-title">提交预开卡信息</div>
                                            <div slot="description" v-if="statusList[item.tid] && +statusList[item.tid].orderStatus > 0">
                                                <div class="status success">已提交</div>
                                            </div>
                                            <div slot="description" v-else>
                                                <div class="status failed">未提交</div>
                                                <div class="more">
                                                    <el-button type="text">复制开卡链接</el-button>
                                                    <el-button type="text">提醒买家开卡</el-button>
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
                                                        <el-button type="text">复制开卡链接</el-button>
                                                        <el-button type="text">提醒买家开卡</el-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-step>
                                        <el-step>
                                            <div slot="title" class="step-title">发卡并跟踪物流</div>
                                            <div slot="description" v-if="statusList[item.tid].activeStep > 1">
                                                <div v-if="statusList[item.tid] && +statusList[item.tid].orderStatus > 2 && +statusList[item.tid].orderStatus !== 5">
                                                    <div class="status success">已发卡</div>
                                                    <el-button type="text">查看物流信息</el-button>
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
                                                    <el-button type="text">短信提醒激活</el-button>
                                                </div>
                                                <div v-if="statusList[item.tid] && +statusList[item.tid].orderStatus === 6">
                                                    <div class="status failed">激活失败</div>
                                                    <el-button type="text">短信提醒激活</el-button>
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
                    <el-button type="primary" size="small">提醒开卡</el-button>
                    <el-button type="primary" size="small">提醒激活</el-button>
                </el-col>
                <el-col :span="12" v-if="totalCount > 10">
                    <el-pagination
                        @current-change="pageChange"
                        :current-page.sync="pageNo"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
        <div class="tips">暂无数据</div>
    </div>
</template>

<script>
import {CheckboxGroup, Checkbox, Pagination, Row, Col, Button, Steps, Step} from 'element-ui'
import axios from 'axios'
export default {
    name: 'ordersList',
    props: {
        pageNo: Number,
        totalCount: Number,
        type: String,
        items: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            time: [],
            tid: '',
            checkList: [],
            statusList: {}
        }
    },
    computed: {
        tids () {
            return this.items.map(item => {
                return item.tid
            })
        }
    },
    created () {

    },
    methods: {
        pageChange (pageNo) {
            this.$emit('page-change', pageNo)
        },
        test () {
            axios.post('/getCardOrdersByTids.post', [22649531295156170])
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    watch: {
        tids (val, oldVal) {
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
    },
    components: {
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Pagination.name]: Pagination,
        [Row.name]: Row,
        [Col.name]: Col,
        [Button.name]: Button,
        [Steps.name]: Steps,
        [Step.name]: Step
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
                padding: 5px 0;
                height: 90px;
                .order-pic{
                    float: left;
                    width: 90px;
                    margin-right: 16px;
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
        }
    }
}
</style>
