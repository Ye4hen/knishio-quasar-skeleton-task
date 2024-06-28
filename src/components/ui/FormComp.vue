// Reusable kit for the forms
<template>
  <q-form
    @submit.prevent="onAction"
    :class="formClassesComputed"
  >
    <div :class="customInputsClasses">
        <div class="public-username-field q-mb-md" v-if="props.isRandomName">
          <q-input
            v-model="publicName"
            label="Public Username"
            outlined
            dense
            :disable="true"
          />
          <q-btn
            icon="refresh"
            @click="generatePublicName"
          />
        </div>

        <q-input
        :class="{'login-input' : props.isLogin}"
          v-if="props.isEmail"
          v-model="email"
          type="email"
          label="Email"
          :rules="emailRules"
          lazy-rules
          outlined
          dense
          :disable="props.loading"
          @keyup.enter = "onAction"
        />

        <div v-if="props.isPassword">
          <q-input
            :class="{'login-input' : props.isLogin}"
            v-model="password"
            type="password"
            label="Password"
            :rules="passwordRules"
            lazy-rules
            outlined
            dense
            :disable="props.loading"
          @keyup.enter = "onAction"
          />
          <q-list v-if="!props.isLogin" class="password-criteria" dense>
            <q-item v-for="(criterion, index) in passwordCriteria" :key="index">
              <q-item-section avatar>
                <q-icon :name="criterion.met ? 'check' : 'close'" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ criterion.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-linear-progress :value="passwordStrength" />
        </div>

        <q-input
          v-if="props.isPublicName"
          filled
          v-model="dltStore.profile.publicName"
          label="Your public name *"
          hint="The name which was chosen during registration"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Please type something']"
          :disable="props.loading"
          @keyup.enter = "onAction"
        />

        <q-input
            v-if="props.isDefaultInput"
            v-model.trim="inputVal"
            :label="inputLabel"
            outlined
            dense
            :disable="props.loading"
            @keyup.enter = "onAction"
          />

        <slot name="additionalForms"></slot>
    </div>

    <div :class="{'text-center q-mt-md' : isRegister}">
      <q-btn
        type="submit"
        color="white"
        text-color="primary"
		:class="btnClass"
        :label="props.loading ? '...loading' : buttonTitle"
        :disabled="!isFormValid || props.formError || props.loading"
      />
      <slot name="resetBtn"></slot>
    </div>
    <q-spinner v-if="props.loading" color="primary" size="xs" />
  </q-form>
</template>

<script setup>
const props = defineProps({
  isEmail: Boolean,
  isDefaultInput: Boolean,
  isPublicName: Boolean,
  isRandomName: Boolean,
  isPassword: Boolean,
  isLogin: Boolean,
  isRegister: Boolean,
  loading: Boolean,
  email: String,
  password: String,
  inputVal: String,
  buttonTitle: String,
  inputLabel: String,
  formClasses: {
    type: String,
    required: true
  },
  customInputsClasses: String,
  btnClass: String,
  formError: Boolean,
  onAction: {
    type: Function || Promise,
    required: true
  }
})

import { computed, ref, watch } from 'vue'
import hasDltStore from 'src/mixins/hasDltStore'
import { randomName } from 'src/libraries/strings'
const emit = defineEmits(['update:email', 'update:password', 'update:inputVal'])
const { dltStore } = hasDltStore()
const publicName = ref(randomName())
const email = ref(props.email)
const password = ref(props.password)
const inputVal = ref(props.inputVal)

watch(email, newValue => emit('update:email', newValue))
watch(password, newValue => emit('update:password', newValue))
watch(inputVal, newValue => emit('update:inputVal', newValue))

const isValidEmail = val => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Invalid email format'
}

const isFormValid = computed(() => {
  if (props.isEmail) return isValidEmail(email.value) === true && password.value
  else return true
})

const emailRules = computed(() => [
  val => !!val || 'Email is required',
  isValidEmail,
  async val => {
    if (val && props.isRegister) {
      const isUnique = await dltStore.isUsernameUnique(val)
      return isUnique || 'Email is already registered'
    }
    return true
  }
])

const passwordRules = computed(() => {
  const metCriteria = passwordCriteria.value.filter(criterion => criterion.met).length
  const requireAllCriteria = metCriteria < 3

  return [
    val => !!val || 'Password is required',
    val => (val.length >= 6 && val.length <= 64) || 'Password must be between 6 and 64 characters',
    val => !requireAllCriteria || /[A-Z]/.test(val) || 'Password must include an uppercase letter',
    val => !requireAllCriteria || /[a-z]/.test(val) || 'Password must include a lowercase letter',
    val => !requireAllCriteria || /[0-9]/.test(val) || 'Password must include a number',
    val => !requireAllCriteria || /[^A-Za-z0-9]/.test(val) || 'Password must include a special character'
  ]
})

const generatePublicName = () => {
  publicName.value = randomName()
}

const passwordCriteria = computed(() => [
  {
    text: 'Uppercase letter',
    met: /[A-Z]/.test(password.value)
  },
  {
    text: 'Lowercase letter',
    met: /[a-z]/.test(password.value)
  },
  {
    text: 'Number',
    met: /[0-9]/.test(password.value)
  },
  {
    text: 'Special character',
    met: /[^A-Za-z0-9]/.test(password.value)
  }
])

const passwordStrength = computed(() => {
  const metCriteria = passwordCriteria.value.filter(criterion => criterion.met).length
  return metCriteria / passwordCriteria.value.length
})

const formClassesComputed = computed(() => ({
  'shake-animation': props.formError,
  [props.formClasses]: true
}))

</script>

<style lang="scss">
.public-username-field {
  display: flex;
  align-items: center;
}

.public-username-field > .q-btn {
  margin-left: 8px;
}

.shake-animation {
  animation: shake 0.5s;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.login-input{
	margin-top: 25px;
	&:has(input[type='email']){
		margin-top: 20px;
	}
}
</style>
