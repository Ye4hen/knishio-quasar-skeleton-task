<template>
	<div>
        <greeting-titles secondaryTitle="Here you can keep your diary" />
		<form-comp
            formClasses="grid-columns q-gutter-md"
			customInputsClasses="gap"
			:formError="todoError"
			:isDefaultInput="true"
			inputLabel="Write the title down"
			v-model:inputVal="inputVal"
			buttonTitle="Add"
			:onAction="addTask"
			:loading="loading"
			btnClass="full-width"
		>
			<template #additionalForms>
				<textarea cols="30" rows="10" class="q-mt-sm" v-model="dairyDesc"/>
			</template>
		</form-comp>
		<list-comp
			class="q-mx-auto"
			v-if="dltStore.diaryList?.length"
			:listArray="dltStore.diaryList"
			:isIndexKey="true"
			:isListOrdered="true"
			:isDeleteBtn="true"
			:multipleKeys="true"
			deleteBtn="Delete"
			:deleteMethod="dltStore.deleteDiaryTask"
			@keyValueEmitted="handleKeyValueEmitted"
		>
      <template #itemSlot="{ key, value }">
        <q-card-section class="q-py-sm q-card-section">
          <div v-if="key === 'date'" class="q-mb-sm diary-date">
            <q-icon  name="event" color="primary" size="3em" />
			<h5>
				{{ getWord(value, 0, 1) }} -
				{{ getWord(value, 1, 2) }} -
				{{ getWord(value, 2, 3) }} -
				{{ getWord(value, 3, 4) }} -
				{{ getWord(value, 4, 5) }}
			</h5>
          </div>
          <div v-else-if="key === 'title'" class="diary-title">
            <h4>
				{{ value }}
			</h4>
          </div>
          <div v-else-if="key === 'description'" class="diary-desc">
			<p>{{ value }}</p>
          </div>
        </q-card-section>
      </template>
		</list-comp>
	</div>
</template>

<script setup>
import GreetingTitles from './ui/GreetingTitles.vue'
import FormComp from './ui/FormComp.vue'
import ListComp from './ui/ListComp.vue'
import { ref, watch } from 'vue'
import hasDltStore from 'src/mixins/hasDltStore'

import { useQuasar } from 'quasar'
const { dltStore } = hasDltStore()
const $q = useQuasar()

const inputVal = ref('')
const dairyDesc = ref('')
const loading = ref(false)
const todoError = ref(false)

function handleKeyValueEmitted ({ key, value }) {
  return `${key} - ${value}`
}

watch(inputVal, (newVal) => {
  todoError.value = !newVal
})

async function addTask () {
  todoError.value = false
  const isTaskNotNew = dltStore.diaryList?.find(task => task.title === inputVal.value)
  if (inputVal.value && !isTaskNotNew) {
    await dltStore.addDiaryTask({
      date: Date(),
      title: inputVal.value,
      description: dairyDesc.value
    })
    showNotification('success', 'Diary added successfully🤟')
  } else if (isTaskNotNew) {
    showNotification('error', 'This diary already exists')
  } else {
    todoError.value = true
    showNotification('error', 'Enter the diary please')
  }
  dairyDesc.value = ''
}

function getWord (str, start, number) {
  return str.split(' ').slice(start, number).join(' ')
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

    h1,h2,h3,h4,h5,h6{
		margin-top: 0;
		margin-bottom: 0;
	}
	.grid-columns {
		display: grid;
		grid-template-columns: 70% 30%;
		input, textarea{
			width: 100%;
		}
		@media(min-width:29.9988em){
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.q-icon {
		margin-right: 0.625rem;
	}

	.diary-date{
		display: grid;
		row-gap: .5rem;
		text-transform: capitalize;
	}

	.diary-title {
		text-transform: capitalize;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.diary-desc{
		display: grid;
		row-gap: .5rem;
		text-transform: capitalize;
		max-width: 40rem;
	}
</style>
