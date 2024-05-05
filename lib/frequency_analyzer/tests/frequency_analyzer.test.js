const getFrequencies = require('../frequency_analyzer');

const fs = require('fs');
const wav = require('node-wav');

function generateSoundSample(sampleRate, duration, frequencies) {
  let numSamples = Math.floor(sampleRate * duration);
  let samples = new Float32Array(numSamples);

  for (let t = 0; t < numSamples; t++) {
      let sampleValue = 0;
      for (let [frequency, intensity] of frequencies) {
          sampleValue += intensity * Math.sin(2 * Math.PI * frequency * t / sampleRate);
      }
      samples[t] = sampleValue;
  }

  return samples;
}

describe("getFrequencies file", () => {
  let threshold = 10
  it.each([
    [440,1024 * 4],
    [600,1024 * 4],
    [880,1024 * 4],
    [440,1024 * 8],
    [600,1024 * 8],
    [880,1024 * 8],
    [440,1024 * 16],
    [600,1024 * 16],
    [880,1024 * 16],
  ])("%pHz %p samples", (frequency, fftSize) => {
    let wavFile = wav.decode(fs.readFileSync(__dirname + "/data/" + frequency + ".wav"));
    let sampleRate = wavFile.sampleRate;
    let audioData = wavFile.channelData[0];

    let result = getFrequencies(audioData, sampleRate, fftSize);
    expect(result[0]).toBeGreaterThanOrEqual(frequency - threshold);
    expect(result[0]).toBeLessThanOrEqual(frequency + threshold);
  });
});

function generateRandomFrequencies(n, x, y) {
  let samples = [];
  for (let i = 0; i < n; i++) {
      let randomValue = Math.random();
      let scaledValue = Math.round(randomValue * (y - x) + x);
      samples.push(scaledValue);
  }
  return samples;
}

describe("getFrequencies random 4096", () => {
  it.each(
    generateRandomFrequencies(20,400,8000)
  )("%pHz 4096 samples", (frequency) => {
    let sampleRate = 44100;
    let duration = 10;
    let frequencies = [[frequency, 0.5]];
    
    let soundSample = generateSoundSample(sampleRate, duration, frequencies);
    let result = getFrequencies(soundSample, sampleRate, 4096);

    let threshold = 10 * (1 + (Math.round(frequency / 1000)));
    expect(result[0]).toBeGreaterThanOrEqual(frequency - threshold);
    expect(result[0]).toBeLessThanOrEqual(frequency + threshold);
  });
});

describe("getFrequencies random 8192", () => {
  it.each(
    generateRandomFrequencies(20,400,8000)
  )("%pHz 8192 samples", (frequency) => {
    let sampleRate = 44100;
    let duration = 10;
    let frequencies = [[frequency, 0.5]];
    
    let soundSample = generateSoundSample(sampleRate, duration, frequencies);
    let result = getFrequencies(soundSample, sampleRate, 8192);

    let threshold = 10 * (1 + (Math.round(frequency / 1000)));
    expect(result[0]).toBeGreaterThanOrEqual(frequency - threshold);
    expect(result[0]).toBeLessThanOrEqual(frequency + threshold);
  });
});

describe("getFrequencies random 16384", () => {
  it.each(
    generateRandomFrequencies(20,400,8000)
  )("%pHz 16384 samples", (frequency) => {
    let sampleRate = 44100;
    let duration = 10;
    let frequencies = [[frequency, 0.5]];
    
    let soundSample = generateSoundSample(sampleRate, duration, frequencies);
    let result = getFrequencies(soundSample, sampleRate, 16384);

    let threshold = 10 * (1 + (Math.round(frequency / 1000)));
    expect(result[0]).toBeGreaterThanOrEqual(frequency - threshold);
    expect(result[0]).toBeLessThanOrEqual(frequency + threshold);
  });
});