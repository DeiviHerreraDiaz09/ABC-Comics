import React from 'react';
import './CardListComponent.css';

const CardListComponent = ({ comics, formatDate, openModal }) => {
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
            <button className="responsive-button" onClick={() => openModal(comic.id)}>Ver más</button>
          </div>
          <button onClick={() => openModal(comic.id)}>Ver más</button>
        </div>
      ))}
    </div>
  );
};

export default CardListComponent;
