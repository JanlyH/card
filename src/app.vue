<template>
    <div id="bbtCard">
        <div class="trades-cont">
            <div class="trades-detailes">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style lang="scss">
@import "assets/css/reset.css";
.trades-cont{
    box-sizing: border-box;
    background-color: #fff;
    width: 1000px;
    margin: 0 auto;
    padding: 20px 10px;
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
</style>
