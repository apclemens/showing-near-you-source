<template>
  <div id="app">
    <Showtimes msg="Welcome to Your Vue.js App"/>
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
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Anton|IBM+Plex+Mono|Muli');

body, html {
    font-family: 'Muli', sans-serif;
}

input, textarea, select {
    font-family: inherit;
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
    width: 320px;
    height: 100%;
    z-index: 1;
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

#select-all-label {
    display:inline-block;
    padding-bottom: 10px;
    color: blue;
}

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

.external-link {
    width: 20px;
}
.external-link-wrapper {
    float: right;
    margin: 15px;
    background-color: white;
    margin-left: 5px;
}

.sortable {
    cursor: pointer;
}
.sorted-down:after {
    content: '▲';
    float: right;
}
.sorted-up:after {
    content: '▼';
    float: right;
}

#location-form {
    font-family: 'IBM Plex Mono', monospace;
    display: grid;
    grid-template-rows: 20px 30px 20px 30px 20px 30px 20px 30px 40px;
    grid-template-columns: 260px 60px;
}
#zip-label {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
}

#zip {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
}
#distance-label {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
}
#distance {
    width: 240px;
    grid-column: 1 / 2;
    grid-row: 4 / 5;
}
#unit-select {
    grid-column: 2 / 3;
    grid-row: 4 / 5;
}
#datefrom-label {
    grid-column: 1 / 3;
    grid-row: 5 / 6;
}
#datefrom {
    grid-column: 1 / 3;
    grid-row: 6 / 7;
}
#dateto-label {
    grid-column: 1 / 3;
    grid-row: 7 / 8;
}
#dateto {
    grid-column: 1 / 3;
    grid-row: 8 / 9;
}
#submit {
    grid-column: 1 / 3;
    grid-row: 9 / 10;
    margin-top: 10px;
}


</style>
