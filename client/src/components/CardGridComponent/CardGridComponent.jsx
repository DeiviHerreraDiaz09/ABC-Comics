import React from 'react';
import "./CardGridComponent.css";
import heart from '/public/img/shape.svg'
import heart2 from '/public/img/fullHeart.svg'

const CardGridComponent = ({ comics, formatDate, openModal, favorites, toggleFavorite }) => {

  return (
    <div className="gridView">
      {comics.map((comic, index) => (
        <div className="col" key={index}>
          <div className="container">
            <div className="front" style={{ backgroundImage: `url(${comic.image})` }}>
            </div>
            <div className="back">
              <div className="inner">
                <div
                  className={`favComics ${favorites.includes(comic.id.toString()) ? 'activado' : ''}`}
                  onClick={() => toggleFavorite(comic.id)}
                  style={{
                    backgroundImage: `url(${favorites.includes(comic.id.toString()) ? heart2 : heart})`
                  }}
                ></div>
                <h2>{comic.name}</h2>
                <p>{comic.description.length > 200 ? comic.description.substring(0, 120) + "..." : comic.description}</p>
                <p>{formatDate(comic.cover_date)}.</p>
                <button onClick={() => openModal(comic.id)}>Ver más</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGridComponent;
