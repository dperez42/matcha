<template>
  <div  v-if="show">
    <v-card height="300px"  v-if="show">
      <v-card-title class="text-h5 blue white--text pa-2">
        <span class="headline">Notifications</span>                 
      </v-card-title>
      <v-card-text>
        <div >
          <v-list max-height="250" class="overflow-y-auto">
              <v-list-item class=" pa-0 ma-0" 
                v-for="(item,index) in data" :key="index">
                {{item.command}} {{item.message}} from {{item.from_username}}
              </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </div>
  </template>
<script>
  import axios from "axios"

  export default {
    data () {
      return {
      }
    },
    props: {
      show: true,
      data:{
      type: Object,
      required: true
      },
    },
    created () {
    },
    methods: {
    },
    components: {
    }
  }
</script>

<style>
  .emoji-picker{
    background: rgb(158, 76, 76);
    position: absolute;
    top: 1rem;
    width: 400px;
    user-select: none;
  }
  .emoji-picker .emoji-header{
    display: flex;
    padding: 5px;
    box-shadow: 0px 5px 9px 0px rgba(0,0,0,0.15);
  }
  .emoji-picker .emoji-header .emoji-close{
    margin-left: auto;
  }
  .emoji-picker .emoji-content{
    margin-top: 10px;
    overflow-y: auto;
    height: 200px;
  }
  .emoji-picker span{
    cursor: pointer;
    font-size: 25px;
  }
</style>