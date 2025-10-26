// to run the tests use `npx jest scripts/detectNoise.test.js`

const fs = require('fs');
const path = require('path');
const { findNoiseFiles, formatNoiseOutput, detectNoiseFiles } = require('./detectNoise');

describe('PR Noise Detector', () => {
  beforeAll(() => {
    // Setup test files and directories
    fs.mkdirSync('tmp', { recursive: true });
    fs.mkdirSync('.vscode', { recursive: true });
    fs.writeFileSync('debug.log', 'debug log');
    fs.writeFileSync('tmp/output.txt', 'output');
    fs.writeFileSync('.vscode/settings.json', '{}');
    fs.writeFileSync('index.js', '// source code');
    fs.writeFileSync('README.md', '# readme');
  });

  afterAll(() => {
    // Cleanup test files and directories
    fs.rmSync('debug.log');
    fs.rmSync('tmp/output.txt');
    fs.rmSync('.vscode/settings.json');
    fs.rmSync('index.js');
    fs.rmSync('README.md');
    fs.rmdirSync('tmp');
    fs.rmdirSync('.vscode');
  });

  test('flags known noise files', () => {
    const files = [
      'debug.log',
      'tmp/output.txt',
      '.vscode/settings.json',
      'index.js',
      'README.md'
    ];
    const noise = detectNoiseFiles(files);
    expect(noise).toEqual([
      'debug.log',
      'tmp/output.txt',
      '.vscode/settings.json'
    ]);
  });

  test('ignores non-noise files', () => {
    const files = ['index.js', 'README.md'];
    const noise = detectNoiseFiles(files);
    expect(noise).toEqual([]);
  });

  test('handles empty directories', () => {
    const files = [];
    const noise = detectNoiseFiles(files);
    expect(noise).toEqual([]);
  });

  test('respects ignore configuration', () => {
    const files = [
      'debug.log',
      'tmp/output.txt',
      '.vscode/settings.json',
      'index.js'
    ];
    const ignore = ['debug.log', 'tmp/output.txt'];
    const noise = detectNoiseFiles(files, ignore);
    expect(noise).toEqual(['.vscode/settings.json']);
  });

  test('correct output format', () => {
    const noise = ['debug.log', 'tmp/output.txt', '.vscode/settings.json'];
    const output = formatNoiseOutput(noise);
    expect(output).toContain('⚠️ Found 3 potentially superfluous files:');
    expect(output).toContain('debug.log');
    expect(output).toContain('tmp/output.txt');
    expect(output).toContain('.vscode/settings.json');
  });
});
