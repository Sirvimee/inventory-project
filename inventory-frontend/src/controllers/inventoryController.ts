import { ref, type Ref } from 'vue'
import type { Item } from '../types/Item.ts'
import { apiService } from '../services/apiService'

export function inventoryController(itemType: 'vinyl' | 'bike') {
  const items: Ref<Item[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const loadItems = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      items.value = await apiService.getItems(itemType)
    } catch (e) {
      error.value = 'Viga andmete laadimisel'
      console.error('Error loading items:', e)
    } finally {
      loading.value = false
    }
  }

  const searchItems = async (query: string): Promise<void> => {
    if (!query.trim()) {
      await loadItems()
      return
    }

    try {
      loading.value = true
      error.value = null
      items.value = await apiService.searchItems(itemType, query)
    } catch (e) {
      error.value = 'Viga otsingul'
      console.error('Error searching items:', e)
    } finally {
      loading.value = false
    }
  }

  const createItem = async (item: Omit<Item, 'id'>): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      await apiService.createItem(item)
      await loadItems()
    } catch (e) {
      error.value = 'Viga lisamisel'
      console.error('Error creating item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id: number, item: Item): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      await apiService.updateItem(id, item)
      await loadItems()
    } catch (e) {
      error.value = 'Viga uuendamisel'
      console.error('Error updating item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id: number): Promise<void> => {
    if (!confirm('Kas oled kindel, et soovid kustutada?')) {
      return
    }

    try {
      loading.value = true
      error.value = null
      await apiService.deleteItem(id)
      await loadItems()
    } catch (e) {
      error.value = 'Viga kustutamisel'
      console.error('Error deleting item:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    loadItems,
    searchItems,
    createItem,
    updateItem,
    deleteItem,
  }
}
