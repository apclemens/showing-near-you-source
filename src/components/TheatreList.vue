<template>
        <div id="theatre-list">
            <h2>Theatres</h2>
            <h4 v-show="theatres.length">Click to include/exclude</h4>
            <h4 v-show="!theatres.length && loaded">No theatres found</h4>
            <div v-show="theatres.length" class="theatre-label" id="select-all-label" v-on:click="toggleAll">Select all</div>
            <div v-for="(data, index) in theatres" :key="index">
                <input
                    class="theatre-checkbox"
                    :id="data.id"
                    type="checkbox"
                    :key="data.id"
                    :value="data.id"
                    v-model="checkedTheatres"
                    @change="updateValue"
                >
                <label class="theatre-label" :for="data.id">{{data.name}}</label>
            </div>
        </div>
</template>

<script>
export default {
  name: 'TheatreList',
  data() {
      return {
          checkedTheatres: [],
      }
  },
  props: ['theatres', 'loaded', 'value'],
  methods: {
      toggleAll: function(evt) { // theatre list
          switch (evt.target.innerHTML) {
              case 'Select all':
                  this.checkedTheatres = [];
                  for (var i=0; i<this.theatres.length; i++) {
                      this.checkedTheatres.push(this.theatres[i].id);
                  }
                  evt.target.innerHTML = 'Select none';
                  break;
              case 'Select none':
                  this.checkedTheatres = [];
                  evt.target.innerHTML = 'Select all';
                  break;
          }
          this.updateValue();
      },
      updateValue() {
          this.$emit('input', this.checkedTheatres)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.theatre-checkbox {
    display: none;
}

.theatre-label {
    cursor: pointer;
    color: red;
}
.theatre-checkbox:checked + label {
    color: green;
}

#select-all-label {
    display:inline-block;
    padding-bottom: 10px;
    color: blue;
}
</style>
