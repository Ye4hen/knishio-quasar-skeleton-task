<template>
	<q-page class="column items-center">
		<section class="q-py-xxl column items-center">
			<greeting-titles secondaryTitle="Feel free to use your own Task Manager😘" />
			<FormComp
			:formClasses="'flex items-center gap-2 q-pb-md'"
			:formError="todoError"
			:isDefaultInput="true"
			inputLabel="Write the task down"
			v-model:inputVal="inputVal"
			buttonTitle="Add"
			:onAction="addTask"
			:loading="loading"
			></FormComp>
			<ListComp
			v-if="dltStore.tasksList?.length"
			:listArray="dltStore.tasksList"
			:isIndexKey="true"
			:isListOrdered="true"
			:isDeleteBtn="true"
			:deleteMethod="dltStore.deleteTask"
			deleteBtn="Delete"
			></ListComp>
		</section>
		<section class="q-py-xxl">
			<diary-comp class="column items-center"/>
		</section>
	</q-page>
</template>

<script setup>
import GreetingTitles from '../components/ui/GreetingTitles.vue'
import FormComp from '../components/ui/FormComp.vue'
import ListComp from '../components/ui/ListComp.vue'
import DiaryComp from '../components/DiaryComp.vue'
import { ref, watch } from 'vue'
import hasDltStore from 'src/mixins/hasDltStore'

import { useQuasar } from 'quasar'
const { dltStore } = hasDltStore()
const $q = useQuasar()

const inputVal = ref('')
const loading = ref(false)
const todoError = ref(false)

watch(inputVal, (newVal) => {
  todoError.value = !newVal
})

async function addTask () {
  todoError.value = false
  const isTaskNotNew = dltStore.tasksList.find(task => task === inputVal.value)
  if (inputVal.value && !isTaskNotNew) {
    await dltStore.addTask(inputVal.value)
    showNotification('success', 'Task added successfully🤟')
  } else if (isTaskNotNew) {
    showNotification('error', 'This task already exists')
  } else {
    todoError.value = true
    showNotification('error', 'Enter the task please')
  }
}

const showNotification = (state, message) => {
  $q.notify({
    message,
    color: state === 'error' ? 'negative' : 'positive',
    position: 'top',
    timeout: 3000
  })
}
</script>

<style lang="scss" scoped>
.gap-2{
	gap: 0.5rem;
}
</style>
