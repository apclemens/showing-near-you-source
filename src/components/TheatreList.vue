<template>
    <div id="all-settings" :class="$mq">
        <div id="theatre-list" :class="$mq">
            <h2>Theatres</h2>
            <h4 v-show="theatres.length">Click to include/exclude</h4>
            <h4 v-show="!theatres.length && loaded">No theatres found</h4>
            <div v-show="theatres.length" class="theatre-label" id="select-all-label" v-on:click="toggleAll">Select none</div>
            <div id="actual-list">
            <div class="theatre" :class="$mq" v-for="(data, index) in theatres" :key="index">
                <input
                    class="theatre-checkbox"
                    :class="$mq"
                    :id="data.id"
                    type="checkbox"
                    :key="data.id"
                    :value="data.id"
                    v-model="uncheckedTheatres"
                    @change="updateValue"
                >
                <label class="theatre-label" :class="$mq" :for="data.id">{{data.name}}</label>
            </div>
            </div>
        </div>
        <button id="theatre-collapse" v-if="$mq === 'sm'" v-on:click="collapse">Theatre List</button>
    </div>
</template>

<script>
export default {
  name: 'TheatreList',
  data() {
      return {
          uncheckedTheatres: [],
      }
  },
  props: ['theatres', 'loaded', 'value'],
  methods: {
      toggleAll: function(evt) { // theatre list
          switch (evt.target.innerHTML) {
              case 'Select none':
                  this.uncheckedTheatres = [];
                  for (var i=0; i<this.theatres.length; i++) {
                      this.uncheckedTheatres.push(this.theatres[i].id);
                  }
                  evt.target.innerHTML = 'Select all';
                  break;
              case 'Select all':
                  this.uncheckedTheatres = [];
                  evt.target.innerHTML = 'Select none';
                  break;
          }
          this.updateValue();
      },
      updateValue() {
          this.$emit('input', this.uncheckedTheatres)
      },
      collapse: function() {
          if (this.$mq !== 'sm') return;
          var list = document.getElementById('theatre-list');
          var button = document.getElementById('theatre-collapse');
          if (list.style.maxHeight === '0px') { //collapse
              list.style.maxHeight = list.scrollHeight + 'px';
          } else { //expand
              list.style.maxHeight = '0px';
          }
          button.classList.toggle('expanded');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#theatre-list.lg {
    max-height: none !important;
}
#theatre-list.sm {
    overflow: hidden;
    max-height: 1000px;
    transition: max-height 0.2s ease-out;
}
#theatre-list.sm #actual-list {
    max-height:50vh;
    overflow-y: scroll;
    overflow-x: hidden;
}
.theatre.sm {
    border: 1px black dotted;
}
.theatre-checkbox {
    display: none;
}

.theatre-label {
    cursor: pointer;
    color: green;
}
.theatre-label.sm {
    width: 100%;
    display: block;
    padding: 7px;
}
.theatre-checkbox:checked + label {
    color: red;
}
.theatre-checkbox.sm + label {
    background-color: rgba(0,255,0,.5);
}
.theatre-checkbox.sm:checked + label {
    background-color: transparent;
}

#select-all-label {
    display:inline-block;
    padding-bottom: 10px;
    color: blue;
}
#theatre-collapse {
    width: 100%;
}
#theatre-collapse:before {
    content: url('https://i.stack.imgur.com/1WdEk.png');
    left: 33%;
    position: absolute;
}
#theatre-collapse:after {
    content: url('https://i.stack.imgur.com/1WdEk.png');
    right: 33%;
    position: absolute;
}
#theatre-collapse.expanded:before {
    content: url('https://i.stack.imgur.com/r6OD6.png');
    left: 33%;
    position: absolute;
}
#theatre-collapse.expanded:after {
    content: url('https://i.stack.imgur.com/r6OD6.png');
    right: 33%;
    position: absolute;
}
</style>
