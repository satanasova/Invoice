import '../node_modules/jquery/dist/jquery.min.js';

function init() {
    getDate();
    initExistingProducts();
    addProduct();
    removeProduct();
    discountRange();
    watchProductUpdate();
}

function getDate() {
    $('.date').text(() => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    });
}

function initExistingProducts() {
    $('.product:not([data-template])').each((i, el) => initProduct(el));
}

let productIndex = 0;

function initProduct(product) {
    validateName(product);

    $(product).attr('id', productIndex++);
    const elID = $(product).attr('id');
    
    const inputs = $(product).find('input');
    inputs.each((idx,product) => {
        const id = $(product).attr('id', (idx, val) => {
           return val.split('-')[0]+'-'+elID;
        });  
    })
    
    const labels = $(product).find('label');
    labels.each((idx,el) => {
        const id = $(el).attr('for', (idx, val) => {
            return val.split('-')[0]+'-'+elID;
        });  
    })
}

function addProduct() {
    const btn = $('#add-product');
    const productTemplate = $('[data-template="product"]');
    productTemplate.remove();
    productTemplate.removeAttr('data-template')
    productTemplate.removeClass('d-none');
    const target = $('.product-container')

    btn.on('click', () => {
        let appended = productTemplate.clone().appendTo(target);
        // $(appended).attr('style', 'display: none!important');
        // $(appended).slideDown(300)
        $(appended).hide(0,function(){
            $(this).slideDown(300)
        });
        initProduct(appended);
        
    })
}

function removeProduct() {
    const productsContainer = $('.product-container');

    productsContainer.on('click', (e) => {
        const target = $(e.target);
        if (target.hasClass('remove-product')) {
            target.closest('.product').slideUp('fast', function() {
                $(this).remove();
                outputTotals();
            });
        }
    })
}

function watchProductUpdate() {
    $(document).on('input', 'input[type!=text]', outputTotals)
}

function calcProductTotal(product) {
    const qty = +$(product).find('[id^=qty]').val();
    const price = +$(product).find('[id^=price]').val();

    return qty * price;
}

function calcTotals() {
    let subTotal = 0;
    let discount = 0;
    let total = 0;
    const discVal = +$('#discount-text').val();

    $('.product-total').each((idx,el) => {
        const val = +$(el).val();
        subTotal += val;
    })

    if(discVal >= 0 & discVal <= 100) {
        discount = subTotal * discVal/100;
        $('#discount-text').removeClass('is-invalid')
    } else {
        $('#discount-text').addClass('is-invalid')
    }

    total = subTotal - discount;

    return {subTotal, discount, total};
}

function outputTotals(e) {
    $('.product').each((idx,el) => {
        const productTotal = calcProductTotal(el);
        $(el).find('[id^=total]').val(productTotal.toFixed(2));
    })
    
    const totals = calcTotals();
    $('.sub-total').text(totals.subTotal.toFixed(2) + ' Лв');
    $('.total-disc').text(totals.discount.toFixed(2) + ' Лв');
    $('.grand-total').text(totals.total.toFixed(2) + ' Лв');
}

function validateName(product) {
    let qty, price, name; 
     
    function validate() {
        qty = +$(product).find('[id^=qty]').val();
        price = +$(product).find('[id^=price]').val();
        name = $(product).find('[id^=name]');

        if ((qty>0 & price>0) & !name.val()) {
            name.addClass('is-invalid');
        } else {
            name.removeClass('is-invalid');
        }
    }

    $(product).on('input', validate);
}

function discountRange() {
    $('#discount-range').on('input', function() {
        $('#discount-text').val($(this).val());
    })

    $('#discount-text').on('input', function() {
        $('#discount-range').val($(this).val());
    })
}

init();


