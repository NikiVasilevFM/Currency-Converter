
const inputLeft = document.querySelector('.input-left');
const inputRight = document.querySelector('.input-right');
const imgArrows = document.querySelector('.img-arrows');


let base = 'RUB';
let symbols = 'USD';
let leftDiv = document.querySelector('.left-contaner');
let rightDiv = document.querySelector('.right-contaner');
let baseDiv = leftDiv;
let symbolsDiv = rightDiv;

getСurrency ();

const inputs = document.querySelectorAll('.input input');
inputs.forEach((item => {
    item.addEventListener('input', () => {
        item.value = item.value.replace(/[^\d.,]/,'');
        item.value = item.value.replace(/,/,'.');
    })
}))

console.dir(inputLeft);
inputLeft.onfocus = () => {
    if(baseDiv === rightDiv) {
        swapBaseSymbols ();
    }
}

inputRight.onfocus = () => {
    if(baseDiv === leftDiv) {
        swapBaseSymbols ();
    }
}

inputLeft.addEventListener('input', () => {
    baseDiv = leftDiv;
    symbolsDiv = rightDiv;
    baseDivButtonsOptionsClick(baseDiv);
    symbolsDivButtonsOptionsClick(symbolsDiv);
    makeRequest(base, symbols, baseDiv, symbolsDiv);
})

inputRight.addEventListener('input', () => {
    baseDiv = rightDiv;
    symbolsDiv = leftDiv;
    baseDivButtonsOptionsClick(baseDiv);
    symbolsDivButtonsOptionsClick(symbolsDiv);
    makeRequest(base, symbols, baseDiv, symbolsDiv);
})

baseDivButtonsOptionsClick(baseDiv);
symbolsDivButtonsOptionsClick(symbolsDiv);
makeRequest(base, symbols, baseDiv, symbolsDiv);

imgArrows.addEventListener('click', () => {
    swapBaseSymbols();
    swapActiveButtons();
    swapInput();
    swapP ();
    swapOption ();
})

function swapBaseSymbols () {
    const temp = base;
    base = symbols;
    symbols = temp;
}

function swapActiveButtons () {
    let baseActiveButton = baseDiv.querySelector('.button-active');
    let symbolsActiveButton = symbolsDiv.querySelector('.button-active');
    const btnBase = baseDiv.querySelectorAll('.btn');
    const btnSymbols = symbolsDiv.querySelectorAll('.btn');
    btnBase.forEach((item) => {
        if(item.innerText === symbolsActiveButton.innerText) {
            baseActiveButton.classList.remove('button-active');
            item.classList.add('button-active');
        }
    })
    btnSymbols.forEach((item) => {
        if(item.innerText === baseActiveButton.innerText) {
            symbolsActiveButton.classList.remove('button-active');
            item.classList.add('button-active');
        }
    })
}

function swapInput() {
    const temp = inputLeft.value;
    inputLeft.value = inputRight.value;
    inputRight.value = temp;
}

function swapP () {
    const baseP = baseDiv.querySelector('.input p');
    const symbolsP = symbolsDiv.querySelector('.input p');
    const basePText = baseP.innerText;
    baseP.innerText = symbolsP.innerText;
    symbolsP.innerText = basePText;
}

function swapOption () {
    const selectBase = baseDiv.querySelector('.btn-add');
    const selectSymbols = symbolsDiv.querySelector('.btn-add');

    let temp = selectBase.selectedIndex;
    selectBase.selectedIndex = selectSymbols.selectedIndex;
    selectSymbols.selectedIndex = temp;
}

function baseDivButtonsOptionsClick () {
    const btnBase = baseDiv.querySelectorAll('.buttons button');
    btnBase.forEach((item) => {
        item.onclick = () => {
            baseDiv.querySelector('.button-active').classList.remove('button-active');
            item.classList.add('button-active');
            base = item.innerText;
        
            makeRequest(base, symbols, baseDiv, symbolsDiv);
        }
    })
    const selectBase = baseDiv.querySelector('.btn-add');
    selectBase.onchange = () => {
        baseDiv.querySelector('.button-active').classList.remove('button-active');
        selectBase.classList.add('button-active');
        base = selectBase.options[selectBase.selectedIndex].innerText;
        
        makeRequest(base, symbols, baseDiv, symbolsDiv);
    }
}


function symbolsDivButtonsOptionsClick () {
    const btnSymbols = symbolsDiv.querySelectorAll('.buttons button');
    btnSymbols.forEach((item) => {
        item.onclick = () => {
            symbolsDiv.querySelector('.button-active').classList.remove('button-active');
            item.classList.add('button-active');
            symbols = item.innerText;
    
            makeRequest(base, symbols, baseDiv, symbolsDiv);
        }
    })
    const selectSymbols = symbolsDiv.querySelector('.btn-add');
    selectSymbols.onchange = () => {
        symbolsDiv.querySelector('.button-active').classList.remove('button-active');
        selectSymbols.classList.add('button-active');
        symbols = selectSymbols.options[selectSymbols.selectedIndex].innerText;
        
        makeRequest(base, symbols, baseDiv, symbolsDiv);
    }
}


function getСurrency () {
    const requestPromise = fetch('https://api.exchangerate.host/latest')
    requestPromise.then((response) => {
        if(response.status === 200) {
            return response.json()
        } else {
            throw new Error(response.status)
        } 
    }) .then((result) => {
        const btnBase = baseDiv.querySelectorAll('.buttons button');
        const btnSymbols = symbolsDiv.querySelectorAll('.buttons button');
        let arr = ["RUB", "USD", "EUR", "GBP"];
        
        let i = 0;
        let allСurrency = result.rates;
        for (key in allСurrency) {
            if(arr.indexOf(key) !== -1 && i < 4) {
                btnBase[arr.indexOf(key)].textContent = key;
                btnSymbols[arr.indexOf(key)].textContent = key;
                delete allСurrency[key];
                i++;
            }
        }

        const selectBase = baseDiv.querySelector('.btn-add');
        const selectSymbols = symbolsDiv.querySelector('.btn-add');
        for(key in allСurrency) {
             const newBaseOption = new Option (key);
             const newSymbolsOption = new Option (key);
             newBaseOption.classList.add('btn');
            //  newBaseOption.value = key;
             newSymbolsOption.classList.add('btn');
            //  newSymbolsOption.value = key;
             selectBase.append(newBaseOption);
             selectSymbols.append(newSymbolsOption);
        }
    }) .catch((err) => {
        console.log('Error');
        console.log(err);
    })
}

function makeRequest(base, symbols, baseDiv, symbolsDiv) {
    console.log(base, symbols);
    const baseNumber = Number(baseDiv.querySelector('.input input').value);
    console.log(baseNumber);
    const paramsString = new URLSearchParams({base: base, symbols: symbols});

    const requestPromise = fetch('https://api.exchangerate.host/latest?' + paramsString)
    requestPromise.then((response) => {
        if(response.status === 200) {
            return response.json()
        } else {
            throw new Error(response.status)
        } 
    }) .then((result) => {
        console.log(result);
        const symbolsValue = result.rates[symbols].toFixed(4);
        const baseValue = (1 / symbolsValue).toFixed(4);
        
        baseDiv.querySelector('.input p').innerText = `1 ${base} = ${symbolsValue} ${symbols}`;
        symbolsDiv.querySelector('.input p').innerText = `1 ${symbols} = ${baseValue} ${base}`;

        symbolsDiv.querySelector('.input input').value = symbolsValue * baseNumber;
    }) .catch((err) => {
        alert(`Что-то пошло не так. 
${err}`);
        console.log(err);
    })
}