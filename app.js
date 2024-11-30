// Importando as dependências necessárias
const express = require('express');
const createPool = require('./conection/connectionUnivag');

// Criando uma instância do Express
const app = express();
const port = 3001;

// Função assíncrona para realizar consultas ao banco de dados
async function fetchData(query) {
  try {
    const pool = await createPool(); // Espera a conexão ser estabelecida
    const result = await pool.request().query(query); // Realiza a consulta
    return result.recordset; // Retorna os dados da consulta
  } catch (err) {
    console.error('Erro ao realizar a consulta:', err);
    throw err; // Lança o erro para ser tratado na rota
  }
}

// Rota para obter os alunos
app.get('/alunos', async (req, res) => {
  try {
    const data = await fetchData('SELECT * FROM Aluno'); // Consulta para obter alunos
    res.json(data); // Retorna os dados no formato JSON
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alunos' }); // Retorna erro em caso de falha
  }
});

// Rota para obter os alunos e disciplinas
app.get('/alunos-disciplina', async (req, res) => {
  try {
    const data = await fetchData('SELECT * FROM AlunoDisciplina'); // Consulta para alunos e disciplinas
    res.json(data); // Retorna os dados no formato JSON
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alunos e disciplinas' }); // Retorna erro em caso de falha
  }
});

// Rota para obter lançamentos de faltas
app.get('/lancamento-falta', async (req, res) => {
  try {
    const data = await fetchData('SELECT * FROM LancamentoFalta'); // Consulta para lançamentos de falta
    res.json(data); // Retorna os dados no formato JSON
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar lançamentos de falta' });
  }
});

// Rota para obter professores e disciplinas
app.get('/professores-disciplina', async (req, res) => {
  try {
    const data = await fetchData('SELECT * FROM ProfessorDisciplina'); // Consulta para professores e disciplinas
    res.json(data); // Retorna os dados no formato JSON
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar professores e disciplinas' });
  }
});

// Rota para obter usuários do Moodle (mdl_user)
app.get('/usuarios-moodle', async (req, res) => {
  try {
    const data = await fetchData('SELECT * FROM mdl_user'); // Consulta para usuários do Moodle
    res.json(data); // Retorna os dados no formato JSON
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários do Moodle' });
  }
});

// Iniciando o servidor HTTP
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
