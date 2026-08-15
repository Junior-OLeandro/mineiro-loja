# 🍔 Mineiro — Hamburgueria Artesanal

Menu digital e sistema de pedidos da **Mineiro Hamburgueria Artesanal**, desenvolvido para oferecer uma experiência completa de compra online, integrada ao WhatsApp e com painel administrativo.

🌐 **Loja:** https://mineiroloja.com.br/  
📦 **Repositório:** https://github.com/Junior-OLeandro/mineiro-loja

---

## 📖 Sobre o projeto

O Mineiro é uma aplicação web de pedidos online criada para substituir o processo tradicional de atendimento por uma experiência digital rápida, responsiva e integrada ao fluxo de operação da hamburgueria.

O cliente pode navegar pelo cardápio, selecionar produtos e adicionais, montar o carrinho, informar seus dados e endereço, escolher a forma de pagamento e finalizar o pedido.

O sistema também possui uma área administrativa para acompanhamento e gerenciamento dos pedidos e configurações da loja.

A aplicação foi construída com foco em:

- 📱 Experiência mobile
- ⚡ Performance
- 🛒 Facilidade de uso
- 📲 Integração com WhatsApp
- 🗄️ Persistência de dados
- 🔄 Atualizações em tempo real
- 🔐 Área administrativa
- 🖨️ Impressão de pedidos
- 🔎 SEO
- 🧩 Arquitetura modular e reutilizável

---

## 🚀 Funcionalidades

### 🍔 Cardápio

O sistema organiza os produtos em categorias, facilitando a navegação do cliente.

Categorias incluem:

- Combos
- Mineirinhos
- Smashs
- Acompanhamentos
- Bebidas

Cada produto pode possuir informações como:

- Nome
- Descrição
- Preço
- Imagem
- Adicionais
- Disponibilidade

---

### 🛒 Carrinho de compras

O cliente pode:

- Adicionar produtos
- Alterar quantidades
- Remover produtos
- Selecionar adicionais
- Visualizar subtotal
- Visualizar taxa de entrega
- Visualizar valor total
- Adicionar observações ao pedido

O carrinho é atualizado dinamicamente durante a navegação.

---

### 📍 Entrega por bairro

A taxa de entrega é calculada de acordo com o bairro selecionado pelo cliente.

O checkout permite informar:

- Nome
- Telefone
- Endereço
- Número
- Complemento
- Bairro
- Referência

A taxa correspondente ao bairro é adicionada automaticamente ao pedido.

---

### 💳 Formas de pagamento

O sistema suporta diferentes formas de pagamento, incluindo:

- PIX
- Cartão
- Dinheiro

Quando o pagamento é em dinheiro, o cliente pode informar o valor entregue para que o sistema calcule o troco.

---

### 📲 Integração com WhatsApp

Após preencher o checkout, o pedido é preparado com todas as informações necessárias para o atendimento.

A mensagem pode conter:

- Dados do cliente
- Produtos
- Quantidades
- Adicionais
- Observações
- Endereço
- Bairro
- Taxa de entrega
- Forma de pagamento
- Troco
- Subtotal
- Total do pedido

O objetivo é reduzir o trabalho manual no atendimento e tornar o processo de confirmação mais rápido.

---

### 🟢 Status da loja

O sistema possui controle do funcionamento da loja.

O status pode considerar:

- Horário automático de funcionamento
- Abertura manual
- Fechamento manual

O cliente consegue visualizar quando a loja está disponível para receber pedidos.

---

### ⏱️ Tempo de entrega

O tempo estimado de entrega pode ser configurado pela administração da loja e utilizado durante o fluxo de pedidos.

---

### 🔥 Promoções

A aplicação possui suporte para apresentação de promoções e destaques no cardápio.

---

### 🌙 Tema Dark / Light

O cliente pode alternar entre:

- 🌙 Tema escuro
- ☀️ Tema claro

O layout é responsivo e adaptado para diferentes tamanhos de tela.

---

## 🔐 Painel administrativo

O projeto possui uma área administrativa separada da loja pública.

Entre as funcionalidades estão:

- Login administrativo
- Visualização de pedidos
- Acompanhamento de status
- Gerenciamento do fluxo de pedidos
- Configuração do tempo de entrega
- Controle do funcionamento da loja
- Integração com WhatsApp
- Recursos relacionados à impressão dos pedidos

A área administrativa utiliza autenticação e regras de segurança do Supabase.

---

## 🗄️ Supabase

O projeto utiliza o **Supabase** como infraestrutura de backend.

Entre os recursos utilizados estão:

- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)
- Realtime
- API REST
- Edge Functions

O Supabase é utilizado principalmente para persistência e gerenciamento dos dados relacionados à operação da loja.

---

## 🔄 Realtime

O painel administrativo utiliza recursos de atualização em tempo real para acompanhar alterações nos pedidos e configurações da loja sem depender exclusivamente de atualizações manuais da página.

---

## 🖨️ Impressão de pedidos

O sistema possui suporte para impressão dos pedidos, incluindo utilização em impressoras térmicas de **80 mm**.

O objetivo é facilitar a integração do sistema digital com o processo operacional da cozinha.

---

## 📊 Google Analytics

O projeto possui integração com Google Analytics para acompanhamento de utilização da loja.

**Measurement ID:**

`G-WVJ8S7ZW6M`

Os dados podem ser utilizados para entender o comportamento dos usuários e acompanhar métricas de acesso e utilização da aplicação.

---

## 🛠️ Tecnologias

A versão atual do projeto utiliza uma arquitetura moderna baseada em:

| Tecnologia | Utilização |
|---|---|
| React | Interface da aplicação |
| TypeScript | Tipagem e segurança do código |
| Vite | Build e desenvolvimento |
| CSS | Estilização e responsividade |
| Supabase | Backend e banco de dados |
| PostgreSQL | Persistência dos dados |
| Supabase Auth | Autenticação administrativa |
| Supabase Realtime | Atualizações em tempo real |
| Supabase Edge Functions | Operações de backend |
| WhatsApp | Comunicação dos pedidos |
| Font Awesome | Ícones |
| Google Analytics | Analytics |
