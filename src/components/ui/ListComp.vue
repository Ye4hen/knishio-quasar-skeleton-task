// Reusable kit for the lists
<template>
	<listTag>
    <li v-for="(item, index) in listArray" :key="isIndexKey ? index : item" class="q-mb-md">
      <q-card>
        <q-card-section :class="!multipleKeys ? 'flex' : 'column'">
          <template v-if="multipleKeys">
            <div v-for="(val, key, subIndex) in item" :key="isIndexKey ? subIndex : item">
              <slot name="itemSlot" :key="key" :value="val"></slot>
            </div>
          </template>
          <template v-else>
            <div class="text-h6">{{index + 1}}. {{item}}</div>
          </template>
          <q-btn
            v-if="isDeleteBtn"
            type="button"
            :label="loading ? '...loading' : deleteBtn"
            size="0.9375rem"
            padding="2.5px 10px"
            class="q-ml-sm"
            @click="deleteTask(index)"
          />
        </q-card-section>
      </q-card>
    </li>
	</listTag>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
// import hasDltStore from 'src/mixins/hasDltStore'
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

const emit = defineEmits(['keyValueEmitted'])

function emitKeyValue (key, value) {
  emit('keyValueEmitted', { key, value })
}

function processListArray () {
  if (props.multipleKeys) {
    props.listArray.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        emitKeyValue(key, value)
      })
    })
  }
}
watch(props.listArray, processListArray(), { immediate: true })

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
    timeout: 3000
  })
}

// onMounted(processListArray)
</script>

<style scoped>
	li, ul, ol{
		list-style: none;
	}
</style>
