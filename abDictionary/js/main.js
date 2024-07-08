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

        // Search abbreviation by searched word
        found = searchByAbbreviation(searchedWord);

        // Add searched word object to Set, if found
        if (found >= 0) {
            matches.add(abDictionary[found]);
        }

        // Search fuzzy matches (useful for not exact searches)
        fuzzyByAbbreviation = fuzzySearchMatchesByAbbreviation(searchedWord);
        fuzzyByTerm = fuzzySearchMatchesByTerm(searchedWord);

        // Merge all Sets to have just one entry per item found in the fuzzy searches
        matches = new Set([...matches, ...fuzzyByAbbreviation, ...fuzzyByTerm]);

        // If any of the searches was succesful, then show in screen results. Otherwise, show not found message
        if (matches.size > 0) {
            show(searchedWord, matches);
        } else {
            wrapper.classList.remove("active");
            infoText.innerHTML = `Lo sentimos, el término o abreviatura "<strong>${searchedWord}</strong>" no se encuentra en la base de datos.`;
        }
    }

    function searchByAbbreviation(searchedWord) {
        found = -1; // initialize found to false

        for (var i = 0; i < abDictionary.length; i++) {
            if (searchedWord == abDictionary[i].abbLowerCase || searchedWord == abDictionary[i].abbLowerCaseEng) {
                found = i;
                break;
            }
        }

        return found;
    }

    // function fuzzySearchMatchesByTerm(searchedWord) {
    //     fuzzyMatches = new Set();;

    //     for (var i = 0; i < abDictionary.length; i++) {
    //          if (abDictionary[i].term.includes(searchedWord) || abDictionary[i].termEng.includes(searchedWord)){
    //             fuzzyMatches.add(abDictionary[i]);
    //          };
    //     }
    //     return fuzzyMatches;
    // }

    // Search fuzzy matches by meaning. Prioritizes results that match accents and diacritics.
    function fuzzySearchMatchesByTerm(searchedWord) {
        fuzzyMatches = new Set();;

        // Prioritizing of results that match accents and diacritics.
        for (var i = 0; i < abDictionary.length; i++) {
             abDictionary[i].meanings.forEach(function(element) {
                if (element.meaning.toLowerCase().includes(searchedWord)) {
                    fuzzyMatches.add(abDictionary[i]);
                };
             }) 
        }

        // Secondary loop that searches regardless of accents and diacritics.
        normalizedSearchedWord = searchedWord.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        for (var i = 0; i < abDictionary.length; i++) {
            abDictionary[i].meanings.forEach(function(element) {
               if (element.meaning.toLowerCase().includes(normalizedSearchedWord)) {
                fuzzyMatches.add(abDictionary[i]);
               };
            }) 
       }

        return fuzzyMatches;
    }

    function fuzzySearchMatchesByAbbreviation(searchedWord) {
        fuzzyMatches = new Set();

        for (var i = 0; i < abDictionary.length; i++) {
             if (abDictionary[i].abbLowerCase.includes(searchedWord)){
                fuzzyMatches.add(abDictionary[i]);
             };
        }
        return fuzzyMatches;
    }

    function show(searchedWord, matches) {
        wrapper.classList.add("active");

        // Add JSON info to HTML

        document.querySelector(".word p").innerHTML = searchedWord;

        // Number of matches for searchedWord, word or words
        quantityStatement = matches.size == 1 ? `Se ha encontrado ${matches.size} resultado.` : 
                                                `Se han encontrado ${matches.size} resultados.`;
        document.querySelector(".word span").innerHTML = quantityStatement;

        // searchedWord details
        document.querySelector(".content").innerHTML = "";
        matches.forEach (function(element) {
            abbreviation = element.abbreviation.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            use = element.use;
            language = element.language;

            let meanings = ``;
            element.meanings.forEach (function(definition) {
                normalizedSearchedWord = searchedWord.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                meaning = definition.meaning.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
                meaning = meaning.replace(new RegExp(normalizedSearchedWord, "gi"), (match) => `<mark>${match}</mark>`);
                meanings += `
                <li>
                    ${definition.lang}. ${meaning}.
                    <br />
                    <span style="color: var(--color1)">trad. ${definition.langTrad}. ${definition.meaningTrad} (${definition.abbreviationTrad}).</span>
                </li>`;
            })

            // Term's first letter will be upper case
            //term = element.term.charAt(0).toUpperCase() + element.term.slice(1);
            // Highlight search in found element
            //term = term.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            
            //termEng = element.termEng.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            //abbreviationEng = element.abbreviationEng.replace(new RegExp(searchedWord, "gi"), (match) => `<mark>${match}</mark>`);
            
            document.querySelector(".content").innerHTML += `
                    <li class="item">
                        <div class="details">
                            <p>` + abbreviation + `</p>
                            <span class="use">Utilizada como ${use} en ${language}.</span>
                            <br />
                            <ol class="meanings">
                            ${meanings}
                            </ol>                            
                        </div>
                    </li>
                `
        }
        );
    }
};

request.send();

removeIcon.addEventListener("click", () => {
     searchInput.value = "";
     searchInput.focus();
     wrapper.classList.remove("active");
     infoText.innerHTML = "Escribe el término, sigla o abreviatura que deseas buscar y presiona la tecla 'Enter' para obtener información.";
     infoText.style.color = "var(--gray)";
 });