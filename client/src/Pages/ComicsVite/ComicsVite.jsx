import { React, useState, useEffect, useRef } from 'react';
import styles from './ComicsVite.module.css';
import { CardGridComponent } from '../../components/CardGridComponent';
import { CardListComponent } from '../../components/CardListComponent';
import Modal from 'react-modal';
import { fetchComics, fetchFavoriteComics, fetchComicDetails, markComicAsFavorite, formatDate, redirectUrl } from '../../services/comicService.js';

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
  const [showFavorites, setShowFavorites] = useState(false);
  const comicsPerPage = 25;
  const listRef = useRef(null);

  const indexOfLastComic = currentPage * comicsPerPage;
  const indexOfFirstComic = indexOfLastComic - comicsPerPage;

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
      const response = await fetchComicDetails(comicId);
      setComicDetails(response);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error al obtener los detalles del cómic:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setComicDetails(null);
  };


  const toggleFavorite = async (comicId) => {
    try {
      await markComicAsFavorite(comicId);
      const favComicIds = await fetchFavoriteComics();
      setFavorites(favComicIds);
    } catch (error) {
      console.error('Error al marcar o buscar cómics favoritos:', error);
    }
  };

  const toggleShowFavorites = () => {
    setShowFavorites(prevState => !prevState);
    setCurrentPage(1);
  };


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

  const filteredComics = comics.filter(comic =>
    comic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFavorites = favorites.length
    ? comics.filter(comic => favorites.includes(comic.id.toString()))
    : [];

  const totalComics = showFavorites ? filteredFavorites.length : filteredComics.length;

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalComics / comicsPerPage); i++) {
    pageNumbers.push(i);
  }

  const currentComics = filteredComics.slice(indexOfFirstComic, indexOfLastComic);
  const currentFavorites = filteredFavorites.slice(indexOfFirstComic, indexOfLastComic);
  const comicsToDisplay = showFavorites ? currentFavorites : currentComics;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const comicsData = await fetchComics();
        setComics(comicsData);
        setLoading(false);
      } catch (error) {
        console.error('Error al buscar cómics:', error);
        setLoading(false);
      }

      try {
        const favComicIds = await fetchFavoriteComics();
        setFavorites(favComicIds);
      } catch (error) {
        console.error('Error al buscar cómics favoritos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.comicsVite}>
      <div className={styles.introduction}>
        <h1>Descubre el Universo de ABC Comics</h1>
        <p>El sitio web de confianza donde puedes encontrar tus cómics favoritos y toda la información que necesitas. ¡Solo disfruta!</p>
        <div className={styles.sections}>
          <div className={styles.website} onClick={() => redirectUrl("website")}></div>
          <div className={styles.github} onClick={() => redirectUrl("gitHub")}></div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <h1>Cargando cómics...</h1>
        </div>
      ) : (
        <div className={styles.listComics} ref={listRef}>
          <div className={styles.displayVis}>
            <input
              type="text"
              placeholder='Nombre del comic'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className={styles.btnDisplay}>
              <label className={styles.switch}>
                <input type="checkbox" checked={viewMode === 'list'} onChange={toggleViewMode} />
                <div className={styles.switchtoggle}></div>
              </label>
              <div className={`${styles.favComicsBlack} ${showFavorites ? styles.active : ''}`} onClick={toggleShowFavorites}></div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <CardGridComponent
              comics={comicsToDisplay}
              formatDate={formatDate}
              openModal={openModal}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ) : (
            <CardListComponent
              comics={comicsToDisplay}
              formatDate={formatDate}
              openModal={openModal}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      )}

      {!showFavorites && (
        <div className={styles.pagination}>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={currentPage === number ? styles.active : ''}
            >
              {number}
            </button>
          ))}
        </div>
      )}

      {comicDetails && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Detalles del Cómic" style={customStyles}>
          <div className={styles.modalDetails}>
            <div className={styles.containerClosedResponsive}>
              <button className={styles.responsiveButton} onClick={closeModal}></button>
            </div>

            <div className={styles.imgDetailsComic} style={{ backgroundImage: `url(${comicDetails.image})` }}></div>
            <div className={styles.informationDetailsComic}>
              <div className={styles.containerClosed}>
                <div className={styles.closeModal} onClick={closeModal}></div>
              </div>

              <div className={styles.informationComic}>
                <h1>{comicDetails.name}</h1>
                <h3 className={styles.DescriptionComicsDetails}><span className={styles.boldSubTitle}>Descripción: </span>{comicDetails.description}</h3>
                <h3><span className={styles.boldSubTitle}>Fecha de publicación</span>: {formatDate(comicDetails.cover_date)}</h3>
                <h3><span className={styles.boldSubTitle}>Volumen</span>: {comicDetails.volume}</h3>
                {comicDetails.location_credits && comicDetails.location_credits.length > 0 && (
                  <>
                    <h3><span className={styles.boldSubTitle}>Créditos de Ubicación</span>:</h3>
                    <div className={styles.objsDecoration}>
                      {comicDetails.location_credits.map((credit, index) => (
                        <div className={styles.objDecoration} key={index}>
                          <h3>{credit.name}</h3>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {comicDetails.person_credits && comicDetails.person_credits.length > 0 && (
                  <>
                    <h3><span className={styles.boldSubTitle}>Créditos de Personas</span>:</h3>
                    <div className={styles.objsDecoration}>
                      {comicDetails.person_credits.map((credit, index) => (
                        <div className={styles.objDecoration} key={index}>
                          <h3>{credit.name}</h3>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {comicDetails.team_credits && comicDetails.team_credits.length > 0 && (
                  <>
                    <h3><span className={styles.boldSubTitle}>Créditos de Equipos</span>:</h3>
                    <div className={styles.objsDecoration}>
                      {comicDetails.team_credits.map((credit, index) => (
                        <div className={styles.objDecoration} key={index}>
                          <h3>{credit.name}</h3>
                        </div>
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
};

export default ComicsVite;


