<template>
  <div id="app">
   


    <!-- map -->
    <gmap-map :center="center" @zoom_changed="updateZoom" @center_changed="updateCenter" :zoom="zoom" style="width: 1060px; height: 670px; float: left;">

<!-- Marker+InfoWindow @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ -->
    <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false" v-if="infoMarker">
        Name: {{infoContent.name}}<br>
        IP: {{infoContent.ip}}<br>
        <p v-if="infoContent.uptime=='0:00:00'">Status: Down <br> Uptime: 0:00:00 Hours</p>
        <p v-else>Status: Up <br> Uptime: {{ infoContent.uptime }} Hours</p>
        <a @click="zoomMap(infoWindowPos,'marker')">Zoom</a> || <a @click="showHistory" data-toggle="modal" data-target="#myModal">History</a>
    </gmap-info-window> 
    <gmap-marker
      :key="index"
      v-for="(m, index) in switchs"
      :title="m.name"
      :position="m.position"
      :clickable="true"
      :draggable="false"
      :icon="image.url"
      @click="toggleInfoWindow(m,index)"
    ></gmap-marker>


    <!-- <gmap-polyline
      :key="index"
      v-for="(p, index) in connects"
      :position="p.position"
      :path="p.path"
      :clickable="true"
      @click="toggleInfoWindow(pl,i)"
    ></gmap-polyline> -->
    <gmap-info-window  :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false" v-if="infoPolyline">
        From: {{ infoContent.A }} <br>
        Port: {{ infoContent.port_A }} <br>
        --------------------------------------------- <br>
        <p>To: {{ infoContent.B }} <br>
        Port: {{ infoContent.port_B }}</p>
        <a @click="zoomMap(infoWindowPos,'line')">Zoom</a> || <a @click="showHistory" data-toggle="modal" data-target="#myModal">History</a>
    </gmap-info-window> 
      <gmap-polyline
      v-for="(pl,index) in connects" 
      :key="index" 
      :path="pl.path" 
      :options="{geodesic:true, strokeColor:pl.linecolor ,strokeWeight:4}"
      @click="toggleInfoWindow2(pl,index)">
      </gmap-polyline>

      </gmap-map>


    <div style="display: inline-block; margin-left: 10px;">
      <div id="bigBoxs">
        <!-- </div> -->
        <!-- <div class="col-md-6 col-md-offset-6" > -->
        <h2>Status :
          <!-- <input type="submit" class="btn btn-default" @click="checkStatus('all')" value="All"/>
          <input type="submit" class="btn btn-default" @click="checkStatus('up')" value="Up"/>
          <input type="submit" class="btn btn-default" @click="checkStatus('down')" value="Down"/> -->
        <div class="btn-group">
          <input type="submit" class="btn btn-default" @click="checkStatus('all')" value="All"/>
          <input type="submit" class="btn btn-default" @click="checkStatus('up')" value="Up"/>
          <input type="submit" class="btn btn-default" @click="checkStatus('down')" value="Down"/>
        </div>
        </h2>
        <!-- </div> -->
        <!-- <div class="col-md-6 col-md-offset-6" > -->
        <h2>Layer :
          <!-- <button class="btn btn-default" type="submit">All</button>
          <button class="btn btn-default" type="submit">Core-End</button>
          <button class="btn btn-default" type="submit">Core-Core</button> -->
          <div class="btn-group">
          <input type="submit" class="btn btn-default" @click="checkStatus('all')" value="All"/>
          <input type="submit" class="btn btn-default" @click="checkStatus('up')" value="Zone"/>
          <input type="submit" class="btn btn-default" @click="checkStatus('down')" value="Core-Core"/>
        </div>
        </h2>
        <h2>Filterd By :
          <!-- <button class="btn btn-default" type="submit">All</button>
          <button class="btn btn-default" type="submit">Core-End</button>
          <button class="btn btn-default" type="submit">Core-Core</button> -->
          <div class="btn-group">
            <input type="submit" class="btn btn-default" @click="showTable('switch')" value="Switch"/>
            <input type="submit" class="btn btn-default" @click="showTable('line')" value="Optical Fiber"/>
          </div>
        </h2>
        <vue-good-table v-if="isTableMarker"
          :columns="columns"
          :rows="filterData"
          :paginate="true"
          :lineNumbers="false"
          :globalSearch="true"
          :onClick="toggleInfoWindow"/>
          <vue-good-table v-if="isTableLine"
          :columns="columnsLine"
          :rows="connects"
          :paginate="true"
          :lineNumbers="false"
          :globalSearch="true"
          :onClick="toggleInfoWindow2"/>
        </div>
      </div>

      <div id="myModal" class="modal fade" role="dialog">
        <div class="modal-dialog">

          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">History</h4>
            </div>
            <div class="modal-body">
              <p>Some text in the modal.</p>
              <div v-for="item in switchs" :key="item.id">
                {{ item }}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>

        </div>
      </div>
    </div>
