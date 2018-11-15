import React, { Component } from 'react'
import speechService from '../lib/speech-service'; 
import { Link } from 'react-router-dom';
// import queryString from 'query-string';
import { withAuth } from '../lib/authContext';
import Loading from "../effects/loading";


// const queryString = require('query-string');

class WorldSpeeches extends Component {

  state = {
    speeches: [],
    speechesSearch: [],
    isLoading: true,
    search:'',
    alert: '',
    // values: queryString.parse(this.props.location.search),
  }

  componentDidMount() {
    this.renderUpdate();
  }

  renderUpdate = () => {
    // const valueSearch = queryString.parse(this.props.location.search);
    const valueSearch2 = this.props.location.search;//queryString.stringify(valueSearch);
    

    this.setState({
      isLoading: true,
      values: valueSearch2,
    });

    speechService.getSpeech()
      .then(result => {
        this.setState({
          speeches: result,
          speechesSearch:result,
          isLoading: false,
          values: {}
        })
      })
      .catch(error => {
        console.log('Error renderList', error);
      })
  }

  handleSearch = (event) => {
    const { speeches } = this.state;

    const result = speeches.filter((speech,index) => {
      let speechTitle = speech.title.toUpperCase();
      let speechTag = speech.tag[0].toUpperCase();
      let speechMessage = speech.message.toUpperCase();
        if (speechTitle.includes(event.target.value.toUpperCase()) || speechTag.includes(event.target.value.toUpperCase()) || speechMessage.includes(event.target.value.toUpperCase())){
          speech.index= index;
          return speech;    
        }
       
    })
    
    this.setState({
      search: event.target.value,
      speechesSearch: result,
    })
  }

  handleFavourites = (id) => {
    speechService.addFavsSpeech(id)
      .then((result) => {
        console.log('REsultado fav ',result)
        this.setState({
          alert: 'Added to Favs!'
        })
        // if (result){

        // }
      })
      .catch( error => {
        const { data } = error.response;
        switch(data.error){
          case 'already add to favourites':     // checked
            this.setState({
              alert: 'Speech was already in favs.'
            });
            break;
          default:
            this.setState({
              alert: ''
            })
        }   
      })
  }

  render() {
    const { speeches, isLoading, search, speechesSearch, alert } = this.state;
    // console.log(this.props.location);
    

    return (
      <React.Fragment>
      <div class="search-navbar">
        <h1>Explore Speeches</h1>
        <div className="search-bar">Search: <input  className="form-input" type="search" name="search" value={search} onChange={this.handleSearch}/></div>
      </div>
      { alert ? <h1 className="alert-warning">{alert}</h1> : <React.Fragment></React.Fragment>}
      <section className="search-result">
        {isLoading ? <h2>Loading2... <Loading /> </h2> : speechesSearch.map((speech, index) => {
          return <div className="search-link-containers" index={index} key={`${speech.title}-${index}`}>
            <div className="search-flex">
              <div><Link className="search-links" key={`${speech._id}-${index}`} to={`/speeches/${speech._id}`}>{speech.title}</Link></div>
              <div><button className="fav-button" onClick={() => this.handleFavourites(speech._id)}>Fav</button></div>
            </div>
          </div>
        } )}
      </section>
      </React.Fragment>
    )
  }
}

export default withAuth(WorldSpeeches);