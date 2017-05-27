<template>
    <div id="app">
        <div class="trades-cont">
            <div class="menu">
                <el-menu default-active="/customize" router>
                    <el-menu-item index="/">淘宝订单关联</el-menu-item>
                    <el-menu-item index="/customize">自定义发卡</el-menu-item>
                    <el-menu-item index="/follow">话卡跟踪激活</el-menu-item>
                </el-menu>
            </div>
            <div class="trades-detailes">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import {Menu, MenuItem, Row, Col} from 'element-ui'
export default {
    name: 'app',
    components: {
        [Menu.name]: Menu,
        [MenuItem.name]: MenuItem,
        [Row.name]: Row,
        [Col.name]: Col
    }
}
</script>

<style lang="scss">
@import "assets/css/reset.css";
.trades-cont{
    width: 1200px;
    margin: 0 auto;
    padding: 20px 0;
    &:after, &:before{
        content: '';
        display: table;
    }
    &:after{
        content: '';
        clear: both;
    }
    .menu{
        float: left;
        width: 160px;
        margin-right: 40px;
        .el-menu{
            min-height: 500px;
        }
    }
}
.trades-detailes{
    box-sizing: border-box;
    float: left;
    width: 1000px;
}
</style>
