<template>
        <v-card color="green">
          <v-card-title>Dataa</v-card-title>
            <ul>
              <li>{{user_data}}</li>
            </ul>
        </v-card>
</template>

<script>
import store from '../store/index'
import axios from "axios"

export default {
  name: 'HelloWorld',
  components: {
  },
  data: () => ({
    error: false,
		error_message: "",
    user_data: store.getters['user_store/getUser'],
    list_connected: store.getters['connected_store/getUUIDs'],
    list_logs: store.getters['logs_store/getLogs'],
    nb_connected: store.getters['connected_store/getCountUUIDs'],
    nearbyUsers: [],
    geo: null,
  }),
  async mounted() {
	},
  methods:{
  },
  computed:{
  }, 
  watch: {
  },
}
</script>
