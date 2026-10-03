import React from 'react';

export default function Hud() {
  return (
    <div id="hud">
      <div className="brand">PULP</div>
      <div className="count" id="count"><b>01</b> / 04 &nbsp; STRAWBERRY</div>
      <div className="rail"><i id="railfill" /></div>
      <div className="intro" id="intro">{'Fruit → Liquid → Drink'}</div>
      <div className="hint" id="hint">Scroll<s /></div>
    </div>
  );
}
