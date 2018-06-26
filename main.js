/**
 * PRÁCTICA 4
 * El objetivo de esta práctica es modificar la práctica anterior (3)
 * para convertirla en un servidor que escuche conexiones tcp por el puerto 3030
 * los clientes se conectaran a esta app servidor utilizando un programa tipo telnet, telcup,
 * Varios clientes se podran conectar simultaneamente y jugar con las preguntas que están almacenadas en la
 * base de datos.
 * El comando quit es lo unico q cambia, que desconectará al cliente conectado que lo solicite
 * Utilizamos el modulo net de node
 *
 */

//modulos que requiere este main.js
const readline = require('readline');

 //otra forma es que coja los metodos uno a uno del modulo
const {colorize, log, biglog, errorlog} = require("./out");
const cmds = require ("./cmds");

//Requiero el modulo net de node
const net = require("net");
/**
 * Cada vez que se nos conecte un cliente, el socket que nos conecta con él está aqui
 *
 * Además, para detectar que se nos ha conecyado un cliente tenemos un aviso que sale por pantalla
 */
//Creación del socket servidor. Toma como parametro el socket que nos conecta con el cliente
net.createServer(socket => {

    console.log("Se ha conectado un cliente desde " + socket.remoteAddress);

    //Mensaje inicial
    biglog(socket, 'CORE Quiz', 'green');

    const rl = readline.createInterface({

        input: socket,
        output: socket,

        prompt: colorize('quiz > ', "blue") ,//esto es para que el usuario sepa que está a la espera de un comando suyo
        completer: (line) => {
            const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
            const hits = completions.filter((c) => c.startsWith(line));
            // show all completions if none found
            return [hits.length ? hits : completions, line]; //me devuelve un array con los posibles comandos que
            //pueden darse con lo que he escrito por el teclado
            //si no he tecleado nada y doy al tabulador 2 veces, me sale la lista de
            //palabras que puedo escribir
        }

    });
    //Atender los eventos de los sockets, si se termina o hay error cierro el readline
    socket
        .on("end", () => {rl.close()}) //despues de la coma, eso es una funcion que lo que hace es cerrar el readline

        .on("error", () => {rl.close()});



    rl.prompt();

    rl
        .on('line', (line) => { //esta esperando una linea de teclado del usuario

            //para pasar por parametro en el switch la primera palabra, pasada a minusculas, que el jugador escriba
            let args = line.split(" ");
            let cmd = args[0].toLowerCase().trim();


            switch (cmd) { //el prompt se tiene que poner detras de las funciones que tengo porque algunas son asincronas
                case '':
                    rl.prompt(); //si el usuario no escribe nada se termina. el resto de llamadas tendra la llamada al prompt internamente
                    break;

                case 'h': //cuando el usuario manda un h
                case 'help':
                    cmds.helpCmd(socket, rl);

                    break;

                case 'quit':
                case 'q':
                    cmds.quitCmd(socket, rl);
                    break;

                case 'add':
                    cmds.addCmd(socket, rl);
                    break;

                case 'list':
                    cmds.listCmd(socket, rl);
                    break;

                case 'show':
                    cmds.showCmd(socket, rl, args[1]);
                    break;

                case 'test':
                    cmds.testCmd(socket, rl, args[1]);
                    break;

                case'play':
                case'p':
                    cmds.playCmd(socket, rl);
                    break;

                case 'delete':
                    cmds.deleteCmd(socket, rl, args[1]);
                    break;

                case 'edit':
                    cmds.editCmd(socket, rl, args[1]);
                    break;

                case'credits':
                    cmds.creditsCmd(socket, rl);
                    break;

                default:

                    log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
                    log(socket, `Use ${colorize('help', 'green')}  para ver todos los comandos disponibles.`);
                    rl.prompt();
                    break;
            }

        })
        .on('close', () => {
            log(socket, 'Adios!');
           // process.exit(0); El servidor sigue funcionando aunq un cliente se vaya
        });


})
    //Para que escuche el puerto 3030
    .listen(3030);


