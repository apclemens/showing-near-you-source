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
                <div class="tooltip" v-for="(showtimes, theatre, index) in formatShowtimes(data.showtimes)" :key="index">
                    {{theatre}}
                    <span class="tooltiptext">
                        <ul>
                            <li v-for="(showtime, index) in showtimes" :key="index">{{formatShowtime(showtime)}}</li>
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
  props: ['movies', 'checkedTheatres', 'removedMovies'],
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
      showMovie: function(movie) { // movie list
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
      formatShowtimes: function(showtimes) { // movie list
          var displayedShowtimes = {};
          var ct = this.checkedTheatres
          showtimes.forEach(function(showtime){
              if (ct.indexOf(showtime.theatre.id) == -1) return;
              if (!displayedShowtimes.hasOwnProperty(showtime.theatre.name)) displayedShowtimes[showtime.theatre.name] = [];
              displayedShowtimes[showtime.theatre.name].push(showtime.dateTime);
          })
          return displayedShowtimes;
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
#movie-list {
    margin-left: 325px;
    width: calc(100% - 320px);
}
#movie-list thead tr:nth-child(1) th{
    position: -webkit-sticky;
    position: -moz-sticky;
    position: -ms-sticky;
    position: -o-sticky;
    position: sticky;
    top: 10px;
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
#movie-list tbody .visible:nth-of-type(even) {
    background-color: #f2f2f2;
}
#movie-list tbody .visible:nth-of-type(odd) {
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
    background-image: url('./remove.png');
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
.tooltiptext.summary img {
    padding-right: 10px;
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
    background-color: white;
    margin-left: 5px;
}
</style>
