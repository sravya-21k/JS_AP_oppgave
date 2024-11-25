const searchForm = document.querySelector(".search-form");
const searchResult = document.querySelector(".search-result");

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInput = document.querySelector(".search-box input");
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      getWord(searchTerm);
    } else {
      searchResult.textContent = "please enter a word";
    }
  });
} else {
  console.error("searchForm element not found in the DOM");
}

async function getWord(word) {
  const apiEndpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const result = await fetch(apiEndpoint);
    if (!result.ok) {
      throw new Error("Word not found");
    }
    const data = await result.json();
    showMeaning(data[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
    searchResult.textContent = "Word not found, Try again!";
    console.log(data);
  }
}
function showMeaning(data) {
  //word
  const wordElement = document.createElement("h2");
  wordElement.textContent = data.word;
  searchResult.appendChild(wordElement);

  //phonetics with audio button
  if (data.phonetics && data.phonetics.length > 0) {
    const phonetics = data.phonetics[0];
    if (phonetics.text) {
      const phoneticsText = document.createElement("p");
      phoneticsText.textContent = phonetics.text;
      searchResult.appendChild(phoneticsText);
    }

    //phonetics audio
    if (phonetics.audio) {
      const audioButton = document.createElement("button");
      audioButton.textContent = "🔊 Play Pronunciation";
      audioButton.style.cursor = "pointer";
      searchResult.appendChild(audioButton);

      //click event to play audio
      audioButton.addEventListener("click", () => {
        const audio = new Audio(phonetics.audio);
        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
          alert("Audio playback failed. Please try again.");
        });
      });
    } else {
      const noAudioMessage = document.createElement("p");
      noAudioMessage.textContent = "Audio not available for this word.";
      searchResult.appendChild(noAudioMessage);
    }
  }

  data.meanings.forEach((meaning) => {
    //parts of speech
    const partsOfSpeech = document.createElement("p");
    partsOfSpeech.textContent = meaning.partsOfSpeech;
    searchResult.appendChild(partsOfSpeech);

    //definations
    const definitions = document.createElement("ul");
    meaning.definitions.forEach((definition) => {
      const defItem = document.createElement("li");
      defItem.textContent = definition.definition;
      definitions.appendChild(defItem);
    });
    searchResult.appendChild(definitions);
  });
}
