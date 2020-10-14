import React from 'react';
import Paginator from 'components/ui/paginator';
const BingResults = (props)=>{
  const bingResults = props.bingResults;
  if(!bingResults){
    return null;
  }
  const totalCount = +bingResults.webPages.totalEstimatedMatches;
  const totalPages = Math.ceil(totalCount/props.limit);
  return <div style={{width:"80%", margin:"0 10%", textAlign:"justify"}}>
    <h5>Displaying Results from Bing</h5>
    {
      bingResults.webPages.value.map((item,idx)=>{
        return (
          <div key={`result-${idx}`}>
            <h3>
              <a href={item.url} target="_blank">{item.name}</a>
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
export default BingResults;