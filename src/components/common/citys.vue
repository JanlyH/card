<template>
    <el-form :model='form' :rules='rules' ref='form' label-position='top'>
        <el-row class='address'>
            <el-col :span='4'>
                <el-form-item prop='province.name'>
                    <el-select v-model='form.province.name' placeholder='请选择省' @change='proChange'>
                        <el-option v-for='item in provinces' :key='item.code' :value='item.name'>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='4'>
                <el-form-item prop='city.name'>
                    <el-select v-model='form.city.name' placeholder='请选择市' @change='cityChange'>
                        <el-option v-for='item in citys' :key='item.code' :value='item.name'>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='4'>
                <el-form-item prop='area.name'>
                    <el-select v-model='form.area.name' placeholder='请选择县/区' @change='areaChange'>
                        <el-option v-for='item in areas' :key='item.code' :value='item.name'>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item prop='detail'>
                    <el-input placeholder='请填写详细地址' :number='true' v-model='form.detail' @blur="detailChange">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
import {Form, FormItem, Row, Col, Select, Option, Input} from 'element-ui'
import citys from 'src/assets/js/citys.json'
export default {
    name: 'address',
    data () {
        return {
            rules: {
                province: [{ required: true, message: '请选择省份', trigger: 'change' }],
                city: [{ required: true, message: '请选择城市', trigger: 'change' }],
                area: [{ required: true, message: '请选择悬/区', trigger: 'change' }],
                detail: [{ required: true, message: '请填写详细地址', trigger: 'change' }]
            },
            form: {
                province: {
                    code: '',
                    name: ''
                },
                city: {
                    code: '',
                    name: ''
                },
                area: {
                    code: '',
                    name: ''
                },
                detail: ''
            },
            provinces: citys,
            citys: [],
            areas: []
        }
    },
    computed: {
        address () {
            return `${this.form.province.name}${this.form.city.name}${this.form.area.name}${this.form.detail}`
        }
    },
    methods: {
        proChange (val) {
            let activeProvince = citys.filter(item => {
                return item.name === val
            })[0]
            this.citys = activeProvince.children
            this.form.province.code = activeProvince.code
            this.form.province.name = activeProvince.name
            this.form.city.code = this.citys[0].code
            this.form.city.name = this.citys[0].name
            this.form.area.code = this.citys[0].children[0].code
            this.form.area.name = this.citys[0].children[0].name
            this.$emit('change', this.address)
        },
        cityChange (val) {
            this.areas = this.citys.filter(item => {
                return item.name === val
            })[0].children
            this.form.area.code = this.areas[0].code
            this.form.area.name = this.areas[0].name
            this.$emit('change', this.address)
        },
        detailChange () {
            this.$emit('change', this.address)
            console.log(this.address)
        },
        areaChange (val) {
            this.$emit('change', this.address)
            console.log(this.address)
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
