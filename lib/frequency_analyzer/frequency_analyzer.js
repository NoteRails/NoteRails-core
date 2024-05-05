const FFT = require('fft.js');

function magnitudesToFrequencyMap(magnitudes, sampleRate) {
  let nyquistFrequency = sampleRate;
  let numBins = magnitudes.length;
  let frequencyMap = new Array(8001).fill(0);

  let frequencyResolution = nyquistFrequency / (numBins - 1);

  for (let i = 0; i < numBins; i++) {
    let frequency = i * frequencyResolution;
    if (frequency > 0 && frequency < frequencyMap.length) {
      frequencyMap[Math.round(frequency)] = magnitudes[i];
    }
  }

  return frequencyMap;
}

function findPeaks(data, threshold = 0, minDistance = 0) {
  let peaks = [];
  let n = data.length;

  let prominences = Array(n).fill(0);

  for (let i = 1; i < n - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
      let left = i - 1;
      while (left > 0 && data[left] <= data[left - 1]) {
        left--;
      }
      let right = i + 1;
      while (right < n - 1 && data[right] <= data[right + 1]) {
        right++;
      }
      let peakHeight = data[i];
      let leftHeight = data[left];
      let rightHeight = data[right];
      let prominence = Math.max(peakHeight - leftHeight, peakHeight - rightHeight);
      prominences[i] = prominence;
    }
  }

  let lastPeakIndex = -minDistance - 1;
  for (let i = 1; i < n - 1; i++) {
    if (prominences[i] >= threshold && i - lastPeakIndex > minDistance) {
      peaks.push(i);
      lastPeakIndex = i;
    }
  }

  return peaks;
}

function getFrequencies(audioData, sampleRate, fftSize) {
  let fft = new FFT(fftSize);
  let spectrum = fft.createComplexArray();
  fft.realTransform(spectrum, audioData);
  let magnitudes = spectrum.map(c => Math.abs(c));
  let frequencyMap = magnitudesToFrequencyMap(magnitudes, sampleRate);
  let peaks = findPeaks(frequencyMap, fftSize / 25,5);

  return peaks
}

module.exports = getFrequencies;