import { useEffect, useState } from 'react';

import * as SearchService from '../service/search-service';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [modal, setModal] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [,setError] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    getSearch(query, page);
  }, [query, page]);

  const getSearch = async (query, page) => {
    setIsLoading(true);
    setError('');

    try {
      const { hits, totalHits } = await SearchService.getFound(query, page);
      if (hits.length === 0) {
        return alert('Невірно введені данні');
      }

      const newHits = [];
      for (const hit of hits) {
        const id = hit.id;
        const webformatURL = hit.webformatURL;
        const largeImageURL = hit.largeImageURL;
        const object = { id, webformatURL, largeImageURL };
        newHits.push(object);
      }
      setImages(prev => [...prev, ...newHits]);
      setLoadMore(page < Math.ceil(totalHits / 12));
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const onHandleSubmit = value => {
    setQuery(value);
    setImages([]);
    setPage(1);
  };

  const modalControl = imageURL => {
    setImageURL(imageURL);
    setModal(prev => !prev);
  };

  const onloadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="app">
      <Searchbar onSubmit={onHandleSubmit} />
      <ImageGallery>
        <ImageGalleryItem images={images} modalControl={modalControl} />
      </ImageGallery>
      {loadMore && <Button onloadMore={onloadMore}></Button>}
      {modal && (
        <Modal imageURL={imageURL} modalControl={modalControl}></Modal>
      )}
      {isLoading && <Loader />}
    </div>
  );
};
