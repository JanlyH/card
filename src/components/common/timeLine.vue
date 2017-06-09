<template>
    <ul class="time-line">
        <slot></slot>
    </ul>
</template>

<script>
export default {
    name: 'timeLine',
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        }
    }
}
</script>
