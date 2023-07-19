import PropTypes from 'prop-types';
import { useEffect } from 'react';

export const Modal = ({ imageURL, modalControl }) => {

  useEffect(() => {
    window.addEventListener('keydown', onHandleModal);

    function onHandleModal({ code }) {
      console.log(code);
      if (code === 'Escape') {
        modalControl();
      }
    }
    return () => {
      window.removeEventListener('keydown', onHandleModal);
    };
  }, [modalControl]);
  
  const onBackdropClose = e => {
    if (e.currentTarget === e.target) {
      modalControl();
    }
  };

  return (
    <div className="overlay" onClick={onBackdropClose}>
      <div className="modal">
        <img src={imageURL} alt="" width="800" height="600" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  imageURL: PropTypes.string.isRequired,
  modalControl: PropTypes.func.isRequired,
};
