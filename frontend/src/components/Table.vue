<template>
  <v-container>
  </v-container>

</template>

<script>
import store from '../store/index'
import axios from "axios"
export default {
  name: 'Table',
  components: {

  },
  data: () => ({
    user: null,
  }),
  methods: {
    // get cards data
    async getData() {      
      console.log("data") 
      const token = localStorage.getItem('matcha_token');
      try {
        let axiosConfig = {
          params:{
            tag: 'tag10'
          },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        let data={
            tag: "tag10"
        }
        console.log("data") 
        const response = await axios.delete("/tags/",axiosConfig)
        console.log("response from tags", response)
      } catch (e) {
        console.log("error:",e)
        this.error = true
      } finally {
        this.isLoading = false;	
      }

            try {
        let axiosConfig = {
          params:{
            tag: 'tag10'
          },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        let data={
            tag: "tag10"
        }
        console.log("data") 
        const response = await axios.get("/distinct/",axiosConfig)
        console.log("response from tags", response)
      } catch (e) {
        console.log("error:",e)
        this.error = true
      } finally {
        this.isLoading = false;	
      }

	  },
  },
  computed:{
  }, 
  watch: {
  },
  mounted() {
    this.user = store.getters['user_store/getUser']
    console.log("mounted")
    this.getData()
  },
  beforeUnmount() {
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal_mask_chat{
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .chat_body{
  /*position: absolute;
  inset: 50px;*/
  width: 90%;
  height: 85%;
  margin: 80px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(127, 40, 40, 0.33);  
}
</style>