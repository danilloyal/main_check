let formId = 0;
let currentElement = null;
let currentOptions = [];

function addOption() {
    const newOptionValue = document.getElementById('new-option').value;
    if (!newOptionValue) {
        alert("O valor da nova opção é obrigatório.");
        return;
    }
    
    currentOptions.push(newOptionValue);
    displayCurrentOptions();
    
    document.getElementById('new-option').value = ''; // Clear the new option input field
}

function displayCurrentOptions() {
    const currentOptionsDiv = document.getElementById('current-options');
    currentOptionsDiv.innerHTML = '';
    
    currentOptions.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.textContent = option;

        const removeOptionButton = document.createElement('button');
        removeOptionButton.type = 'button';
        removeOptionButton.textContent = 'Remover';
        removeOptionButton.onclick = () => {
            currentOptions.splice(index, 1);
            displayCurrentOptions();
        };

        optionItem.appendChild(removeOptionButton);
        currentOptionsDiv.appendChild(optionItem);
    });
}

function confirmElement() {
    formId++;
    const elementName = document.getElementById('element-name').value;
    if (!elementName) {
        alert("O nome do elemento é obrigatório.");
        return;
    }

    const form = document.getElementById('custom-form');
    let label = document.createElement('label');
    label.textContent = `${elementName}: `;
    let element;

    switch (currentElement) {
        case 'select':
            element = document.createElement('select');
            element.name = elementName;
            currentOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.toLowerCase().replace(/\s+/g, '-');
                opt.text = option;
                element.add(opt);
            });
            break;
        case 'checkbox':
            element = document.createElement('div');
            element.className = 'checkbox-group';
            currentOptions.forEach(option => {
                const checkboxLabel = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = elementName;
                checkbox.value = option.toLowerCase().replace(/\s+/g, '-');

                checkboxLabel.textContent = option;
                checkboxLabel.appendChild(checkbox);
                element.appendChild(checkboxLabel);
            });
            break;
        case 'text':
            element = document.createElement('input');
            element.type = 'text';
            element.name = elementName;
            element.placeholder = 'Digite o texto';
            break;
        case 'textarea':
            element = document.createElement('textarea');
            element.name = elementName;
            element.placeholder = 'Digite um texto mais longo';
            break;
        case 'file':
            element = document.createElement('input');
            element.type = 'file';
            element.name = elementName;
            break;
        case 'date':
            element = document.createElement('input');
            element.type = 'date';
            element.name = elementName;
            break;
        case 'time':
            element = document.createElement('input');
            element.type = 'time';
            element.name = elementName;
            break;
        default:
            alert('Tipo de elemento inválido.');
            return;
    }

    const formElement = document.createElement('div');
    formElement.className = 'form-element';
    formElement.appendChild(label);
    formElement.appendChild(element);
    formElement.appendChild(createRemoveButton(formElement));
    form.appendChild(formElement);

    clearCurrentElement();
}

function toggleOptionInput() {
    const elementType = document.getElementById('element-type').value;
    currentElement = elementType;
    if (elementType === 'select' || elementType === 'checkbox') {
        showOptionInput();
        showConfirmButton(); // Mostrar o botão de confirmação se o tipo for 'select' ou 'checkbox'
    } else {
        hideOptionInput();
        showConfirmButton(); // Mostrar o botão de confirmação para outros tipos de elementos
    }
}
function showConfirmButton() {
    document.getElementById('confirm-element').style.display = 'inline-block';
}

function showOptionInput() {
    document.getElementById('select-options').style.display = 'flex';
    document.getElementById('confirm-element').style.display = 'inline-block';
    currentOptions = [];
    displayCurrentOptions();
}

function hideOptionInput() {
    document.getElementById('select-options').style.display = 'none';
    document.getElementById('confirm-element').style.display = 'none';
    currentOptions = [];
}

function clearCurrentElement() {
    document.getElementById('element-name').value = ''; // Clear the input field
    document.getElementById('element-type').selectedIndex = 0; // Reset the select field
    hideOptionInput();
    currentElement = null;
}

function createRemoveButton(formElement) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Remover';
    button.onclick = () => formElement.remove();
    return button;
}

function clearForm() {
    const form = document.getElementById('custom-form');
    form.innerHTML = '';
}

function saveForm() {
    const form = document.getElementById('custom-form');
    const formTemplate = {
        name: document.getElementById('form-name').value || "Unnamed Form",
        fields: {}
    };

    Array.from(form.elements).forEach(element => {
        if (element.tagName.toLowerCase() !== 'button') {
            if (element.type === 'select-one' || element.type === 'checkbox') {
                formTemplate.fields[element.name] = {
                    type: element.type,
                    options: currentOptions
                };
            } else {
                formTemplate.fields[element.name] = {
                    type: element.type
                };
            }
        }
    });

    console.log(JSON.stringify(formTemplate));

    // Enviar o template para a API
    fetch('/api/forms/template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formTemplate),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.getElementById('element-type').addEventListener('change', toggleOptionInput);
document.getElementById('add-option').addEventListener('click', addOption);
document.getElementById('confirm-element').addEventListener('click', confirmElement);
document.getElementById('clear-form').addEventListener('click', clearForm);
document.getElementById('save-form').addEventListener('click', saveForm);

