# Arquitetura Limpa com TypeScript
[🇺🇸 Read in English](README.md)
### ⚠️ *Projeto em construção!*
Projeto construído para mostrar aos leitores um exemplo prático do TDD e Clean
Architecture aplicados na prática. O resultado desses princípios aplicados juntos
é uma API com baixo acoplamento, fácil de dar manutenção e estender o comportamento.

Atualmente, a API apenas recebe dados simples de um usuário para criar uma conta,
criptografa a senha e salva os dados em um banco de dados.

Apesar do funcionamento simples, há uma sólida estrutura aplicada, o que deixa as portas
abertas para qualquer sistema ser construído a partir deste, independente de
frameworks específicos. Para exemplificar, eu escolhi MongoDb para persistência de dados,
mas é possível substituí-lo facilmente por qualquer outro banco de dados de sua preferência.

Esta liberdade de escolha e mudança é crucial para aplicações críticas.

## Diagrama da Arquitetura
![Diagrama da arquitetura do sistema](assets/architecture_diagram.jpg)
