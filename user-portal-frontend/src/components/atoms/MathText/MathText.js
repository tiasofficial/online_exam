import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Text cleaner function to fix unescaped LaTeX percent, arrows, markdown bold, raw text braces, and stemmed text
function cleanText(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text
    .replace(/\\text\{\s*%\s*\}/gi, '%')
    .replace(/\\text\{%\}/gi, '%')
    .replace(/\\text\{\s*\\%\s*\}/gi, '%')
    .replace(/-\\text\{([a-zA-Z0-9_]+)\}\$/gi, '-$1')
    .replace(/-\\text\{([a-zA-Z0-9_]+)\}/gi, '-$1')
    .replace(/\\text\{([a-zA-Z0-9_\s,]+)\}/gi, '$1')
    .replace(/\\circC/gi, '°C')
    .replace(/\^\\circ C/gi, '°C')
    .replace(/\^\\circ/gi, '°')
    .replace(/\\cdot([a-zA-Z0-9])/gi, ' · $1')
    .replace(/\\cdot\b/gi, ' · ')
    .replace(/\\to\b/gi, '→')
    .replace(/\\rightarrow\b/gi, '→')
    .replace(/\bDifferenti\b/gi, 'Differentiate')
    .replace(/\bdivid by\b/gi, 'divided by')
    .replace(/\bdivid\b/gi, 'divided')
    .replace(/\bquadrilater\b/gi, 'quadrilateral')
    .replace(/\bform by\b/gi, 'formed by')
    .replace(/\bspeci\b/gi, 'species')
    .replace(/\bincreas\b/gi, 'increase')
    .replace(/\baverag\b/gi, 'average')
    .replace(/\btemperatur\b/gi, 'temperature')
    .replace(/\bdistribut\b/gi, 'distribution')
    .replace(/\bmeasur\b/gi, 'measure')
    .replace(/\breproduc\b/gi, 'reproduce')
    .replace(/\bafforest\b/gi, 'afforestation');

  return cleaned;
}

// Function to render text containing SVG diagrams, markdown **bold** and LaTeX blocks $...$, $$...$$, \(...\), \[...\]
function renderFormattedMath(rawText) {
  if (!rawText) return null;
  const text = cleanText(rawText);

  // Regex matching <svg>...</svg>, $$...$$, $...$, \(...\), \[...\], or **bold**
  const masterRegex = /(<svg[^]+?<\/svg>|\$\$[^]+?\$\$|\$[^]+?\$|\\\(.*?\\\)|\\\[.*?\\\]|\*\*.*?\*\*)/gi;
  const parts = text.split(masterRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Handle SVG Diagrams (Circuit Diagrams, Chemical Structures, Geometric Shapes)
    if (part.toLowerCase().startsWith('<svg') && part.toLowerCase().endsWith('</svg>')) {
      return (
        <div key={idx} style={{ display: 'block', margin: '14px auto', textAlign: 'center', maxWidth: '100%' }}>
          <div dangerouslySetInnerHTML={{ __html: part }} />
        </div>
      );
    }

    // Handle markdown **bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const innerContent = part.slice(2, -2);
      return <strong key={idx} style={{ color: '#0f172a' }}>{innerContent}</strong>;
    }

    let isMath = false;
    let mathContent = part;

    if (part.startsWith('$$') && part.endsWith('$$')) {
      isMath = true;
      mathContent = part.slice(2, -2).trim();
    } else if (part.startsWith('$') && part.endsWith('$')) {
      isMath = true;
      mathContent = part.slice(1, -1).trim();
    } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
      isMath = true;
      mathContent = part.slice(2, -2).trim();
    } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
      isMath = true;
      mathContent = part.slice(2, -2).trim();
    } else if (part.includes('\\frac') || part.includes('\\sqrt') || part.includes('\\tan') || part.includes('\\sin') || part.includes('\\cos') || part.includes('\\mathrm') || part.includes('\\left')) {
      isMath = true;
      mathContent = part.replace(/^\\\(|\\\)$/g, '').trim();
    }

    if (isMath && mathContent) {
      // Fix unescaped % inside mathContent
      mathContent = mathContent.replace(/\\text\{\s*%\s*\}/gi, '\\%').replace(/\\text\{\s*\\%\s*\}/gi, '\\%');

      try {
        const html = katex.renderToString(mathContent, {
          displayMode: false,
          throwOnError: false
        });
        return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} style={{ margin: '0 2px' }} />;
      } catch (e) {
        return <span key={idx}>{part}</span>;
      }
    }

    return <span key={idx}>{part}</span>;
  });
}

const MathText = ({ text, style, className }) => {
  return (
    <span style={style} className={className}>
      {renderFormattedMath(text)}
    </span>
  );
};

export default MathText;
