const mergeImg = require('merge-img');

mergeImg(['letters/A.png', 'letters/B.png'])
  .then((img) => {
    // Save image as file
    img.write('temp/out.png', () => console.log('done'));
  });