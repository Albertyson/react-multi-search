import React from 'react';
import Paginator from 'components/ui/paginator';
const GoogleResults = (props)=>{
  const googleResults = props.googleResults;
  if(!googleResults){
    return null;
  }
  const totalCount = +googleResults.searchInformation.totalResults;
  const totalPages = Math.ceil(totalCount/props.limit);
  return <div style={{width:"80%", margin:"0 10%", textAlign:"justify"}}>
    <h5>Displaying Results from Google</h5>
    {
      googleResults.items.map((item,idx)=>{
        return (
          <div key={`result-${idx}`}>
            <h3>
              <a href={item.link} target="_blank">{item.title}</a>
            </h3>
            <p>{item.snippet}</p>
          </div>
        );
      })
    }
    <Paginator
      pages = {totalPages}
      selectedPage = {props.currentPage}
      totalEntries = {totalCount}
      limit = {props.limit}
      loading = {props.loading}
      onPageChange = {props.onPageChange}
    />
  </div>
}
export default GoogleResults;