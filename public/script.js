const API_KEY = "60cbb35e7cd64dfc94fca0bce0e12ce9";
const url ="https://newsapi.org/v2/everything?q=";
// const API_KEY = "6041f39ba9f04857a60574dcacb1977f";

window.addEventListener('load' , ()=>fetchNews("India"));
function reload(){
    window.location.reload();
}
async function fetchNews(query){
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}
function bindData(articles){
    const cardContainer = document.getElementById('card-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardContainer.innerHTML='';

    articles.forEach(article => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone,article );
        cardContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone , article){
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleDateString("en-US",{
        timeZone:"Asia/Jakarta"
    });
    newsSource.innerHTML = `${article.source.name} - ${date}`;

    cardClone.firstElementChild.addEventListener("click" ,()=>{
        window.open(article.url , "_blank");
    })
}
let currSelectedNav = null;
function onNavItemClick(id){
    fetchNews(`${id}-India`);
    const navItem = document.getElementById(id);
    currSelectedNav?.classList.remove('active');
    currSelectedNav=navItem;
    currSelectedNav.classList.add('active');
}


const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click",()=>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    currSelectedNav?.classList.remove('active');
    currSelectedNav=null;
})

function toggleNotesModal() {
    const modal = document.getElementById('notes-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        loadNote(); // Load the saved note when opening the modal
    }
}
//download notes locally
function downloadNoteAsText() {
    const noteText = document.getElementById('notes-text').value;

    if (!noteText) {
        alert('Please write some notes before downloading.');
        return;
    }

    // Create a Blob with the note text
    const blob = new Blob([noteText], { type: 'text/plain' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'note.txt'; // Set the download file name

    // Trigger the download
    link.click();

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(link.href);
}


//notes
// Function to save the note to the server
function saveNoteToServer() {
    const noteText = document.getElementById('notes-text').value;

    if (!noteText) {
        alert('Please write some notes before saving.');
        return;
    }

    // Send the note to the server using fetch
    fetch('/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: noteText })  // Send the note content
    })
    .then(response => response.text())
    .then(data => {
        // alert('Note saved successfully!');
        // Optionally, you could clear the input after saving:
        document.getElementById('notes-text').value = '';
    })
    .catch(error => {
        console.error('Error saving note:', error);
        alert('Failed to save note.');
    });
    
}

// Add an event listener to the Save Note button
document.getElementById('save-note').addEventListener('click', saveNoteToServer);




// / Function to fetch saved notes from the server and display them
function loadNotesFromServer() {
    fetch('/notes')
    .then(response => response.json())
    .then(notes => {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = ''; // Clear the current list

        // Loop through the notes and display each one with creation time
        notes.forEach(note => {
            const noteItem = document.createElement('li');
            const createdAt = new Date(note.createdAt).toLocaleString(); // Format creation date
            noteItem.textContent = `${note.content} (Date: ${createdAt})`; // Display content and timestamp
            notesList.appendChild(noteItem);
        });

        // Show the saved notes section
        document.getElementById('saved-notes-section').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error fetching notes:', error);
        // alert('Failed to load saved notes.');
    });
}

// Function to toggle the visibility of the see-notes modal
function toggleSeeNotesModal() {
    const modal = document.getElementById('see-notes-modal');
    modal.classList.toggle('hidden');  // Add or remove the 'hidden' class
    // If the modal is now visible, load notes from the server
    if (!modal.classList.contains('hidden')) {
        loadNotesFromServer();  // Call the function to fetch and display notes
    }
}

// Add event listener to the "See Notes" button
document.getElementById('see-notes').addEventListener('click', toggleSeeNotesModal);

// Add event listener to the "Close" button inside the modal
document.getElementById('Close-Notes').addEventListener('click', toggleSeeNotesModal);





//hamburger 
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".sidebar").style.left = "0px";
    document.querySelector(".hamburger").style.display = "none";
    document.querySelector(".close").style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".sidebar").style.left = "-100%";
    document.querySelector(".hamburger").style.display = "block";
    document.querySelector(".close").style.display = "none";
});

let selectedChannel = "in"; // Default to India

// Function to handle country change
function onChannelChange() {
    const channelSelect = document.getElementById('channel-filter');
    selectedChannel = channelSelect.value;
    fetchNews(selectedChannel);
}

// Ensure the fetchNewsForCountry is called on page load
window.addEventListener('load', () => fetchNews(selectedChannel));

//dark mode toogel
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {        document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);