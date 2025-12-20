package ee.inventory.service;

import ee.inventory.model.Item;
import ee.inventory.repository.ItemRepository;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Singleton
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public List<Item> findByType(String type) {
        return itemRepository.findByType(type);
    }

    public List<Item> search(String type, String query) {
        return itemRepository.searchByTypeAndQuery(type, query);
    }

    public Item save(Item item) {
        return itemRepository.save(item);
    }

    public Item update(Long id, Item item) {
        item.setId(id);
        return itemRepository.update(item);
    }

    public void delete(Long id) {
        itemRepository.deleteById(id);
    }
}