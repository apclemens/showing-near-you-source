<template>
  <div id="app">
    <Showtimes/>
  </div>
</template>

<script>
import Showtimes from './components/Showtimes.vue'

export default {
  name: 'app',
  components: {
    Showtimes
  }
}

// helper functions

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Anton|IBM+Plex+Mono|Muli');

body, html {
    font-family: 'Muli', sans-serif;
}

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

h2, h4 {
    font-family: 'Acme', sans-serif;
}
h2 {
    border-top: 2px solid;
    padding: 5px 0;
}

.hidden-movie {
    cursor: pointer;
}
#removed-movies ul {
    list-style-type: none;
}

#sidebar {
    position: fixed;
    max-width: 320px;
    height: 100%;
    z-index: 1;
    overflow: scroll;
}

#select-all-label {
    display:inline-block;
    padding-bottom: 10px;
    color: blue;
}
</style>
