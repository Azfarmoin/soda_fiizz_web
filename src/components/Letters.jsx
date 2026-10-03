import React from 'react';

// Splits text into masked per-letter spans (outer .ch clips, inner <i> animates).
export default function Letters({ text }) {
  return [...text].map((c, k) =>
    c === ' '
      ? <span key={k} style={{ display: 'inline-block', width: '.25em' }} />
      : <span className="ch" key={k}><i>{c}</i></span>
  );
}
