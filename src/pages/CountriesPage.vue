<template>
  <q-page>
	<section>
		<greeting-titles mainTitle="Here you can select your favorite country" :secondaryTitle="`Your current favorite country is ${dltStore.favCountry || 'not selected'}`" />
		<div class="q-px-md">
			<div class="country-form q-pb-xl">
				<q-select v-model="continentModel" :options="continentOptions" label="Select Continent"></q-select>
				<q-btn color="primary" @click="selectContinent" :disable="!continentModel">
					Select Continent
				</q-btn>
			</div>
			<div class="country-form" v-if="countries.length || dltStore.favCountry">
				<q-select v-model="favCountry" :options="countryOptions" label="Select Country"></q-select>
				<q-btn color="primary" @click="selectFavCountry" :disable="!favCountry">
					Select Country
				</q-btn>
			</div>
		</div>
	</section>
  </q-page>
</template>

<script setup>
import GreetingTitles from '../components/ui/GreetingTitles.vue'
import { onMounted, ref } from 'vue'
import hasDltStore from 'src/mixins/hasDltStore'
import { useQuasar } from 'quasar' // Import Quasar for access to components and plugins

const { dltStore } = hasDltStore()
const $q = useQuasar()

const continentModel = ref('')
const favCountry = ref('')
const continents = ref([])
const countries = ref([])

const continentOptions = ref([])
const countryOptions = ref([])

async function selectContinent () {
  countries.value = await dltStore.loadCountries(continentModel.value.value)
  updateCountryOptions()
}

async function updateCountryOptions () {
  countryOptions.value = countries.value.map(country => ({
    label: `${country.name} - ${country.capital}`,
    value: country.name
  }))
}

async function selectFavCountry () {
  await dltStore.addFavoriteCountry(favCountry.value.value)
  $q.notify({
    color: 'secondary',
    position: 'top',
    message: `Selected country: ${favCountry.value.value} capital - ${favCountry.value.label.split('- ')[1]}`,
    timeout: 2000
  })
}

onMounted(async () => {
  continents.value = await dltStore.getAllContinents()
  continentOptions.value = continents.value.map(continent => ({
    label: continent.name,
    value: continent.name
  }))
})
</script>

<style lang="scss" scoped>
.country-form{
	max-width: 46.875rem;
	padding: 15px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 70% 30%;
	column-gap: 2rem;
	row-gap: 1rem;
	@media(max-width:29.9988em){
		grid-template-columns: auto;
	}
}
</style>
