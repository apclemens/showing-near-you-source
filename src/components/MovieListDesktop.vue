<template>
	<table id="movie-list">
        <thead>
		<tr class="visible">
			<th>Title</th>
			<th>Theatres</th>
			<th>Genres</th>
		</tr>
        </thead>
        <tbody>
            <tr v-for="(data, index) in movies" :key="data.tmsId" v-bind:class="{visible: showMovie(data, index), odd: data.row_index}">
			<td>
                <div class="remove-button" v-on:click="removedMovies.push(data)"></div>
                <span class="tooltip">
                      {{data.title}}
                      <div class="tooltiptext summary">
                <div class="external-link-wrapper">
                    <a style="filter: invert(100%);" target="_blank" :href="'http://www.google.com/search?q=site:en.wikipedia.org+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./images/wiki.png">
                    </a>
                    <a target="_blank" :href="'http://www.google.com/search?q=site:rottentomatoes.com+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./images/rt.png">
                    </a>
                    <a target="_blank" :href="'http://www.google.com/search?q=site:imdb.com+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./images/imdb.png">
                    </a>
                    <a target="_blank" :href="'http://www.google.com/search?q=site:youtube.com+trailer+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
                        <img class="external-link" src="./images/youtube.png">
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
                <div class="tooltip" v-for="(types, theatre, index) in formatShowtimes(data.customShowtimes)" :key="index">
                    {{theatre}}
                    <span class="tooltiptext">
                        <ul>
                            <li v-for="(showtimes, type, index) in types" :key="index">
                                {{type}}
                                <ul>
                                    <li v-for="(showtime, index) in showtimes" :key="index">
                                        {{formatShowtime(showtime)}}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>
            </td>
            <td><span v-if="data.genres">{{data.genres.join(', ')}}</span></td>
		</tr>
        </tbody>
	</table>

</template>

<script>
export default {
  name: 'MovieList',
  props: ['movies', 'uncheckedTheatres', 'removedMovies', 'filter'],
  methods: {
      formatRuntime: function(runtime) { // movie list
          var hr = parseInt(runtime.substr(2,2));
          var min = parseInt(runtime.substr(5,2));
          return '' + (60*hr+min) + ' minutes';
      },
      formatShowtime: function(showtime) { // movie list
          var a = new Date(showtime);
          return a.toDateString() + ' ' + a.toLocaleTimeString();
      },
      showMovie: function(movie, index) { // movie list
          if (index === 0) row_index = 0;
          movie.row_index = row_index%2;
          if (findWithAttr(this.removedMovies, 'title', movie.title) != -1) return false;
          if (filterMovie(movie.title, this.filter)) {
              return false;
          }

          var ut = this.uncheckedTheatres;
          var ret = false;
          movie.showtimes.forEach(function(showtime){
              // if showtime.theatre.id in uncheckedTheatres, return true
              if (ut.indexOf(showtime.theatre.id) == -1) {
                  ret = true;
                  return;
              }
          })
          if (ret) {
              row_index++;
              row_index%=2;
          }
          return ret;
      },
      formatShowtimes: function(customShowtimes) { // movie list
          var displayedShowtimes = {};
          var ut = this.uncheckedTheatres;
          for (var type in customShowtimes) {
              if (!customShowtimes.hasOwnProperty(type)) continue;
              customShowtimes[type].forEach(function(showtime){
                  if (ut.indexOf(showtime.theatre.id) != -1) return; // skip if this theatre is not selected
                  if (!displayedShowtimes.hasOwnProperty(showtime.theatre.name)) displayedShowtimes[showtime.theatre.name] = {};
                  if (!displayedShowtimes[showtime.theatre.name].hasOwnProperty(type)) displayedShowtimes[showtime.theatre.name][type] = [];
                  displayedShowtimes[showtime.theatre.name][type].push(showtime.dateTime);
              })
          }
          return displayedShowtimes;
      },
  }
}

var row_index = 0;

var filterMovie = function(title, filter) {
    var ret = false;
    filter.split(' ').forEach(function(word) {
        if (title.toLowerCase().indexOf(word.toLowerCase()) == -1) {
            ret = true;
            return;
        }
    })
    return ret;
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
#movie-list {
    margin-left: 320px;
    width: calc(100% - 320px);
}
#movie-list thead tr:nth-child(1) th{
    position: -webkit-sticky;
    position: -moz-sticky;
    position: -ms-sticky;
    position: -o-sticky;
    position: sticky;
    top: 2px;
}
#movie-list ul {
    list-style-type: none;
}
#movie-list td, #movie-list th {
    border: 1px solid #ddd;
    padding: 8px;
}
#movie-list tbody tr:not(.visible) {
    display: none;
}
#movie-list tbody .visible {
    background-color: #f2f2f2;
}
#movie-list tbody .visible.odd {
    background-color: #ddd;
}
.visible:hover {
    background-color: white !important;
}
#movie-list th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: black;
    color: white;
}

.remove-button {
    background-image: url('./images/remove.png');
    height: 16px;
    width: 16px;
    background-size: cover;
    display: inline-block;
    cursor: pointer;
}

.tooltip {
    border-bottom: 1px dotted black;
}
.tooltip .tooltiptext {
    visibility: hidden;
    background-color: black;
    color: #fff;
    padding: 5px 0;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
}
.tooltiptext {
    max-width: 720px;
    display: inline;
}
.tooltiptext ul {
    list-style-type: none;
    padding: 5px 15px;
}
.tooltiptext img.poster {
    float: left;
}
.tooltiptext div {
    padding: 5px 0;
}
.tooltiptext.summary {
    width: 720px;
    padding: 10px;
}
.tooltiptext.summary .poster {
    margin-right: 10px;
}
.tooltip:hover .tooltiptext {
    visibility: visible;
}

.external-link {
    width: 20px;
}
.external-link-wrapper {
    float: right;
    margin: 15px;
    margin-left: 5px;
}
</style>
