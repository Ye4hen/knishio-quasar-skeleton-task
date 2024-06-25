// Reusable kit for the titles
<template>
	<q-toolbar class="column text-center">
		<h1 v-if="isMainTitle" class="q-mb-md text-h2">{{mainTitle}}</h1>
		<h3 v-if="secondaryTitle" class="q-mt-md">{{props.secondaryTitle}}</h3>
    </q-toolbar>
</template>

<script setup>
import hasDltStore from 'src/mixins/hasDltStore'
import { computed } from 'vue'

const { dltStore } = hasDltStore()
const props = defineProps({
  mainTitle: String,
  isMainTitle: Boolean,
  secondaryTitle: String
})

const mainTitle = computed(() => props.mainTitle || `Welcome, ${dltStore.profile.publicName}`)
</script>
