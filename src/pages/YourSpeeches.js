import React, { Component } from 'react';
import speechService from '../lib/speech-service'; 
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { withAuth } from '../lib/authContext';



class YourSpeeches extends Component {
  state = {
    speeches: [],
    isLoading: true,
  }

  componentDidMount() {
    this.renderUpdate();
  }

  renderUpdate = () => {
    const valueSearch = queryString.parse(this.props.location.search);
    const valueSearch2 = this.props.location.search;//queryString.stringify(valueSearch);

    this.setState({
      isLoading: true,
    });
    speechService.getMySpeeches(this.props.user._id)
      .then(result => {
        this.setState({
          speeches: result,
          isLoading: false,
        })
      })
      .catch(error => {
        console.log('Error renderList', error);
      })
  }

  render() {
    const { speeches, isLoading } = this.state;
    let filterSpeeches = [];
    return (
      <div>
        <h1>Your Search</h1>
        {isLoading ? <h2>Loading...</h2> : speeches.map((speech, index) => {
          // if (speech.owner === this.props.user._id) {
            return <div key={index}>
            <div><Link key={speech._id} to={`/speeches/${speech._id}`}>{speech.title}</Link></div>
            </div>
            // }
        } )}
        
       </div>
    )
  }
}


export default withAuth(YourSpeeches);