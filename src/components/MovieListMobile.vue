<template>
    <div>
            <div class="movie" :id="data.tmsId" v-for="(data) in movies" :key="data.tmsId" v-bind:class="{visible: showMovie(data)}" v-on:click="collapse(data.tmsId)">
                <!--                <div class="remove-button" v-on:click="removedMovies.push(data)"></div>-->
                <span class="movie-title">
                    <h3>
                      {{data.title}}
                    </h3>
                </span>
                <div class="summary">
                      <img class="poster" :src="'https://dlby.tmsimg.com/' + data.preferredImage.uri">
                      <div class="trivia">
                <div class="external-link-wrapper">
                    <a target="_blank" :href="'http://www.google.com/search?q=site:en.wikipedia.org+' + data.title.replace(' ', '+') + '+'+data.releaseYear + '+film&btnI'">
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
                          <div v-if="data.directors"><strong>Directed by:</strong> {{ data.directors.join(', ') }}</div>
                          <div v-if="data.topCast"><strong>Cast:</strong> {{data.topCast.join(', ')}}</div>
                          <div v-if="data.releaseDate"><strong>Release date:</strong> {{ data.releaseDate }}</div>
                          <div v-if="data.genres"><strong>Genres:</strong> {{data.genres.join(', ')}}</div>
                          <div v-if="data.runTime"><strong>Runtime:</strong> {{ formatRuntime(data.runTime) }}</div>
                      </div>
                          <div v-if="data.longDescription">{{ data.longDescription }}</div>
                          <ul>
                <li v-for="(showtimes, theatre, index) in formatShowtimes(data.showtimes)" :key="index">
                    {{theatre}}
                    <ul>
                        <li v-for="(showtime, index) in showtimes" :key="index">{{formatShowtime(showtime)}}</li>
                    </ul>
                </li>
                          </ul>
                </div>
        </div>
    </div>

</template>

<script>
export default {
  name: 'MovieListMobile',
  props: ['movies', 'checkedTheatres', 'removedMovies', 'filter'],
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
          if (filterMovie(movie.title, this.filter)) {
              return false;
          }
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
      collapse: function(id) {
          var movieBlock = document.getElementById(id);
          var summary = movieBlock.getElementsByClassName('summary')[0];
          if (summary.style.maxHeight) {
              summary.style.maxHeight = null;
          } else {
              summary.style.maxHeight = summary.scrollHeight + 'px';
              setTimeout(function() {
                  movieBlock.scrollIntoView({behavior: 'smooth'});}, 200);
          }
      },
  }
}

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
    width: 100%;
}
#movie-list ul {
    list-style-type: none;
}
.movie:not(.visible) {
    display: none;
}
.movie.visible {
    border: 1px solid black;
}
.summary {
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
}
.poster {
    width: 50%;
}
.trivia {
    width: 50%;
    vertical-align: top;
    display: inline-block;
}



.remove-button {
    background-image: url('./images/remove.png');
    height: 16px;
    width: 16px;
    background-size: cover;
    display: inline-block;
    cursor: pointer;
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
    width: calc(100% - 20px);
    margin: 10px;
}
.external-link-wrapper {
    width:100%;
    display: block;
}
.external-link-wrapper a {
    width: 25%;
    display: inline-block;
}
</style>
