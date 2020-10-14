import React,{ Component } from 'react';
class Paginator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: this.props.pages,
      selectedPage: this.props.selectedPage || 1,
      totalEntries: this.props.totalEntries || 0,
      limit: this.props.limit || 10,
      loading: this.props.loading,
    };
  }

  componentDidMount(){
    if (this.props.loadOnFirst){
      const page = this.props.firstPage || 1
      this.setState({ selectedPage: page });
      this.props.onPageChange(page);
    }
  }
  changePage(page) {
    if (page == 0 || page > this.state.pages) {
      return;
    }
    this.setState({ selectedPage: page });
    this.props.onPageChange(page);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    let {pages, totalEntries, loading, selectedPage} = this.state

    if (newProps.pages != this.props.pages)
      pages = newProps.pages;
    if (newProps.totalEntries != this.props.totalEntries)
      totalEntries = newProps.totalEntries;
    if (newProps.loading != this.props.loading)
      loading = newProps.loading;
    if (newProps.selectedPage != this.props.selectedPage)
      selectedPage = newProps.selectedPage

    this.setState({pages, totalEntries, loading, selectedPage});
  }
  renderPages() {
    if (this.state.pages === 0) {
      return;
    }
    let pgList = [];
    let lastPage = this.state.pages;
    const pagesShown = 10;
    let startPage = 1;
    if (lastPage > pagesShown) {
      lastPage = pagesShown;
    }

    const selectedPage = this.state.loading ? 0 : this.state.selectedPage
    if (selectedPage >= pagesShown) {
      startPage = selectedPage - (Math.floor(pagesShown / 2) - 1);
    }
    if (selectedPage >= lastPage) {
      lastPage = selectedPage + (Math.floor(pagesShown / 2) - 1);
      if (lastPage > this.state.pages) {
        lastPage = this.state.pages;
      }
    }
    for (let i = startPage; i <= lastPage; i++) {
      pgList.push(i);
    }
    if (pgList.indexOf(1) === -1) {
      pgList.unshift(null);
      pgList.unshift(1);
    }
    if (pgList.indexOf(this.state.pages) === -1) {
      pgList.push(null);
      pgList.push(this.state.pages);
    }
    return pgList.map((pg, idx) => {
      if (pg === null) {
        return (
          <li
            key={`page-${pg + '-' + idx}`}
            className="paginate_button disabled ">
            <a
              onClick={() => {
                return;
              }}
              className="page-link">
              {'…'}
            </a>
          </li>
        );
      }
      return (
        <li
          key={`page-${pg}`}
          className={
            'paginate_button ' +
            (selectedPage == pg ? 'active' : '') +
            (this.state.loading ? ' disabled ' : '')
          }>
          <a
            disabled={this.state.loading ? true : false}
            data-toggle="tooltip"
            data-placement="left"
            onClick={this.changePage.bind(this, pg)}
            data-original-title={pg}
            className={"page-link " + (selectedPage == pg ? 'active' : '')}>
            {pg}
          </a>
        </li>
      );
    });
  }

  render() {
    let to = this.state.selectedPage * this.state.limit;
    if (to > this.state.totalEntries) {
      to = this.state.totalEntries;
    }
    if (!this.state.totalEntries) {
      to = 0;
    }
    let totalEntries = this.state.totalEntries;
    if(this.props.to && this.props.to > to){
      to = this.props.to;
    }
    return (
      <div style={{ marginRight: 0 }}>
        <div>
          Showing{' '}
          {this.state.pages == 0
            ? 0
            : (this.state.selectedPage - 1) * this.state.limit + 1}{' '}
          to {to} of {totalEntries} entries{' '}
        </div>
        <div>
          <ul
            className="pagination"
            style={{ float: 'left' }}>
            <li
              className={
                'page-item previous ' +
                (this.state.selectedPage == 1 || this.state.loading
                  ? 'disabled'
                  : '')
              }>
              <a
                disabled={this.state.selectedPage == 1}
                onClick={this.changePage.bind(
                  this,
                  this.state.selectedPage - 1,
                )}
                className="page-link">
                Previous
              </a>
            </li>
            {this.renderPages()}
            <li
              className={
                'page-item next ' +
                (this.state.selectedPage == this.state.pages ||
                this.state.loading ||
                this.state.pages == 0
                  ? 'disabled'
                  : '')
              }>
              <a
                disabled={
                  this.state.selectedPage == this.state.pages ||
                  this.state.pages == 0
                }
                onClick={this.changePage.bind(
                  this,
                  this.state.selectedPage + 1,
                )}
                className="page-link">
                Next
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
Paginator.defaultProps = {
  pages: 10,
  selectedPage: 1,
  totalEntries: 100,
  limit: 10,
  loading: false,
  onPageChange: ()=>{},
};
export default Paginator;
