# 🍽️ Sistema de Gestão de Restaurante

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.7-green)
![React](https://img.shields.io/badge/React-19-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

Um sistema completo para gerenciamento de restaurantes, desenvolvido como projeto da disciplina de POODS (2025/2) na UENF. O sistema integra o fluxo de trabalho entre garçons, cozinha, bar e administração.

## Funcionalidades

O sistema é dividido em módulos baseados em perfis de usuário:

### Garçom
*   **Gestão de Mesas:** Visualização em tempo real do status das mesas (Livre, Ocupada, Reservada).
*   **Comandas:** Abertura e fechamento de comandas por mesa.
*   **Pedidos:** Lançamento de pedidos (comida e bebida) com observações.
*   **Notificações:** Recebimento de alertas quando pedidos estão prontos para entrega.

### Cozinha
*   **Fila de Pedidos:** Visualização de pedidos pendentes de comida.
*   **Controle de Preparo:** Início de preparo com cronômetro para monitorar tempo.
*   **Status:** Marcação de pedidos como prontos.
*   **Gestão de Equipe:** Visualização do status dos cozinheiros (Livre/Ocupado).

### Bar
*   **Fila de Drinks:** Visualização específica para pedidos de bebidas/drinks.
*   **Controle de Preparo:** Fluxo similar à cozinha, focado no barman.

### Admin
*   **Gestão de Usuários:** Cadastro de funcionários e atribuição de cargos.
*   **Cardápio:** Gerenciamento de itens, preços e categorias.
*   **Relatórios:** (Em desenvolvimento) Visão geral do restaurante.

## Tecnologias Utilizadas

### Backend
*   **Java 17**
*   **Spring Boot 3:** Framework principal.
*   **Spring Security + JWT:** Autenticação e autorização segura.
*   **Spring Data JPA:** Persistência de dados.
*   **Flyway:** Migração e versionamento de banco de dados.
*   **PostgreSQL:** Banco de dados relacional.
*   **Lombok:** Redução de boilerplate code.

### Frontend
*   **React 19:** Biblioteca para construção de interfaces.
*   **Vite:** Build tool rápida e moderna.
*   **Material UI (MUI):** Biblioteca de componentes visuais.
*   **React Router:** Navegação SPA.
*   **Axios:** Cliente HTTP.

### Infraestrutura
*   **Docker & Docker Compose:** Containerização de toda a aplicação (Backend, Frontend, Banco de Dados) para fácil deploy e desenvolvimento.

## Como Executar

### Pré-requisitos
*   Docker e Docker Compose instalados.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/POODS-2025_1.git
    cd POODS-2025_1
    ```

2.  **Execute com Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```
    *   Isso irá construir as imagens do backend e frontend, e iniciar o banco de dados PostgreSQL.

3.  **Acesse a aplicação:**
    *   **Frontend:** [http://localhost:5173](http://localhost:5173) (ou a porta configurada no docker-compose)
    *   **Backend API:** [http://localhost:8080](http://localhost:8080)

## Estrutura do Projeto

```
POODS-2025_1/
├── backend/            # Código fonte da API Spring Boot
│   ├── src/
│   │   └── main/resources/db/migration/ # Scripts SQL (Flyway)
│   ├── pom.xml
│   └── Dockerfile
├── frontend/           # Código fonte da aplicação React
│   ├── src/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml  # Orquestração dos containers
```

## Contribuição

1.  Faça um Fork do projeto.
2.  Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o Commit de suas mudanças (`git commit -m 'Adiciona MinhaFeature'`).
4.  Faça o Push para a Branch (`git push origin feature/MinhaFeature`).
5.  Abra um Pull Request.

## Licença

Este projeto está sob a licença [MIT](LICENSE).