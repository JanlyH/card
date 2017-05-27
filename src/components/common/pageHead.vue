<template>
    <div class="page-head" :class="{'no-border' : !border}">
        <ul class="position">
            <li v-for="item in items">{{item}}</li>
        </ul>
        <slot></slot>
        <slot name="breadcrumb"></slot>
    </div>
</template>

<script>
export default {
    name: 'pageHead',
    props: {
        position: {
            type: String,
            default: ''
        },
        border: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        items () {
            return this.position.split('-')
        }
    }
}
</script>

<style lang="scss">
@import "../../assets/scss/common.scss";
.page-head{
    width: 100%;
    padding-bottom: 12px;
    line-height: 1;
    overflow: hidden;
    margin-bottom: 20px;
    border-bottom: 1px solid $bdc;
    &.no-border{
        border-bottom-color: transparent;
    }
    .position{
        display: inline-block;
        overflow: hidden;
        li{
            position: relative;
            float: left;
            font-size: 16px;
            &+li{
                padding-left: 24px;
                &:after{
                    content: '-';
                    position: absolute;
                    left: 10px;
                    top: 0;
                    color: $secondary;
                }
            }
        }
    }
}
</style>
