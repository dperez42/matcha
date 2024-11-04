
<template>
	<div style="padding: 5px 5px 5px 5px">
        <span v-for="tag, index in tags" :key="index" class="tag" 
        style="padding: 1px 1px 4px 3px; margin: 5px 5px 5px 5px">
            {{tag}}
            <v-btn v-if = "edit"
              color="rgb(231, 190, 9)"
              icon="mdi-delete-forever-outline"
              size="extrasmall"
              v-on:click.prevent = "remove(index)"
            ></v-btn>
        </span>
  
	</div>
</template>

<script>
// prop edit: permit delete via un emit call delete con el nº de tag a borrar
export default {
	name: 'TagList',
    props: {
        tags:{
		type: Object,
		default: ['tag1','tag2','tag3']
	},
        edit:{
		type: Boolean,
		default: true
	},
    },
    methods:{
        remove (index) {
            this.tags.splice(index,1)
            this.$emit('delete', this.tags)
        }
    }
}
</script>
<style>
.tag {
  min-width: 0;
  word-wrap: break-word;
  color: black;
  background-color: rgb(231, 190, 6);
  background-clip: border-box;
  border: 1px solid #000;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
  border-radius: .50rem;
}
</style>