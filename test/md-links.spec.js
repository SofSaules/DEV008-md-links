const path = require('path');
const api = require("../api.js");
const { resolveAbsolutePath, pathExists, absolutePath, extensionCheck } = require('../functions.js')

// C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md

// --- Test para validar si una ruta existe o no ---
describe('check if path exists', () => {
  it('should return true if path exists', () => {
    const path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md';
    const result = pathExists(path);
    expect(result).toBe(true);
  });
  it('should return false if path exists', () => {
    const path = 'C:\\Users\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\notReal.md';
    const result = pathExists(path);
    expect(result).toBe(false);
  });
});

// --- Test para saber si una ruta es absoluta o no ---
describe('check if path is absolute', () => {
  it('should return true if path is absolute', () => {
    const Path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md';
    const result = absolutePath(Path);
    expect(result).toBe(true);
  });
  it('should return false if path is absolute', () => {
    const Path = 'DEV008-md-links\\test\\simulation.md';
    const result = absolutePath(Path);
    expect(result).toBe(false);
  });
});

// --- Test para transformar una ruta a absoluta --- 
describe('resolve absolute path', () => {
  it('should convert relative paths to absolute paths', () => {
    const path = 'test\\simulation.md';
    const result = resolveAbsolutePath(path);
    expect(result).toBe('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md'); 
  });
})

// --- Test para saber si un archivo es .md o no --- 
describe('check if file is MD', () => {
  it('should return true if file is .md', () => {
    const Path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md';
    const result = extensionCheck(Path);
    expect(result).toBe(true);
  });
  it('should return false if file is not .md', () => {
    const Path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.png';
    const result = extensionCheck(Path);
    expect(result).toBe(false);
  });
});

// --- Test para recorrer el directorio en busca de archivos .md ---

