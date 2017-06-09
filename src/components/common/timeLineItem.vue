<template>
    <li class="time-line-item">
        <div class="time-line-item-dot"></div>
        <div class="time-line-item-line"></div>
        <div class="time-line-item-content">
            <slot></slot>
        </div>
    </li>
</template>

<script>
export default {
    name: 'timeLineItem'
}
</script>

<style lang="scss">
.time-line-item{
    position: relative;
    .time-line-item-dot{
        position: absolute;
        left: 0;
        top: 5px;
        width: 12px;
        height: 12px;
        border-radius: 7px;
        border: 1px solid #20a0ff;
        background-color: #fff;
        z-index: 2;
    }
    &:last-child{
        .time-line-item-line{
            display: none;
        }
    }
    .time-line-item-line{
        position: absolute;
        left: 7px;
        top: 6px;
        height: 100%;
        border-left: 1px solid #e0e6ed;
    }
    .time-line-item-content{
        min-height: 48px;
        padding: 1px 1px 10px 24px;
    }
}
</style>
