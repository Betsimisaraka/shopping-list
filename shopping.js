console.log('it works');

const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

//we need an array to hold our state
let items = [];

const handleSubmit = e => {
    e.preventDefault();//prevent the page from reloading
    const name = e.currentTarget.item.value;
    //if it is empty don't submit it
    if (!name) return;
    const item = {
        name: name,
        id: Date.now(),
        complete: false,
    };
    items.push(item);
    console.info(`There are now ${items.length} in your state`);
    e.target.reset();
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

const displayItems = () => {
    const html = items.map(
        item => `
            <li class="shopping-item">
                <input 
                    type="checkbox" 
                    ${item.complete ? "checked" : ''}
                    value="${item.id}">
                <span class="itemName">${item.name}</span>
                <button 
                    aria-label="Remove ${item.name}"
                    value="${item.id}"
                >&times;</button> 
            </li>`).join('');
    list.innerHTML = html;
};

const mirrorToLocalStorage = () => {
    console.info('mirroring items to local storage');
    localStorage.setItem('items', JSON.stringify(items));
};

const restoreFromLocalStorage = () => {
    console.info('restoring from LS');
    const lsItems = JSON.parse(localStorage.getItem('items'));
    //check if there is something inside local storage
    if (lsItems) {
        items.push(...lsItems);
    }
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

const deleteItem = (id) => {
    console.log('delete item', id);
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

const markAsComplete = (id) => {
    console.log('complete', id);
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

list.addEventListener('click', function(e) {
    const id = Number(e.target.value);
    if (e.target.matches('button')) {
        deleteItem(id);
    }
    if (e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    }
});

restoreFromLocalStorage();
