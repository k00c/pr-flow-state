// to run the tests use `npx jest scripts/detectNoise.test.js`

const fs = require('fs');
const path = require('path');
const { findNoiseFiles, formatNoiseOutput, detectNoiseFiles } = require('./detectNoise');

describe('PR Noise Detector', () => {
  const TEST_DIR = 'test-files-temp';

  beforeAll(() => {
    // Setup test files and directories in a test-specific folder
    fs.mkdirSync(TEST_DIR, { recursive: true });
    fs.mkdirSync(`${TEST_DIR}/tmp`, { recursive: true });
    fs.mkdirSync(`${TEST_DIR}/.vscode`, { recursive: true });
    fs.writeFileSync(`${TEST_DIR}/debug.log`, 'debug log');
    fs.writeFileSync(`${TEST_DIR}/tmp/output.txt`, 'output');
    fs.writeFileSync(`${TEST_DIR}/.vscode/settings.json`, '{}');
    fs.writeFileSync(`${TEST_DIR}/index.js`, '// source code');
    fs.writeFileSync(`${TEST_DIR}/README.md`, '# readme');
  });

  afterAll(() => {
    // Cleanup test directory
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
    fs.rmSync('.pr-noise-ignore', { force: true });
  });

  afterEach(() => {
    // Clean up any .pr-noise-ignore file after each test
    fs.rmSync('.pr-noise-ignore', { force: true });
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

  test('respects ignore configuration via parameter', () => {
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

  test('respects .pr-noise-ignore file', () => {
    // Create a .pr-noise-ignore file
    fs.writeFileSync('.pr-noise-ignore', '# Ignore debug files\ndebug.log\ntmp/*.txt');
    
    // Verify file was created
    expect(fs.existsSync('.pr-noise-ignore')).toBe(true);

    // Use jest.resetModules() to fully clear module cache
    jest.resetModules();
    const { detectNoiseFiles: detectNoiseFilesReloaded } = require('./detectNoise');

    const files = [
      'debug.log',
      'tmp/output.txt',
      '.vscode/settings.json',
      'scratch.js'
    ];
    const noise = detectNoiseFilesReloaded(files);
    
    // debug.log and tmp/output.txt should be ignored
    expect(noise).toEqual([
      '.vscode/settings.json',
      'scratch.js'
    ]);

    // Cleanup
    fs.rmSync('.pr-noise-ignore', { force: true });
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
