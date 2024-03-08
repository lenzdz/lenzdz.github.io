var request = new XMLHttpRequest();
request.open("GET", "https://lenzdz.github.io/dictionary/json/eng-esp.json");
const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    infoText = wrapper.querySelector(".info-text"),
    removeIcon = wrapper.querySelector(".search span");
request.onload = function () {
    var dictionary = JSON.parse(request.responseText);
    console.log(dictionary);

    // Enter to search functionality
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && e.target.value) {
        console.log("Sirvió el Enter.");
        search(e.target.value);
        }
    });

    // Search funcionality
    function search(word) {
        console.log("Entré a la función de búsqueda.");
        console.log(dictionary.length)
        found = -1; // initialize found to false

        // Search by journal name
        for (var i = 0; i < dictionary.length; i++) {
            console.log("Vuelta " + i + ": la palabra en el arreglo es " + dictionary[i].word)
            if (word == dictionary[i].titleLowCase) {
                found = i;
                console.log(found);
                break;
            }
        }

        // Search by journal abbreviation, if haven't found something
        if (found < 0) {
            for (var i = 0; i < dictionary.length; i++) {
                if (word == dictionary[i].abbreviationLowCase) {
                    found = i;
                    console.log(found);
                    break;
                }
            }
        }

        if (found >= 0) {
            show(found);
        } else {
            infoText.innerHTML = `Lo sentimos, la palabra "<strong>${word}</strong>" no se encuentra en nuestro diccionario.`;
        }
    }

    function show(index) {
        wrapper.classList.add("active");

        // Add JSON info to HTML

        // Word
        tempWord = dictionary[index].word;
        capWord = tempWord.charAt(0).toUpperCase() + tempWord.slice(1);
        document.querySelector(".word p").innerHTML = capWord;

        // Number of meanings of word
        document.querySelector(".word span").innerHTML = `Se ha encontrado ${dictionary[index].definition} resultado.`;

        // Meanings of word: part of speech, definition and translation to Spanish
        document.querySelector(".content").innerHTML = "";
        document.querySelector(".content").innerHTML += `
                <li class="meaning">
                    <div class="details">
                        <p>` + capWord + `</p>
                        <span class="definition">${dictionary[index].definition}. ${dictionary[index].definition}</span>
                        <br />
                        <span class="translation">${dictionary[index].related.join(", ")}</span>
                    </div>
                </li>
            `
    }
};

request.send();

removeIcon.addEventListener("click", () => {
     searchInput.value = "";
     searchInput.focus();
     wrapper.classList.remove("active");
     infoText.innerHTML = "Escribe una palabra en inglés y presiona la tecla 'Enter' para conocer sus acepciones y traducciones al español.";
     infoText.style.color = "var(--gray)";
 });

// const wrapper = document.querySelector(".wrapper"),
// searchInput = wrapper.querySelector("input");
// infoText = wrapper.querySelector(".info-text"),
// removeIcon = wrapper.querySelector(".search span");

// // Fetch API function
// function fetchAPI(userWord) {
//     word = userWord.toLowerCase();
//     wrapper.classList.remove("active");
//     infoText.style.color = "#000";
//     infoText.innerHTML = `Buscando traducciones para <span>"${word}".</span>`;

//     if (userWord == "") {
//       return;
//     }

//     found = -1; // initialize found to false

//     for (var i = 0; i < dictionary.length; i++) {
//       if (query == dictionary[i].word) {
//           found = i;
//           break;
//       } else {
//           document.getElementById("word_text").innerHTML = "Word not found";
//           document.getElementById("definition").innerHTML = "This word is not in our dictionary.";
//           document.getElementById("related").innerHTML = "No related words.";
//       }
//     }

//     if (found >= 0) {
//         show(found);
//     }

//     let url = `https://lenzdz.github.io/dictionary/json/${word}.json`;
//     fetch(url)
//     .then(res => {
//         if (res.ok) {
//           return res.json()
//         } else if (res.status === 404) {
//           return Promise.reject(`Lo sentimos, la palabra "<strong>${word}</strong>" no se encuentra en nuestro diccionario.`)
//         } else {
//           return Promise.reject(`Ocurrió un error inesperado. Prueba de nuevo más tarde.`)
//         }
//       })
//       .then(result => {
//           wrapper.classList.add("active");

//           // Add JSON info to HTML

//           // Word
//           tempWord = result[0].word;
//           capWord = tempWord.charAt(0).toUpperCase() + tempWord.slice(1);
//           document.querySelector(".word p").innerHTML = capWord;

//           // Number of meanings of word
//           document.querySelector(".word span").innerHTML = `Se ha encontrado ${result[0].meanings.length} resultado.`;

//           // Meanings of word: part of speech, definition and translation to Spanish
//           document.querySelector(".content").innerHTML = ""
//           for (let i = 0; i < result[0].meanings.length; i++) {
//               document.querySelector(".content").innerHTML += `
//                 <li class="meaning">
//                     <div class="details">
//                         <p>` + capWord + `</p>
//                         <span class="definition">${result[0].meanings[i].partOfSpeech}. ${result[0].meanings[i].definition}</span>
//                         <br />
//                         <span class="translation">${result[0].meanings[i].translation.join(", ")}</span>
//                     </div>
//                 </li>
//               `
//           }
//       })
//       .catch(error => {
//         wrapper.classList.remove("active")
//         infoText.innerHTML = error
//       });
// }

// searchInput.addEventListener("keyup", e =>{
//     if (e.key === "Enter" && e.target.value) {
//         fetchAPI(e.target.value);
//     }
// });

// removeIcon.addEventListener("click", () => {
//     searchInput.value = "";
//     searchInput.focus();
//     wrapper.classList.remove("active");
//     infoText.innerHTML = "Escribe una palabra en inglés y presiona la tecla 'Enter' para conocer sus acepciones y traducciones al español.";
//     infoText.style.color = "var(--gray)";
// });
