import React, { useState } from 'react';
import axios from 'axios';
import './LibraryList.css';

const LibraryList = () => {
  const [libraries, setLibraries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.kirjastot.fi/v4/library?q=${searchQuery}`);
      if (response.data.items) {
        setLibraries(response.data.items);
      } else {
        setLibraries([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="library-list-container">
      <h1>Find Libraries</h1>
      <div className='pic'></div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Enter city or library name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      <div className="libraries-container">
        {libraries && libraries.length > 0 ? (
          libraries.map((library) => (
            <div key={library.id} className="library-card">
              <h2>{library.name}</h2>
              <p><strong>Address:</strong> {library.address.street}, {library.address.zipcode} {library.address.city}</p>
              {library.openingHours && <p><strong>Service Times:</strong> {library.openingHours.join(', ')}</p>}
              {library.description && (
                <div>
                  <strong>Description:</strong>
                  <div dangerouslySetInnerHTML={{ __html: library.description }} />
                </div>
               )}
              {library.coverPhoto && <img src={library.coverPhoto.large.url} alt={library.name} className="library-image" />}
              <p><strong>City:</strong> {library.address.city}</p>
              <p><strong>Area:</strong> {library.address.area}</p>
            </div>
          ))
        ) : (
          <p>No libraries found</p>
        )}
      </div>
    </div>
  );
};

export default LibraryList;