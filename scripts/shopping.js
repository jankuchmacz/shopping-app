'use strict'

const products = getProducts();

const filters = {
    searchText: '',
    hideBought: false
}


renderProducts(products, filters);


document.querySelector('#search-text').addEventListener('input', function(e){
    filters.searchText = e.target.value;
    renderProducts(products, filters);
})

document.querySelector('#new-todo').addEventListener('submit', function(e){
    
    const newProduct = e.target.elements.newProduct.value.trim();
    const category = e.target.elements.Category.value;
    e.preventDefault();
    //console.log(category);
    if(newProduct.length===0){
        return;
    }
    let product = {
        id: uuidv4(),
        text: newProduct,
        bought: false,
        category
    } 
    products.push(product); 
    saveProducts(products);
    renderProducts(products, filters); 
    e.target.elements.newProduct.value='';
})
document.querySelector('#hide-completed').addEventListener('change', function(e){
    filters.hideBought = e.target.checked;
    renderProducts(products, filters);
})

/*const paragraphsToRemove = document.querySelectorAll('p');
paragraphsToRemove.forEach(function(paragraphToRemove){
    if(paragraphToRemove.textContent.includes('the')){
        paragraphToRemove.remove();
    }
})*/
/*document.querySelector('#add-todo').addEventListener('click', function(){
    console.log('I added new todo');
})*/




