const currencyDropdownsEl = document.querySelectorAll('.drops');
const fromLogoEl = document.querySelector('.fromLogo');
const toLogoEl = document.querySelector('.toLogo');
const buttonEl = document.querySelector('.btn');
const inputEl = document.querySelector('.from');

let countryCodes = [];

window.addEventListener("DOMContentLoaded", () => {
    loadCountries(["EUR", "USD"]);
    inputEl.focus();
});

const loadCountries = async (defaults) => {

    const codes = await fetch("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-currency-code.json");
    const data = await codes.text();
    
    parsedData = JSON.parse(data);
    countryCodes = parsedData;

    let tmpCurrencies = [];

    countryCodes.map((code) => {
        if(tmpCurrencies.includes(code.currency_code)) return;
        tmpCurrencies.push(code.currency_code);
    });

    countryCodes = tmpCurrencies.sort();
    countryCodes.forEach((code) => {

        if(code === undefined || code === null) return;

        currencyDropdownsEl.forEach((drop) => {
            let el = document.createElement('option');
            el.innerHTML = "<option>" + code + "</option>";
            drop.appendChild(el);
        });
    });

    currencyDropdownsEl.forEach((drop, idx) => drop.selectedIndex = countryCodes.indexOf(defaults[idx]));
    updateFlags();
};


const convert = async () => {

    const to = countryCodes[currencyDropdownsEl[1].selectedIndex]; //EUR
    const from = countryCodes[currencyDropdownsEl[0].selectedIndex]; //USD
    const amount = inputEl.value;

    const apiUrl = "https://api.apilayer.com/currency_data/convert?to=" + to + "&from=" + from + "&amount="+ amount;

    var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);

    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    const apiData = await fetch(apiUrl, requestOptions);
    const dataText = await apiData.text();
    const result = JSON.parse(dataText).result;
    document.querySelector('.rst').innerText = "Your Exchange Rate is: " + result + " " + to + ".";
    lockInputs(false);
    inputEl.focus();
};

const onConvert = () => {
    lockInputs(true);
    convert();
};  

const onValueChanged = () => {
    inputEl.value = inputEl.value > 0 ? inputEl.value : 1;
};

const onCurrencyChange = () => {
    updateFlags();
};

const lockInputs = (lock) => {
    buttonEl.disabled = lock;
    inputEl.disabled = lock;
    currencyDropdownsEl.forEach((drop) => drop.disabled = lock);
};

const updateFlags = () => {
    fromLogoEl.src = "https://wise.com/public-resources/assets/flags/rectangle/" + countryCodes[currencyDropdownsEl[0].selectedIndex].toLowerCase() + ".png";
    toLogoEl.src = "https://wise.com/public-resources/assets/flags/rectangle/" + countryCodes[currencyDropdownsEl[1].selectedIndex].toLowerCase() + ".png";
};
