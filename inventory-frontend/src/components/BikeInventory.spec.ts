import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import BikeInventory from '../components/BikeInventory.vue'
import type { BikeItem } from '../types/BikeItem'

vi.mock('@/controllers/inventoryController', () => ({
  inventoryController: vi.fn(() => ({
    items: ref<BikeItem[]>([]),
    loading: ref(false),
    error: ref<string | null>(null),
    loadItems: vi.fn(),
    searchItems: vi.fn(),
    createItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
  })),
}))

describe('BikeInventory', () => {
  let wrapper: any

  const mockBikeItems: BikeItem[] = [
    {
      id: 1,
      type: 'bike',
      name: 'Piduriklotsid',
      category: 'Hooldus',
      quantity: 3,
      location: 'Riiul A',
      notes: 'Tagumine pidur',
    },
    {
      id: 2,
      type: 'bike',
      name: 'Kett',
      category: 'Ülekanne',
      quantity: 2,
      location: 'Riiul B',
      notes: '',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts and renders properly', () => {
    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders search input and buttons', () => {
    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })
    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toContain('Otsi (nimi, kategooria, asukoht)...')
  })

  it('renders add button', () => {
    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })
    const buttons = wrapper.findAll('button')
    const addButton = buttons.find((btn) => btn.text().includes('Lisa'))
    expect(addButton).toBeDefined()
  })

  it('toggles form visibility when add button is clicked', async () => {
    wrapper = mount(BikeInventory, {
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
    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.isAdding = true
    wrapper.vm.formData.name = 'Piduriklotsid'
    wrapper.vm.formData.category = 'Hooldus'
    await wrapper.vm.$nextTick()

    const cancelButton = wrapper.findAll('button').find((btn) => btn.text().includes('Tühista'))
    expect(cancelButton).toBeDefined()
    await cancelButton!.trigger('click')

    expect(wrapper.vm.isAdding).toBe(false)
    expect(wrapper.vm.formData.name).toBe('')
    expect(wrapper.vm.formData.category).toBe('')
    expect(wrapper.vm.formData.quantity).toBe(1)
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

    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.isAdding = true
    wrapper.vm.formData.name = ''
    wrapper.vm.formData.category = ''

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

    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.isAdding = true
    wrapper.vm.formData.name = 'Piduriklotsid'
    wrapper.vm.formData.category = 'Hooldus'
    wrapper.vm.formData.quantity = 4
    wrapper.vm.formData.location = 'Riiul C'
    wrapper.vm.formData.notes = 'Varuosa'

    await wrapper.vm.handleAdd()
    await flushPromises()

    expect(createItemMock).toHaveBeenCalledWith({
      type: 'bike',
      name: 'Piduriklotsid',
      category: 'Hooldus',
      quantity: 4,
      location: 'Riiul C',
      notes: 'Varuosa',
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

    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.editingId = 1
    wrapper.vm.formData.name = ''
    wrapper.vm.formData.category = 'Hooldus'

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

    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.editingId = 1
    wrapper.vm.formData.name = 'Jahutusvedelik'
    wrapper.vm.formData.category = 'Hooldus'
    wrapper.vm.formData.quantity = 2
    wrapper.vm.formData.location = 'Riiul D'
    wrapper.vm.formData.notes = 'Kontrollida aegumiskuupäeva'

    await wrapper.vm.handleUpdate()
    await flushPromises()

    expect(updateItemMock).toHaveBeenCalledWith(1, {
      id: 1,
      type: 'bike',
      name: 'Jahutusvedelik',
      category: 'Hooldus',
      quantity: 2,
      location: 'Riiul D',
      notes: 'Kontrollida aegumiskuupäeva',
    })
  })

  it('populates form when startEdit is called', () => {
    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    const testItem = mockBikeItems[0]
    wrapper.vm.startEdit(testItem)

    expect(wrapper.vm.editingId).toBe(1)
    expect(wrapper.vm.formData.name).toBe('Piduriklotsid')
    expect(wrapper.vm.formData.category).toBe('Hooldus')
    expect(wrapper.vm.formData.quantity).toBe(3)
    expect(wrapper.vm.formData.location).toBe('Riiul A')
    expect(wrapper.vm.formData.notes).toBe('Tagumine pidur')
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

    wrapper = mount(BikeInventory, {
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
    const errorRef = ref('Testi veateade')
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

    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Testi veateade')
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

    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    wrapper.vm.searchQuery = 'ketaspidur'
    const searchButton = wrapper.findAll('button').find((btn) => btn.text().includes('Otsi'))

    await searchButton!.trigger('click')
    await flushPromises()

    expect(searchItemsMock).toHaveBeenCalledWith('ketaspidur')
  })

  it('renders list of bike items when items are loaded', async () => {
    const { inventoryController: mockController } = await import(
      '@/controllers/inventoryController'
    )
    const itemsRef = ref(mockBikeItems)
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

    wrapper = mount(BikeInventory, {
      global: {
        stubs: ['font-awesome-icon'],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Piduriklotsid')
    expect(wrapper.text()).toContain('Hooldus')
    expect(wrapper.text()).toContain('Kett')
    expect(wrapper.text()).toContain('Ülekanne')
  })
})
