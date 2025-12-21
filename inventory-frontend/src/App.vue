<script setup lang="ts">
import { ref } from 'vue';
import VinylInventory from './components/VinylInventory.vue';
import BikeInventory from './components/BikeInventory.vue';

type TabType = 'vinyl' | 'bike';
const activeTab = ref<TabType>('vinyl');

const tabClass = (tab: TabType): string => {
  const baseClass = 'px-6 py-3 font-medium transition-colors';
  if (activeTab.value === tab) {
    const color = tab === 'vinyl' ? 'purple' : 'orange';
    return `${baseClass} text-${color}-600 border-b-2 border-${color}-600`;
  }
  return `${baseClass} text-gray-600 hover:text-purple-600`;
};
</script>

<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
          Inventari haldussüsteem
        </h1>

        <div class="flex gap-2 mb-6 border-b border-gray-200">
          <button
            @click="activeTab = 'vinyl'"
            :class="tabClass('vinyl')"
          >
          <font-awesome-icon icon="music" class="mr-2" />
            Katrina vinüülid
          </button>
          <button
            @click="activeTab = 'bike'"
            :class="tabClass('bike')"
          >
          <font-awesome-icon icon="bicycle" class="mr-2" />
            Mardi rattaosad
          </button>
        </div>

        <VinylInventory v-if="activeTab === 'vinyl'" />
        <BikeInventory v-if="activeTab === 'bike'" />
      </div>
    </div>
  </div>
</template>

<style>
@import './assets/main.css';
</style>
