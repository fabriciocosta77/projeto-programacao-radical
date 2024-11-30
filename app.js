// Importando as dependências necessárias
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const createPool = require('./conection/connectionUnivag'); // Certifique-se de que esta conexão está configurada para SQL Server
const OpenAI = require('openai');
// Substitua pela sua chave de API
const API_KEY = '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';


const openai = new OpenAI({
  apiKey: API_KEY
});

// Criando uma instância do Express
const app = express();
const port = 3001;

// Middlewares globais
app.use(cors()); // Permite requisições CORS de qualquer origem
app.use(express.json()); // Faz o parsing de JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Faz o parsing de dados URL-encoded

// Função auxiliar para realizar consultas ao banco de dados
async function fetchData(query) {
  try {
    const pool = await createPool(); // Conexão com o banco
    const result = await pool.request().query(query); // Executa a consulta SQL no SQL Server
    return result.recordset; // Retorna os dados
  } catch (err) {
    console.error('Erro ao realizar a consulta:', err);
    throw new Error('Erro ao acessar o banco de dados'); // Propaga erro com mensagem clara
  }
}

// Rotas para banco de dados
app.get('/alunos', async (req, res) => {
  try {
    const data = await fetchData('SELECT TOP 5 * FROM Aluno'); // Limita a 5 resultados
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar alunos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar alunos', details: err.message });
  }
});

app.get('/alunos-disciplina', async (req, res) => {
  try {
    const data = await fetchData(`
      SELECT TOP 5 
        DescricaoModalidadeMEC,
        NotaIa1,
        NotaPb1,
        NotaIa2,
        NotaPb2,
        SiglaSituacaoNota,
        CursoTipoDescricao
      FROM AlunoDisciplina
    `); // Limita a 5 resultados e seleciona apenas os campos relevantes
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar alunos e disciplinas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar alunos e disciplinas', details: err.message });
  }
});

app.get('/lancamento-falta', async (req, res) => {
  try {
    const data = await fetchData('SELECT TOP 5 * FROM LancamentoFalta'); // Limita a 5 resultados
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar lançamentos de falta:', err.message);
    res.status(500).json({ error: 'Erro ao buscar lançamentos de falta', details: err.message });
  }
});

app.get('/professores-disciplina', async (req, res) => {
  try {
    const data = await fetchData('SELECT TOP 5 * FROM ProfessorDisciplina'); // Limita a 5 resultados
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar professores e disciplinas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar professores e disciplinas', details: err.message });
  }
});

app.get('/usuarios-moodle', async (req, res) => {
  try {
    const data = await fetchData('SELECT TOP 5 * FROM mdl_user'); // Limita a 5 resultados
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar usuários do Moodle:', err.message);
    res.status(500).json({ error: 'Erro ao buscar usuários do Moodle', details: err.message });
  }
});

// Função auxiliar para enviar mensagem ao ChatGPT
async function sendMessageToChatGPT(message) {
  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
          // { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: message + ' O texto deve ser gerado sem formatações e caracteres especiais, na fonte arial 12',
          },
      ],
  });
  
  console.log(completion.choices[0].message);
    // const response = await axios.post(
    //   'https://api.openai.com/v1/chat/completions',
    //   {
    //     model: 'gpt-4',
    //     messages: [{ role: 'user', content: message }],
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${API_KEY}`,
    //     },
    //   }
    // );
// 
    // console.log('Enviando para ChatGPT:', {
    //   url: 'https://api.openai.com/v1/chat/completions',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${API_KEY}`,
    //   },
    //   data: {
    //     model: 'gpt-4o',
    //     messages: [{ role: 'user', content: message }],
    //   },
    // });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Erro ao se comunicar com o ChatGPT:', error.message);
    throw error;
  }
}

// Rota para comunicação com ChatGPT
app.post('/chatgpt', async (req, res) => {
  console.log('Recebido no /chatgpt:', req.body); // Log para depuração
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'O campo "message" é obrigatório' });
  }

  try {
    const response = await sendMessageToChatGPT(message);
    res.json({ response });
  } catch (error) {
    console.error('Erro ao gerar resposta do ChatGPT:', error.message);
    res.status(500).json({ error: 'Erro ao gerar resposta do ChatGPT', details: error.message });
  }
});

// Iniciando o servidor HTTP
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
