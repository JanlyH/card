<template>
    <div class="tips-wrap">
        <div class="title"><i class="el-icon-information"></i>{{title}}</div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'tips',
    props: {
        title: {
            type: String,
            default: '温馨提示'
        }
    }
}
</script>

<style lang="scss">
.tips-wrap{
    background-color: #f9fafc;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    .title{
        margin-bottom: 4px;
        i{
            color: #20a0ff;
            margin-right: 4px;
        }
    }
    ul{
        li{
            color: #99a9bf;
            list-style-type: decimal;
            margin-left: 16px;
        }
    }
}
</style>
