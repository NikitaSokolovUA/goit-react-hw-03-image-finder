import { Component } from 'react';
import { Overlay, ModalWindow } from './Modal.styled';

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.closeModalOnEscPush);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeModalOnEscPush);
  }

  closeModalOnEscPush = e => {
    const KEY_CODE_ESCAPE = 'Escape';

    console.log(e.code);

    if (e.code === KEY_CODE_ESCAPE) {
      this.props.toggleModal();
    }
  };

  closeModalOnClick = e => {
    if (e.target === e.currentTarget) {
      this.props.toggleModal();
    }
  };

  render() {
    return (
      <Overlay onClick={this.closeModalOnClick}>
        <ModalWindow>
          <img src={this.props.largeImageURL} alt="" />
        </ModalWindow>
      </Overlay>
    );
  }
}

export default Modal;