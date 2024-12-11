const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Cadastrar pergunta', () => {
  const texto = 'Qual é a capital da França?';
  
  modelo.cadastrar_pergunta(texto);
  const perguntas = modelo.listar_perguntas();
  
  expect(perguntas.length).toBe(1); // Espera que haja 1 pergunta
  expect(perguntas[0].texto).toBe(texto); // Verifica se a pergunta cadastrada tem o texto correto
});
test('Listar perguntas', () => {
  modelo.cadastrar_pergunta('Pergunta 1');
  modelo.cadastrar_pergunta('Pergunta 2');
  
  const perguntas = modelo.listar_perguntas();
  
  expect(perguntas.length).toBe(2); // Espera 2 perguntas cadastradas
  expect(perguntas[0].texto).toBe('Pergunta 1');
  expect(perguntas[1].texto).toBe('Pergunta 2');
});
test('Cadastrar e listar respostas', () => {
  modelo.cadastrar_pergunta('O que é JavaScript?');
  
  const pergunta = modelo.listar_perguntas()[0]; // Pega a primeira pergunta cadastrada
  
  modelo.cadastrar_resposta(pergunta.id_pergunta, 'É uma linguagem de programação.');
  
  // Verifica se a resposta foi cadastrada
  const respostas = modelo.listar_respostas(pergunta.id_pergunta);
  
  expect(respostas.length).toBe(1); // Espera 1 resposta cadastrada
  expect(respostas[0].texto).toBe('É uma linguagem de programação.');
});

test('Número de respostas', () => {
  modelo.cadastrar_pergunta('Quanto é 2 + 2?');
  
  const pergunta = modelo.listar_perguntas()[0];
  
  // Cadastra 2 respostas
  modelo.cadastrar_resposta(pergunta.id_pergunta, 'É 4');
  modelo.cadastrar_resposta(pergunta.id_pergunta, 'É quatro');
  
  // Verifica o número de respostas
  const numRespostas = modelo.get_num_respostas(pergunta.id_pergunta);
  
  expect(numRespostas).toBe(2); // Espera 2 respostas
});
