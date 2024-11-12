<template>
<div v-if="isLoading">
          LOADING DATA .... wait
          </div>
          <div v-if ="error">
          {{error_message}}
          </div> 
          <div id="map" v-if ="isLoading===false && error===false" >
          </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import store from '../../store/index'
import axios from "axios"
import CardMap from "./CardMap.vue"
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import "leaflet.markercluster";

export default {
  name: 'Chat',
  emits :{
    click_on_profile: null,
  },
  components: {
    CardMap
  },
  props: {
    user: {       //use to get coordenates and center the map
      type: Object,
      required: true,
    },
  },
  data() {
	return{
        error: false,
        error_message: '',
        isLoading: false,
        nb_connected: store.getters['connected_store/CountUUIDs'],
        list_connected: store.getters['connected_store/getUUIDs'],
        initialMap: null,         //leatfleat  object
        layer_connected: null,    //leatfleat  object
        layer_users: null,        //leatfleat  object
        nearbyUsers: [],
        allUsers: null,
        enable_profile: false,
	}
  },
  methods:{
    // get data
    async getData() {  
      this.error = false   
      try {
        this.isLoading = true;
        if (import.meta.env.VITE_DEBUG==='true'){
          console.log("info: loading connected users and all")
        }
        // Get connected users
        const token = localStorage.getItem('matcha_token');
        this.list_connected = store.getters['connected_store/getUUIDs']
        this.nearbyUsers =[]
        // config axios
        let axiosConfig = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`,
              //"Access-Control-Allow-Origin": "*",
            }
        };
        // get data from each connected uuid
        for (let j=0; j<this.list_connected.length;j++){
            const response = await axios.get('/users?uuid='+this.list_connected[j][0], axiosConfig)
            const item= { 'latitud':response.data[0].latitude,'longitud':response.data[0].longitude,'avatar':response.data[0].avatar,'uuid':response.data[0].uuid,'username':response.data[0].username}
            this.nearbyUsers.push(item)
        }
        // get data of all users
        const response2 = await axios.get('/users', axiosConfig)
        this.allUsers=response2.data
        this.error = false;
        this.isLoading = false;	
        } catch (e) {
          if (import.meta.env.VITE_DEBUG==='true'){
            console.log("error: getting users: ",e)
          }
          this.error = true
          this.error_message = "Oops.... Something happen in server. Try Later"
        } finally {
          this.isLoading = false;	
        }
	  },
    myfunction(e){
        var uuid = e.layer.properties.uuid;
        for (let i = 0; i < this.nearbyUsers.length; i++){
            if (this.user.uuid === uuid){
              if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Click on yourself.")}
              break
            } else {
              if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Click on ", uuid)}
              this.$emit('click_on_profile', uuid)
              break
            }
        }
      
    }
  },
  async mounted() {
    await this.getData()
    //define leatfleat object p.e.https://gis.stackexchange.com/questions/371901/function-with-map-addlayer-and-map-removelayer-not-working
    //this.initialMap = L.map('map').setView([this.user.latitude, this.user.longitude], 6);
 
    this.initialMap = L.map('map', {zoomControl: true,zoom:1,zoomAnimation:true,fadeAnimation:true,markerZoomAnimation:true}).setView([this.user.latitude, this.user.longitude],8);
  //define layers 
    //this.layer_connected = L.layerGroup() //connected users
    this.layer_connected = L.featureGroup() //connected users
    // listener when click pictures
    this.layer_connected.on("click", this.myfunction)

    // if you want make cluster
    //this.layer_users = L.markerClusterGroup({ showCoverageOnHover: true, maxClusterRadius:80,disableClusteringAtZoom:8, animate:true }) //all users with clustering
    this.layer_users = L.layerGroup() //influence zone
    this.layer_circle = L.layerGroup() //all users
  //define title
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, 
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.initialMap);
  //load data layer of markers of users
    for (let i = 0; i < this.allUsers.length; i++) {
            var myIcon = L.icon({
                iconUrl: './matcha.png',
                //shadowUrl: './matcha.png',
                iconSize: [20, 20],
                //iconAnchor: [22, 94],
                //popupAnchor: [-3, -76],
                //shadowSize: [60, 30],
                //shadowAnchor: [22, 94]
            });
            var marker = L.marker([this.allUsers[i].latitude,this.allUsers[i].longitude], {icon:myIcon})
            this.layer_users.addLayer(marker)
                //.bindPopup(`<h3>${this.nearbyUsers[i].username}</h3></h5>${this.nearbyUsers[i].uuid}</h5><button name="button" class="background-color: #04AA6D">Click me</button>
    //(<strong>${this.nearbyUsers[i].latitud},${this.nearbyUsers[i].longitud}</strong>)`)
    };
  // Zone 100 kms, 200 kms
  var c_100 = L.circle([this.user.latitude, this.user.longitude], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.2,
          radius: 100000.0
      })
  var c_200 = L.circle([this.user.latitude, this.user.longitude], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.2,
          radius: 200000.0
      })
  this.layer_circle.addLayer(c_100)
  this.layer_circle.addLayer(c_200)
  //load data layer of markers of connected
    for (let i = 0; i < this.nearbyUsers.length; i++) {
            var myIcon = L.icon({
                iconUrl: this.nearbyUsers[i].avatar.startsWith('https') ? this.nearbyUsers[i].avatar : import.meta.env.VITE_APP_SERVER_API+'/uploads/'+this.nearbyUsers[i].avatar,
                //shadowUrl: './matcha.png',
                iconSize: [40, 40],
                //iconAnchor: [22, 94],
                //popupAnchor: [-3, -76],
                //shadowSize: [60, 30],
                //shadowAnchor: [22, 94]
            });
            /*
            const htmlString = `<div> <h3>${this.nearbyUsers[i].username}</h3>
              <p dir='auto'>some content</> <NewComp text='some kind of text here'/> 
              <button type="button" onclick="close()">Click Me!</button>
              </div>`;
              const div = document.createElement("div");
              div.innerHTML = `<h3>${this.nearbyUsers[i].username}</h3>`;
              const button = document.createElement("button");
              button.innerHTML = "View Profile";
              button.onclick = function(x,y) {
                console.log("click", y, x)
                this.$emit('click_on_profile')
              }
              div.appendChild(button);
            */
            var marker = L.marker([this.nearbyUsers[i].latitud,this.nearbyUsers[i].longitud], {icon:myIcon, bubblingMouseEvents:false})
                //.addTo(this.initialMap)
                //.bindPopup(div)
                //.bindPopup(`<h3>${this.nearbyUsers[i].username}</h3></h5>${this.nearbyUsers[i].uuid}</h5><button name="button" class="background-color: #04AA6D">Click me</button>
                //(<strong>${this.nearbyUsers[i].latitud},${this.nearbyUsers[i].longitud}</strong>)`)
            // add new propierties to marker 
            marker.properties={ "uuid":this.nearbyUsers[i].uuid}
            this.layer_connected.addLayer(marker)
                
    };

  // show layer (order is important)
  
    this.initialMap.addLayer(this.layer_users)
    this.initialMap.addLayer(this.layer_circle)
    this.initialMap.addLayer(this.layer_connected)
  },
  computed:{
    nb_connected_change(){
      return (store.state.connected_store.nb_connected )
      },
  },
  watch: {
    async nb_connected_change(newer,older){
      if (import.meta.env.VITE_DEBUG==='true'){
          console.log("info: connected users have change. reload..")
      }
      this.nb_connected = store.state.connected_store.nb_connected
      await this.getData()
      this.layer_connected.clearLayers()
      //define layer of connected_markers
      this.layer_connected = L.layerGroup()
      //define layer of markers of connected
      for (let i = 0; i < this.nearbyUsers.length; i++) {
            var myIcon = L.icon({
                iconUrl: this.nearbyUsers[i].avatar.startsWith('https') ? this.nearbyUsers[i].avatar : import.meta.env.VITE_APP_SERVER_API+'/uploads/'+this.nearbyUsers[i].avatar,
                //shadowUrl: './matcha.png',
                iconSize: [40, 40],
                //iconAnchor: [22, 94],
                //popupAnchor: [-3, -76],
                //shadowSize: [60, 30],
                //shadowAnchor: [22, 94]
            });
            //const htmlString = '<div> <h1>hello world</h1> <p dir="auto">some content</> <NewComp text="some kind of text here" /> </div>'
            var marker = L.marker([this.nearbyUsers[i].latitud,this.nearbyUsers[i].longitud], {icon:myIcon})
                //.addTo(this.initialMap)
                //.bindPopup(htmlString)
            this.layer_connected.addLayer(marker)
                //.bindPopup(`<h3>${this.nearbyUsers[i].username}</h3></h5>${this.nearbyUsers[i].uuid}</h5><button name="button" class="background-color: #04AA6D">Click me</button>
    //(<strong>${this.nearbyUsers[i].latitud},${this.nearbyUsers[i].longitud}</strong>)`)
    };
    // show layer
    this.initialMap.addLayer(this.layer_connected)
    },
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}

</style>