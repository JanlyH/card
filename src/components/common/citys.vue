<template>
    <el-form :model='form' :rules='rules' ref='form' label-position='top'>
        <el-row class='address'>
            <el-col :span='4'>
                <el-form-item prop='province'>
                    <el-select v-model='form.province' placeholder='请选择输入省' @change='proChange'>
                        <el-option v-for='item in provinces' :key='item.value' :value='item.value'>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='4'>
                <el-form-item prop='city'>
                    <el-select v-model='form.city' placeholder='请选择输入市' @change='cityChange'>
                        <el-option v-for='item in citys' :key='item.value' :value='item.value'>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='4'>
                <el-form-item prop='city'>
                    <el-select v-model='form.county' placeholder='请选择输入市' @change='countyChange'>
                        <el-option v-for='item in county' :key='item' :value='item'>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item prop='detail'>
                    <el-input placeholder='请填写详细地址' :number='true' v-model='form.detail'>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
import {Form, FormItem, Row, Col, Select, Option, Input} from 'element-ui'
import citys from 'src/assets/js/citys'
function formatData (data) {
    var result = []
    for (var key in data) {
        result.push({
            value: key
        })
    }
    return result
}
export default {
    name: 'address',
    props: ['province', 'city', 'detail'],
    data () {
        return {
            rules: {
                province: [{ required: true, message: '请选择省份', trigger: 'change' }],
                city: [{ required: true, message: '请选择城市', trigger: 'change' }],
                county: [{ required: true, message: '请选择悬/区', trigger: 'change' }],
                detail: [{ required: true, message: '请填写详细地址', trigger: 'change' }]
            },
            form: {
                province: this.province,
                city: this.city,
                county: this.county,
                detail: this.detail
            },
            provinces: formatData(citys),
            county: []
        }
    },
    computed: {
        citys () {
            return formatData(citys[this.form.province])
        }
    },
    methods: {
        proChange (val, oldVal) {
            if (oldVal) {
                this.form.city = ''
                this.form.detail = ''
            }
            var data = formatData(citys[this.form.province])
            for (var i = 0; i < data.length; i++) {
                this.$set(this.citys, i, data[i])
            }
            this.cityChange(this.citys[0].value)
            this.form.city = this.citys[0].value
        },
        cityChange (val, oldVal) {
            this.county = citys[this.form.province][val]
            this.form.county = this.county[0]
        },
        detailChange (val) {
            console.log(val)
        },
        countyChange (val) {
            this.$emit('change', this.form)
        },
        getValidateResult () {
            return this.$refs.form.validate(valid => {
                return valid
            })
        }
    },
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Row.name]: Row,
        [Col.name]: Col,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input
    }
}
</script>

<style lang="scss">
.address {
    .el-col{
        padding-right: 12px;
        &:last-child{
            padding-right: 0;
        }
    }
}
</style>
