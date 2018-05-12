<template>
<div>
    <div id="sidebar">
        <Settings
            v-on:locationSubmit="requestMovieList($event)"
        />
        <LoadingCircle v-show="loading"/>
        <TheatreList
            v-bind:theatres="theatres"
            v-bind:loaded="loaded"
            v-model="checkedTheatres"
        />
        <div id="removed-movies">
            <h2>Hidden movies</h2>
            <ul>
                <li class="hidden-movie" v-for="(data, index) in removedMovies" :key="index" v-on:click="reAddMovie(data.rootId)">
                    {{ data.title }}
                </li>
            </ul>
        </div>
    </div>
    <MovieList
        v-bind:movies="movies"
        v-bind:checkedTheatres="checkedTheatres"
        v-bind:removedMovies="removedMovies"
    />
</div>
</template>

<script>
import LoadingCircle from './LoadingCircle.vue'
import MovieList from './MovieList.vue'
import Settings from './Settings.vue'
import TheatreList from './TheatreList.vue'

export default {
  name: 'Showtimes',
  components: {
    LoadingCircle,
    MovieList,
    Settings,
    TheatreList,
  },
  data() {
      return {
          movies: [],
          theatres: [],
          checkedTheatres: [],
          removedMovies: [],

          loading: false,
          loaded: false,
      }
  },
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
      },
      reAddMovie: function(rootId) { // hidden movies
          var index = findWithAttr(this.removedMovies, 'rootId', rootId);
          this.removedMovies.splice(index, 1);
      },
      requestMovieList: function(event) {

          this.loading = true;
          this.theatres = [];
          var ths = this;
          var theatres = this.theatres;

          var a = new Date(event.datefrom);
          var b = new Date(event.dateto);
          var numDays = Math.round(Math.abs((b.getTime() - a.getTime())/(24*60*60*1000))) + 1;

          var data = {
              startDate: event.datefrom,
              numDays: numDays,
              lat: event.lat,
              lng: event.lng,
              radius: event.distance,
              units: event.unit,
              api_key: apikey,
          };
          var url = theatersUrl + '?';
          for (var prop in data) {
              url += prop + '=' + data[prop] + '&';
          }
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.onload = function() {
              if (xhr.status === 200) {
                  if (!xhr.responseText) {
                      ths.movies = [];
                  } else {
                  ths.movies = JSON.parse(xhr.responseText);
                  ths.movies.sort(function(a, b){
                      return a.title > b.title;
                  })

                  ths.movies.forEach(function(movie){
                      movie.showtimes.forEach(function(showtime){
                          if (findWithAttr(theatres, 'id', showtime.theatre.id) == -1) theatres.push(showtime.theatre);
                      })
                  })
              }
              } else console.log(xhr);
              ths.loading = false;
              ths.loaded = true;
          }
          xhr.send();
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

var apikey = "h6p3tbv6f2u5savqzhgq5wts";
var baseUrl = "https://data.tmsapi.com/v1.1";
var theatersUrl = baseUrl + '/movies/showings';
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
