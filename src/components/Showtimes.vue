<template>
<div id="everything">
    <div id="collapse" onclick="document.getElementById('everything').classList.toggle('collapsed')"><i></i></div>
    <div id="sidebar">
        <form id="location-form" v-on:submit.prevent="onLocationSubmit">
            <button id="location-input" v-on:click="enterLocation">Manually enter location</button>
            <button id="location-get" v-on:click="getLocation">Use current location</button>
            <div align="center" id="location-div" v-if="lat&&lng">{{ loc_string }}</div>
            <div align="center" id="location-div" v-if="!(lat&&lng)" style="color: red;">Location not set</div>
            <label id="distance-label" for="distance">radius:</label>
            <input type="number" name="distance" id="distance" v-model="distance" required>
            <select name="unit" id="unit-select" v-model="unit">
                <option value="mi">mi</option>
                <option value="km">km</option>
            </select>
            <label id="datefrom-label" for="datefrom">start date:</label>
            <input type="date" name="datefrom" id="datefrom" v-model="datefrom" required>
            <label id="dateto-label" for="dateto">end date:</label>
            <input type="date" name="dateto" id="dateto" v-model="dateto" required>
            <input id="submit" type="submit" value="submit">
        </form>
        <LoadingCircle v-show="loading"/>
        <div id="theatre-list">
            <h2>Theatres</h2>
            <h4 v-show="theatres.length">Click to include/exclude</h4>
            <h4 v-show="!theatres.length && loaded">No theatres found</h4>
            <div v-show="theatres.length" class="theatre-label" id="select-all-label" v-on:click="toggleAll">Select all</div>
            <div v-for="(data) in theatres">
                <input class="theatre-checkbox" type="checkbox" :id="data.id" :value="data.id" v-model="checkedTheatres">
                <label class="theatre-label" :for="data.id">{{data.name}}</label>
            </div>
        </div>
        <div id="removed-movies">
            <h2>Hidden movies</h2>
            <ul>
                <li class="hidden-movie" v-for="(data) in removedMovies" v-on:click="reAddMovie(data.rootId)">
                    {{ data.title }}
                </li>
            </ul>
        </div>
    </div>
	<table id="movie-list">
        <thead>
		<tr class="visible">
			<th>Title</th>
			<th>Theatres</th>
			<th>Genres</th>
		</tr>
        </thead>
        <tbody>
            <tr v-for="(data) in movies" :key="data.tmsId" v-bind:class="{visible: showMovie(data)}">
			<td>
                <div class="remove-button" v-on:click="removedMovies.push(data)"></div>
                <span class="tooltip">
                      {{data.title}}
                      <div class="tooltiptext summary">
                <div class="external-link-wrapper">
                    <a target="_blank" :href="'http://www.google.com/search?q=site:en.wikipedia.org+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./wiki.png">
                    </a>
                    <a target="_blank" :href="'http://www.google.com/search?q=site:rottentomatoes.com+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./rt.png">
                    </a>
                    <a target="_blank" :href="'http://www.google.com/search?q=site:imdb.com+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./imdb.png">
                    </a>
                    <a target="_blank" :href="'http://www.google.com/search?q=site:youtube.com+trailer+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./youtube.png">
                    </a>
                </div>
                          <h3>{{ data.title }}</h3>
                          <img class="poster" :src="'https://dlby.tmsimg.com/' + data.preferredImage.uri">
                          <div v-if="data.directors"><strong>Directed by:</strong> {{ data.directors.join(', ') }}</div>
                          <div v-if="data.topCast"><strong>Cast:</strong> {{data.topCast.join(', ')}}</div>
                          <div v-if="data.releaseDate"><strong>Release date:</strong> {{ data.releaseDate }}</div>
                          <div v-if="data.genres"><strong>Genres:</strong> {{data.genres.join(', ')}}</div>
                          <div v-if="data.runTime"><strong>Runtime:</strong> {{ formatRuntime(data.runTime) }}</div>
                          <div></div>
                          <div v-if="data.longDescription">{{ data.longDescription }}</div>
                      </div>
                </span>
            </td>
			<td>
                <div class="tooltip" v-for="(showtimes, theatre) in formatShowtimes(data.showtimes)">
                    {{theatre}}
                    <span class="tooltiptext">
                        <ul>
                            <li v-for="(showtime) in showtimes">{{formatShowtime(showtime)}}</li>
                        </ul>
                    </span>
                </div>
            </td>
            <td><span v-if="data.genres">{{data.genres.join(', ')}}</span></td>
		</tr>
        </tbody>
	</table>
</div>
</template>

