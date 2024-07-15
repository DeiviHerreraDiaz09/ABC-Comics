import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./ComicsVite.css";
import { CardGridComponent } from '../../components/CardGridComponent';
import { CardListComponent } from '../../components/CardListComponent';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ComicsVite = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [comicDetails, setComicDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const comicsPerPage = 25;
  const listRef = useRef(null);

  console.log(favorites);

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

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'grid' ? 'list' : 'grid');
  };

  const openModal = async (comicId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comics/${comicId}`);
      setComicDetails(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching comic details:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setComicDetails(null);
  };

  const redirectUrl = (url) => {
    if (url === "favComics") {
      window.location.href = "/favComics";
    } else if (url === "website") {
      window.location.href = "https://comicvine.gamespot.com/api";
    } else if (url === "gitHub") {
      window.location.href = "https://github.com/DeiviHerreraDiaz09";
    } else {
      console.log("Error en el redireccionamiento de vinculos");
    }
  }

  const toggleFavorite = async (comicId) => {
    try {
      await axios.post(`http://localhost:5000/api/favComics/mark/${comicId}`);
      axios.get('http://localhost:5000/api/favComics')
        .then(response => {
          const favComicIds = response.data.map(comic => comic.id);
          setFavorites(favComicIds);
        })
        .catch(error => {
          console.error('Error fetching favorite comics:', error);
        });
    } catch (error) {
      console.error('Error marking comic as favorite:', error);
    }
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

    axios.get('http://localhost:5000/api/favComics')
      .then(response => {
        const favComicIds = response.data.map(comic => comic.id);
        setFavorites(favComicIds);
      })
      .catch(error => {
        console.error('Error fetching favorite comics:', error);
      });
  }, []);


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width: '70%',
      height: '70%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px'
    },
  };

  return (
    <div className='comicsVite'>
      <div className="introduction">
        <h1>Descubre el Universo de ABC Comics y Películas</h1>
        <p>El sitio web de confianza donde puedes encontrar tus cómics favoritos y toda la información que necesitas. ¡Solo disfruta!</p>
        <div className="sections">
          <div className="website" onClick={() => redirectUrl("website")}></div>
          <div className="github" onClick={() => redirectUrl("gitHub")}></div>
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
              <label className="switch">
                <input type="checkbox" checked={viewMode === 'list'} onChange={toggleViewMode} />
                <div className="switch--toggle"></div>
              </label>
              <div className="favComicsBlack"></div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <CardGridComponent
              comics={currentComics}
              formatDate={formatDate}
              openModal={openModal}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ) : (
            <CardListComponent
              comics={currentComics}
              formatDate={formatDate}
              openModal={openModal}

            />
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

      {comicDetails && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Detalles del Cómic" style={customStyles}>
          <div className="modalDetails">
            <div className="containerClosedResponsive">
              <button className="responsiveButton" onClick={closeModal}></button>
            </div>

            <div className="imgDetailsComic" style={{ backgroundImage: `url(${comicDetails.image})` }}></div>
            <div className="informationDetailsComic">
              <div className="containerClosed">
                <div className="closeModal" onClick={closeModal}></div>
              </div>

              <div className="informationComic">
                <h1>{comicDetails.name}</h1>
                <h3 className='DescriptionComicsDetails'><span className='boldSubTitle'>Descripción: </span>{comicDetails.description}</h3>
                <h3><span className='boldSubTitle'>Fecha de publicación</span>: {comicDetails.cover_date}</h3>
                <h3><span className='boldSubTitle'>Volumen</span>: {comicDetails.volume}</h3>
                {comicDetails.location_credits && comicDetails.location_credits.length > 0 && (
                  <>
                    <h3><span className='boldSubTitle'>Créditos de Ubicación</span>:</h3>
                    <div className="objsDecoration">
                      {comicDetails.location_credits.map((credit, index) => (
                        <div className="objDecoration" key={index}>{credit.name}</div>
                      ))}
                    </div>
                  </>
                )}
                {comicDetails.person_credits && comicDetails.person_credits.length > 0 && (
                  <>
                    <h3><span className='boldSubTitle'>Créditos de personas:</span></h3>
                    <div className="objsDecoration">
                      {comicDetails.person_credits.map((credit, index) => (
                        <div className="objDecoration" key={index}>{credit.name}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ComicsVite;
