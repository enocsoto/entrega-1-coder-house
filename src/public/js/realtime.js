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
            <button class="delete" data-id="${product._id}">Delete</button>
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
        thumbnails: getThumbnails()
    };

    socket.emit('newProduct', newProduct);
    productForm.reset();
    document.getElementById('thumbnailsList').innerHTML = '';
});

// Función para obtener las URLs de imágenes
function getThumbnails() {
    const thumbnailsElements = document.querySelectorAll('.thumbnail-item');
    const thumbnails = [];
    
    thumbnailsElements.forEach(item => {
        thumbnails.push(item.textContent.replace('×', '').trim());
    });
    
    const singleThumbnail = document.querySelector('#thumbnails').value;
    if (singleThumbnail) {
        thumbnails.push(singleThumbnail);
    }
    
    return thumbnails;
}

// Agregar funcionalidad para múltiples imágenes
document.getElementById('addImageBtn').addEventListener('click', () => {
    const thumbnailInput = document.querySelector('#thumbnails');
    const thumbnailValue = thumbnailInput.value.trim();
    
    if (thumbnailValue) {
        const thumbnailsList = document.getElementById('thumbnailsList');
        const thumbnailItem = document.createElement('div');
        thumbnailItem.className = 'thumbnail-item';
        thumbnailItem.textContent = thumbnailValue;
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-thumbnail';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => {
            thumbnailsList.removeChild(thumbnailItem);
        });
        
        thumbnailItem.prepend(removeBtn);
        thumbnailsList.appendChild(thumbnailItem);
        thumbnailInput.value = '';
    }
});