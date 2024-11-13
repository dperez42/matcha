<template>
  <v-row align="center" justify="center" >
    <v-col cols="12" sm="12">
      <v-row class="pt-9">
          <v-range-slider
            v-model="filter.age"
              :max="options_age.limits[1]"
              :min="options_age.limits[0]"
              :step="options_age.step"
              class="align-center"
              thumb-label="always"
              hide-details
          >
          <template v-slot:prepend>
            <div class="text-subtitle-1 font-weight-medium">AGE</div>
          </template>
          <template v-slot:append>
            <v-btn 
              @click.prevent = "emit_orderby(1)"
              :color="this.orderId === 1 ? '#e84c73':'grey'"
              size="x-small"
              :icon="'mdi-order-alphabetical-ascending'"
            />
           
          </template>
          </v-range-slider>
      </v-row>
      <v-row class="pt-9">
          <v-range-slider
              v-model="filter.distance"
              :max="options_distance.limits[1]"
              :min="options_distance.limits[0]"
              :step="options_distance.step"
              class="align-center"
              thumb-label="always"
              hide-details
          >          
          <template v-slot:prepend>
            <div class="text-subtitle-1 font-weight-medium">DISTANCE</div>
          </template>
          <template v-slot:append>
            <v-btn 
              @click.prevent = "emit_orderby(2)"
              :color="this.orderId === 2 ? '#e84c73':'grey'"
              size="x-small"
              :icon="'mdi-order-alphabetical-ascending'"
            >
            </v-btn>
          </template>
           </v-range-slider>
      </v-row>
      <v-row class="pt-9">
          <v-range-slider
              v-model="filter.tags"
              :max="options_tags.limits[1]"
              :min="options_tags.limits[0]"
              :step="options_tags.step"
              class="align-center"
              thumb-label="always"
              hide-details
          >
          <template v-slot:prepend>
            <div class="text-subtitle-1 font-weight-medium">TAGS</div>
          </template>
          <template v-slot:append>
            <v-btn 
              @click.prevent = "emit_orderby(3)"
              size="x-small"
              :color="this.orderId === 3 ? '#e84c73':'grey'"
              :icon="'mdi-order-alphabetical-ascending'"
            >
            </v-btn>
          </template>
           </v-range-slider>
      </v-row>
      <v-row class="pt-9">
          <v-range-slider
             v-model="filter.rating"
              :max="options_fame.limits[1]"
              :min="options_fame.limits[0]"
              :step="options_fame.step"
              class="align-center"
              thumb-label="always"
              hide-details
          >
          <template v-slot:prepend>
            <div class="text-subtitle-1 font-weight-medium">RATING</div>
          </template>
          <template v-slot:append>
            <v-btn 
              @click.prevent = "emit_orderby(4)"
              :color="this.orderId === 4 ? '#e84c73':'grey'"
              size="x-small"
              :icon="'mdi-order-alphabetical-ascending'"
            >
            </v-btn>
          </template>
          </v-range-slider>
      </v-row>
      <v-spacer></v-spacer>
      <v-row class="pa-2" align="center" justify="center">
        <v-tooltip text="Reset" location="top">
                <template v-slot:activator="{ props } "> 
                <v-btn v-bind="props"
                  v-on:click.prevent = "reset_query" 
                  class="mx-4"
                  elevation="8"
                  color="orange"
                  icon="mdi-reload"
                  size="small"
                  alt="Reset"
                ></v-btn>
                </template>
          </v-tooltip>      
          <v-tooltip text="Search" location="top">
                <template v-slot:activator="{ props } "> 
                <v-btn v-bind="props"
                  v-on:click.prevent = "emit_query" 
                  class="mx-4"
                  elevation="8"
                  color="#e84c73"
                  icon="mdi-magnify"
                  size="small"
                  alt="Search"
                ></v-btn>
                </template>
          </v-tooltip>      
      </v-row>
    </v-col>
  </v-row>
</template>
<script lang="ts">

// https://github.com/NightCatSama/vue-slider-component/blob/master/src/examples/components-slots.ts
export default {
  emits :{
    filter: null,  
    filter_reset: null
  },
  components: {
  },
  props: {
    filter: Object,
  },
  data () {
    return {
      orderId: 4,
      options_age: {
        range: [18, 50],
        limits:[18,100],
        step: 10
      },
      options_distance: {
        range: [0, 100],
        limits:[0,2000],
        step: 10
      },
      options_tags: {
        range: [0, 3],
        limits:[0,6],
        step: 1
      },    
      options_fame: {
        range: [0,3],
        limits:[0,5],
        step: 1
      },
      list_gender: ["*","Male", "Female"],//, "Transgender", "Cisgender", "Intersex","Genderfluid", "Non-binary gender", "Agender" ,"Bigender", "Demigender" ,"MTF" ,"Androgyne", "Genderbroken", "Two-spirit", "Gender identity disorder" ,"Aliagender" ,"Ambigender","Bisexual" ,"Butch", "Genderfae", "Genderflux", "Gendervoid", "Masculine gender", "Questioning"],
		  list_sexual: ["*","Bisexual", "Heterosexual", "Homosexual"] //, "Asexual" ,"Autosexual","Demisexual", "Gray-asexuality","Pansexual", "Queer", "Questioning" ],
    }
  },
  methods:{
    emit_query() {
      this.$emit('filter', [[this.filter.age[0],this.filter.age[1]], [this.filter.distance[0],this.filter.distance[1]],[this.filter.tags[0],this.filter.tags[1]],[this.filter.rating[0],this.filter.rating[1]],this.orderId, this.filter.gender, this.filter.sexual])
    },
    reset_query () {
      this.$emit('filter_reset', {})
    },
    emit_orderby (orderId) {
      this.orderId = orderId
      this.$emit('filter', [[this.filter.age[0],this.filter.age[1]], [this.filter.distance[0],this.filter.distance[1]],[this.filter.tags[0],this.filter.tags[1]],[this.filter.rating[0],this.filter.rating[1]],this.orderId, this.filter.gender, this.filter.sexual])
    }
  }
}
</script>

<style scoped>
.card{
  display: flex;
  background-color:rgb(9, 19, 24);
  margin-top: 40px;
}

.card_order{
  display: flex;
  flex-direction: column;
  flex: 0.40;
  padding: 30 px;
}
.card_order>p{
  color: white;
}
.card_slider{
  display: flex;
  flex-direction: column;
  flex: 0.60;
  padding: 10 px;
  margin-left: 15px;
  align-content: end;
  background-color:rgb(40, 56, 65);
}
</style>
