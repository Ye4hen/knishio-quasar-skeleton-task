<template>
<FormComp
    :formClasses="'row q-col-gutter-sm flex-center'"
    :formError="loginError"
    v-model:email="email"
    v-model:password="password"
    :isLogin="true"
    :isEmail="true"
    :isPassword="true"
    :onAction="handleLogin"
    :loading="loading"
    buttonTitle="Login"
  ></FormComp>
</template>

<script setup>
import FormComp from './ui/FormComp.vue'
import {
  ref
} from 'vue'
import { useRouter } from 'vue-router'
import hasDltStore from 'src/mixins/hasDltStore'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const { dltStore } = hasDltStore()

const email = ref('')
const password = ref('')
const loginError = ref(false)
const loading = ref(false)

const router = useRouter()

const handleLogin = async () => {
  console.log(email.value)
  console.log(password.value)
  loginError.value = false
  loading.value = true

  try {
    const loginResult = await dltStore.login({
      username: email.value,
      password: password.value
    })

    if (loginResult) {
      await router.push({ name: 'dashboard' })
      showNotification('success', 'Login process successfully passed🤟')
    } else {
      loginError.value = true
      showNotification('error', 'Invalid email or password. Please try again.')
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = true
    showNotification('error', 'An error occurred during login. Please try again.')
  } finally {
    loading.value = false
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
