const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input");
infoText = wrapper.querySelector(".info-text"),
removeIcon = wrapper.querySelector(".search span");

// Fetch API function
function fetchAPI(word) {
    wrapper.classList.remove("active")
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
          return Promise.reject(`Lo sentimos, la palabra "<strong>${word}</strong>" no se encuentra en nuestro diccionario.`)
        } else {
          return Promise.reject(`Ocurrió un error inesperado. Prueba de nuevo más tarde.`)
        }
      })
      .then(result => {
          wrapper.classList.add("active");

          // Add JSON info to HTML

          // Word
          document.querySelector(".word p").innerHTML = result[0].word;

          // Number of meanings of word
          document.querySelector(".word span").innerHTML = `Se han encontrado ${result[0].meanings.length} acepciones.`;

          // Meanings of word: part of speech, definition and translation to Spanish
          document.querySelector(".content").innerHTML = ""
          for (let i = 0; i < result[0].meanings.length; i++) {
              document.querySelector(".content").innerHTML += `
                <li class="meaning">
                    <div class="details">
                        <p>${word}</p>
                        <span class="definition">${result[0].meanings[i].partOfSpeech}. ${result[0].meanings[i].definition}</span>
                        <br />
                        <span class="translation">${result[0].meanings[i].translation.join(", ")}</span>
                    </div>
                </li>
              `  
          }
        //   document.querySelector(".word p").innerHTML = result[0].meaning
      })
      .catch(error => {
        wrapper.classList.remove("active")  
        infoText.innerHTML = error
      });
}

searchInput.addEventListener("keyup", e =>{
    if (e.key === "Enter" && e.target.value) {
        fetchAPI(e.target.value);
    }
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.innerHTML = "Escribe una palabra en inglés y presiona la tecla 'Enter' para conocer sus acepciones y traducciones al español.";
    infoText.style.color = "var(--gray)";
});