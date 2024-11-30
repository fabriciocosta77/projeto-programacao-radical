// Importando o pacote mssql
const sql = require('mssql');

// Configuração da conexão para o SQL Server
const config = {
  user: 'alunoprog',
  password: 'alunoprog',
  server: '172.206.243.20',
  database: 'DBUnivag',
  port: 25648,
  options: {
    encrypt: true, // Use true para conexões criptografadas
    trustServerCertificate: true, // Para aceitar certificados não confiáveis
  }
};

// Função para criar a pool de conexões de forma assíncrona
async function createPool() {
  try {
    // Criando a pool de conexões e aguardando a conexão
    const pool = await sql.connect(config);

    // Retornando a pool de conexões
    console.log('Conexão estabelecida com sucesso!');
    return pool;
  } catch (err) {
    console.error('Erro ao conectar ao SQL Server:', err);
    throw err;  // Lançando o erro novamente para que seja tratado na chamada
  }
}

// Exportando a função createPool
module.exports = createPool;