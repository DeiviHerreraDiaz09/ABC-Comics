import React from 'react';
import './CardListComponent.css';
import heart from '/public/img/shape.svg'
import heart2 from '/public/img/fullHeart.svg'

const CardListComponent = ({ comics, formatDate, openModal, favorites, toggleFavorite }) => {
  return (
    <div className="listView">
      {comics.map((comic, index) => (
        <div className="list" key={index}>
          <div className="imgComic" style={{ backgroundImage: `url(${comic.image})` }}></div>
          <div className="information">
            <h2>{comic.name}</h2>
            <div className="descriptionContainer">
              <p>{comic.description}</p>
              <p>{formatDate(comic.cover_date)}.</p>
            </div>
            <div className="btnMoreFav">
              <button className="responsive-button" onClick={() => openModal(comic.id)}>Ver más</button>
              <div
                className={`favComicsTwoResponsive ${favorites.includes(comic.id.toString()) ? 'activado' : ''}`}
                onClick={() => toggleFavorite(comic.id)}
                style={{
                  backgroundImage: `url(${favorites.includes(comic.id.toString()) ? heart2 : heart})`
                }}
              ></div>
            </div>
          </div>
          <button onClick={() => openModal(comic.id)}>Ver más</button>
          <div
            className={`favComicsTwo ${favorites.includes(comic.id.toString()) ? 'activado' : ''}`}
            onClick={() => toggleFavorite(comic.id)}
            style={{
              backgroundImage: `url(${favorites.includes(comic.id.toString()) ? heart2 : heart})`
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default CardListComponent;
