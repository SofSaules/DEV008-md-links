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

const findFileResult = findFile ('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links')
//console.log(findFileResult)



// --- path.extname() Indica qué extensión es. ---
function extensionCheck(route) {
    return path.extname(route) === '.md';
}

// --- fs.readFileSync() Lee el contenido del archivo MD --- 
function getFileContent(route){
     return fs.readFileSync(route, {encoding: 'utf8'})  
}
//console.log(getFileContent('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md'))

// --- Extraer links del archivo MD --- 
// Método match() busca coincidencias de una cadena de texto y una expresión regular. --- 
function getLinks(content){
    const regex = /\[[^\[\]]*\]\((http|https):\/\/[^\(\)]+\)/g;  // Usamos una expresión regular para buscar los links
    const links = content.match(regex) || [];  // Utilizamos match para obtener los enlaces y si no hay, asignamos un array vacío
     return links;
      };

      const trueLinks = getLinks(getFileContent('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md'));
      //console.log(trueLinks)

// --- Dar formato links --- 
function formatLinks(links, route){
    const eachLink = links.map((link) => {
        const regexHttp = /\((https?:\/\/[^\)]+)\)/; // Expresión regular para identificar https
        const http = link.match(regexHttp)
        const regexText = /\[([^\[\]]+)\]/;  // Expresión regular para identificar solo texto
        let text = link.match(regexText)
        // text = null
        if (!text){
             text = ['Text not found'];
        }

        const result = {
            href: http[1], // Segunda posición. Checar ejemplo.
            text: text[1],
            file: route
        }
        return result 
    }) 
    return eachLink
}

const eachLinkResult = formatLinks(trueLinks, 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md')
//console.log(eachLinkResult)


// --- Validar links con axios ---
// se le hace un mock y de el mock un test asincrono 

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
    link.ok = 'error';
      return link;
  })
 })
 return Promise.all(arrayLinks)
}

/*
validateLinks(eachLinkResult, 'C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test\\simulation.md')
  .then(arrayLinksResult => {
    console.log(arrayLinksResult);
  })
  .catch(error => {
    console.error(error);
  });
*/


// --- Función para determinar la cantidad de links ---
function getLinksCount(arrayLinks){
    return arrayLinks.length;
}

const count = getLinksCount(eachLinkResult);
//console.log(count);


// --- Función para determinar la cantidad de links únicos ---
function getUniqueLinksCount(arrayLinks){
    //console.log(arrayLinks)
    let valores = Object.values(arrayLinks)
    //console.log(valores)
    const uniqueCount = new Set(valores.map(link => link.href)).size; // set permite almacenar valores únicos de cualquier tipo
    return uniqueCount;
};

const uniqueCount = getUniqueLinksCount(eachLinkResult); // Llama a la función con 'eachLinkResult' como argumento
//console.log("total link", uniqueCount); 



// --- Función para determinar la cantidad de links rotos ---
function getBrokenLinksCount(arrayLinks){
    let count = 0;
for(const link of arrayLinks){
    if(link.ok !== 'OK'){
        count++;
    }
    return count;
}
   
}

const brokenCount = getBrokenLinksCount(eachLinkResult); // Llama a la función con 'eachLinkResult' como argumento
//console.log( brokenCount); 



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
    validateLinks,
    getLinksCount,
    getUniqueLinksCount,
    getBrokenLinksCount
}



// --- Recursiva --- 
//leer documentacion map
//promise.all 
// Pasos a seguir:
// --Validate (Objeto general)
// --Stats ()
// --mezcla de los dos
