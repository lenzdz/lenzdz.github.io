var request = new XMLHttpRequest();
request.open("GET", "https://lenzdz.github.io/journals/json/journals.json");
const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    infoText = wrapper.querySelector(".info-text"),
    removeIcon = wrapper.querySelector(".search span");
request.onload = function () {
    var journalsDB = JSON.parse(request.responseText);
    console.log(journalsDB);

    // Enter to search functionality
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && e.target.value) {
            search(e.target.value);
        }
    });

    // Search funcionality
    function search(journal) {
        journal = String(journal.toLowerCase()).trim();
        matches = [];

        // Search by journal name
        found = searchByTitle(journal);
        console.log(found);

        // Search by journal abbreviation, if haven't found something
        found = found < 0 ? searchByAbbreviation(journal, "abbreviationLowCase") : found;
        console.log(found);

        if (found >= 0) {
            matches.push(journalsDB[found]);
        }

        fuzzyMatches = searchFuzzyMatchesByTitle(journal);
        console.log("Antes de unir matches con fuzzymatches");
        matches = matches.concat(fuzzyMatches);
        console.log(matches);

        if (matches.length > 0) {
            show(found, journal, matches);
        } else {
            wrapper.classList.remove("active");
            infoText.innerHTML = `Lo sentimos, la revista "<strong>${journal}</strong>" no se encuentra en la base de datos.`;
        }
    }

    function searchByTitle(journal) {
        found = -1; // initialize found to false

        for (var i = 0; i < journalsDB.length; i++) {
            if (journal == journalsDB[i].titleLowCase) {
                found = i;
                break;
            }
        }

        return found;
    }

    function searchByAbbreviation(journal) {
        found = -1; // initialize found to false

        for (var i = 0; i < journalsDB.length; i++) {
            if (journal == journalsDB[i].abbreviationLowCase) {
                found = i;
                break;
            }
        }

        return found;
    }

    function searchFuzzyMatchesByTitle(journal) {
        fuzzyMatches = [];

        for (var i = 0; i < journalsDB.length; i++) {
             if (journalsDB[i].titleLowCase.includes(journal)){
                fuzzyMatches.push(journalsDB[i]);
             };
        }
        console.log("En for fuzzy");
        console.log(fuzzyMatches);
        return fuzzyMatches;
    }

    function show(index, journal, matches) {
        wrapper.classList.add("active");

        // Add JSON info to HTML

        // Searched journal, word or words
        let title;
        if (index >= 0) {
            title = journalsDB[index].title;
            document.querySelector(".word p").innerHTML = title;
        } else {
            title = journal;
            document.querySelector(".word p").innerHTML = title;
        }

        // Number of matches for journal, word or words
        quantityStatement = matches.length == 1 ? `Se ha encontrado ${matches.length} resultado.` : 
                                                `Se han encontrado ${matches.length} resultados.`;
        document.querySelector(".word span").innerHTML = quantityStatement;

        // Journal details
        document.querySelector(".content").innerHTML = "";
        for (let i = 0; i < matches.length; i++) {
            document.querySelector(".content").innerHTML += `
                    <li class="item">
                        <div class="details">
                            <p>` + matches[i].title + `</p>
                            <span class="abbreviation">${matches[i].abbreviation}. ${matches[i].medium}</span>
                            <br />
                            <span class="definition">${matches[i].description}</span>
                            <br />
                            
                        </div>
                    </li>
                `
        }
    }
};

request.send();

removeIcon.addEventListener("click", () => {
     searchInput.value = "";
     searchInput.focus();
     wrapper.classList.remove("active");
     infoText.innerHTML = "Escribe el nombre de una revista, o su abreviatura, y presiona la tecla 'Enter' para buscar información sobre ella.";
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
