const mysql = require('mysql2');

// Configuração da pool de conexões para o MariaDB
const pool = mysql.createPool({
  host: '172.206.243.20',     
  user: 'aluno',         
  password: 'aluno',  
  database: 'moodle_avaunivag',  
  port:21879        
});

// Usando a API baseada em Promises para facilitar o uso assíncrono
module.exports = pool.promise(); // Exporta a pool