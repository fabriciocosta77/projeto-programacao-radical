const express = require('express');
const pool = require('./conection/connection'); // Conexão com o banco
const port = 3000;

const app = express();

// Função utilitária para lidar com consultas
const executeQuery = async (query, res) => {
  try {
    const [rows] = await pool.execute(query);
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error('Erro na consulta ao banco:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Rotas
app.get('/usuario', (req, res) => {
  const query = `
    SELECT mud.model, mud.platform, m.firstname
    FROM mdl_user m
    INNER JOIN mdl_user_devices mud ON mud.userid = m.id;
  `;
  executeQuery(query, res);
});

app.get('/total', (req, res) => {
  const query = `
    SELECT COUNT(m.id) AS usuarios
    FROM mdl_user m;
  `;
  executeQuery(query, res);
});

app.get('/preferencias', (req, res) => {
  const query = `
    SELECT *
    FROM mdl_user_preferences;
  `;
  executeQuery(query, res);
});

app.get('/alunodisciplina', (req, res) => {
  const query = `
    SELECT *
    FROM mdl_user_lastaccess;
  `;
  executeQuery(query, res);
});

app.get('/lancamentofalta', (req, res) => {
  const query = `
    SELECT *
    FROM mdl_user_devices;
  `;
  executeQuery(query, res);
});

app.get('/professordisciplina', (req, res) => {
  const query = `
    SELECT *
    FROM ProfessorDisciplina;
  `;
  executeQuery(query, res);
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});