'use strict'

const categories = ["dairyProducts", 'meat', "drinks", "dryProducts", "cosmetics", "sweets", "other"];
const productsDiv = document.querySelector('#products');
const productsToBuy = document.createElement('h2');
//fetch existing products from localStorage
const getProducts = function(){
    let productsJSON = localStorage.getItem('products');
    try{
        return productsJSON ? JSON.parse(productsJSON): [];
    } catch(e){
        return [];
    }
    
}
//save products to localStorage
const saveProducts = function (products){
    localStorage.setItem('products', JSON.stringify(products));
}
const removeProduct = (id) => {
    const index = products.findIndex((product)=> {
        return product.id === id;
    })
    if(index >= 0){
        products.splice(index, 1);
    }   
}
//change from bought or vice versa
const toogleBuy = (id, checkobxState) => {
    const productToChange = products.find((product) => {
        return product.id === id
    })
    if(productToChange){
        productToChange.bought=checkobxState;
    }
    
}
//get the DOM element for an individual product
const generateProductDOM = (product, category) => {
    const productEl = document.createElement('div');
    const containerEl1 = document.createElement('div');
    const containerEl2 = document.createElement('div');
    //create checkobx
    const checkobx = document.createElement('input');
    checkobx.setAttribute('type', 'checkbox');
    checkobx.setAttribute('id', product.id);
    if(product.bought){
        checkobx.checked = true;
    }
    checkobx.addEventListener('change', ()=>{
        toogleBuy(product.id, checkobx.checked);
        saveProducts(products);
        //renderProducts(products, filters);
        productsToBuy.innerHTML='';
        const productsNotBought = products.filter((product)=> {
            return !product.bought 
        })
        generateSummaryDOM(productsNotBought);
        refreshNumberOfProductsToBuy(product.category);
        if(filters.hideBought && checkobx.checked){
            productEl.remove();
        }
    })
    
    //create text for product
    const productText = document.createElement('label');
        if(product.text.length>0){
            productText.textContent = product.text;
        } else {
            productText.textContent = 'Unnamed product';
        }
    productText.setAttribute('for', product.id);
    //Setup container
    productEl.classList.add('list-item');
    containerEl1.classList.add('list-item__container');
    containerEl2.classList.add('list-item__container');
    productEl.appendChild(containerEl1);
    productEl.appendChild(containerEl2);

    //create button to remove product
    const button = document.createElement('button');
    //set text for buttom
    button.textContent = 'remove';
    button.classList.add('button', 'button--text')
    button.addEventListener('click', ()=>{
        removeProduct(product.id);
        saveProducts(products);
        renderProducts(products, filters);
    });
    containerEl1.appendChild(checkobx);
    containerEl1.appendChild(productText);
    containerEl2.appendChild(button);
    
    return productEl;
        
}
const refreshNumberOfProductsToBuy = (category) => {
    let spanWithProductsToBuy = document.querySelector(`#${category}`);
    const productsToBuyFromThisCategory = products.filter((product)=> {
        return !product.bought && product.category === category
    })
     spanWithProductsToBuy.innerHTML = `${productsToBuyFromThisCategory.length} to buy`;
    //console.log(productsToBuyFromThisCategory.length);
    //spanWithProductsToBuy = generateCategoryNumberOfProductsToBuy(productsToBuyFromThisCategory.length, category);
}
//render ToDos
const renderProducts = function(products, filters){
    let filteredProducts = products.filter((product)=>{
        return product.text.toLowerCase().includes(filters.searchText.toLowerCase());
    })
    //sort filteredProducts alpabetically
    filteredProducts.sort((a,b)=>{
        if(a.category < b.category) {
            return -1;
        } else if(a.category > b.category){
            return 1;
        } else {
            return 0;
        }
    })
    let productsNotBought = filteredProducts.filter((product) => {
        return !product.bought; 
    })
    //console.log(productsNotBought);
    

    if(filters.hideBought){
        filteredProducts = productsNotBought;
    }

    productsDiv.innerHTML='';
    
    const productsToBuy = generateSummaryDOM(productsNotBought);
    productsDiv.appendChild(productsToBuy);
    categories.forEach((category)=>{
        const productsNotBoughtFromThisCategory = productsNotBought.filter((product)=>{
            return product.category === category;
        })
        const allProductsFromThisCategory = filteredProducts.filter((product)=>{
            return product.category === category;
        })
        if(allProductsFromThisCategory.length > 0){
            const categoryParagraph = generateCategoryParagraph(category, productsNotBoughtFromThisCategory.length, allProductsFromThisCategory);
            productsDiv.appendChild(categoryParagraph);
        }
        
    })

    /*if(filteredProducts.length > 0){
       filteredProducts.forEach((product) => {
        const productParagraph =  generateProductDOM(product);
        productsDiv.appendChild(productParagraph);
        })  
    }else{
        const emptyParagrapgh = document.createElement('p');
        emptyParagrapgh.textContent='No products to show';
        emptyParagrapgh.classList.add('empty-message');
        productsDiv.appendChild(emptyParagrapgh);
    }*/
   
}
//get the DOM element for list summary
const generateSummaryDOM = function(products){
    productsToBuy.classList.add('list-title');
    let productsString='';
    products.length === 1 ? productsString='product' : productsString='products'
    productsToBuy.textContent = `You have ${products.length} ${productsString} to buy`;
    return productsToBuy;
}
const generateCategoryText = (category) => {
    const categoryText = document.createElement('span');
    categoryText.classList.add('category-text');
    categoryText.textContent=category;
    return categoryText;
}
const generateCategoryNumberOfProductsToBuy = (numberOfProducts, category) => {
    const categoryNumberOfProductsToBuy = document.createElement('span');
    categoryNumberOfProductsToBuy.setAttribute('id', category);
    categoryNumberOfProductsToBuy.textContent = `${numberOfProducts} to buy`;
    categoryNumberOfProductsToBuy.classList.add('category-toBuy');
    return categoryNumberOfProductsToBuy;
}
const generateCategoryParagraph = function(category, numberOfProducts, allProductsFromThisCategory){
    //console.log(allProductsFromThisCategory);
    const categoryEl = document.createElement('div');
    categoryEl.classList.add('category-item');
    let categoryShow = false; 
    /*categoryEl.appendChild(categoryText);
    categoryEl.appendChild(categoryNumberOfProductsToBuy);*/
    categoryEl.appendChild(generateCategoryText(category));
    categoryEl.appendChild(generateCategoryNumberOfProductsToBuy(numberOfProducts, category));

    categoryEl.addEventListener('click', (e)=>{
        if(!categoryShow){
            allProductsFromThisCategory.forEach((product)=>{
            const productElFromThisCategory = generateProductDOM(product, category);
            productElFromThisCategory.addEventListener('click', (e)=> {
                console.log("Element was clicked");
                e.stopPropagation();
            })
            categoryEl.appendChild(productElFromThisCategory);
            categoryShow = true;
            })   
        } else {
            categoryEl.innerHTML='';
            categoryEl.appendChild(generateCategoryText(category));
            categoryEl.appendChild(generateCategoryNumberOfProductsToBuy(numberOfProducts, category));
            categoryShow = false;
        }
        
        /*const reg = new RegExp('^[a-zA-Z]+$');
        const categoryMatch = reg.exec(e.target.textContent);
        if(categoryMatch){
            const category=categoryMatch[0];
            console.log(category);
        }*/
        
    });

    return categoryEl;
}
