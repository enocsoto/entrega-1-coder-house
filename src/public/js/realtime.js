const socket = io();

const productForm = document.querySelector('#productForm');
const productList = document.querySelector('#productList');

socket.on('products', (products) => {
    updateProductList(products);
});

function updateProductList(products) {
    productList.innerHTML = '';
    
    if (!products.length) {
        productList.innerHTML = '<p>No products to display.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const thumbnailsHtml = product.thumbnails && product.thumbnails.length > 0 
            ? `<p><strong>Imágenes:</strong> ${product.thumbnails.join(', ')}</p>` 
            : '';
        
        const statusClass = product.status ? 'status-available' : 'status-unavailable';
        
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Code:</strong> ${product.code}</p>
            <p><strong>Status:</strong> <span class="${statusClass}">${product.status ? 'Available' : 'Not available'}</span></p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            ${thumbnailsHtml}
            <div class="product-actions">
                <button class="delete" data-id="${product._id}">Delete</button>
                <button class="add-to-cart" data-id="${product._id}" ${!product.status ? 'disabled' : ''}>
                    ${product.status ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
        
        productList.appendChild(productCard);
    });
    
    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            socket.emit('deleteProduct', productId);
        });
    });

    // Agregar event listeners a los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            try {
                let cartId = localStorage.getItem('cartId');
                
                if (!cartId) {
                    const response = await fetch('/api/carts', {
                        method: 'POST'
                    });
                    const data = await response.json();
                    cartId = data._id;
                    localStorage.setItem('cartId', cartId);
                }
                
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: 1 })
                });
                
                if (response.ok) {
                    const result = confirm('Product added to cart successfully! Would you like to view your cart?');
                    if (result) {
                        window.location.href = `/cart/${cartId}`;
                    }
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Could not add product to cart'}`);
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
                alert('An error occurred while adding the product to cart');
            }
        });
    });
}

// Manejar el envío del formulario
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
      title: document.querySelector('#title').value,
      description: document.querySelector('#description').value,
      code: document.querySelector('#code').value,
      price: parseFloat(document.querySelector('#price').value),
      status: document.querySelector('#status').value === 'true',
      stock: parseInt(document.querySelector('#stock').value),
      category: document.querySelector('#category').value,
      thumbnails: [document.querySelector('#thumbnails').value],
    };

    socket.emit('newProduct', newProduct);
    productForm.reset();
});
