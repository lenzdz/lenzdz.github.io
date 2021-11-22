const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input");
infoText = wrapper.querySelector(".info-text");

// Fetch API function

function fetchAPI(word) {
    infoText.innerHTML = `Buscando traducciones para <span>"${word}".</span>`;
    let url = `https://lenzdz.github.io/ejemplo/json/${word}.json`;
    fetch(url)
    .then(res => res.json())
    .then(result => console.log(result));
}

searchInput.addEventListener("keyup", e =>{
    if (e.key === "Enter" && e.target.value) {
        fetchAPI(e.target.value);
    }
});