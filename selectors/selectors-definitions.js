const JpegTakenDateSelector = require('./jpeg-taken-date-selector');
const MusicFirstLetterSelector = require('./music-first-letter-selector');
const Mp3JenreSelector = require('./mp3-jenre-selector');

const selectorsDefinition = {
    'jpeg-taken-date': JpegTakenDateSelector,
    'music-first-letter': MusicFirstLetterSelector,
    'mp3-jenre': Mp3JenreSelector
};

module.exports = selectorsDefinition;
