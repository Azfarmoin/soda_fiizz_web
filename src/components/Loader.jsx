import React from 'react';

export default function Loader({ progress, done }) {
  return (
    <div id="loader" className={done ? 'done' : ''}>
      <div>
        <h1>PULP</h1>
        <div className="bar"><i style={{ width: `${progress}%` }} /></div>
        <p>{progress}%</p>
      </div>
    </div>
  );
}
