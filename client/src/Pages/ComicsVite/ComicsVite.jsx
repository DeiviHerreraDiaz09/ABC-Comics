import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./ComicsVite.css";

const ComicsVite = () => {
  const [comics, setComics] = useState([]);

  console.log(comics);

  useEffect(() => {
    axios.get('http://localhost:5000/api/comics')
      .then(response => {
        setComics(response);
      })
      .catch(error => {
        console.error('Error fetching comics:', error);
      });
  }, []);

  return (
    <div className='comicsVite'>
      <div className="introduction">
        <h1>Introducción de Comics / Movies</h1>
      </div>

      <div className="listComics">
  
      </div>
    </div>
  );
}

export default ComicsVite;
