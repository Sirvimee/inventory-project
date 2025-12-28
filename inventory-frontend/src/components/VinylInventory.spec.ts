import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import VinylInventory from '../components/VinylInventory.vue'
import type { VinylItem } from '../types/VinylItem'

vi.mock('@/controllers/inventoryController', () => ({
  inventoryController: vi.fn(() => ({
    items: ref<VinylItem[]>([]),
    loading: ref(false),
    error: ref<string | null>(null),
    loadItems: vi.fn(),
    searchItems: vi.fn(),
    createItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
  })),
}))

import { ref } from 'vue'

describe('VinylInventory', () => {
  let wrapper: any

  const mockVinylItems: VinylItem[] = [
    {
      id: 1,
      type: 'vinyl',
      name: 'Test Album',
      artist: 'Test Artist',
      year: 2020,
      location: 'Riiul A',
      notes: 'Test märkmed',
    },
    {
      id: 2,
      type: 'vinyl',
      name: 'Teine Album',
      artist: 'Teine Artist',
      year: 2021,
      location: 'Riiul B',
      notes: '',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts and renders properly', () => {
    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders search input and buttons', () => {
    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })
    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toContain(
      'Otsi plaate (nimi, artist, asukoht)...',
    )
  })

  it('renders add button', () => {
    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })
    const buttons = wrapper.findAll('button')
    const addButton = buttons.find((btn) => btn.text().includes('Lisa'))
    expect(addButton).toBeDefined()
  })

  it('toggles form visibility when add button is clicked', async () => {
    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })
    const buttons = wrapper.findAll('button')
    const addButton = buttons.find((btn) => btn.text().includes('Lisa'))

    await addButton!.trigger('click')
    expect(wrapper.vm.isAdding).toBe(true)

    const formInputs = wrapper.findAll('input[type="text"]')
    expect(formInputs.length).toBeGreaterThan(1)
  })

  it('resets form when cancel button is clicked', async () => {
    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.isAdding = true
    wrapper.vm.formData.name = 'Test Album'
    wrapper.vm.formData.artist = 'Test Artist'
    await wrapper.vm.$nextTick()

    const cancelButton = wrapper.findAll('button').find((btn) => btn.text().includes('Tühista'))
    expect(cancelButton).toBeDefined()
    await cancelButton!.trigger('click')

    expect(wrapper.vm.isAdding).toBe(false)
    expect(wrapper.vm.formData.name).toBe('')
    expect(wrapper.vm.formData.artist).toBe('')
  })

  it('validates required fields before adding item', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const createItemMock = vi.fn()
    vi.mocked(mockController).mockReturnValue({
      items: ref([]),
      loading: ref(false),
      error: ref(null),
      loadItems: vi.fn(),
      searchItems: vi.fn(),
      createItem: createItemMock,
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.isAdding = true
    wrapper.vm.formData.name = ''
    wrapper.vm.formData.artist = ''

    await wrapper.vm.handleAdd()
    expect(createItemMock).not.toHaveBeenCalled()
  })

  it('calls createItem with correct data when adding valid item', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const createItemMock = vi.fn().mockResolvedValue(undefined)
    vi.mocked(mockController).mockReturnValue({
      items: ref([]),
      loading: ref(false),
      error: ref(null),
      loadItems: vi.fn(),
      searchItems: vi.fn(),
      createItem: createItemMock,
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.isAdding = true
    wrapper.vm.formData.name = 'Test Album'
    wrapper.vm.formData.artist = 'Test Artist'
    wrapper.vm.formData.year = 2023
    wrapper.vm.formData.location = 'Riiul C'
    wrapper.vm.formData.notes = 'Hea album'

    await wrapper.vm.handleAdd()
    await flushPromises()

    expect(createItemMock).toHaveBeenCalledWith({
      type: 'vinyl',
      name: 'Test Album',
      artist: 'Test Artist',
      year: 2023,
      location: 'Riiul C',
      notes: 'Hea album',
    })
  })

  it('validates required fields before updating item', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const updateItemMock = vi.fn()
    vi.mocked(mockController).mockReturnValue({
      items: ref([]),
      loading: ref(false),
      error: ref(null),
      loadItems: vi.fn(),
      searchItems: vi.fn(),
      createItem: vi.fn(),
      updateItem: updateItemMock,
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.editingId = 1
    wrapper.vm.formData.name = ''
    wrapper.vm.formData.artist = 'Test'

    await wrapper.vm.handleUpdate()
    expect(updateItemMock).not.toHaveBeenCalled()
  })

  it('calls updateItem with correct data when updating valid item', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const updateItemMock = vi.fn().mockResolvedValue(undefined)
    vi.mocked(mockController).mockReturnValue({
      items: ref([]),
      loading: ref(false),
      error: ref(null),
      loadItems: vi.fn(),
      searchItems: vi.fn(),
      createItem: vi.fn(),
      updateItem: updateItemMock,
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.editingId = 1
    wrapper.vm.formData.name = 'Muudetud Album'
    wrapper.vm.formData.artist = 'Muudetud Artist'
    wrapper.vm.formData.year = 2024
    wrapper.vm.formData.location = 'Riiul D'
    wrapper.vm.formData.notes = 'Muudetud märkmed'
    await wrapper.vm.handleUpdate()
    await flushPromises()

    expect(updateItemMock).toHaveBeenCalledWith(1, {
      id: 1,
      type: 'vinyl',
      name: 'Muudetud Album',
      artist: 'Muudetud Artist',
      year: 2024,
      location: 'Riiul D',
      notes: 'Muudetud märkmed',
    })
  })

  it('populates form when startEdit is called', () => {
    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    const testItem = mockVinylItems[0]
    wrapper.vm.startEdit(testItem)

    expect(wrapper.vm.editingId).toBe(1)
    expect(wrapper.vm.formData.name).toBe('Test Album')
    expect(wrapper.vm.formData.artist).toBe('Test Artist')
    expect(wrapper.vm.formData.year).toBe(2020)
    expect(wrapper.vm.formData.location).toBe('Riiul A')
    expect(wrapper.vm.formData.notes).toBe('Test märkmed')
  })

  it('renders loading message when loading is true', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const loadingRef = ref(true)
    vi.mocked(mockController).mockReturnValue({
      items: ref([]),
      loading: loadingRef,
      error: ref(null),
      loadItems: vi.fn(),
      searchItems: vi.fn(),
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Laadimine...')
  })

  it('renders error message when error is present', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const errorRef = ref('Test error message')
    vi.mocked(mockController).mockReturnValue({
      items: ref([]),
      loading: ref(false),
      error: errorRef,
      loadItems: vi.fn(),
      searchItems: vi.fn(),
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Test error message')
  })

  it('calls searchItems when search button is clicked', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const searchItemsMock = vi.fn().mockResolvedValue(undefined)
    vi.mocked(mockController).mockReturnValue({
      items: ref([]),
      loading: ref(false),
      error: ref(null),
      loadItems: vi.fn(),
      searchItems: searchItemsMock,
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.searchQuery = 'test query'
    const searchButton = wrapper.findAll('button').find((btn) => btn.text().includes('Otsi'))

    await searchButton!.trigger('click')
    await flushPromises()

    expect(searchItemsMock).toHaveBeenCalledWith('test query')
  })

  it('renders list of vinyl items when items are loaded', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const itemsRef = ref(mockVinylItems)
    vi.mocked(mockController).mockReturnValue({
      items: itemsRef,
      loading: ref(false),
      error: ref(null),
      loadItems: vi.fn(),
      searchItems: vi.fn(),
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    })

    wrapper = mount(VinylInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('Teine Album')
  })
})
