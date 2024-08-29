

function addToCart(productId) {
    fetch(`/api/products/${productId}/add-to-cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            alert('Product added to cart!');
        } else {
            alert('Failed to add product to cart.');
        }
    });
}