<script>
import LoadingCircle from './LoadingCircle.vue'

export default {
  name: 'Showtimes',
  components: {
    LoadingCircle
  },
  data() {
      return {
          movies: [],
          theatres: [],
          checkedTheatres: [],
          removedMovies: [],

          loading: false,
          loaded: false,

          datefrom: new Date().toDateInputValue(),
          dateto: new Date().toDateInputValue(),
          unit: 'mi',
          distance: 15,

          lng: 0,
          lat: 0,

          loc_string: '',
      }
  },
  created() {
      this.getLocation(false);
  },
  methods: {
      getLocation: function(evt) {
          if (evt)
              evt.preventDefault();
          if (navigator.geolocation) {
              var ths = this;
              navigator.geolocation.getCurrentPosition(function(position){
                  ths.lng = position.coords.longitude;
                  ths.lat = position.coords.latitude;

                  ths.loc_string = 'Using current location';
                  ths.onLocationSubmit(evt);
              });
          }
      },
      enterLocation: function(evt){
          console.log(evt);
          if (evt)
              evt.preventDefault();
          var ths = this;
          var address = prompt("Please enter your address");
          var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address.replace(' ','+')+'&key=AIzaSyDOQ5kRHiFFudzZzd19LUJ3iNSrsdOZI6Q';
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.onload = function() {
              if (xhr.status === 200) {
                  var data = JSON.parse(xhr.responseText);
                  ths.lng = data.results[0].geometry.location.lng;
                  ths.lat = data.results[0].geometry.location.lat;
                  ths.loc_string = 'Address: ' + address;
                  ths.onLocationSubmit(evt);
              } else {
                  alert('There was an error.');
                  console.log(xhr);
              }
          }
          xhr.send();
      },
      toggleAll: function(evt) {
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
      formatRuntime: function(runtime) {
          var hr = parseInt(runtime.substr(2,2));
          var min = parseInt(runtime.substr(5,2));
          return '' + (60*hr+min) + ' minutes';
      },
      formatShowtime: function(showtime) {
          var a = new Date(showtime);
          return a.toDateString() + ' ' + a.toLocaleTimeString();
      },
      showMovie: function(movie) {
          if (findWithAttr(this.removedMovies, 'title', movie.title) != -1) return false;
          var ct = this.checkedTheatres;
          var ret = false;
          movie.showtimes.forEach(function(showtime){
              // if showtime.theatre.id in checkedTheatres, return true
              if (ct.indexOf(showtime.theatre.id) >= 0) {
                  ret = true;
                  return;
              }
          })
          return ret;
      },
      reAddMovie: function(rootId) {
          var index = findWithAttr(this.removedMovies, 'rootId', rootId);
          this.removedMovies.splice(index, 1);
      },
      formatShowtimes: function(showtimes) {
          var displayedShowtimes = {};
          var ct = this.checkedTheatres
          showtimes.forEach(function(showtime){
              if (ct.indexOf(showtime.theatre.id) == -1) return;
              if (!displayedShowtimes.hasOwnProperty(showtime.theatre.name)) displayedShowtimes[showtime.theatre.name] = [];
              displayedShowtimes[showtime.theatre.name].push(showtime.dateTime);
          })
          return displayedShowtimes;
      },
      onLocationSubmit: function(evt) {
          if (this.lat == 0 && this.lng == 0) {
              this.enterLocation(evt);
              return;
          }

          this.loading = true;
          this.theatres = [];
          var ths = this;
          var theatres = this.theatres;
          var distance = this.distance;
          var unit = this.unit;
          var startDate = this.datefrom;
          var endDate = this.dateto;

          var a = new Date(startDate);
          var b = new Date(endDate);
          var numDays = Math.round(Math.abs((b.getTime() - a.getTime())/(24*60*60*1000))) + 1;

          var data = {
              startDate: startDate,
              numDays: numDays,
              lat: this.lat,
              lng: this.lng,
              radius: distance,
              units: unit,
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
                  ths.checkedTheatres = [];
                  for (var i=0; i<ths.theatres.length; i++) {
                      ths.checkedTheatres.push(ths.theatres[i].id);
                  }
                  document.getElementById('select-all-label').innerHTML = 'Select none';
              }
              } else console.log(xhr);
              ths.loading = false;
              ths.loaded = true;
          }
          xhr.send();
      },
  }
}


// helper functions
function findWithAttr(array, attr, value) {
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
<style scoped>
.remove-button {
    background-image: url('./remove.png');
    height: 16px;
    width: 16px;
    background-size: cover;
    display: inline-block;
    cursor: pointer;
}
</style>
