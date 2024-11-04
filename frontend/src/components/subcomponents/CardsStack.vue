<template>
<v-container fluid class="">
  <v-row justify="center" class="">
    <v-col cols="6" class="pt-5">
      <SwipCard
        v-for="(card, index) in cards.data"
        :key="card"
        :card="card"
        :is-current="index === 0"

        @cardSkipped="$emit('cardSkipped');"
        @hideCard="$emit('hideCard');"

        @click_on_blocked="click_on_blocked"
        @click_on_reported="click_on_reported"
        @click_on_chat="click_on_chat"
        @click_on_profile="click_on_profile"
        @click_on_like="click_on_like"
        @click_on_unlike="click_on_unlike"
      />
    </v-col>
  </v-row>
 
</v-container>
</template>

<script>
import SwipCard from "./SwipCard.vue";
export default {
  emits :{
    click_on_chat: null, 
    click_on_profile: null,
    click_on_blocked: null,
    click_on_reported: null,

    click_on_like: null, 
    click_on_unlike: null,

    cardAccepted: null, 
    cardRejected: null, 
    cardSkipped: null, 
    hideCard: null, 
    cardAccepted_click: null,
    cardRejected_click:null
  },
  components: {
    SwipCard
  },
  props: {
    cards: {
      type: Object,
      required: true
    }
  },
  methods: {
    check_cards_data(){
      if (this.cards.data.length != 0){
        return true
      }
      return false
    },
    click_on_blocked(payload) {
      this.$emit('click_on_blocked', payload)
    },
    click_on_reported(payload) {
      this.$emit('click_on_reported', payload)
    },
    click_on_chat(payload) {
      this.$emit('click_on_chat', payload)
    },
    click_on_profile(payload) {
      this.$emit('click_on_profile', payload)
    },
    click_on_like(payload) {
      this.$emit('click_on_like', payload)
    },
    click_on_unlike(payload) {
      this.$emit('click_on_unlike', payload)
    },
    emit_accepted(payload) {
      this.$emit('cardAccepted', payload)
    },
    emit_rejected(payload) {
      this.$emit('cardRejected', payload)
    },
    emit_block(payload) {
      this.$emit('cardBlock', payload)
    },
    emit_report(payload) {
      this.$emit('cardReport', payload)
    },
    emit_chat(payload) {
      this.$emit('cardChat', payload)
    },
    emit_view(payload) {
      this.$emit('cardView', payload)
    },
    emit_accepted_click(payload) {
      this.$emit('cardAccepted_click', payload)
    },
    emit_rejected_click(payload) {
      this.$emit('cardRejected_click', payload)
    },
  }
};
</script>

<style scoped>
.container1{ 
  width: 100vw;
	height: 100vh;
  background-color: #1616e4;
}

</style>