</template>

<script>
// import Table from "./components/Table.vue";

export default {
//   components: {
//     smartTable : Table
//   },
  data () {
    return {
      image: {
        // url:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
      },
      zoom: 16,
      center: { lat: 18.79686, lng: 98.9537475 },
      infoContent: '',
      infoMarker: false,
      infoPolyline: false,
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
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
          infoText: 'Marker 1'
        },
        {
          position: {
            lat: 47.374592,
            lng: 8.548867
          },
          infoText: 'Marker 2'
        },
        {
          position: {
            lat: 47.379592,
            lng: 8.549867
          },
          infoText: 'Marker 3'
        }
      ],
      plPath: [
        { lat: 18.7956453, lng: 98.952812 },
        { lat: 18.7982302, lng: 98.9491877 },
        { lat: 18.8004538, lng: 98.9504027 },
        { lat: 18.7932254, lng: 98.9562057 },
        { lat: 18.7956453, lng: 98.952812 }
      ],
      lineColor: 'RED',
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
      plvisible: true,
      switchs: [],
      connects: [],
      search: '',
      columns: [
        {
          label: 'Name',
          field: 'name',
          filterable: false
        },
        {
          label: 'Status',
          field: 'status',
          type: 'string',
          html: false,
          filterable: false
        },
        {
          label: 'Uptime',
          field: 'uptime',
          type: 'number',
          html: false,
          filterable: false
        }
      ],
      isTableMarker: true,
      columnsLine: [
        {
          label: 'From',
          field: 'A',
          filterable: false
        },
        {
          label: 'To',
          field: 'B',
          filterable: false
        },
        {
          label: 'Status',
          field: 'linecolor',
          type: 'number',
          html: false,
          filterable: false
        }
      ],
      isTableLine: false,
      isHistory: false
    }
  },
  methods: {
    showHistory () {
      console.log('')
    },
    zoomMap (pos, obj) {
      if (obj === 'marker') {
        this.center = pos
        this.zoom = 18
      } else if (obj === 'line') {
        this.center = pos
        this.zoom = 17
      }
    },
    updateZoom (zoom) {
      // console.log(zoom);
      this.zoom = zoom
    },
    updateCenter (center) {
      this.center = {
        lat: center.lat(),
        lng: center.lng()
      }
    },
    showTable (value) {
      console.log(value)
      if (value === 'switch') {
        this.isTableMarker = true
        this.isTableLine = false
      } else if (value === 'line') {
        this.isTableMarker = false
        this.isTableLine = true
      }
    },
    checkStatus (value) {
      // console.log(e)
      this.axios
        .get('https://fibermap.herokuapp.com/getstatus', {
          params: {
            status: value
          }
        })
        .then(response => {
          // console.log(response.data);
          this.switchs = response.data
        })
    },
    toggleInfoWindow (marker, idx) {
      this.infoOptions.pixelOffset.height = -35
      this.infoWindowPos = marker.position
      this.infoContent = marker
      this.center = marker.position
      this.infoWinOpen = true
      this.currentMidx = idx
      this.infoMarker = true
      this.infoPolyline = false
    },
    toggleInfoWindow2 (line, idx) {
      this.infoOptions.pixelOffset.height = 0
      var midLat = (line.path[0].lat + line.path[1].lat) / 2
      var midLng = (line.path[0].lng + line.path[1].lng) / 2
      // console.log(line)
      this.infoWindowPos = {'lat': midLat, 'lng': midLng}
      this.infoContent = line
      this.center = {'lat': midLat, 'lng ': midLng}
      this.infoWinOpen = true
      this.currentMidx = idx
      this.infoPolyline = true
      this.infoMarker = false
    },
    getSwitch () {
      this.axios
        .get('https://fibermap.herokuapp.com/getswitch')
        .then(response => {
          // console.log(response.data);
          this.switchs = response.data
        })
    },
    getConnect () {
      this.axios
        .get('https://fibermap.herokuapp.com/connect')
        .then(response => {
          // console.log(response.data);
          this.connects = response.data
        })
    }
  },
  created: function () {
    this.getSwitch()
    this.getConnect()
  },
  computed: {
    filterData () {
      return this.switchs.filter(sw => {
        return sw.name.match(this.search)
      })
    }
  }
}
</script>
