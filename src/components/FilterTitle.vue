<template>
    <div id="filter-wrapper" :class="$mq">
        <input type="text" placeholder="Filter by title..."
            v-model="filter"
            v-on:keyup="updateFilter"
        >
    </div>
</template>

<script>
export default {
    name: 'FilterTitle',
    data() {
        return {
            filter: '',
        }
    },
    methods: {
        updateFilter: function(event) {
            this.$emit('updateFilter', this.filter);
        }
    }
}
</script>

<style scoped>
#filter-wrapper.sm {
    height: 29px;
}
#filter-wrapper input {
    width: calc(100% - 16px);
}
#filter-wrapper.sm input {
    position: fixed;
    top: 0;
}
</style>
