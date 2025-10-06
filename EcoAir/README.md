EcoAir - Monitoramento da Qualidade do Ar

Este é o repositório frontend de uma plataforma web moderna e responsiva, dedicada ao gerenciamento, rastreamento e visualização de dispositivos (ativos) em um contexto global.

🌟 Funcionalidades Principais
O frontend foi desenvolvido para oferecer uma experiência de usuário completa e intuitiva, cobrindo as seguintes áreas:

Autenticação Segura:

Criação de Conta (RegisterForm.jsx).

Login de Usuário (LoginForm.jsx).

Gerenciamento de Dispositivos (CRUD):

Formulário para cadastro e edição de novos ativos (DeviceForm.jsx).

Listagem completa dos dispositivos com detalhes (DeviceList.jsx).

Visualização Geográfica:

Mapa Mundial Interativo (WorldMap.jsx) para rastreamento e localização visual dos dispositivos.

Navegação e Estrutura:

Rotas protegidas por autenticação (PrivateRoute.jsx).

Menu de navegação global (Menu.jsx).

🛠️ Stack de Tecnologias
Framework: React

Tooling: Vite para desenvolvimento rápido e builds otimizados.

Linguagem: JavaScript

Roteamento: React Router (implícito pelo uso de PrivateRoute).

Estilização: (Assumido) Classes CSS ou uma biblioteca como Tailwind CSS/Sass.

🚀 Configuração e Primeiros Passos
Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

Pré-requisitos
Certifique-se de ter o Node.js (versão LTS recomendada) e o npm instalados em sua máquina.

1. Instalação das Dependências
Navegue até o diretório raiz do projeto frontend e execute o seguinte comando:

npm install
# ou
yarn install

2. Configuração de Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto para configurar as variáveis de ambiente (como a URL da sua API backend ou chaves de serviço, se aplicável).

Exemplo de .env:

VITE_API_BASE_URL="http://localhost:3000/api"

3. Executando o Projeto
Para iniciar o servidor de desenvolvimento com Hot Module Replacement (HMR):

npm run dev
# ou
yarn dev

O aplicativo estará acessível em http://localhost:5173 (ou outra porta disponível).

4. Build para Produção
Para gerar a versão otimizada e estática do projeto para deploy:

npm run build
# ou
yarn build

Os arquivos de produção serão gerados na pasta dist/.

📂 Estrutura do Projeto
O projeto segue uma organização modular para maior clareza e manutenção:

src/
├── components/         # Componentes reutilizáveis (Menu, PrivateRoute)
├── auth/               # Componentes de autenticação (Login, Registro)
├── device/             # Componentes de gerenciamento de dispositivos (Formulário, Lista)
├── pages/              # Componentes de nível superior (Home, WorldMap, About)
├── api/                # Lógica para interações com a API Backend
├── App.jsx             # Componente raiz da aplicação
├── main.jsx            # Ponto de entrada do React
└── ...
