<template>
        <div id="removed-movies">
            <h2>Hidden movies</h2>
            <ul>
                <li class="hidden-movie" v-for="(data, index) in removedMovies" :key="index" v-on:click="reAddMovie(data.rootId)">
                    {{ data.title }}
                </li>
            </ul>
        </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
      return {
      }
  },
  props: ['removedMovies'],
  methods: {
      reAddMovie: function(rootId) { // hidden movies
          var index = findWithAttr(this.removedMovies, 'rootId', rootId);
          this.$emit('reAddMovie', index);
      },
  }
}

var findWithAttr = function(array, attr, value) {
    for (var i=0; i<array.length; i++) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hidden-movie {
    cursor: pointer;
}
#removed-movies ul {
    list-style-type: none;
}
</style>
