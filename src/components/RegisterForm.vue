<template>
<FormComp
    :formClasses="'register-form'"
    :formError="registerError"
    v-model:email="email"
    v-model:password="password"
    :isRegister="true"
    :isRandomName="true"
    :isEmail="true"
    :isPassword="true"
    :onAction="handleRegister"
    :loading="loading"
    buttonTitle="Register"
  />
</template>

<script setup>
import FormComp from './ui/FormComp.vue'
import {
  ref
} from 'vue'
import { useRouter } from 'vue-router'
import hasDltStore from 'src/mixins/hasDltStore'
import { randomName } from 'src/libraries/strings'

import { useQuasar } from 'quasar'
const { dltStore } = hasDltStore()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const publicName = ref(randomName())
const registerError = ref(false)
const loading = ref(false)

const router = useRouter()

const showNotification = (state, message) => {
  $q.notify({
    message,
    color: state === 'error' ? 'negative' : 'positive',
    position: 'top',
    timeout: 3000
  })
}

const handleRegister = async () => {
  registerError.value = false
  loading.value = true

  try {
    const registerResult = await dltStore.register({
      username: email.value,
      password: password.value,
      publicName: publicName.value
    })

    if (registerResult === true) {
      await router.push({ name: 'dashboard' })
      showNotification('success', 'Registration process successfully passed🤟')
    } else {
      registerError.value = true
      showNotification('error', 'Registration failed. Please try again.')
    }
  } catch (error) {
    console.error('Registration error:', error)
    registerError.value = true
    showNotification('error', 'Registration error.')
  } finally {
    loading.value = false
  }
}
</script>
