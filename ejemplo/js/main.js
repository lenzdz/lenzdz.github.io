var request = new XMLHttpRequest();
request.open("GET","https://lenzdz.github.io/ejemplo/json/eng-esp.json");
request.onload = function() {
    var dictionary = JSON.parse(request.responseText);

    // Fill the dictionary list with words
    init = function() {
        for (var i = 0; i < dictionary.length; i++) {
            document.getElementById("word_list").innerHTML += "<li onclick='show(" + i + ")'>" + dictionary[i].word + "</li>"
        }  
    }

    // Call init function when page loads
    init();

    // Display word, definition and related words
    show = function(i) {
        document.getElementById("word_text").innerHTML = dictionary[i].word;
        document.getElementById("definition").innerHTML = dictionary[i].definition;

        var list = "";

        for (var j = 0; j < dictionary[i].related.length; j++) {
            list += "<li>" + dictionary[i].related[j] + "</li>";
            document.getElementById("related").innerHTML = list;
        }
    }

    // Show first word of the dictionary when page loads
    show(0);

    // Search funcionality
    search = function() {
        query = document.getElementById("search").value;

        if (query == "") {
            return;
        }

        found = -1; // initialize found to false

        for (var i = 0; i < dictionary.length; i++) {
            if (query == dictionary[i].word) {
                found = i;
                break;
            } else {
                document.getElementById("word_text").innerHTML = "Word not found";
                document.getElementById("definition").innerHTML = "This word is not in our dictionary.";
                document.getElementById("related").innerHTML = "No related words.";
            }
        }

        if (found >= 0) {
            show(found);
        }

    }
}
request.send();

// var dictionary = [
//     {
//         "word": "apple",
//         "definition": "a round fruit with shiny red or green skin that is fairly hard and white inside",
//         "related" : ["mango", "pear", "guayaba"]
//     },
//     {
//         "word": "gauntlet",
//         "definition": "a metal glove worn as part of a suit of armour by soldiers in the Middle Ages",
//         "related" : ["spear", "axe", "armour"]
//     },
//     {
//         "word": "kite",
//         "definition": "a toy made of a light frame covered with paper, cloth, etc., that you fly in the air at the end of one or more long strings",
//         "related" : ["toy", "air", "string"]
//     },
//     {
//         "word": "venom",
//         "definition": "the poisonous liquid that some snakes, spiders, etc. produce when they bite or sting you",
//         "related" : ["poison", "liquid", "snake"]
//     },
//     {
//         "word": "yellow",
//         "definition": "having the colour of lemons or butter",
//         "related" : ["blue", "lemon", "red"]
//     }
// ];

// // Fill the dictionary list with words
// init = function() {
//     for (var i = 0; i < dictionary.length; i++) {
//         document.getElementById("word_list").innerHTML += "<li onclick='show(" + i + ")'>" + dictionary[i].word + "</li>"
//     }  
// }

// // Call init function when page loads
// init();

// // Display word, definition and related words
// show = function(i) {
//     document.getElementById("word_text").innerHTML = dictionary[i].word;
//     document.getElementById("definition").innerHTML = dictionary[i].definition;

//     var list = "";

//     for (var j = 0; j < dictionary[i].related.length; j++) {
//         list += "<li>" + dictionary[i].related[j] + "</li>";
//         document.getElementById("related").innerHTML = list;
//     }
// }

// // Show first word of the dictionary when page loads
// show(0);

// // Search funcionality
// search = function() {
//     query = document.getElementById("search").value;

//     if (query == "") {
//         return;
//     }

//     found = -1; // initialize found to false

//     for (var i = 0; i < dictionary.length; i++) {
//         if (query == dictionary[i].word) {
//             found = i;
//             break;
//         } else {
//             document.getElementById("word_text").innerHTML = "Word not found";
//             document.getElementById("definition").innerHTML = "This word is not in our dictionary.";
//             document.getElementById("related").innerHTML = "No related words.";
//         }
//     }

//     if (found >= 0) {
//         show(found);
//     }

// }