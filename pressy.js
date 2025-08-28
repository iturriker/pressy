// Variables globales
let book = {};
let chapters;

// Elementos del DOM
const chapterList = document.querySelector(".chapter-list");
const pages = document.querySelectorAll(".page");

const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

// Manejar la entrada del mouse
function handleChapterListEnter(event) {
    chapters.forEach(chapter => chapter.classList.remove("collapse"));
}

// Manejar la salida del mouse
function handleChapterListExit(event) {
    displayChapter();
}

// Manejar el clic en un capítulo
function handleChapterClick(event) {
    event.preventDefault();

    const clickedChapter = event.target.closest(".chapter");
    if (!clickedChapter) return;

    const clickedChapterIndex = Array.from(chapters).indexOf(clickedChapter);

    console.log("Chapter clicked:", clickedChapterIndex);
    book.currentChapter = book.chapters[clickedChapterIndex];
    book.currentPage = book.currentChapter.pages[0];
    displayThings();
    console.log("Current chapter and page updated:", book.currentChapter.index, book.currentPage.lindex);
}

// Manejar el clic en los botones de navegación
function handleNavigationClick(event) {
    event.preventDefault();

    console.log("before: chapter " + book.currentChapter.index + " , " + "local page " + book.currentPage.lindex + " , " + "global page " + book.currentPage.gindex  + " , " + "translation " + document.body.style.getPropertyValue("--translation"));
    updateNavigation(event);
    displayThings();
    console.log("after: chapter " + book.currentChapter.index + " , " + "local page " + book.currentPage.lindex + " , " + "global page " + book.currentPage.gindex  + " , " + "translation " + document.body.style.getPropertyValue("--translation"));
}

// Controlar el chapter y la page
function updateNavigation(event) {
    const link = event.target.closest(".link");
    if (!link) return;

    if (link === next)
    {
        if (book.currentPage.lindex < book.currentChapter.pages[book.currentChapter.pages.length - 1].lindex)
        {
            book.currentPage = book.currentChapter.pages[book.currentPage.lindex + 1];
        }
        else if (book.currentChapter.index < book.chapters.length - 1)
        {
            book.currentChapter = book.chapters[book.currentChapter.index + 1];
            book.currentPage = book.currentChapter.pages[0];
        }
    }
    else if (link === previous)
    {
        if (book.currentPage.lindex > 0)
        {
            book.currentPage = book.currentChapter.pages[book.currentPage.lindex - 1];
        }
        else if (book.currentChapter.index > 0)
        {
            book.currentChapter = book.chapters[book.currentChapter.index - 1];
            book.currentPage = book.currentChapter.pages[book.currentChapter.pages.length - 1];
        }
    }
}

// Englobador de display
function displayThings() {
    displayNavigation();
    displayPage();
    displayChapter();
}

// Mostrar u ocultar los botones
function displayNavigation() {
  if (book.currentPage.gindex == book.firstPage.gindex)
  {previous.classList.add("collapse");}
  else
  {previous.classList.remove("collapse");}
  
  if (book.currentPage.gindex == book.lastPage.gindex)
  {next.classList.add("collapse");}
  else
  {next.classList.remove("collapse");}
}

// Mostrar la page seleccionada
function displayPage() {
    const translation = (100 / (book.lastPage.gindex + 1) * (book.currentPage.gindex) * -1) + "%";
    document.body.style.setProperty("--translation", translation);
}

// Mostrar el chapter
function displayChapter() {
    chapters.forEach((chapter, index) => {
        if (index === book.currentChapter.index)
        {chapter.classList.remove("collapse");}
        else
        {chapter.classList.add("collapse");}
    });
}

// Inicializar las cosas
function initialize() {
    document.body.style.setProperty("--pages", book.lastPage.gindex + 1);
    chapterList.addEventListener("mouseenter", handleChapterListEnter);
    chapterList.addEventListener("mouseleave", handleChapterListExit);
    chapters.forEach(chapter => chapter.addEventListener("click", handleChapterClick));
    
    previous.addEventListener("click", handleNavigationClick);
    next.addEventListener("click", handleNavigationClick);
}

async function get_chapters() {
    try {
        const response = await fetch('pressy.json');
        if (!response.ok) throw new Error("Error al cargar el JSON");

        const data = await response.json();
        return data.chapters;

    } catch (error) {
        console.error("Error capturado con try/catch:", error);
    }
}

function define_book(chapters) {
    book = {
        chapters: chapters,
        firstPage: chapters[0].pages[0],
        lastPage: chapters[chapters.length - 1].pages[chapters[chapters.length - 1].pages.length - 1],
        currentChapter: chapters[0],
        currentPage: chapters[0].pages[0]
    };
}

function render_chapters(chapters) {
    if (!chapterList) return;

    chapters.forEach(chapter => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '/';
    a.classList.add('chapter');

    const img = document.createElement('img');
    img.src = chapter.img.src.replace(/&amp;/g, '&'); // Corrige &amp; por &
    img.alt = chapter.img.alt;

    a.appendChild(img);
    li.appendChild(a);
    chapterList.appendChild(li);
  });
}

function render_page_backgrounds(chapters) {
    if (!pages.length) return;

    pages.forEach((page, gindex) => {
        const chapter = chapters.find(ch =>
            ch.pages.some(p => p.gindex === gindex)
        );

        page.style.backgroundImage = `url("${chapter.img.src}")`;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const chapters_data = await get_chapters();

    define_book(chapters_data);
    render_chapters(chapters_data);
    render_page_backgrounds(chapters_data);

    const event = new CustomEvent("chaptersLoaded", { detail: chapters });
    document.dispatchEvent(event);

    chapters = document.querySelectorAll(".chapter");
    initialize();
    displayThings();
})