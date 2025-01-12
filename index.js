const book = document.getElementById('book');
const loader = document.getElementById('loader');
const chapter = document.getElementById('chapter');
const divChapters = document.getElementById("divChapters");
const divVerses = document.getElementById("divVerses");
var globalChapter = 0; // shows the current chapter
var globalBook = 0; // shows the current book
var darkModeBtn = document.getElementById('darkMode');
var darkModeOn = 1; // switchs between the dark mode and light mode
var r = document.querySelector(':root'); // select the root element to change the css variables.
var lblDM = document.getElementById('lblDarkMode'); // change lable to dark and light mode
var searchBar = document.getElementById("busca");
const dialogo = document.querySelector("dialog");
var imgSelected = document.getElementById("imgSelected");
var DialogSrc = "";
var bible = bibleBBE; 

// Array containing the names of the books of the Bible
const booksOfBible = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
    "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts",
    "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
    "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
    "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
    "Jude", "Revelation"
];


window.onload = function(){
    populateBookList(); // Call the function to fill the header with the names of the books of the Bible
    disableContextMenu(); // Disable context menu
    loadDarkMode(); // load the current state of dark mode
    loadData();
    renderBookAndChapter(globalBook,globalChapter);
    hideVerses();
    searchBarListener();
}

function translate(){

}




// Function to fill the header with the names of the books of the Bible
function populateBookList() {
    let old_testament = true;
    const bookListOld = document.getElementById("old-testament");
    const bookListNew = document.getElementById("new-testament");
    let i = 0;
    booksOfBible.forEach(book => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = '#';
        link.textContent = book;
        link.setAttribute('onclick','populateChapters('+i+')');
        listItem.appendChild(link);

        if(book == "Matthew"){
            old_testament = false;
        }

        if (old_testament) {
            bookListOld.appendChild(listItem);
        }else{
            bookListNew.appendChild(listItem);
        }
       i++;
    });
}

function renderBook(livro){ // I can delete
    let cap = 0;
    let TrueChapter = cap + 1;
    book.innerHTML = bible[livro].name;
    chapter.innerHTML = bible[livro].name + " " + TrueChapter;
    for (let i = 0; i < bible[livro].chapters[cap].length; i++) {
        let verse = i + 1;
        let para = document.createElement("p");
        para.innerHTML = verse + ". " + bible[livro].chapters[cap][i];
        chapter.appendChild(para);
    }
    populateChapters(livro);
}

function renderBookAndChapter(livro, chap){
    displayLoader();
    globalBook = livro;
    globalChapter = chap;
    removeChildrenNodes(chapter);
    let realIndexBook = livro + 1;
    let realIndexChapter = chap + 1;
    hideDiv(divChapters);
    let cap = chap;
    book.innerHTML = bible[livro].name;
    chapter.innerHTML = " Chapter " + realIndexChapter;

    let elementsToAppend = [];
    let promises = [];

    for (let i = 0; i < bible[livro].chapters[cap].length; i++) {
        let verse = i + 1;
        let image = "./imgs/"+realIndexBook+"_"+realIndexChapter+"_"+verse+".jpg";
        let para = document.createElement("p");
        para.innerHTML = verse + ". " + bible[livro].chapters[cap][i];
        para.setAttribute("id", "v" + i);
        let img = document.createElement("img");
        let promise = fetch(image).then(response => {
            if (response.ok) {
                img.setAttribute("src", image);
                img.setAttribute("onclick", "fullscreen('"+image+"','"+para.innerHTML+"')");
                img.setAttribute("id", "imagem"+i);
                para.classList.add("ilustrated");
                para.appendChild(img);
            }
        }).catch(error => {
            console.log("Image not found: " + image);
        });

        elementsToAppend.push({para: para, promise: promise});
    }

    // Wait for all promises to be resolved and then add the elements to the DOM in the correct order
    Promise.all(elementsToAppend.map(element => element.promise)).then(() => {
        elementsToAppend.forEach(element => {
            chapter.appendChild(element.para);
        });
    });

    saveData();
    undisplayLoader(); 
    populateVerses(livro, chap);
}




function renderBookChapterVerse(livro, chap, ver){
    let realIndexChapter = chap + 1;
    let realIndexVerse = ver + 1;
    let bookchapverse = document.createElement("p");
    bookchapverse.innerHTML = bible[livro].name + " - " + realIndexChapter + " : " + realIndexVerse;
    let para = document.createElement("p");
    para.innerHTML = realIndexVerse + ". " + bible[livro].chapters[chap][ver];
    chapter.appendChild(para);
    chapter.appendChild(bookchapverse); 
}


