import React from 'react';


const Modal = ({handleClose, show, children, title, button}) =>{
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-header">
        <h1>{title}</h1>
        <button onClick={handleClose}>
          {button}
        </button>
      </section>
      <section className="modal-main">
        {children}
      </section>
    </div>
  );
};

export default Modal;
