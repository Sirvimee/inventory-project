package ee.inventory.repository;

import ee.inventory.model.Item;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;
import io.micronaut.data.annotation.Query;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByType(String type);

    @Query("SELECT i FROM Item i WHERE i.type = :type AND " +
            "(LOWER(i.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.artist) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Item> searchByTypeAndQuery(String type, String query);
}
