import * as pianoSamplesByNote from '../assets/audio/samples/vsco2-piano-mf';
import * as arcvibSamplseByNote from '../assets/audio/samples/vsco2-violin-arcvib-reverbed';
import * as susvibSamplesByNote from '../assets/audio/samples/vsco2-violins-susvib-reverbed';

export default {
  'vsco2-piano-mf': Object.keys(pianoSamplesByNote).reduce((o, note) => {
    o[note.replace('sharp', '#')] = pianoSamplesByNote[note];
    return o;
  }, {}),
  'vsco2-violin-arcvib-reverbed': arcvibSamplseByNote,
  'vsco2-violins-susvib-reverbed': susvibSamplesByNote,
};
