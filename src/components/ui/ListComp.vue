// Reusable kit for the lists
<template>
	<listTag>
		<li v-for="(item, index) in listArray" :key="isIndexKey ? index : item" class="q-mb-md text-h5">
			<span>{{item}}</span>
            <q-btn
              v-if="isDeleteBtn"
              type="button"
              :label="loading ? '...loading' : deleteBtn"
              size="0.9375rem"
              padding="2.5px 10px"
              class="q-ml-sm"
              @click="deleteTask(index)"
           />
		</li>
	</listTag>
</template>

<script setup>
import { computed, ref } from 'vue'
import hasDltStore from 'src/mixins/hasDltStore'
import { useQuasar } from 'quasar'
// const { dltStore } = hasDltStore()
const $q = useQuasar()
const loading = ref(false)

const props = defineProps({
  listArray: {
    type: Array,
    required: true
  },
  isIndexKey: Boolean,
  isListOrdered: Boolean,
  isDeleteBtn: Boolean,
  multipleKeys: Boolean,
  deleteBtn: String,
  deleteMethod: Function
})

const listTag = computed(() => {
  return props.isListOrdered ? 'ol' : 'ul'
})

async function deleteTask (index) {
  loading.value = true
  await props.deleteMethod(index)
  loading.value = false
  showNotification('success', 'Task deleted successfully')
}

const showNotification = (state, message) => {
  $q.notify({
    message,
    color: state === 'error' ? 'negative' : 'positive',
    position: 'top',
    timeout: 1000
  })
}

// onMounted(processListArray)
</script>

<style scoped>
	li, ul, ol{
		list-style: none;
	}
</style>
