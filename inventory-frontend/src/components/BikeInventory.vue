<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { inventoryController } from '@/controllers/inventoryController';
import type { BikeItem } from '@/types/BikeItem';

const { items, loading, error, loadItems, searchItems, createItem, updateItem, deleteItem } =
  inventoryController('bike');

const searchQuery = ref<string>('');
const isAdding = ref<boolean>(false);
const editingId = ref<number | null>(null);
const formData = ref<Partial<BikeItem>>({
  name: '',
  category: '',
  quantity: 1,
  location: '',
  notes: '',
});

onMounted(() => {
  loadItems();
});

const handleSearch = async (): Promise<void> => {
  await searchItems(searchQuery.value);
};

const handleAdd = async (): Promise<void> => {
  if (!formData.value.name || !formData.value.category) return;

  try {
    await createItem({
      type: 'bike',
      name: formData.value.name,
      category: formData.value.category,
      quantity: formData.value.quantity,
      location: formData.value.location,
      notes: formData.value.notes,
    });
    cancelForm();
  } catch {}
};

const handleUpdate = async (): Promise<void> => {
  if (!editingId.value || !formData.value.name || !formData.value.category) return;

  try {
    await updateItem(editingId.value, {
      id: editingId.value,
      type: 'bike',
      name: formData.value.name,
      category: formData.value.category,
      quantity: formData.value.quantity || 1,
      location: formData.value.location,
      notes: formData.value.notes,
    });
    cancelForm();
  } catch {}
};

const startEdit = (item: BikeItem): void => {
  editingId.value = item.id!;
  formData.value = {
    name: item.name,
    category: item.category,
    quantity: item.quantity || 1,
    location: item.location || '',
    notes: item.notes || '',
  };
};

const cancelForm = (): void => {
  isAdding.value = false;
  editingId.value = null;
  formData.value = {
    name: '',
    category: '',
    quantity: 1,
    location: '',
    notes: '',
  };
};
</script>

<template>
  <div class="space-y-4">
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div class="flex gap-2">
      <div class="relative flex-1">
        <font-awesome-icon icon="search" class="absolute left-3 top-3 text-gray-400"/>
        <input v-model="searchQuery" type="text" placeholder="Otsi (nimi, kategooria, asukoht)..."
          @keyup.enter="handleSearch"
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
      </div>
      <button @click="handleSearch" :disabled="loading"
        class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 shadow">
        <font-awesome-icon icon="search" class="mr-2" />
        Otsi
      </button>
      <button @click="isAdding = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow flex items-center gap-2">
        <font-awesome-icon icon="plus" class="mr-2" />
        Lisa
      </button>
    </div>

    <div v-if="isAdding || editingId" class="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100 shadow-sm">
      <div class="grid grid-cols-2 gap-3">
        <input v-model="formData.name" type="text" placeholder="Osa nimi *"
          class="px-3 py-2 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-200" />
        <input v-model="formData.category" type="text" placeholder="Kategooria *"
          class="px-3 py-2 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-200" />
        <input v-model.number="formData.quantity" type="number" placeholder="Kogus" min="1"
          class="px-3 py-2 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-200" />
        <input v-model="formData.location" type="text" placeholder="Asukoht"
          class="px-3 py-2 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-200" />
      </div>
      <textarea v-model="formData.notes" placeholder="Märkmed" rows="2"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-200" />
      <div class="flex gap-2">
        <button @click="editingId ? handleUpdate() : handleAdd()" :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow">
          <span>Salvesta</span>
        </button>
        <button @click="cancelForm"
          class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 flex items-center gap-2 shadow">
          <span>Tühista</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-500">
      Laadimine...
    </div>

    <div v-else class="space-y-2">
      <div v-for="item in items" :key="item.id"
        class="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-gray-800">{{ item.name }}</h3>
            <p class="text-gray-600">
              {{ (item as BikeItem).category }}
              {{ item.quantity ? `(kogus: ${item.quantity})` : '' }}
            </p>
            <p v-if="item.location" class="text-sm text-gray-500 mt-1">
              <font-awesome-icon icon="location-dot" class="text-red-500 mr-1" />
              {{ item.location }}
            </p>
            <p v-if="item.notes" class="text-sm text-gray-500 mt-1 italic">
              {{ item.notes }}
            </p>
          </div>
          <div class="flex gap-2">
            <button @click="startEdit(item as BikeItem)" class="p-2 text-blue-600 hover:bg-blue-50 rounded">
              <font-awesome-icon icon="pencil" />
            </button>
            <button @click="deleteItem(item.id!)" class="p-2 text-red-600 hover:bg-red-50 rounded">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
