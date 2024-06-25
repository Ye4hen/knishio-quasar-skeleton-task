<template>
  <q-page class="flex justify-center">
    <greeting-titles :isMainTitle="true" secondaryTitle="It is your profile page" />
	<edit-profile-form/>
  </q-page>
</template>

<script setup>
import EditProfileForm from '../components/EditProfileForm.vue'
import GreetingTitles from '../components/ui/GreetingTitles.vue'
</script>
