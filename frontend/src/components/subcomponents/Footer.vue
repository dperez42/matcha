<template>
  <v-footer
    dark
    padless
    app
    inset
  >
  <v-row align="center" justify="center" no-gutters>
    <v-card
      class="flex"
      flat
      tile
      color="red"
      :elevation="10"
    >

      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>MATCHA tehhhham</strong>
      </v-card-text>
    </v-card>
  </v-row>
  </v-footer>
</template>