function HideOldTestament() {
    var old_testament_books = document.getElementById("old-testament");
    if (old_testament_books.style.display === "none") {
        old_testament_books.style.display = "inline-flex";
    } else {
        old_testament_books.style.display = "none";
    }
    var new_testament_books = document.getElementById("new-testament");
    new_testament_books.style.display = "none";
    hideChapters();
    hideVerses();
  }

  function HideNewTestament() {
    var new_testament_books = document.getElementById("new-testament");
    if (new_testament_books.style.display === "none") {
        new_testament_books.style.display = "inline-flex";
    } else {
        new_testament_books.style.display = "none";
    }
    var old_testament_books = document.getElementById("old-testament");
    old_testament_books.style.display = "none";
    hideChapters();
    hideVerses();
  }

  function populateChapters(livro) {
    showDiv(divChapters);
    HideOldandNewTestament();
    const capitulos = document.getElementById("chapters");
    const bookName = document.getElementById("bookName");
    removeChildrenNodes(capitulos);
    bookName.innerHTML = bible[livro].name;
    let book = bible[livro].chapters; 
    let i = 0;
    book.forEach(chapter => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = '#';
        link.textContent = i+1;
        link.setAttribute('onclick','renderBookAndChapter('+livro+','+i+')');
        listItem.appendChild(link);
        capitulos.appendChild(listItem);
       i++;
    });
    const btnHide = document.createElement("button");
    btnHide.textContent = "Minimize";
    btnHide.setAttribute('onclick','hideChapters()');
    btnHide.classList.add("chapterSpecial");
    capitulos.appendChild(btnHide);
  }

  function populateVerses(livro,capitulo) {
    showDiv(divVerses);
    HideOldandNewTestament();
    const bookName = document.getElementById("bookNameChapter");
    const versesUl = document.getElementById("verses");
    removeChildrenNodes(versesUl);
    let TrueChapter = capitulo + 1;
    bookName.innerHTML = bible[livro].name+" - " + TrueChapter;
    let verses = bible[livro].chapters[capitulo]; 
    let i = 0;
    verses.forEach(verse => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = i+1;
        link.href = '#v'+i;
        link.setAttribute('onclick','hideVerses()');
        listItem.appendChild(link);
        versesUl.appendChild(listItem);
       i++;
    });
    const btnHide = document.createElement("button");
    btnHide.textContent = "Minimize";
    btnHide.setAttribute('onclick','hideVerses()');
    btnHide.classList.add("chapterSpecial");
    versesUl.appendChild(btnHide);
  }

function HideOldandNewTestament(){
    var old_testament_books = document.getElementById("old-testament");
    old_testament_books.style.display = "none";
    var new_testament_books = document.getElementById("new-testament");
    new_testament_books.style.display = "none";
}

function removeChildrenNodes(node){
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
}

function disableContextMenu(){ // disable the second left btn click.
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); 
    });
}

function showDiv(div){
    div.style.display = "flex";
}

function hideDiv(div){
    div.style.display = "none";
}

function hideChapters(){
    divChapters.style.display = "none";
}

function hideVerses(){
    divVerses.style.display = "none";
}

function NextChapter(){
    if (globalChapter < bible[globalBook].chapters.length-1) {
        globalChapter++;
    } else if (globalBook < bible.length-1) {
        globalBook++;
        globalChapter = 0;
    }else{
        globalBook = 0;
        globalChapter = 0;
    }
    renderBookAndChapter(globalBook,globalChapter);
    hideVerses();
}

function PreviousChapter(){
    if (globalChapter > 0) {
        globalChapter--;
    } else if (globalBook > 0) {
        globalBook--;
        globalChapter = bible[globalBook].chapters.length-1;
    }else{
        globalBook = bible.length-1;
        globalChapter = bible[globalBook].chapters.length-1;
    }
    renderBookAndChapter(globalBook,globalChapter);
    hideVerses();
}

function undisplayLoader(){
    loader.style.display = "none";
}

function displayLoader(){
    loader.style.display = "flex";
}

