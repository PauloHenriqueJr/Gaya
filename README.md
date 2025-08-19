# 🌱 GaiaSystem - Gestão Ambiental Digital

![GaiaSystem Logo](https://img.shields.io/badge/GaiaSystem-v2.2-green?style=for-the-badge&logo=leafmap&logoColor=white)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue?style=for-the-badge&logo=pwa&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4.5+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**Plataforma completa para gestão ambiental empresarial** com licenças, projetos, vistorias e monitoramento em tempo real.

## 📋 Visão Geral

O GaiaSystem é um Progressive Web App (PWA) desenvolvido para empresas que precisam gerenciar suas obrigações e processos ambientais de forma eficiente e digital. A plataforma oferece uma interface intuitiva com módulos especializados para cada área da gestão ambiental.

### 🎯 Funcionalidades Principais

#### 📊 **Dashboard Executivo**
- Métricas de compliance em tempo real (85.7% atual)
- Score ESG automatizado (92.3% atual) 
- Visão consolidada de licenças, projetos e vistorias
- Indicadores de performance ambiental

#### 📄 **Gestão de Licenças**
- Controle completo do portfólio de licenças ambientais
- Alertas de vencimento e renovação automática
- Suporte para LP, LI, LO, LA e AAF
- Integração com órgãos (CETESB, INEA, IBAMA)
- Histórico de condicionantes e cumprimento

#### 🏗️ **Projetos Ambientais**
- Gestão de projetos de sustentabilidade
- Controle orçamentário e cronogramas
- Monitoramento de impactos ambientais
- Relatórios de progresso automatizados

#### 🔍 **Vistorias e Auditorias**
- Sistema de checklist digital personalizado
- Captura de evidências fotográficas
- Relatórios de conformidade automatizados
- Planos de ação corretiva

#### 💧 **Monitoramento Hídrico**
- Controle de qualidade da água
- Monitoramento de consumo e descarte
- Alertas de não conformidade
- Relatórios para órgãos reguladores

#### ♻️ **Gestão de Resíduos**
- Classificação e destinação de resíduos
- Controle de manifesto de transporte
- Rastreabilidade completa
- Indicadores de economia circular

#### ✅ **Compromissos e Condicionantes**
- Gestão de obrigações legais
- Cronograma de cumprimento
- Alertas preventivos
- Documentação de evidências

## 🚀 Tecnologias Utilizadas

### **Frontend**
- **React 18+** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** + **shadcn/ui** para interface
- **Zustand** para gerenciamento de estado
- **React Query** para cache de dados
- **PWA** com service worker e cache offline

### **Backend**
- **FastAPI 0.110+** para APIs REST
- **MongoDB 4.5+** com Motor (async driver)
- **Pydantic** para validação de dados
- **JWT** para autenticação
- **Pytest** para testes automatizados

### **Infraestrutura**
- **Docker** containerização completa
- **Supervisor** para gerenciamento de processos
- **MongoDB** banco de dados principal
- **PWA** instalável em dispositivos móveis

## 🛠️ Instalação e Configuração

### **Pré-requisitos**
- Docker e Docker Compose
- Node.js 18+ e Yarn
- Python 3.11+
- MongoDB

### **Executando o Projeto**

1. **Clone o repositório**
```bash
git clone https://github.com/sua-empresa/gaia-system.git
cd gaia-system
```

2. **Configuração das variáveis de ambiente**
```bash
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=gaiasystem
JWT_SECRET_KEY=your-secret-key

# Frontend (.env)
REACT_APP_BACKEND_URL=https://your-api-url.com
```

3. **Instalação das dependências**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd frontend
yarn install
```

4. **Executar os serviços**
```bash
# Usando Supervisor (recomendado)
sudo supervisorctl start all

# Ou individualmente
sudo supervisorctl start backend
sudo supervisorctl start frontend
sudo supervisorctl start mongodb
```

### **Build para Produção**
```bash
# Frontend
cd frontend
yarn build

# O build será gerado em frontend/build/
# Inclui PWA completo com service worker
```

## 🏗️ Estrutura do Projeto

```
gaiasystem/
├── backend/                    # API FastAPI
│   ├── server.py              # Servidor principal
│   ├── requirements.txt       # Dependências Python
│   └── .env                   # Variáveis backend
├── frontend/                   # React PWA
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── hooks/            # Custom hooks
│   │   ├── stores/           # Zustand stores
│   │   └── lib/              # Utilitários
│   ├── public/               # Assets estáticos
│   ├── package.json          # Dependências Node
│   └── vite.config.ts        # Configuração Vite/PWA
├── ROADMAP.md                 # Roadmap de desenvolvimento
└── README.md                  # Este arquivo
```

## 📱 PWA (Progressive Web App)

O GaiaSystem é um PWA completo que pode ser instalado em dispositivos móveis e desktop:

### **Características PWA**
- ✅ **Instalável** - Adicione à tela inicial
- ✅ **Offline** - Funciona sem conexão
- ✅ **Responsivo** - Design adaptativo
- ✅ **Seguro** - HTTPS obrigatório
- ✅ **Rápido** - Cache inteligente

### **Cache Strategy**
- **NetworkFirst** para APIs dinâmicas
- **CacheFirst** para assets estáticos
- **Offline fallback** para páginas principais

## 🔄 APIs Disponíveis

### **Endpoints Principais**
```
GET  /api/                     # Health check
GET  /api/dashboard/stats      # Estatísticas dashboard
GET  /api/licenses            # Lista licenças
GET  /api/projects            # Lista projetos  
GET  /api/inspections         # Lista vistorias
GET  /api/water-monitoring    # Monitoramento hídrico
GET  /api/waste-management    # Gestão resíduos
GET  /api/commitments         # Compromissos
POST /api/seed-data           # Popular dados demo
```

### **Multi-tenant**
Todas as APIs suportam isolamento por tenant via header:
```bash
curl -H "X-Tenant-ID: gaia_demo" https://api.gaia.com/api/licenses
```

## 🧪 Testes

### **Backend**
```bash
cd backend
pytest                        # Todos os testes
pytest -v                     # Modo verbose
pytest tests/test_api.py      # Testes específicos
```

### **Frontend**
```bash
cd frontend
yarn test                     # Testes unitários
yarn test:e2e                 # Testes E2E
yarn test:coverage            # Coverage report
```

## 📊 Dados de Demonstração

A aplicação inclui dados brasileiros realistas para demonstração:

- **85 Licenças** de empresas como Petrobras, Vale, Ambev
- **23 Projetos** ambientais em andamento
- **142 Vistorias** com dados de conformidade
- **Dados geográficos** de São Paulo, Rio de Janeiro, Minas Gerais
- **CNPJs válidos** e razões sociais reais

```bash
# Popular dados demo via API
curl -X POST http://localhost:8001/api/seed-data
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📋 Roadmap

Veja o arquivo [ROADMAP.md](./ROADMAP.md) para o plano completo de desenvolvimento, incluindo:

- ✅ **FASE 1:** Infraestrutura base (100% completa)
- 🔄 **FASE 2:** Interface avançada (em andamento)
- ⏳ **FASE 3:** PWA completo
- ⏳ **FASE 4:** Funcionalidades específicas
- ⏳ **FASE 5:** IA e automação

## 🐛 Suporte

Para bugs, dúvidas ou sugestões:
- Abra uma [issue](https://github.com/sua-empresa/gaia-system/issues)
- Entre em contato: suporte@gaiasystem.com.br
- Documentação: [docs.gaiasystem.com.br](https://docs.gaiasystem.com.br)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**🌱 Desenvolvido com ❤️ para um futuro mais sustentável**

[![Made with FastAPI](https://img.shields.io/badge/Made%20with-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Powered by MongoDB](https://img.shields.io/badge/Powered%20by-MongoDB-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)

</div>
