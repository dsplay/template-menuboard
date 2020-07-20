import React from 'react';

function FeaturedImage({
  url,
  layout,
  size,
}) {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className={"ad-box ad-box-" + size + (!layout ? ' ad-box-bordered' : '')} style={{ "backgroundImage": "url('" + url + "')" }} />
      </div>
    </div>
  );
}

export default FeaturedImage;