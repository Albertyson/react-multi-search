import React from 'react';

import API from "utils/api.js";

import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import GoogleResults from './google_results';
import BingResults from './bing_results';

const GOOGLE_API_KEY = "AIzaSyBy8sFzd9NGwVKDHQU9FkpsamzQU5voZRE";
const GOOGLE_API_CX = "00ede641bb354a5b3";
const GOOGLE_API_BASE_URL = "https://www.googleapis.com/customsearch/v1";

const BING_API_KEY = "d04a370c5a74467b868eda0dcf8df027";
const BING_API_BASE_URL = "https://albert-bing-search.cognitiveservices.azure.com//bing/v7.0/search";

const GOOGLE = "google";
const BING = "bing";
const BOTH = "both";



class SearchEngine extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchDone: false,
      loading: false,
      currentPage: {
        google:1,
        bing:1
      },
      hasError: {
        onGoogle: false,
        onBing: false
      },
      sourceEngine: GOOGLE
    };
    this.queryInput = React.createRef();
    this.limit = 10;
    this.api = new API();
  }
  componentDidMount(){}
  handleSubmit(){
    switch (this.state.sourceEngine) {
      case GOOGLE:
        this.searchOnGoogle();
        break;
      case BING:
        this.searchOnBing();
        break;
      case BOTH:
        this.searchOnGoogle();
        this.searchOnBing();
        break;
      default:
        break;
    }
  }
  searchOnGoogle(){
    let endpoint = `${GOOGLE_API_BASE_URL}`;
    this.setState({loading: true, hasError: {...{onGoogle:false}}});
    let request = this.api.get(endpoint,{
      key:GOOGLE_API_KEY,
      cx:GOOGLE_API_CX,
      start:(this.state.currentPage.google - 1) * this.limit + 1,
      num: this.limit,
      q:this.state.searchQuery
    });
    request.then(response=>{
      if(response.ok){
        return response.json();
      }else{
        throw response;
      }
    }).then(data=>{
      this.setState({searchDone:true, loading: false});
      if(data && data){
        this.setState({googleResults:data});
      }
    }).catch(e=>{
      this.setState({hasError: {...{onGoogle: true}}});
    });
  }
  searchOnBing(){
    let query= this.api.objectParamsToString({
      offset:(this.state.currentPage.bing - 1) * this.limit + 1,
      count: this.limit,
      q:this.state.searchQuery
    });
    let endpoint = `${BING_API_BASE_URL}?${query}`;
    var requestHeaders = new Headers();
    requestHeaders.append("Ocp-Apim-Subscription-Key",BING_API_KEY);
    var request = new Request(endpoint, {
      method: 'GET',
      headers: requestHeaders,
      mode: 'cors',
      cache: 'default'
    });
    this.setState({loading: true, hasError: {...{onBing: false}} });
    fetch(request).then(response=>{
      if(response.ok){
        return response.json();
      }else{
        throw response;
      }
    }).then(data=>{
      this.setState({searchDone:true, loading: false});
      if(data){
        this.setState({bingResults:data});
      }
    }).catch(e=>{
      this.setState({hasError: {...{onBing: true}} });
    });
  }
  handleInputChange(e){
    this.setState({searchQuery:e.target.value});
  }
  handleOnKeyDown(e){
    if (e.keyCode !== 13) {
      return;
    }
    this.setState({currentPage: {bing: 1,google: 1}},()=>{
      this.handleSubmit();
    });
  }
  handleRadioChange(e){
    this.setState({sourceEngine: e.target.value});
  }
  renderResults(){
    switch(this.state.sourceEngine){
      case GOOGLE:{
        return this.renderGoogleResults();
      }
      case BING: {
        return this.renderBingResults();
      }
      case BOTH: {
        return <div style={{display:"inline-flex"}}>
          <div style={{width:"50%"}}>
            {this.renderGoogleResults()}
          </div>
          <div style={{width:"50%"}}>
            {this.renderBingResults()}
          </div>
        </div>
      }
    }
  }
  renderGoogleResults(){
    return this.state.hasError.onGoogle ?
    <div style={{textAlign:"center"}}>
      <span>There was an error when trying to search.</span>
    </div>
    : 
    <GoogleResults
      googleResults={this.state.googleResults}
      currentPage={this.state.currentPage.google}
      limit={this.limit}
      loading={this.state.loading}
      onPageChange={(selectedPage)=>{
        const currentPage = Object.assign({},this.state.currentPage);
        currentPage.google = selectedPage;
        this.setState({currentPage},()=>{
          this.searchOnGoogle();
        })
      }}
    />     
  }
  renderBingResults(){
    return this.state.hasError.onBing ? 
    <div style={{textAlign:"center"}}>
      <span>There was an error when trying to search.</span>
    </div>
    :
    <BingResults
      bingResults={this.state.bingResults}
      currentPage={this.state.currentPage.bing}
      limit={this.limit}
      loading={this.state.loading}
      onPageChange={(selectedPage)=>{
        const currentPage = Object.assign({},this.state.currentPage);
        currentPage.bing = selectedPage;
        this.setState({currentPage},()=>{
          this.searchOnBing();
        })
      }}
    />  
  }
  render(){
    return (
      <React.Fragment>
        <div style={{textAlign:"center", marginTop:"3%"}}>
          <TextField 
            type="search" 
            onChange={this.handleInputChange.bind(this)} 
            onKeyDown={this.handleOnKeyDown.bind(this)}
            variant="outlined" label="Search Anything"
            style={{width:"80%"}}
          />
          <RadioGroup row aria-label="Engine Options" name="engine-options" defaultValue={GOOGLE}
            onChange={this.handleRadioChange.bind(this)}
            style={{width:"80%",display:"inline-flex"}}>
            <FormControlLabel value={GOOGLE} control={<Radio color="primary" />} label="Google" />
            <FormControlLabel value={BING} control={<Radio color="primary" />} label="Bing" />
            <FormControlLabel value={BOTH} control={<Radio color="primary" />} label="Both" />
          </RadioGroup>
        </div>
        {this.state.searchDone ? 
          this.renderResults()
        : null}
      </React.Fragment>
    );
  }
}
export default SearchEngine;