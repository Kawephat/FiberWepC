<template>
  <div id="app">
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#"><h4>Fiber Map</h4></a>
      </div>
      <ul class="nav navbar-nav">
        <li class="active"><a href="#"><h4>Monitor</h4></a></li>
        <li><a href="#"><h4>Real Path</h4></a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#"><h4><span class="glyphicon glyphicon-log-in"></span> Login</h4></a></li>
      </ul>
    </div>
    </nav>
    <br><br><br><br>

    <!-- map -->
    <gmap-map :center="center" :zoom="16" style="width: 1000px; height: 650px; float: left;">
    <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
        Name: {{infoContent.name}}<br>
        IP: {{infoContent.ip}}<br>
        <p v-if="infoContent.uptime!=0">Status: Up <br> Uptime: {{ infoContent.uptime }} Hours</p>
        <p v-else>Status: Down <br> Uptime: 0 Hours</p>
    </gmap-info-window>
    <gmap-marker
      :key="index"
      v-for="(m, index) in switchs"
      :position="m.position"
      :clickable="true"
      :draggable="false"
      @click="toggleInfoWindow(m,i)"
    ></gmap-marker>


    <!-- <gmap-polyline
      :key="index"
      v-for="(p, index) in polyline"
      :position="p.position"
      :path="p.path"
      :clickable="true"
    ></gmap-polyline> -->

      <gmap-polyline 
      v-for="pl in connects" 
      :key="pl.path" 
      :path="pl.path" 
      :options="{geodesic:true, strokeColor:'GREEN'}"
      @click="toggleInfoWindow(pl,i)">
      </gmap-polyline>
  </gmap-map>
<!-- <vue-good-table
      title="Demo Table"
      :columns="columns"
      :rows="switchs"
      :paginate="true"
      :lineNumbers="true"/> -->

      <beer/>

    <div style="display: inline-block; margin-left: 20px;">
          <div id="bigBoxs">
              <!-- <div class="row"> -->
              <input v-model="search" type="text" placeholder="Search..." />  
               <!-- <div class="col-md-6 col-md-offset-6" > -->
                <h2>Page : <button class="btn btn-default" type="submit">First</button>
                <button class="btn btn-default" type="submit">Previous</button> 1/5
                <button class="btn btn-default" type="submit">Next</button>
                <button class="btn btn-default" type="submit">Last</button>
                </h2>
              <!-- </div> -->
              <!-- <div class="col-md-6 col-md-offset-6" > -->
              <h2>Status :
                <button class="btn btn-default" type="submit">All</button>
                <button class="btn btn-default" type="submit">Down</button>
                <button class="btn btn-default" type="submit">Up</button>
              </h2>
              <!-- </div> -->
              <!-- <div class="col-md-6 col-md-offset-6" > -->
              <h2>Layer :
                <button class="btn btn-default" type="submit">All</button>
                <button class="btn btn-default" type="submit">Core-End</button>
                <button class="btn btn-default" type="submit">Core-Core</button>
              </h2>
              </div>
              <div class="well well-lg">
              <table class="table table-hover">
                 <thead>
                   <tr>
                     <th>Switch Name</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody> 
                   <tr v-for="m in filteredBlogs":key="m" :clickable="true" >
                    <td :clickable="true">
                      <p>{{m.name}}</p>
                    </td>
                     <td>Up - {{m.uptime}} Days</td>
                   </tr>
                 </tbody>
               </table>
               </div>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Beer from './test.vue'

export default {
  components: {
    'beer': Beer
  },
  data() {
    return {
      center: { lat: 18.79686, lng: 98.9537475 },
      infoContent: "",
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      markers: [
        {
          position: {
            lat: 47.376332,
            lng: 8.547511
          },
          infoText: "Marker 1"
        },
        {
          position: {
            lat: 47.374592,
            lng: 8.548867
          },
          infoText: "Marker 2"
        },
        {
          position: {
            lat: 47.379592,
            lng: 8.549867
          },
          infoText: "Marker 3"
        }
      ],
      plPath: [
        { lat: 18.7956453, lng: 98.952812 },
        { lat: 18.7982302, lng: 98.9491877 },
        { lat: 18.8004538, lng: 98.9504027 },
        { lat: 18.7932254, lng: 98.9562057 },
        { lat: 18.7956453, lng: 98.952812 }
      ],

      ppath: [
        {
          path: [
            { lat: 18.7932254, lng: 98.9562057 },
            { lat: 18.8004538, lng: 98.9504027 }
          ]
        },
        {
          path: [
            { lat: 18.7982302, lng: 98.9491877 },
            { lat: 18.7956453, lng: 98.952812 }
          ]
        },
        {
          path: [
            { lat: 18.8004538, lng: 98.9504027 }
            // { lat: 18.7982302, lng: 98.9491877 }
          ]
        },
        {
          path: [
            { lat: 18.7932254, lng: 98.9562057 },
            { lat: 18.7932254, lng: 98.9562057 }
          ]
        }
      ],
      info: "eiei",
      plvisible: true,
      switchs: [],
      connects: [],
      search: '',
      columns: [
        {
          label: 'Name',
          field: 'name',
          filterable: true,
        },
        {
          label: 'Status',
          field: 'uptime',
          type: 'number',
          html: false,
          filterable: true,
        },
        {
          label: 'Uptime',
          field: 'uptime',
          type: 'number',
          html: false,
          filterable: true,
        },
      ],
    };
  },
  methods: {
    toggleInfoWindow(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = marker;
      this.center = marker.position;
      this.infoWinOpen = true;
      this.currentMidx = idx;
    },
    getSwitch() {
      this.axios
        .get("https://fibermap.herokuapp.com/getswitch")
        .then(response => {
          // console.log(response.data);
          this.switchs = response.data;
        });
    },
    getConnect() {
      this.axios
        .get("https://fibermap.herokuapp.com/connect")
        .then(response => {
          // console.log(response.data);
          this.connects = response.data;
        });
    }
  },
  created: function() {
    this.getSwitch();
    this.getConnect();
  },
  computed: {
    filteredBlogs() {
      return this.switchs.filter((sw) => {
        return sw.name.match(this.search)
      })
    }
  }
};
</script>
