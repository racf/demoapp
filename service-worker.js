//imports
importScripts('js/sw-utils.js'); //importamos a importScripts al archivo .jshintrc

const CACHE_ESTATICO = "chache-estatico-v1.0";
const CACHE_DINAMICO = "chache-dinamico-v1.1";  
const CACHE_INMUTABLE = "chache-inmutable-v1.0";

const APP_SHELL = [
   // '/', //La petición slash es necesaría para cargar la información en local pero no se utiliza para producción.
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js' //agregamos el archivo importado
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];



self.addEventListener('install', event => {
   /* let cacheStatic = caches.open( STATIC_CACHE ).then( cache => {

    });*/
    let cacheStatic = caches.open( CACHE_ESTATICO ).then( cache => cache.addAll( APP_SHELL ));
    let cacheInmutable = caches.open( CACHE_INMUTABLE ).then( cache => cache.addAll( APP_SHELL_INMUTABLE ));

    //agregamos los caches 

    event.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));
});

//Eliminar caches obsoletos
self.addEventListener( 'activate', event =>{

    let deleteCache = caches.keys().then( keys => {
        keys.forEach( key => {
            if( key !== CACHE_ESTATICO && key.includes( 'estatico' )){
                return caches.delete( key );
            }
        })
    });

    event.waitUntil( deleteCache );
});

//Implementando la estrategia del cache
self.addEventListener( 'fetch', event =>{

    let respuesta = caches.match( event.request ).then( res => {
        //Validando que la respuesta exista
        if( res ){
            return res; 
        }else{
            console.log( event.request.url );
            return fetch( event.request ).then( newRes => {
                return actualizaCacheDinamico( CACHE_DINAMICO, event.request, newRes );
            })
        }
    });
    event.respondWith( respuesta );
});