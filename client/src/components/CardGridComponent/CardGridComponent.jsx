import React from 'react';
import "./CardGridComponent.css";

const CardGridComponent = ({ comics, formatDate }) => {
  return (
    <div className="gridView">
      {comics.map((comic, index) => (
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
  );
};


export default CardGridComponent;
