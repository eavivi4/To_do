let addButton = document.getElementById('add');
let container = document.getElementById('to_dos');
let user_input = document.getElementById('user_in');

addButton.addEventListener('click', function() {
    // Make a paragraph element
    var paragraph = document.createElement('p');
    // Change the inner text of this paragraph to the value entered by the user
    paragraph.innerText = user_input.value;
    // Add this element into the container for the to do list
    container.appendChild(paragraph);
    // Empty input
    user_input.value = "";

    // Clicking on an element, line through
    paragraph.addEventListener('click', function() {
        paragraph.style.textDecoration = "line-through";
    })

    // Double clicking an element, remove
    paragraph.addEventListener('dblclick', function() {
        container.removeChild(paragraph);
    })
})

