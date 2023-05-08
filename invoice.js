let products = [];

let cart = [];


const handleCartItemChange = (qty, item_id) => {
    console.log(qty, item_id);
    cart.map(item => {
        if (item.id == item_id) {
            item.qty = qty
            item.total_price = item.unit_price * qty;

            renderCart();
        }
    })
}

function renderCart() {
    //updating cart
    let cart_elem = document.getElementById('cart');
    cart_elem.innerHTML = '';

    cart.forEach(function (item) {
        // create a new table row for each product
        const row = document.createElement('tr');
        // set the SKU, Name, Price, and Stock values for the product
        row.innerHTML = `
        <tr>
        <td>${item.name}</td>
        <td>
            <input onchange="handleCartItemChange(this.value, ${item.id})" type="number" value="${item.qty}" class="form-control">
        </td>
        <td>
            <input disabled type="number" value="${item.unit_price}" class="form-control">
        </td>
        <td>
            <input disabled type="number" value="${item.total_price}" class="form-control">
        </td>
    </tr>
`;
        // add the row to the tbody element
        cart_elem.appendChild(row);
    });

    handleCartCalc();
}

function handleCartCalc() {
    let cart_total = 0;
    let cart_vat = 0;

    cart.forEach(item => {
        cart_vat = cart_vat + parseInt((item.total_price * parseInt(item.vat)) / 100);
    })
    document.getElementById('cart-vat').value = cart_vat;


    cart.forEach(item => {
        cart_total = cart_total + parseInt(item.total_price);
    })

    console.log(cart_total);
    document.getElementById('cart-total').value = cart_total + cart_vat;
}

const handleAddProductToCart = () => {
    let prod_id = document.getElementById('prod-list').value
    // console.log(products);
    products.forEach(prod => {
        if (prod_id == prod.id) {
            console.log(prod);
            let item = {
                name: prod.name,
                id: prod.id,
                qty: 1,
                unit_price: prod.price,
                total_price: prod.price,
                vat: prod.vat
            }

            cart.push(item);
        }
    })

    console.log(cart);
    renderCart();
}

const handleAddProductToCartV2 = (prod_id) => {

    // console.log(products);
    products.forEach(prod => {
        if (prod_id == prod.id) {
            console.log(prod);
            let item = {
                name: prod.name,
                id: prod.id,
                qty: 1,
                unit_price: prod.price,
                total_price: prod.price,
                vat: prod.vat
            }

            cart.push(item);
        }
    })

    console.log(cart);
    renderCart();
}


const addProdUsingSKU = () => {
    let id = document.getElementById('skuAdd').value;
    if (!id) {
        Toastify({
            text: 'Please enter SKU',
            duration: 3000,
            position: 'center'
        }).showToast();
        return;
    }

    axios.get(`http://localhost/cse-482-server/api/get-product.php?id=${id}`).then(response => {
        console.log(response.data.productInfo[0].id);
        handleAddProductToCartV2(response.data.productInfo[0].id);
    }).catch(err => {
        Toastify({
            text: 'Invalid SKU',
            duration: 3000,
            position: 'center'
        }).showToast();
    })
}


const handleInvoiceCreate = e => {
    e.preventDefault();
    const form = document.getElementById('invoice-form');

    // get the form data
    const formData = new FormData(form);
    console.log(formData);
    formData.append('products', JSON.stringify(cart));
    // convert the form data to URL encoded format
    const urlEncodedData = new URLSearchParams(formData).toString();
    console.log(urlEncodedData);

    // make an AJAX request using Axios
    axios.post('http://localhost/cse-482-server/api/create-invoice.php', urlEncodedData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(function (response) {
            console.log(response.data);

            if (formData.get('pm') === 'cash') {
                window.location.replace('/manage-invoices.html')
            } else {
                window.location.replace(`http://localhost/cse-482-server/checkout_hosted.php?total_amount=${formData.get('total_price')}&invoice=${formData.get('id')}`);
            }
            // do something with the response
        })
        .catch(function (error) {
            console.log(error);
            // handle the error
        });
}