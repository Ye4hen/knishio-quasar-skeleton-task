<template>
  <div>
    <div class="column items-center">
      <div v-if="dltStore.profile.avatar" class="q-mb-md">
        <img class="avatar" :src="dltStore.profile.avatar" alt="your avatar" >
      </div>
      <label>
        Upload your avatar here:
        <input
          type="file"
          name="userAvatar"
          accept="image/png, image/gif, image/jpeg, image/jpg, image/svg"
          @change="handleFileChange"
          style="margin-bottom:50px;"
          :disabled="loading"
        />
      </label>
    </div>

    <FormComp
      :formClasses="'q-gutter-lg flex column fit dynamic-max-width-500px'"
      :formError="formError"
      :isPublicName="true"
      :onAction="handleSubmit"
      :loading="loading"
       buttonTitle="Save"
    >
      <template #resetBtn>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" :disable="loading" @click="onReset" />
      </template>
    </FormComp>
  </div>
</template>

<script setup>
import FormComp from './ui/FormComp.vue'
import hasDltStore from 'src/mixins/hasDltStore'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
const { dltStore } = hasDltStore()
const $q = useQuasar()
const loading = ref(false)
const formError = ref(false)

function handleFileChange (event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      dltStore.profile.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  formError.value = false
  loading.value = true

  try {
    const success = await dltStore.updateProfile(dltStore.profile)
    if (success) {
      showNotification('success', 'Profile successfully updated')
    } else {
      formError.value = true
      showNotification('error', 'Failed to update profile')
    }
  } catch (error) {
    formError.value = true
    showNotification('error', 'Error updating profile')
    console.error('Error updating profile:', error)
  } finally {
    loading.value = false
  }
}

const onReset = async () => {
  loading.value = true
  await dltStore.init()
  loading.value = false
  showNotification('success', 'Profile is successfully reset')
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
.avatar {
  width: 12.5rem;
  height: 12.5rem;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}
</style>
