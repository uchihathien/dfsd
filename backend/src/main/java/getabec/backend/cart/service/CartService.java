package getabec.backend.cart.service;

import getabec.backend.cart.dto.CartDto;
import getabec.backend.cart.dto.CartItemDto;
import getabec.backend.cart.model.Cart;
import getabec.backend.cart.model.CartItem;
import getabec.backend.cart.repo.CartItemRepository;
import getabec.backend.cart.repo.CartRepository;
import getabec.backend.product.model.ProductVariant;
import getabec.backend.product.repo.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository itemRepo;
    private final ProductVariantRepository variantRepo;

    @Transactional
    public CartDto getOrCreate(UUID cartId) {
        Cart cart = (cartId != null)
                ? cartRepo.findById(cartId).orElseGet(Cart::new)
                : new Cart();
        if (cart.getId() == null) {
            cartRepo.save(cart);
        }
        return toDto(cart);
    }

    @Transactional
    public CartDto addItem(UUID cartId, Long variantId, int quantity) {
        if (quantity <= 0) quantity = 1;

        Cart cart = (cartId != null)
                ? cartRepo.findById(cartId).orElseGet(Cart::new)
                : new Cart();
        if (cart.getId() == null) cartRepo.save(cart);

        ProductVariant variant = variantRepo.findById(variantId)
                .orElseThrow(() -> new NoSuchElementException("Variant not found"));

        Optional<CartItem> existed = cart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .findFirst();
        if (existed.isPresent()) {
            existed.get().setQuantity(existed.get().getQuantity() + quantity);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(quantity)
                    .build();
            cart.getItems().add(item);
        }
        cartRepo.save(cart);
        return toDto(cart);
    }

    @Transactional
    public CartDto updateItem(Long itemId, int quantity) {
        CartItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found"));
        if (quantity <= 0) {
            Cart cart = item.getCart();
            cart.getItems().remove(item);
            itemRepo.delete(item);
            return toDto(cart);
        }
        item.setQuantity(quantity);
        return toDto(item.getCart());
    }

    @Transactional(readOnly = true)
    public CartDto getById(UUID cartId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new NoSuchElementException("Cart not found"));
        return toDto(cart);
    }

    private CartDto toDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream().map(i -> CartItemDto.builder()
                .id(i.getId())
                .variantId(i.getVariant().getId())
                .sku(i.getVariant().getSku())
                .productName(i.getVariant().getProduct().getName())
                .thumbnailUrl(i.getVariant().getProduct().getThumbnailUrl())
                .price(i.getVariant().getPrice())
                .quantity(i.getQuantity())
                .stockQty(i.getVariant().getStockQty())
                .build()).collect(Collectors.toList());

        int totalQty = items.stream().mapToInt(CartItemDto::getQuantity).sum();
        BigDecimal subtotal = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.builder()
                .id(cart.getId())
                .items(items)
                .totalQty(totalQty)
                .subtotal(subtotal)
                .build();
    }

    //================================================================
    //  MERGE CART GUEST -> USER  (ĐÃ SỬA LỖI ObjectDeletedException)
    //================================================================
    @Transactional
    public CartDto attachOrMerge(UUID guestCartId, Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        // cart hiện tại của user (tạo mới nếu chưa có)
        Cart userCart = getOrCreateEntityForUser(userId);

        // không có guest cart thì trả luôn cart user
        if (guestCartId == null) {
            return toDto(userCart);
        }

        Cart guest = cartRepo.findById(guestCartId).orElse(null);
        if (guest == null) {
            return toDto(userCart);
        }

        // Nếu guest cart đã là cart của user này luôn thì trả về luôn
        if (Objects.equals(guest.getUserId(), userId)) {
            return toDto(guest);
        }

        // Map variantId -> CartItem trong userCart
        Map<Long, CartItem> userMap = userCart.getItems().stream()
                .collect(Collectors.toMap(
                        i -> i.getVariant().getId(),
                        i -> i
                ));

        // Duyệt item trong guest bằng Iterator để remove an toàn
        Iterator<CartItem> it = guest.getItems().iterator();
        while (it.hasNext()) {
            CartItem gi = it.next();
            Long vid = gi.getVariant().getId();
            CartItem ui = userMap.get(vid);

            if (ui != null) {
                // Nếu userCart đã có variant này -> cộng dồn số lượng
                ui.setQuantity(ui.getQuantity() + gi.getQuantity());

                // Bỏ gi khỏi guest. orphanRemoval/cascade sẽ lo phần delete.
                it.remove();
                // KHÔNG gọi itemRepo.delete(gi); tránh trạng thái "DELETED" rồi lại merge
            } else {
                // Chuyển item từ guest sang userCart
                it.remove();              // bỏ khỏi guest
                gi.setCart(userCart);     // đổi owner
                userCart.getItems().add(gi);
                userMap.put(vid, gi);
            }
        }

        // set owner cho userCart
        userCart.setUserId(userId);

        // Không cần xóa guest cart; sau login cookie sẽ trỏ sang userCart.id
        // Nếu vẫn muốn dọn DB sau này có thể làm cron/job riêng.

        // Flush thay đổi của userCart; không còn tham chiếu tới entity đã delete
        cartRepo.save(userCart);

        return toDto(userCart);
    }

    // ===== helpers private =====

    private Cart getOrCreateEntityForUser(Long userId) {
        return cartRepo.findByUserId(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.setUserId(userId);
            return cartRepo.save(c);
        });
    }

    @Transactional
    public CartDto getOrCreateForUser(Long userId) {
        Cart c = cartRepo.findByUserId(userId).orElseGet(() -> {
            Cart nc = new Cart();
            nc.setUserId(userId);
            return cartRepo.save(nc);
        });
        return toDto(c);
    }

    @Transactional
    public CartDto addItemForUser(Long userId, Long variantId, int quantity) {
        Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> {
            Cart nc = new Cart();
            nc.setUserId(userId);
            return cartRepo.save(nc);
        });
        if (quantity <= 0) quantity = 1;

        ProductVariant variant = variantRepo.findById(variantId)
                .orElseThrow(() -> new NoSuchElementException("Variant not found"));

        Optional<CartItem> existed = cart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .findFirst();
        if (existed.isPresent()) {
            existed.get().setQuantity(existed.get().getQuantity() + quantity);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart).variant(variant).quantity(quantity).build();
            cart.getItems().add(item);
        }
        cartRepo.save(cart);
        return toDto(cart);
    }
}
