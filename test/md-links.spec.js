const path = require('path');
const api = require("../api.js");
const fs = require('fs');
const axios = require("axios");
const { mdLinks } = require('../api.js');
const { resolveAbsolutePath, pathExists, absolutePath, extensionCheck, isFile, getFileContent, findFile, validateLinks, formatLinks, getLinks  } = require('../functions.js');



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


// --- Indica si el elemento es un archivo o no. ---
describe('check if is file', () =>{
  it('should return true if is file', () => {
    const Path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md';
    const result = isFile(Path);
    expect(result).toBe(true);
  });
  it('should return false if is not file', () => {
    const Path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test';
    const result = isFile(Path);
    expect(result).toBe(false);
  });
});


// --- Test para recorrer el directorio en busca de archivos .md ---
describe('search files .md', () => {
  it('should return an array of files .md inside the directory.', () => {
    const Path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test';
    const result = findFile(Path,[]);
    const content = ['C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\prueba.md', 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md'];
    expect(result).toStrictEqual(content);

  });
});


// --- Test para leer el contenido de un archivo .md ---     ***CHECAR
describe('read the content of a .md file', () => {
  it('should read the content of a .md file', () => {
    const Path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md';
    const content =`This is a simulation for testing.`;
    jest.spyOn(fs, 'readFileSync').mockReturnValue(content);
    const result = getFileContent(Path);

    expect(result).toEqual(content);
  });
});


// --- Test para dar formato a los links --
describe("extract Links", () => {
  it("should extract links from the content and return an array of link objects", () => {
    const Path =  'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md';
    const content = ['[Markdown](https://es.wikipedia.org/wiki/Markdown)', '[Node.js](https://nodejs.org/)'];
    const expected = [
      { href: 'https://es.wikipedia.org/wiki/Markdown', 
        text: 'Markdown', 
        file: 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md' 
      },

      { href: 'https://nodejs.org/', 
        text: 'Node.js', 
        file: 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md' 
      }
    ];
    const result = formatLinks(content, Path);
    
    expect(result).toEqual(expected);
  });
});



// Dar formato links --- 
// --- Validar links con axios ---
describe('validate Links', () => {
  it('should return an array of objects with the validated links', () => {
    const links = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md'
      },
      {
        href: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions',
        text: 'Funciones — bloques de código reutilizables - MDN',
        file: 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md'
      },
    ];
 
    const expected = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md',
        status: 200,
        ok: 'OK'
      },
      {
        href: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions',
        text: 'Funciones — bloques de código reutilizables - MDN',
        file: 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md',
        status: 404,
        ok: 'error'
      }
    ];

    return validateLinks(links).then(result => {
      expect(result).toEqual(expected);
    });
  });
});


// --- Función para determinar la cantidad de links ---
// --- Función para determinar la cantidad de links únicos ---
// --- Función para determinar la cantidad de links rotos ---

// Test mdLinks
describe("mdLinks", () => {
  it("deberia retornar una promesa que se resuelve con un array de objetos", () => {
    const path = 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md';
    const options = {
      validate: true,
      stats: true,
    };
   return mdLinks('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md', {validate: true, stats: true }).then((result) => {
     expect(result).toEqual([
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md',
        status: 200,
        ok: 'OK'
      },
        
      ]) 
   })
    
  });
});
