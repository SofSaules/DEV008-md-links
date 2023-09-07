#!/usr/bin/env node
const yargs = require('yargs');
const { mdLinks } = require('./api');

console.log('¡Bienvenido a esta biblioteca!');


const options = yargs(process.argv.slice(2))
.usage('md-links "./path/to/file.md" -v -s')
.command('$0', 'Default command')
.option("v", {alias:"validate", describe: "Verifica si el link funciona", type: "boolean", demandOption: false })
.option("s", {alias:"stats", describe: "Imprime las estadisticas de los links encontrados en cada archivo .md", type: "boolean", demandOption: false })
.help(true)
.demandCommand()
.argv;

//console.log(options)

const route = options._[0];


if (route) {
     //Estableer las opciones en false por defecto
    const mdLinksOptions = {
        validate: options.validate || false,
        stats: options.stats || false,
    };

    mdLinks(route, mdLinksOptions)
        .then(links => {

            console.log(links)
            if (mdLinksOptions.stats) {
                const totalStats = `Total: ${links.total}`;
                const uniqueStats = `Unique: ${links.unique}`;
                const brokenStats = `Broken: ${links.broken}`;

                console.log(totalStats);
                console.log(uniqueStats);
                console.log(brokenStats);


            } else if (mdLinksOptions.validate) {
                links.forEach(link => {

                    let statusInfo;
                    if (link.ok) {
                        statusInfo = 'ok';
                    } else {
                        statusInfo = 'fail';
                    }

                    let formattedLink = 
                        `File: ${link.file}\n` +  //estructura para concatenar y pasar a la línea siguiente
                        `href: ${link.href}\n` +
                        `StatusInfo: ${statusInfo}\n` +
                        `Status: ${link.status}\n` +
                        `Text: ${link.text}\n` 
                     

                    console.log(formattedLink);
                });
            } else {
                links.forEach(link => {
                    let formattedLink = 
                        `File: ${link.file}\n` +
                        `href: ${link.href}\n` +
                        `Text: ${link.text}\n` 
                     

                    console.log(formattedLink);
                });
            }
        })
        .catch(error => {
            console.error(error.message);
        });
} else {
    const errorMessage = 'Proporciona una ruta válida.';
    console.error(errorMessage);
    yargs.showHelp();
}