import React, { Component } from 'react';
import ImageGallery from './ImageGallery';
import Searchbar from './Searchbar';
import Button from './Button';
import Loader from './Loader';
import picturesApi from 'api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    pictureValue: '',
    pictures: null,
    totalHits: 0,
    loadedHits: 0,
    page: 1,
    status: 'idle',
  };

  handleSubmit = async value => {
    this.setState({ page: 1 });
    this.setState({ status: 'pending' });

    try {
      const pictures = await picturesApi(value, this.state.page);

      if (pictures.hits.length !== 0) {
        this.setState({ loadedHits: pictures.hits.length });
        this.setState({ totalHits: pictures.totalHits });
        this.setState({ pictures: pictures.hits });
        this.setState({ pictureValue: value });
        this.updatePage();
        this.setState({ status: 'resolved' });
        return;
      }
      this.setState({ status: 'rejected' });
      return;
    } catch (error) {
      this.setState({ status: 'rejected' });
    }
  };

  handleUpdate = async () => {
    this.setState({ status: 'resolvAndPending' });
    const { pictureValue, page } = this.state;

    try {
      const pictures = await picturesApi(pictureValue, page);

      if (pictures.hits.length !== 0) {
        this.loadedPictures(pictures.hits.length);
        this.setState(prevState => ({
          pictures: [...prevState.pictures, ...pictures.hits],
        }));
        this.updatePage();
        this.setState({ status: 'resolved' });
        return;
      }
      this.setState({ status: 'rejected' });
      return;
    } catch (error) {
      this.setState({ status: 'rejected' });
    }
  };

  renderButtonByTotalHits = () => {
    if (this.state.loadedHits < this.state.totalHits) {
      return this.state.status === 'resolvAndPending' ? (
        <Loader />
      ) : (
        <Button onClick={this.handleUpdate} />
      );
    }
  };

  updatePage = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  loadedPictures = count => {
    this.setState(prevState => ({ loadedHits: prevState.loadedHits + count }));
  };

  notify = () => {
    toast.error('Sorry we dont find pictures by your Request', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  renderByStatus = () => {
    if (
      this.state.status === 'resolved' ||
      this.state.status === 'resolvAndPending'
    ) {
      return (
        <>
          <ImageGallery pictures={this.state.pictures} />
          {this.renderButtonByTotalHits()}
        </>
      );
    }

    if (this.state.status === 'pending') {
      return <Loader />;
    }

    if (this.state.status === 'rejected') {
      this.notify();
      return;
    }
  };

  render() {
    return (
      <>
        <Searchbar
          pictureValue={this.state.pictureValue}
          onSubmit={this.handleSubmit}
        />
        <ToastContainer />
        {this.renderByStatus()}
      </>
    );
  }
}

export default App;
