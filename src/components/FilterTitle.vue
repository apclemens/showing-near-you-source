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
#filter-wrapper {
    height: 52px;
}
#filter-wrapper.lg {
    margin-left: 320px;
    width: calc(100% - 320px);
}
#filter-wrapper input {
    width: calc(100% - 16px);
    height:40px;
}
#filter-wrapper.sm input {
    width: calc(100% - 16px);
    margin-bottom: 6px;
}
</style>
