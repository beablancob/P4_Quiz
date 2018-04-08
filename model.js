//Cargo el modulo sequielize, aquí tengo la clase Sequielize
const Sequelize = require('sequelize');
//Genero una instancia sequielize para acceder a la base de datos del fichero
const sequelize = new Sequelize("sqlite:quizzes.sqlite", {logging: false}); //El logging quita las trazas del terminal
//sequelize es el objeto que me permite acceder a las tablas y todos los elementos y en verde es la url donde está mi base de datos(fichero)

//Defino un modelo de datos, el quiz. Defino la pregunta y la respuesta
sequelize.define('quiz', {
    question: {
        type: Sequelize.STRING,//la pregunta y la respuesta son strings.
        unique: { msg: "Ya existe una pregunta"}, //no se pueden repetir las preguntas, son unique. Si se repite una pregunta, sale este mensaje
        validate: { notEmpty: {msg: "La respuesta no puede estar vacía"}} //no permito que se generen preguntas vacias. Si se produche sale el error.

    },
    answer: {
        type: Sequelize.STRING,
        validate: { notEmpty: {msg: "La respuesta no puede estar vacía"}}
        }
}); //cada vez que defino un modelo, dentro de sequelize se crea un array que se llama models,
 //donde están todos los modelos definidos. NO ES UNA VARIABLE

/**
 * SINCRONIZAR. Es decir, mirar si en la base de datos existen las tablas que
 * necesito. Los que no existen se van a crear.
 * Una vez se sincroniza (la sincronización es una promesa), se ejecuta el then,
 * donde paso una función donde se va a cumplir otra promesa. Dentro de sequelize accedo a la
 * propiedad models donde están todos los modelos definidos. Accedo al modelo quiz donde los
 * va a contar. Cuando la promesa da el valor, paso al siguiente then. Pasa como parámetro el
 * valor de la cuenta. si count es cero, creo varios quizes con bulkCreate que los pasa como un array.
 * pongo un return para que la promesa del then espere hasta que la promesa de los quizes se cree.
 * En caso de error en algun sitio, creo el catch
 * Exporto al final el sequelize.
 */
sequelize.sync()
.then(() => sequelize.models.quiz.count())
.then(count => {
    if(!count){
        return sequelize.models.quiz.bulkCreate([
            { question: "Capital de Italia", answer: "Roma"},
            { question: "Capital de Francia", answer: "Paris"},
            { question: "Capital de España", answer: "Madrid"},
            { question: "Capital de Portugal", answer: "Lisboa"},
        ]);


    }
})

.catch (error => {
    console.log(error);

});

module.exports = sequelize;
