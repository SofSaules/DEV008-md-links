# Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Instalación](#3-instalacion)
* [4. Uso](#4-uso)


***

## 1. Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...) y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

## 2. Resumen del proyecto

En este proyecto se crea una línea de comando ejecutado en `Node.js` que instala una biblioteca, la cual, se encargará de realizar un barrido a la ruta ingresada y de buscar los archivos .md que se encuentren en la misma. A su vez, se encarga de verificar que los enlaces que se encuentren sean funcionales o sean inválidos, reportando esta información en estadísticas. 

## 3. Instalación 
Para la instalación de la biblioteca se deberá ejecutar el siguiente comando:

* Desde consola

`npm i sofsaules-md-links`

## 4. Uso
El módulo ofrece dos procesos: validar y/u obtener estadísticas de los enlaces. 

#### `md-links <path-to-file> [options]`

##### Argumentos

* `path`: Se ingresa la ruta **absoluta** o **relativa** al **archivo** o **directorio**. 
**IMPORTANTE: para poder leer el path es necesario que se cambie la dirección del slash: \ => /  o en su defecto agregarle otro: \ => \\** 
* `options`: Se ingresan **únicamente** las siguiente opciones:
  - `-v o --validate`: Determina si se desea validar via HTTP los links encontrados.
  - `-s o --stats`: Muestra cuantos links hay, incluyendo los links únicos y los links inválidos. 

##### Valor de retorno

En caso de recibir solamente la `ruta`, se mostrarán en consola los siguientes datos
para cada link encontrado :

* `href`: URL encontrada.
* `text`: Título del link
* `file`: Ruta del archivo donde se encuentra el link.

En caso de recibir `-v o --validate`, se mostrarán en consola los siguientes datos para cada link
encontrado :

* `href`: URL encontrada.
* `text`: Título del link.
* `file`: Ruta del archivo donde se encuentra el link.
* `status`: Código de respuesta HTTP.
* `ok`: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.

En caso de recibir `-s o --stats`, se mostrarán las estadísticas en consola :

* `Total`: Total de liks encontrados en la ruta.
* `Unique`: Total de links únicos encotrados en la ruta.
* `Broken`: Total de links rotos encotrados en la ruta.


#### Ejemplos (resultados como comentarios)

```sh
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
./some/example.md http://google.com/ Google
```

##### `--validate`

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```

##### `--stats`

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
Broken: 1
```
