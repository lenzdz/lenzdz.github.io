var request = new XMLHttpRequest();
request.open("GET", "https://lenzdz.github.io/abDictionary/json/abDictionary.json");
const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    infoText = wrapper.querySelector(".info-text"),
    removeIcon = wrapper.querySelector(".search span");
request.onload = function () {
    // Load JSON
    var abDictionary = JSON.parse(request.responseText);

    // Enter to search functionality
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && e.target.value && e.target.value.length > 1) {
            search(e.target.value);
        }
    });

    // Search funcionality
    function search(searchedWord) {
        searchedWord = String(searchedWord.toLowerCase()).trim();
        matches = new Set();

        // Search by searchedWord name
        found = searchByTerm(searchedWord);

        // Search by searchedWord abbreviation, if haven't found something
        found = found < 0 ? searchByAbbreviation(searchedWord) : found;

        // Add searchedWord to Set if found
        if (found >= 0) {
            matches.add(abDictionary[found]);
        }

        // Search fuzzy matches (useful for not exact searches)
        fuzzyByTerm = fuzzySearchMatchesByTerm(searchedWord);
        fuzzyByAbbreviation = fuzzySearchMatchesByAbbreviation(searchedWord);
        fuzzyByDescription = fuzzySearchMarchesByDescription(searchedWord);

        // Merge all Sets to have just one entry per item found in the fuzzy searches
        matches = new Set([...matches, ...fuzzyByTerm, ...fuzzyByAbbreviation, ...fuzzyByDescription]);

        // If any of the searches was succesful, then show in screen results. Otherwise, show not found message
        if (matches.size > 0) {
            show(found, searchedWord, matches);
        } else {
            wrapper.classList.remove("active");
            infoText.innerHTML = `Lo sentimos, el término o abreviatura "<strong>${searchedWord}</strong>" no se encuentra en la base de datos.`;
        }
    }

    function searchByTerm(searchedWord) {
        found = -1; // initialize found to false

        for (var i = 0; i < abDictionary.length; i++) {
            if (searchedWord == abDictionary[i].term || searchedWord == abDictionary[i].termEng) {
                found = i;
                break;
            }
        }

        return found;
    }

    function searchByAbbreviation(searchedWord) {
        found = -1; // initialize found to false

        for (var i = 0; i < abDictionary.length; i++) {
            if (searchedWord == abDictionary[i].abbLowerCase || searchedWord == abDictionary[i].abbLowerCase) {
                found = i;
                break;
            }
        }

        return found;
    }

    function fuzzySearchMatchesByTerm(searchedWord) {
        fuzzyMatches = new Set();;

        for (var i = 0; i < abDictionary.length; i++) {
             if (abDictionary[i].term.includes(searchedWord) || abDictionary[i].termEng.includes(searchedWord)){
                fuzzyMatches.add(abDictionary[i]);
             };
        }
        return fuzzyMatches;
    }

    function fuzzySearchMatchesByAbbreviation(searchedWord) {
        fuzzyMatches = new Set();

        for (var i = 0; i < abDictionary.length; i++) {
             if (abDictionary[i].abbLowerCase.includes(searchedWord) || abDictionary[i].abbLowerCaseEng.includes(searchedWord)){
                fuzzyMatches.add(abDictionary[i]);
             };
        }
        return fuzzyMatches;
    }

    function fuzzySearchMarchesByDescription(searchedWord) {
        fuzzyMatches = new Set();

        for (var i = 0; i < abDictionary.length; i++) {
             if (abDictionary[i].description.includes(searchedWord)){
                fuzzyMatches.add(abDictionary[i]);
             };
        }
        return fuzzyMatches;
    }

    function show(index, searchedWord, matches) {
        wrapper.classList.add("active");

        // Add JSON info to HTML

        // Searched searchedWord, word or words
        let term;
        // If there was an exact match
        if (index >= 0) {
            term = abDictionary[index].term;
            document.querySelector(".word p").innerHTML = term;
        } else {
            term = searchedWord;
            document.querySelector(".word p").innerHTML = term;
        }

        // Number of matches for searchedWord, word or words
        quantityStatement = matches.size == 1 ? `Se ha encontrado ${matches.size} resultado.` : 
                                                `Se han encontrado ${matches.size} resultados.`;
        document.querySelector(".word span").innerHTML = quantityStatement;

        // searchedWord details
        document.querySelector(".content").innerHTML = "";
        matches.forEach (function(element) {
            // Term's first letter will be upper case
            term = element.term.charAt(0).toUpperCase() + element.term.slice(1);
            // Highlight search in found element
            term = term.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            abbreviation = element.abbreviation.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            termEng = element.termEng.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            abbreviationEng = element.abbreviationEng.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            description = element.description.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            document.querySelector(".content").innerHTML += `
                    <li class="item">
                        <div class="details">
                            <p>` + abbreviation + ` — ` + term + `</p>
                            <span class="abbreviation">${abbreviationEng} — ${termEng}</span>
                            <br />
                            <span class="definition">${description}</span>
                            <br />
                            
                        </div>
                    </li>
                `
        }

        );
        // for (let i = 0; i < matches.size; i++) {
        //     title.replace(new RegExp(journal, "gi"), (match) => `<mark>${match}</mark>`);
        //     document.querySelector(".content").innerHTML += `
        //             <li class="item">
        //                 <div class="details">
        //                     <p>` + matches[i].title + `</p>
        //                     <span class="abbreviation">${matches[i].abbreviation} — ${matches[i].medium}</span>
        //                     <br />
        //                     <span class="definition">${matches[i].description}</span>
        //                     <br />
                            
        //                 </div>
        //             </li>
        //         `
        // }
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
