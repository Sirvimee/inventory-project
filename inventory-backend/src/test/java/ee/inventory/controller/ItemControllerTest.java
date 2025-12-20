package ee.inventory.controller;

import ee.inventory.model.Item;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

@MicronautTest
public class ItemControllerTest {

    @Inject
    @Client("/")
    HttpClient client;

    @Test
    @DisplayName("Should create and retrieve vinyl item")
    public void testCreateAndGetVinylItem() {
        // Arrange
        Item vinyl = Item.builder()
                .type("vinyl")
                .name("Dark Side of the Moon")
                .artist("Pink Floyd")
                .year(1973)
                .location("Riiul A")
                .notes("Klassika!")
                .build();

        // Act
        Item created = client.toBlocking().retrieve(
                HttpRequest.POST("/api/items", vinyl),
                Item.class
        );

        // Assert
        assertNotNull(created.getId());
        assertEquals("Dark Side of the Moon", created.getName());
        assertEquals("Pink Floyd", created.getArtist());
        assertEquals(1973, created.getYear());

    }

    @Test
    @DisplayName("Should create and retrieve bike item")
    public void testCreateAndGetBikeItem() {
        // Arrange
        Item bike = Item.builder()
                .type("bike")
                .name("Shimano pidurid")
                .category("Pidurid")
                .quantity(2)
                .location("Garaaž")
                .build();

        // Act
        Item created = client.toBlocking().retrieve(
                HttpRequest.POST("/api/items", bike),
                Item.class
        );

        // Assert
        assertNotNull(created.getId());
        assertEquals("Shimano pidurid", created.getName());
        assertEquals("Pidurid", created.getCategory());
        assertEquals(2, created.getQuantity());

    }

    @Test
    @DisplayName("Should search items by query")
    public void testSearch() {
        // Arrange
        Item vinyl = Item.builder()
                .type("vinyl")
                .name("Abbey Road")
                .artist("The Beatles")
                .year(1969)
                .build();

        client.toBlocking().retrieve(
                HttpRequest.POST("/api/items", vinyl),
                Item.class
        );

        // Act
        Item[] results = client.toBlocking().retrieve(
                HttpRequest.GET("/api/items/vinyl/search?q=Beatles"),
                Item[].class
        );

        // Assert
        assertTrue(results.length > 0);
        assertEquals("The Beatles", results[0].getArtist());

    }

    @Test
    @DisplayName("Should update item")
    public void testUpdateItem() {
        // Arrange
        Item original = Item.builder()
                .type("vinyl")
                .name("Test Album")
                .artist("Test Artist")
                .build();

        Item created = client.toBlocking().retrieve(
                HttpRequest.POST("/api/items", original),
                Item.class
        );

        // Act
        created.setLocation("Riiul B");
        created.setNotes("Uuendatud asukoht");

        Item updated = client.toBlocking().retrieve(
                HttpRequest.PUT("/api/items/" + created.getId(), created),
                Item.class
        );

        // Assert
        assertEquals("Riiul B", updated.getLocation());
        assertEquals("Uuendatud asukoht", updated.getNotes());

    }

    @Test
    @DisplayName("Should delete item")
    public void testDeleteItem() {
        // Arrange
        Item item = Item.builder()
                .type("bike")
                .name("Vana pump")
                .category("Pump")
                .quantity(1)
                .build();

        Item created = client.toBlocking().retrieve(
                HttpRequest.POST("/api/items", item),
                Item.class
        );

        // Act
        client.toBlocking().exchange(
                HttpRequest.DELETE("/api/items/" + created.getId())
        );

        // Assert
        Item[] remaining = client.toBlocking().retrieve(
                HttpRequest.GET("/api/items/bike"),
                Item[].class
        );

        boolean found = false;
        for (Item i : remaining) {
            if (i.getId().equals(created.getId())) {
                found = true;
                break;
            }
        }

        assertFalse(found, "Item should be deleted");

    }
}
