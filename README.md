# EcoAir - Sistema de Monitoramento de Qualidade do Ar

O EcoAir é uma aplicação web desenvolvida em React para monitoramento da qualidade do ar através de dispositivos IoT distribuídos geograficamente. O sistema permite visualizar dados de sensores em tempo real em um mapa interativo e gerenciar dispositivos de monitoramento.

## 🚀 Funcionalidades

- **Mapa Interativo**: Visualização de dispositivos de monitoramento em um mapa mundial usando Leaflet
- **Monitoramento em Tempo Real**: Dados de qualidade do ar (CO₂, CO, NO₂, PM2.5, PM10, O₃) com indicadores visuais por cores
- **Gerenciamento de Dispositivos**: Cadastro, edição e listagem de dispositivos IoT
- **Sistema de Autenticação**: Login e registro de usuários com rotas protegidas
- **Interface Responsiva**: Design moderno usando React Bootstrap

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19.1.1 + Vite
- **Roteamento**: React Router DOM
- **UI/UX**: React Bootstrap + Bootstrap 5.3.8
- **Mapas**: Leaflet + React Leaflet
- **Ícones**: React Icons + Font Awesome
- **HTTP Client**: Axios
- **Desenvolvimento**: ESLint + Vite

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd frontend-ecoair/EcoAir
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o servidor de desenvolvimento:

```bash
npm run dev
```

4. Para desenvolvimento com dados mockados:

```bash
npm run server
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Menu.jsx        # Navegação principal
│   ├── PrivateRoute.jsx # Proteção de rotas
│   └── WorldMap.jsx    # Mapa interativo
├── pages/              # Páginas da aplicação
│   ├── Auth/           # Autenticação
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── Device/         # Gerenciamento de dispositivos
│   │   ├── DeviceForm.jsx
│   │   └── DeviceList.jsx
│   └── Home.jsx        # Página inicial
├── services/           # Serviços e APIs
│   └── api.js         # Configuração do Axios
└── assets/            # Recursos estáticos
```

## 🎯 Principais Componentes

### WorldMap

- Mapa mundial interativo com dispositivos IoT
- Indicadores visuais de qualidade do ar por cores
- Popups informativos com dados dos sensores
- Atualização de dados em tempo real

### DeviceForm

- Formulário para cadastro e edição de dispositivos
- Validação de dados (MAC, coordenadas, tipo de gás)
- Suporte a múltiplos tipos de gases monitorados

### Sistema de Autenticação

- Login e registro de usuários
- Rotas protegidas para funcionalidades administrativas
- Gerenciamento de sessão

## 🌍 Tipos de Gases Monitorados

- **CO₂** - Dióxido de Carbono
- **CO** - Monóxido de Carbono
- **NO₂** - Dióxido de Nitrogênio
- **PM2.5** - Material Particulado Fino
- **PM10** - Material Particulado Grosso
- **O₃** - Ozônio

## 🎨 Indicadores de Qualidade do Ar

- 🟢 **Verde**: Boa qualidade (PPM < 10)
- 🟠 **Laranja**: Qualidade média (PPM 10-50)
- 🔴 **Vermelho**: Qualidade ruim (PPM > 50)

## 📱 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
- `npm run server` - Inicia servidor JSON para dados mockados

## 🔧 Configuração

O projeto utiliza Vite como bundler e está configurado com:

- Hot Module Replacement (HMR)
- ESLint para qualidade de código
- Suporte a React 19 com Fast Refresh
- Configuração otimizada para desenvolvimento

## 📄 Licença

Este projeto está sob licença [especificar licença].

## 👥 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através de [informações de contato].
