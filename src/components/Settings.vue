<template>
    <div>
        <div id="location-form" :class="$mq">
            <button id="location-input" v-on:click="enterLocation">Manually enter location</button>
            <button id="location-get" v-on:click="getLocation">Use current location</button>
            <div align="center" id="location-div" v-if="lat&&lng">{{ loc_string }}</div>
            <div align="center" id="location-div" v-if="!(lat&&lng)" style="color: red;">Location not set</div>
            <label id="distance-label" for="distance">radius:</label>
            <input v-on:keyup.enter="onLocationSubmit" type="number" name="distance" id="distance" v-model="distance" required>
            <select name="unit" id="unit-select" v-model="unit">
                <option value="mi">mi</option>
                <option value="km">km</option>
            </select>
            <label id="datefrom-label" for="datefrom">start date:</label>
            <input v-on:keyup.enter="onLocationSubmit" type="date" name="datefrom" id="datefrom" v-model="datefrom" required>
            <label id="dateto-label" for="dateto">end date:</label>
            <input v-on:keyup.enter="onLocationSubmit" type="date" name="dateto" id="dateto" v-model="dateto" required>
            <button id="submit" v-on:click="onLocationSubmit">submit</button>
        </div>
        <button id="collapse" v-if="$mq === 'sm'" v-on:click="collapse">collapse</button>
    </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
      return {
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
      this.getLocation();
  },
  methods: {
      enterLocation: function(){
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
                  ths.onLocationSubmit();
              } else {
                  alert('There was an error.');
                  console.log(xhr);
              }
          }
          xhr.send();
      },
      getLocation: function() {
          if (navigator.geolocation) {
              var ths = this;
              navigator.geolocation.getCurrentPosition(function(position){
                  ths.lng = position.coords.longitude;
                  ths.lat = position.coords.latitude;

                  ths.loc_string = 'Using current location';
                  ths.onLocationSubmit();
              });
          }
      },
      onLocationSubmit: function() {
          if (this.lat == 0 && this.lng == 0) {
              this.enterLocation();
              return;
          }

          this.$emit('locationSubmit', {'datefrom': this.datefrom, 'dateto': this.dateto, 'unit': this.unit, 'distance': this.distance, 'lng': this.lng, 'lat': this.lat})
          this.collapse();
      },
      collapse: function() {
          if (this.$mq !== 'sm') return;
          var settings = document.getElementById('location-form');
          var collapse_button = document.getElementById('collapse');
          if (settings.style.maxHeight) { // collapse
              settings.style.maxHeight = null;
              if (this.loc_string) {
                  collapse_button.innerHTML = 'Movies playing within ';
                  collapse_button.innerHTML += this.distance + ' ';
                  collapse_button.innerHTML += this.unit + ' of ';
                  if (this.loc_string.substr(0, 9) == 'Address: ') {
                      collapse_button.innerHTML += this.loc_string.substr(9);
                  } else {
                      collapse_button.innerHTML += 'current location';
                  }
                  if (this.datefrom == this.dateto) {
                      collapse_button.innerHTML += ' on ' + this.datefrom;
                  } else {
                      collapse_button.innerHTML += ' between ' + this.datefrom + ' and ' + this.dateto;
                  }
                  collapse_button.innerHTML += ' (tap to change)'
              } else {
                  collapse_button.innerHTML = 'Click here to set location';
              }
          } else {
              settings.style.maxHeight = settings.scrollHeight + 'px'; // expand
              collapse_button.innerHTML = 'collapse';
          }
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

input, textarea, select, button {
    font-family: inherit;
}

#location-form {
    font-family: 'IBM Plex Mono', monospace;
    display: grid;
    grid-template-rows: auto auto 20px 30px 20px 30px 20px 30px 40px;
    grid-template-columns: 50% auto 60px;
}
#location-form.sm {
    width: 100%;
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
}
#location-input {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
}
#location-get {
    grid-column: 2 / 4;
    grid-row: 1 / 2;
}
#location-div {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
}
#distance-label {
    grid-column: 1 / 4;
    grid-row: 3 / 4;
}
#distance {
    width: calc(100% - 20px);
    grid-column: 1 / 3;
    grid-row: 4 / 5;
}
#unit-select {
    grid-column: 3 / 4;
    grid-row: 4 / 5;
}
#datefrom-label {
    grid-column: 1 / 4;
    grid-row: 5 / 6;
}
#datefrom {
    grid-column: 1 / 4;
    grid-row: 6 / 7;
}
#dateto-label {
    grid-column: 1 / 4;
    grid-row: 7 / 8;
}
#dateto {
    grid-column: 1 / 4;
    grid-row: 8 / 9;
}
#submit {
    grid-column: 1 / 4;
    grid-row: 9 / 10;
    margin-top: 10px;
}
#collapse {
    width: 100%;
}
</style>
