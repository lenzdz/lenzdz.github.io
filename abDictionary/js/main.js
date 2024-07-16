var request = new XMLHttpRequest();
request.open("GET", "https://lenzdz.github.io/abDictionary/json/abDictionary.json");
const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    infoText = wrapper.querySelector(".info-text"),
    removeIcon = wrapper.querySelector(".search span");
request.onload = function () {
    // Load JSON
    var abDictionary = JSON.parse(request.responseText);
    console.log("La base de datos tiene " + abDictionary.length + " entradas.")

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
        fuzzyByTrad = fuzzySearchMatchesByTermTrad(searchedWord);

        // Merge all Sets to have just one entry per item found in the fuzzy searches
        matches = new Set([...matches, ...fuzzyByAbbreviation, ...fuzzyByTerm, ...fuzzyByTrad]);

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

    function fuzzySearchMatchesByAbbreviation(searchedWord) {
        fuzzyMatches = new Set();

        for (var i = 0; i < abDictionary.length; i++) {
             if (abDictionary[i].abbLowerCase.includes(searchedWord)){
                fuzzyMatches.add(abDictionary[i]);
             };
        }
        return fuzzyMatches;
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
               if (element.meaning.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(normalizedSearchedWord)) {
                fuzzyMatches.add(abDictionary[i]);
               };
            }) 
       }

        return fuzzyMatches;
    }

    // Search fuzzy matches by meaning translation. Prioritizes results that match accents and diacritics.
    function fuzzySearchMatchesByTermTrad(searchedWord) {
        fuzzyMatches = new Set();;

        // Prioritizing of results that match accents and diacritics.
        for (var i = 0; i < abDictionary.length; i++) {
             abDictionary[i].meanings.forEach(function(element) {
                if (element.meaningTrad.toLowerCase().includes(searchedWord)) {
                    fuzzyMatches.add(abDictionary[i]);
                };
             }) 
        }

        // Secondary loop that searches regardless of accents and diacritics.
        normalizedSearchedWord = searchedWord.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        for (var i = 0; i < abDictionary.length; i++) {
            abDictionary[i].meanings.forEach(function(element) {
               if (element.meaningTrad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(normalizedSearchedWord)) {
                fuzzyMatches.add(abDictionary[i]);
               };
            }) 
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
            let abbreviation = highlightMatch(element.abbreviation, searchedWord);
            use = element.use;
            language = element.language;

            let meanings = ``;
            element.meanings.forEach (function(definition) {

                let meaning = highlightMatch(definition.meaning, searchedWord);
                meaning = highlightInexactMatch(meaning, searchedWord);

                let meaningTrad = highlightMatch(definition.meaningTrad, searchedWord);
                meaningTrad = highlightInexactMatch(meaningTrad, searchedWord);


                meaning = mayusCorrection(definition.meaning, meaning);
                meaningTrad = mayusCorrection(definition.meaningTrad, meaningTrad);

                meanings += `
                <li>
                    ${definition.lang}. ${meaning}.
                    <br />
                    <span style="color: var(--color1)">trad. ${definition.langTrad}. ${meaningTrad} (${definition.abbreviationTrad}).</span>
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

    function highlightMatch(text, searchedWord) {
        let regex = new RegExp(searchedWord, "gi");
        return text.replace(regex, (match) => `<mark>${match}</mark>`);
    }

    // To highlight words with accents and diacritics, even if the user doesn't write them. For example, if a user searches "cancer" the program will return objects with the meaning "cancer" and "cáncer" (with accent).
    function highlightInexactMatch(text, searchedWord) {

        for (let i = 0; i < searchedWord.length; i++) {
            let tempWord = "";
            if (searchedWord[i] == "a") {
                text = addingAccentsDiacritics("á", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "a") {
                text = addingAccentsDiacritics("à", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "e") {
                text = addingAccentsDiacritics("é", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "e") {
                text = addingAccentsDiacritics("è", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "i") {
                text = addingAccentsDiacritics("í", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "i") {
                text = addingAccentsDiacritics("ì", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "o") {
                text = addingAccentsDiacritics("ó", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "o") {
                text = addingAccentsDiacritics("ò", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "u") {
                text = addingAccentsDiacritics("ú", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "u") {
                text = addingAccentsDiacritics("ù", searchedWord, i, tempWord, text);
            }
            if (searchedWord[i] == "u") {
                text = addingAccentsDiacritics("ü", searchedWord, i, tempWord, text);
            }

            
        }

        // I don't know how this is working, but if I remove it, the program doesn't work how I want it to. 
        let regex = new RegExp((searchedWord), "gi");
        return text.replace(regex, (match) => `<mark>${match}</mark>`);
    }

    // Function adds an accent or diacritic to normal vocals to check if there are any coincidences with accented terms in the database
    function addingAccentsDiacritics(newLetter, searchedWord, i, tempWord, text) {

        tempWord = searchedWord.substring(0,i) + newLetter + searchedWord.substring(i+1, searchedWord.length);
        if (text.toLowerCase().includes(tempWord)) {
            text = indexOfSearchedWord(tempWord, text);
        }

        return text;
        
    }

    // Function searches for the temporal accented word position in the database's term going through the loop and surrounds it with an HTML <mark> so that it gets highlighted by the show function.
    function indexOfSearchedWord(tempWord, text) {
        // If the temporal accented word is the first at the term's meaning, the program proceeds
        console.log(text.toLowerCase().indexOf(tempWord) == 0);
        if (text.toLowerCase().indexOf(tempWord) == 0) {
            text = text.toLowerCase().replace(tempWord, (match) => `<mark>${match}</mark>`);
            text = text.toUpperCase();
            // If the term's meaning evaluated at the loop doesn't begin with "[", it proceeds to change its first character to upper case. In case the first character is, indeed, a "[", it proceeds to change the second character to upper case.
            if (text.charAt(6) != "[") {
                text = text.substring(0,6).toLowerCase() + text.charAt(6) + text.slice(7).toLowerCase();
            } else if (text.charAt(6) == "[") {
                text = text.substring(0,7).toLowerCase() + text.charAt(7) + text.slice(8).toLowerCase();
            }
        
        // Else, if the temporal accented word isn't the first at the term's meaning, the program proceeds
        } else {
            text = text.toLowerCase().replace(tempWord, (match) => `<mark>${match}</mark>`);
            // If the term's meaning evaluated at the loop doesn't begin with "[", it proceeds to change its first character to upper case. In case the first character is, indeed, a "[", it proceeds to change the second character to upper case.
            if (text.charAt(0) != "[") {
                text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            } else if (text.charAt(0) == "[") {
                text = text.charAt(0) + text.charAt(1).toUpperCase() + text.slice(2).toLowerCase();
            }
        }

        return text;
    }

    function mayusCorrection(originalText, meaning) {
        let numUpperCases = countUpperCases(originalText);

        const exceptions = ["de", "del", "a", "en", "la", "para", "the", "to"];
        if (numUpperCases > 1) {

            return meaning.split(' ').map((word) => {
                if (word.startsWith("<mark>") && word.endsWith('</mark>')) {
                    if (exceptions.includes(word.slice(6, -7).toLowerCase())) {
                        word.charAt(6).toLowerCase();
                        return word;
                    } else {
                        word = word.slice(0,6) + word.charAt(6).toUpperCase() + word.slice(7);
                        return word;
                    }
                } else if (word.startsWith("<mark>")) {
                    if (exceptions.includes(word.slice(6).toLowerCase())) {
                        word.charAt(6).toLowerCase();
                        return word;
                    } else {
                        word = word.slice(0,6) + word.charAt(6).toUpperCase() + word.slice(7);
                        return word;
                    }
                } else {
                    if (exceptions.includes(word.toLowerCase())) {
                        word.toLowerCase();
                        return word;
                    } else {
                        word = word.charAt(0).toUpperCase() + word.slice(1);
                        return word;
                    }
                }
            }).join(' ');

        } else {
            return meaning;
        }
    }

    function countUpperCases(text) {
        // Remove content in parenthesis (abbreviations, if existent)
        const textWithoutParenthesis = text.replace(/\([^)]*\)/g, '');
        
        // Dividir la cadena en palabras
        const words = textWithoutParenthesis.split(' ');

        // Filtrar las palabras que no contienen guiones
        const wordsWithoutDashes = words.filter(word => !word.includes('-'));

        // Unir las palabras filtradas en una cadena
        const filteredText = wordsWithoutDashes.join(' ');

        // Regular expression to find upper cases
        const regex = /[A-ZÁÉÍÓÚÜÑ]/g;

        // Count matches
        const numUpperCases = filteredText.match(regex);
        return numUpperCases ? numUpperCases.length : 0;
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
