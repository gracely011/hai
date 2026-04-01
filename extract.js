const fs = require('fs');
const html = fs.readFileSync('ig/index.html', 'utf8');
const regex = /<svg\b[^>]*>.*?<\/svg>/g;
const matches = html.match(regex) || [];

// Let's print out all the aria-labels if any, otherwise just the first 50 chars
const out = matches.map(m => {
  const matchAria = m.match(/aria-label="([^"]+)"/);
  const aria = matchAria ? matchAria[1] : 'No Label';
  return `<!-- ${aria} -->\n${m}`;
});

fs.writeFileSync('svgs.html', out.join('\n\n'));
console.log("Extracted " + matches.length + " SVGs");
