const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input");
infoText = wrapper.querySelector(".info-text");

// Data function
// function data(result, word) {
//     if (condition) {
        
//     } else {
//         wrapper.classList.add("active");
//     }
// }

// Fetch API function
function fetchAPI(word) {
    infoText.style.color = "#000";
    infoText.innerHTML = `Buscando traducciones para <span>"${word}".</span>`;
    let url = `https://lenzdz.github.io/ejemplo/json/${word}.json`;
    fetch(url)
    // .then(res => res.json())
    // .then(result => data(result, word));
    .then(res => {
        if (res.ok) {
          return res.json()
        } else if (res.status === 404) {
          return Promise.reject('Error 404')
        } else {
          return Promise.reject('Otro tipo de error: ' + response.status)
        }
      })
      .then(result => {
          console.log(result);
          wrapper.classList.add("active");

          // Add JSON info to HTML

          // Word
          document.querySelector(".word p").innerHTML = result[0].word

          // Number of meanings of word
          document.querySelector(".word span").innerHTML = `Se han encontrado ${result[0].meanings.length} acepciones.`
          document.querySelector(".word p").innerHTML = result[0].meaning
      })
      .catch(error => {
          infoText.innerHTML = error + `. La palabra "${word}" no se encuentra en nuestro diccionario.`
      });
}

searchInput.addEventListener("keyup", e =>{
    if (e.key === "Enter" && e.target.value) {
        fetchAPI(e.target.value);
    }
});