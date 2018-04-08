//modulos que implementa este modulo
const figlet = require('figlet');
const chalk = require('chalk');


/**
 * Dar color a un string
 * @param msg El string que hay que dar color
 * @param color el color con el que pintar msg
 * @return {string} Devuelve el string msg con el color indicado
 */

const colorize = (msg, color) => {
    if (typeof color !== "undefined"){
        msg = chalk[color].bold(msg);
    }
    return msg;
};

/**
 * Escribe un mensaje por el socket donde quiero q se escriba
 * Cambio console.log por socket.write para que se escriba por el socket
 * en vez de por la consola.
 * Console.log mete un retorno de carro por defecto, asi que se lo añadimos nosotros al write
 * @param msg El string a escribir
 * @param color Color del texto
 */
const log = (socket, msg, color) => { //si no me pasan un color, se pone el color por defecto

    socket.write(colorize(msg, color) + "\n");
};

/**
 * Escribe un mensaje de log grande
 * Cambiamos biglog, errorlog etc igual que console.log
 * @param msg Texto a escribir
 * @param color Color del texto
 */
const biglog = (socket, msg, color) => {
    log(socket, figlet.textSync(msg, { horizontalLayout: 'full'}), color);
};

/**
 * Escribe el mensaje de error emsg
 *@param emsg Texto del mensaje de error
 */
const errorlog = (socket, emsg) => {
    socket.write(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}\n`);
};

//otra forma de cambiar los const por exports. es creando la funcion:

exports = module.exports = {
    colorize,
    log,
    biglog,
    errorlog
};