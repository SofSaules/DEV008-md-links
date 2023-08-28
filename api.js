const functions = require('./functions')

function mdLinks(path, options) {
    return new Promise((resolve, reject) => {
        const isValid = functions.pathExists(path)
        if(!isValid){
            return reject('Path no válido')
        }
        const isAbsolute = functions.absolutePath(path)
        if(!isAbsolute){
            path = functions.resolveAbsolutePath(path)
        }
        const isFile = functions.isFile(path)
        if(!isFile){
            const isDirectory = functions.isDirectory(path)
            if(isDirectory){
                const findMd = functions.findFile(path)
                resolve(findMd)
            }
        }
        resolve(path)
    })
}

// Resolve es como el return, termina la promesa. 

//const resultado = mdLinks('./README.md', {})
//console.log(resultado)
//'C:/Users/sofsa/Desktop/LABORATORIA/PROYECTO4/DEV008-md-links/README.md'


mdLinks('C:/Users/sofsa/Desktop/LABORATORIA/PROYECTO4/DEV008-md-links', {})
 .then((response) => {
    console.log(response)
 })
 .catch((error) => {
    console.log('error')
    console.log(error)
 })