function search(){
    let search = document.getElementById("busca").value;
    if (search == ""){
        alert("Insert text in the search field...");
        renderBookAndChapter(globalBook,globalChapter);
        hideVerses();
    }else {
    removeChildrenNodes(chapter);
    book.innerHTML = "Results";
    chapter.innerHTML = "Search for - " + search;
    let found = false;
    let i = 0;
    let j = 0;
    for (let i = 0; i < bible.length; i++) {
        for (let j = 0; j < bible[i].chapters.length; j++) {
            for (let k = 0; k < bible[i].chapters[j].length; k++) {
                if (bible[i].chapters[j][k].toLowerCase().includes(search.toLowerCase())) {
                    found = true;
                    console.log("🚀 ~ search ~ bible[i].chapters[j][k]:", bible[i].chapters[j][k].toLowerCase());
                    console.log("🚀 ~ search ~ search:", search)
                    renderBookChapterVerse(i,j,k);
                }
            }
                
                
        }
    }
    if (found == false) {
        alert("No results found");
        renderBookAndChapter(globalBook,globalChapter);
        hideVerses();
    }
}
}

function saveData(){
    localStorage.setItem("book", globalBook);
    localStorage.setItem("chapter", globalChapter);
}

function loadData(){
    if (localStorage.getItem("book") != null) {
    globalBook = parseInt(localStorage.getItem("book"));
    globalChapter = parseInt(localStorage.getItem("chapter"));
    }
}

function darkMode() {
    darkModeOn = (darkModeOn==1)?0:1;
    if (darkModeOn==1) {
        lblDM.innerText = "Activate Dark Mode" + darkModeOn;
        lblDM.innerText = "Activate Dark Mode";
        darkModeBtn.classList.remove('fa-toggle-on');
        darkModeBtn.classList.add('fa-toggle-off');
        lightMode();
    }else if (darkModeOn==0){
        lblDM.innerText = "Activate Light Mode" + darkModeOn;
        lblDM.innerText = "Activate Light Mode";
        darkModeBtn.classList.remove('fa-toggle-off');
        darkModeBtn.classList.add('fa-toggle-on');
        shadowMode();
    }
    saveDarkMode(darkModeOn);
}



function darkModeChage(){
    if (darkModeOn==1) {
        lblDM.innerText = "Activate Dark Mode" + darkModeOn;
        lblDM.innerText = "Activate Dark Mode";
        darkModeBtn.classList.remove('fa-toggle-on');
        darkModeBtn.classList.add('fa-toggle-off');
        lightMode();
    }else if (darkModeOn==0){
        lblDM.innerText = "Activate Light Mode" + darkModeOn;
        lblDM.innerText = "Activate Light Mode";
        darkModeBtn.classList.remove('fa-toggle-off');
        darkModeBtn.classList.add('fa-toggle-on');
        shadowMode();
    }
}


function lightMode(){
    r.style.setProperty('--font-family', "Poetsen One");
    r.style.setProperty('--backgorund-color', "#ffffff");
    r.style.setProperty('--font-color', '#333333');
    r.style.setProperty('--footer-color', '#f8f4e6');
    r.style.setProperty('--footer-border', '#c0c0c0');
    r.style.setProperty('--contraster-color', 'teal'); // --contraster-color: #008080;
    r.style.setProperty('--contraster-color2', 'aqua'); // --contraster-color2: #008000;
}

function shadowMode(){
    r.style.setProperty('--font-family', 'Courgette, cursive');
    r.style.setProperty('--backgorund-color', '#1f1f1f');
    r.style.setProperty('--font-color', '#ffffff');
    r.style.setProperty('--footer-color', '#2c2c2c');
    r.style.setProperty('--footer-border', '#4a4a4a');
    r.style.setProperty('--contraster-color', 'aqua');  
    r.style.setProperty('--contraster-color2', 'teal');  
}

function saveDarkMode(d) {
    localStorage.setItem("darkMode", d);   
}

function loadDarkMode() {
    if (localStorage.getItem("darkMode") != null) {
        darkModeOn = parseInt(localStorage.getItem('darkMode'));
    }else {
        darkModeOn = 0;
    }
    darkModeChage();
}


function searchBarListener() {
    // Execute a function when the user presses a key on the keyboard
searchBar.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    // event.preventDefault();
    // Trigger the button element with a click
    search();
  }
});
}

function openDialog() {
    dialogo.showModal();
}

function closeDialog() {
    dialogo.close();
}

function fullscreen(imageSrc, verse) {
    imgSelected.setAttribute('src',imageSrc);
    document.getElementById("legenda").innerHTML = verse;
    openDialog();
}
