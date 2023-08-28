const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

// ----- FUNCIONES CHIQUITAS ----- //
// --- fs.existsSync() Verifica si una ruta existe en el sistema de archivos. ---
function pathExists(route){
   return fs.existsSync(route)
 }

// --- path.isAbsolute() Determina si es ruta absoluta o no. ---
function absolutePath(route){
    return path.isAbsolute(route);
}

// --- path.resolve() convierte rutas relativas en rutas absolutas. ---
function resolveAbsolutePath(route){
    return path.resolve(route);
}

// --- fs.statSync() Indica si el elemento es un archivo o no. ---
function isFile(route){
    return fs.statSync(route).isFile();
}

// --- fs.statSync() Indica si el elemento es un directorio o no. ---
function isDirectory(route){
    return fs.statSync(route).isDirectory();
}

// --- fs.readdirSync() Lee el directorio buscando archivos MD --- 
function findFile(route) {
    const mdFiles = [];
    if(fs.statSync(route).isDirectory()) { 
        const directory = fs.readdirSync(route); // lee el contenido del directorio 
        directory.forEach((file) => {
            const completePath = path.join(route, file); // join() construye la ruta completa del archivo o subdirectorio
            if(fs.statSync(completePath).isDirectory()){
                const subdirectory = findFile(completePath); // llama recursivamente la función en el subdirectorio
                mdFiles.push(...subdirectory);
            } else if (path.extname(completePath) === '.md') {
                mdFiles.push(completePath)
            }
        });
    } else {
        const extension = path.extname(route);
        if (extension === '.md') {
            mdFiles.push(route);
        }
    }
    return mdFiles
}

const findFileResult = findFile('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links')
//console.log(findFileResult)


// --- path.extname() Indica qué extensión es. ---
function extensionCheck(route) {
    return path.extname(route) === '.md';
}

// --- fs.readFileSync() Lee el contenido del archivo MD --- 
function getFileContent(route){
     return fs.readFileSync(route, {encoding: 'utf8'})  
}

// --- Extraer links del archivo MD --- 
// Método match() busca coincidencias de una cadena de texto y una expresión regular. --- 
function getLinks(content){
    const regex = /\[[^\[\]]*\]\((http|https):\/\/[^\(\)]+\)/g;  // Usamos una expresión regular para buscar los links
    const links = content.match(regex) || [];  // Utilizamos match para obtener los enlaces y si no hay, asignamos un array vacío
     return links;
      };

      const trueLinks = getLinks(getFileContent('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\README.md'));
      //console.log("Links:", trueLinks);
      

// --- Dar formato links --- 

/* // ejemplo 
const regex = /\((https?:\/\/[^\)]+)\)/;
const link = '[Empezando con Jest - Documentación oficial](https://jestjs.io/docs/es-ES/getting-started)';
const result = link.match(regex)
console.log(result)
*/

function formatLinks(links, route){
    const eachLink = links.map((link) => {
        const regexHttp = /\((https?:\/\/[^\)]+)\)/; // Expresión regular para identificar https
        const http = link.match(regexHttp)
        const regexText = /\[([^\[\]]+)\]/;  // Expresión regular para identificar solo texto
        const text = link.match(regexText)
        
        const result = {
            href: http[1], // Segunda posición. Checar ejemplo.
            text: text[1],
            file: route
        }
        return result 
    }) 
    return eachLink
}

const eachLinkResult = formatLinks(trueLinks, 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\README.md')
//console.log(eachLinkResult)


// --- Validar links con axios ---

function validateLinks(links){
 const arrayLinks = links.map((link) => {  // método map itera sobre cada objeto del arreglo (link de links)
  return axios.get(link.href)  // petición HTTP a la URL especificada
  .then((response) => {
        link.status = response.status;  // `status` es el código HTTP de la respuesta del servidor
        link.ok = response.statusText;  // `statusText` es el mensaje del estado HTTP de la respuesta del servidor
      return link;
  })
  .catch((error) => {
    link.status = 404;
    link.ok = "error";
      return link;
  })
 })
 return Promise.all(arrayLinks)
}

/*
validateLinks(eachLinkResult, 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\README.md')
  .then(arrayLinksResult => {
    console.log(arrayLinksResult);
  })
  .catch(error => {
    console.error(error);
  });
*/



// ----- VINCULACION DE FUNCIONES ----- //
module.exports = {
    pathExists,
    absolutePath,
    resolveAbsolutePath,
    isFile,
    isDirectory,
    findFile,
    extensionCheck,
    getFileContent,
    getLinks,
    formatLinks,
    validateLinks
}



// --- Recursiva --- 
//leer documentacion map
//promise.all 
