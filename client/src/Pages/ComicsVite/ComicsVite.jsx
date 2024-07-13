import React, { useState, useEffect, useRef } from 'react';
import "./ComicsVite.css";
import axios from 'axios';

const ComicsVite = () => {

  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const comicsPerPage = 25;
  const listRef = useRef(null);


  const indexOfLastComic = currentPage * comicsPerPage;
  const indexOfFirstComic = indexOfLastComic - comicsPerPage;

  const filteredComics = comics.filter(comic =>
    comic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentComics = filteredComics.slice(indexOfFirstComic, indexOfLastComic);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredComics.length / comicsPerPage); i++) {
    pageNumbers.push(i);
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', options);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/comics')
      .then(response => {
        setComics(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching comics:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='comicsVite'>
      <div className="introduction">
        <h1>Descubre el Universo de ABC Comics y Películas</h1>
        <p>El sitio web de confianza donde puedes encontrar tus cómics favoritos y toda la información que necesitas. ¡Solo disfruta!</p>
        <div className="sections">
          <button>Comics</button>
          <button>Peliculas</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <h1>Cargando cómics...</h1>
        </div>
      ) : (
        <div className="listComics" ref={listRef}>
          <div className="displayVis">
            <input
              type="text"
              placeholder='Nombre del comic'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="btnDisplay">
              <button onClick={() => toggleViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>Grilla</button>
              <button onClick={() => toggleViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>Lista</button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="gridView">
              {currentComics.map((comic, index) => (
                <div className="col" key={index}>
                  <div className="container">
                    <div className="front" style={{ backgroundImage: `url(${comic.image})` }}>
                    </div>
                    <div className="back">
                      <div className="inner">
                        <h2>{comic.name}</h2>
                        <p>{comic.description.length > 200 ? comic.description.substring(0, 200) + "..." : comic.description}</p>
                        <p>{formatDate(comic.cover_date)}.</p>
                        <button>Ver más</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (

            <div className="listView">
              {currentComics.map((comic, index) => (
                <div className="list" key={index}>
                  <div className="imgComic" style={{ backgroundImage: `url(${comic.image})` }}></div>
                  <div className="information">
                    <h2>{comic.name}</h2>
                    <p>{comic.description.length > 200 ? comic.description.substring(0, 200) + "..." : comic.description}</p>
                    <p>{formatDate(comic.cover_date)}.</p>
                  </div>
                  <button>Ver más</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="pagination">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ComicsVite;
