let addButton = document.getElementById('add');
let container = document.getElementById('to_dos');
let user_input = document.getElementById('user_in');

addButton.addEventListener('click', function() {
    // Make a paragraph element, div, and button elements
    var div = document.createElement('div');
    var paragraph = document.createElement('p');
    var check_button = document.createElement('button');
    // Change the inner text of this paragraph to the value entered by the user
    paragraph.innerText = user_input.value;
    
    // Set class for button and div
    check_button.className = 'check_button';
    div.className = 'element';

    // Add both paragraph element and button to the div for the item on list
    container.appendChild(div);
    div.appendChild(check_button);
    div.appendChild(paragraph);
    // Empty input
    user_input.value = "";

    // Clicking on an element, line through
    paragraph.addEventListener('click', function() {
        paragraph.style.textDecoration = "line-through";
    })

    // Double clicking an element, remove
    paragraph.addEventListener('dblclick', function() {
        container.removeChild(div);
    })

    // Clicking on check button, will fill it with color
    check_button.addEventListener('click', function() {
        check_button.id = 'checked';
    })

    // Double clicking check button will uncolor it
    check_button.addEventListener('dblclick', function() {
        check_button.removeAttribute('id');
    })
})

