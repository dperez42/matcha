<template>
  <span @click.prevent="onEmojiClick">{{emoji.value}}</span>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: {
      emoji: ''
    },
    methods: {
      onEmojiClick () {
        this.$emit('click_on_emoji', this.emoji)
      }
    }
  }
</script>