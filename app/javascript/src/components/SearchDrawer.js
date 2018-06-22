import PropTypes from 'prop-types';
import React, { Component } from "react";
import SearchResults from "./SearchResults";
import axios from "axios";

const items = [
  { name: 'Events', link: '/#events', description: 'List of events.' },
  { name: 'Nature', link: '/#nature', description: 'Types of things found in nature.' },
  { name: 'Ideas', link: '/#ideas', description: 'Page detailing specific project ideas.' },
  { name: 'Travel Plans', link: '/#travel-plans', description: 'People\'s travel plans.' },
  { name: 'Branches', link: '/#branches', description: 'All BitBucket branches you have access to.' },
  { name: 'Pages', link: '/#pages', description: 'Confluence pages you have made.' },
];

export default class SearchDrawer extends Component {
  static propTypes = {
    onResultClicked: PropTypes.func,
    onSearchInputRef: PropTypes.func,
  };

  state = {
    searchString: '',
    results: []
  }

  componentDidMount(){
    axios.get("/apps.json")
    .then( (response)=> {
      this.setState({results: response.data.collection}, ()=>{ 
      })
    })
    .catch( (error)=> {
      console.log(error);
    });
  }

  filterChange = () => {
    this.setState({
      searchString: this.searchInput.value
    });
  };

  formattedResults = ()=> {
    return this.state.results.map((o,i)=>{
      return { 
        name: o.id, 
        link: `/apps/${o.id}`, 
        description: o.id 
      }
    })
  }

  searchResults = () => {
    const {searchString} = this.state;
    //const matchingResults = this.formattedResults()
    
    const matchingResults = this.formattedResults().filter(
      c => (
        c.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 ||
        (c.description && c.description.toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
      )
    ).slice(0, 10);
    
    return (
      <SearchResults
        matchingResults={matchingResults}
        onResultClicked={() => {
          this.props.onResultClicked();
          this.searchInput.value = '';
          this.filterChange();
        }}
      />
    )
  };

  render() {
    //console.log(this.state.items)
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          onKeyUp={this.filterChange}
          ref={el => {
            this.searchInput = el;
            if (this.props.onSearchInputRef) {
              this.props.onSearchInputRef(el);
            }
          }}
          style={{
            border: 'none',
            display: 'block',
            fontSize: 24,
            fontWeight: 200,
            outline: 'none',
            padding: '0 0 0 12px',
          }}
        />
        { this.searchResults() }
      </div>
    );
  }
}