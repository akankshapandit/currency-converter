const API_KEY = "fca_live_KHCYC2uoMCSfGtaaEEJ5HInOjUMf743HpobE4wlt"; 
const BASE_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".To select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "To" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 0) {
        amtVal = 1;
        amount.value = 1;
    }

    const fromCode = fromCurr.value;
    const toCode = toCurr.value;
    
    const URL = `${BASE_URL}&base_currency=${fromCode}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Unable to fetch exchange rate`);
        }
        let data = await response.json();

        if (!data.data[toCode]) {
            throw new Error("Invalid response: Currency not found.");
        }

        let rate = data.data[toCode];
        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCode} = ${finalAmount} ${toCode}`;
    } catch (error) {
        console.error(error);
        msg.innerText = "Error fetching exchange rate. Please try again.";
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
