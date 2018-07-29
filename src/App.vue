<template>
<div>
    <div id="sidebar" :class="$mq">
        <Settings
            v-on:locationSubmit="requestMovieList($event)"
        />
        <LoadingCircle 
            v-show="loading"/>
        <TheatreList
            v-bind:theatres="theatres"
            v-bind:loaded="loaded"
            v-model="uncheckedTheatres"
        />
        <HiddenMovies
            v-if="$mq === 'lg'"
            v-bind:removedMovies="removedMovies"
            v-on:reAddMovie="removedMovies.splice($event, 1);"
        />
    </div>
    <FilterTitle
        v-bind:filter="filter"
        v-on:updateFilter="filterMovies($event)"
    />
    <MovieListDesktop
        v-if="$mq === 'lg'"
        v-bind:filter="filter"
        v-bind:movies="movies"
        v-bind:uncheckedTheatres="uncheckedTheatres"
        v-bind:removedMovies="removedMovies"
    />
    <MovieListMobile
        v-if="$mq === 'sm'"
        v-bind:filter="filter"
        v-bind:movies="movies"
        v-bind:uncheckedTheatres="uncheckedTheatres"
        v-bind:removedMovies="removedMovies"
    />
</div>
</template>

<script>
import LoadingCircle from './components/LoadingCircle.vue'
import MovieListDesktop from './components/MovieListDesktop.vue'
import MovieListMobile from './components/MovieListMobile.vue'
import Settings from './components/Settings.vue'
import TheatreList from './components/TheatreList.vue'
import HiddenMovies from './components/HiddenMovies.vue'
import FilterTitle from './components/FilterTitle.vue'

export default {
  name: 'Showtimes',
  components: {
    LoadingCircle,
    MovieListDesktop,
    MovieListMobile,
    Settings,
    TheatreList,
    HiddenMovies,
    FilterTitle,
  },
  data() {
      return {
          movies: [],
          theatres: [],
          uncheckedTheatres: [],
          removedMovies: [],
          filter: '',

          loading: false,
          loaded: false,
      }
  },
  methods: {
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
                  var moviesTmp = JSON.parse(xhr.responseText);
                      console.log(moviesTmp);
                      ths.movies = [];
                      for (var i=0; i<moviesTmp.length; i++) {
                          // if an element of ths.movies has a rootId equal to
                          // moviesTmp[i].rootId
                          var preexisting = ths.movies.find(function(element){return element.rootId == moviesTmp[i].rootId});
                          if (preexisting) {
                              preexisting.customShowtimes[moviesTmp[i].title] = moviesTmp[i].showtimes;
                          } else {
                              moviesTmp[i].customShowtimes = {};
                              moviesTmp[i].customShowtimes[moviesTmp[i].title] = moviesTmp[i].showtimes;
                              ths.movies[ths.movies.length] = moviesTmp[i];
                          }
                      }
                  ths.movies.sort(function(a, b){
                      return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
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
      filterMovies: function(filter) {
          this.filter = filter;
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
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

var apikey = "h6p3tbv6f2u5savqzhgq5wts";
var baseUrl = "https://data.tmsapi.com/v1.1";
var theatersUrl = baseUrl + '/movies/showings';
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url('https://fonts.googleapis.com/css?family=Anton|IBM+Plex+Mono|Muli');

body, html {
    font-family: 'Muli', sans-serif;
    margin: 0;
}

h2, h4 {
    font-family: 'Acme', sans-serif;
}
h2 {
    border-top: 2px solid;
    padding: 5px 0;
}

#sidebar.lg {
    position: fixed;
    max-width: 320px;
    height: 100%;
    z-index: 1;
    overflow: scroll;
}
#all-settings.sm {
    margin: 4px;
    border: 2px solid black;
    padding: 2px;
}
</style>
