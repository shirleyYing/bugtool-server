import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

export default ({
  data = [],
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [height, setHeight] = useState(document.documentElement.clientHeight - 100)

  useEffect(() => {
    setList(data.slice(0, 20));
    setPage(1);
    setHasMore(true);
  }, [data])

  const onResize = () => {
    setHeight(document.documentElement.clientHeight - 100);
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, []);

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    if (list.length >= data.length) {
      setLoading(false);
      setHasMore(false)
      return;
    }
    const newPage = page + 1;
    setPage(newPage);
    setList(list.concat(data.slice((newPage - 1) * 20, newPage * 20)))
    setLoading(false)
  };

  // console.log("data::::", data)
  // console.log("list:::", list)

  return (
    <div className="infinite-container" style={{ height, overflowY: 'auto' }}>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
        {React.Children.map(children,
          (child) => React.cloneElement(child, { data: list }))}
        {loading && hasMore && (
          <div className="demo-loading-container"
            style={{ position: 'absolute', bottom: '40px', width: '100%', textAlign: 'center' }}>
            <Spin />
          </div>
        )}
      </InfiniteScroll>
    </div >
  );
}
