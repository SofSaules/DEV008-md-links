const functions = require('./functions')

function mdLinks(path, options) {
    return new Promise((resolve, reject) => {
        const isValid = functions.pathExists(path)
        if(!isValid){
            return reject(new Error('Path no válido'))
        }
        const isAbsolute = functions.absolutePath(path)
        if(!isAbsolute){
            path = functions.resolveAbsolutePath(path)
        }
        const isFile = functions.isFile(path)
        const isDirectory = functions.isDirectory(path)

        if (!isFile && !isDirectory) {
            return reject('No es un archivo ni un directorio válido');
        }

        if(isFile){
            const isMD = functions.extensionCheck(path);
            if(!isMD){
                return reject('No es un archivo MD');
            } 
            
            const content = functions.getFileContent(path);
            const links = functions.getLinks(content);
            const formatedLinks = functions.formatLinks(links, path);
           
            if(options.stats === true){
                resolve ({
                    total: functions.getLinksCount(formatedLinks),
                    unique: functions.getUniqueLinksCount(formatedLinks),
                    broken: functions.getBrokenLinksCount(formatedLinks)
                }); 
            } else if(options.validate === true){
                const validatedLinks = functions.validateLinks(formatedLinks);
               resolve(validatedLinks)
           } else {
            resolve(formatedLinks);
           }

        } else {
            if(isDirectory){
                const findMd = functions.findFile(path)
                //resolve(findMd)
                console.log("uno", findMd)
                let allLinks = [];
                findMd.forEach((file) => { 
                    const content = functions.getFileContent(file);
                    const links = functions.getLinks(content)
                    const formatedLinks = functions.formatLinks(links, file);
                      
                    allLinks = allLinks.concat(formatedLinks)

                });

                if(options.stats){
                    resolve ({
                        total: functions.getLinksCount(allLinks),
                        unique: functions.getUniqueLinksCount(allLinks),
                        broken: functions.getBrokenLinksCount(allLinks)
                    }); 
                } else if(options.validate === true){
                     const validatedLinks = functions.validateLinks(allLinks);
                    resolve(validatedLinks)
                } else 
                resolve(allLinks)
            } 
        }

    })
}


mdLinks('C:\\Users\\sofsa\\Desktop\\LABORATORIA\\PROYECTO4\\DEV008-md-links\\test', {validate: true, stats: false })
 .then((response) => {
    console.log(response)
 })
 .catch((error) => {
    console.log('error')
    console.log(error)
 })


// Resolve es como el return, termina la promesa. 

        // si validate == true, ejecutar validateLinks. 
        // si validate == false, resolver formatLinks


module.exports = {
    mdLinks
}