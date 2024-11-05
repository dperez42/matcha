<template>
  <v-container fluid px-5>
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card color="green">
          <v-card-title>Dataa</v-card-title>

            <ul>
              <li>{{user_data}}</li>
              <li>{{list_connected}}</li>
              <li>{{nb_connected}}</li>
              <li>aaa {{list_logs}}</li>
            </ul>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '../store/index'

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
    nb_connected: store.getters['connected_store/getCountUUIDs']
  }),
  mounted() {
	},
  computed:{
  }, 
  watch: {
  },
}
</script>
