package ee.inventory.controller;

import ee.inventory.model.Item;
import ee.inventory.service.ItemService;
import io.micronaut.http.annotation.*;
import io.micronaut.http.server.cors.CrossOrigin;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Controller("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @Get("/{type}")
    public List<Item> getAllByType(@PathVariable String type) {
        return itemService.findByType(type);
    }

    @Get("/{type}/search")
    public List<Item> search(@PathVariable String type, @QueryValue String q) {
        return itemService.search(type, q);
    }

    @Post
    public Item create(@Body Item item) {
        return itemService.save(item);
    }

    @Put("/{id}")
    public Item update(@PathVariable Long id, @Body Item item) {
        return itemService.update(id, item);
    }

    @Delete("/{id}")
    public void delete(@PathVariable Long id) {
        itemService.delete(id);
    }
}
