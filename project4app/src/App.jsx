import { useState } from 'react'
import './App.css'

function App() {
  const [banCount, unbanCount] = useState([]);
  const [currentArtwork, setArtwork] = useState(null);
  const [isLoading, setLoading] = useState(false);

  async function fetchArt(){
    setLoading(true);
    try {
      const response = await fetch('https://api.artic.edu/api/v1/artworks?fields=id,title,artist_title,image_id,place_of_origin');
      const data = await response.json();
      const filteredData = data.data.filter(artwork => !banCount.includes(artwork.artist_title) && !banCount.includes(artwork.place_of_origin));
      if (filteredData.length == 0){
        setArtwork(null);
        setLoading(false);
        return;
      }
      const randomIndex = Math.floor(Math.random() * filteredData.length);
      const selected = filteredData[randomIndex];

      setArtwork(selected);
    } catch (error) {
      console.error("Error fetching artwork:", error);
    }

    setLoading(false);
  }

function handleBan(value){
  if(!banCount.includes(value)){
    unbanCount([...banCount, value]);
  }
}
function handleUnban(value){
  unbanCount(banCount.filter(item => item !== value));
}

function buildImageUrl(imageId) {
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
  }

return(
  <div className="App">
    <h1>Artworks from the World </h1>
    <button onClick={fetchArt} disabled = {isLoading} className = "findButton">{isLoading ? "Loading..." : "Discover Artwork"}</button>
    {currentArtwork ? (
      <div className="art-card">
          {currentArtwork.image_id && (
            <img
              src={buildImageUrl(currentArtwork.image_id)}
              alt={currentArtwork.title}
            />
          )}

          <h2>{currentArtwork.title}</h2>

          <p>
            <strong>Artist:</strong>{" "}
            <span
              className="clickable"
              onClick={() => handleBan(currentArtwork.artist_title)}
            >
              {currentArtwork.artist_title || "Unknown"}
            </span>
          </p>

          <p>
            <strong>Place of Origin:</strong>{" "}
             <span
               className="clickable"
               onClick={() => handleBan(currentArtwork.place_of_origin)}>
              {currentArtwork.place_of_origin || "Unknown"}
               </span>
          </p>
        </div>
      ) : (
        <p>No artwork to display. Click Discover!</p>
      )}

      <div className="ban-list">
        <h3>Ban List</h3>

        {banCount.length === 0 && <p>No banned artists yet.</p>}

        <div className="ban-items">
          {banCount.map((item) => (
            <button
              key={item}
              onClick={() => handleUnban(item)}
              className="ban-item"
            >
              {item} ✕
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
  
export default App;
