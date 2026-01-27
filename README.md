# paystore-ecommerce-sdk

## 📦 Visão Geral

O **paystore-ecommerce-sdk** é uma biblioteca que abstrai e padroniza a integração de **3D Secure (3DS)** entre a **PayStore** e diferentes **adquirentes e gateways de e-commerce**.

O SDK foi projetado para simplificar a implementação do fluxo de autenticação 3DS, encapsulando as particularidades de cada provedor e oferecendo uma **interface unificada, segura e escalável**.

---

## 🎯 Objetivos

- Abstrair as diferenças de implementação entre adquirentes e gateways
- Padronizar a comunicação com a PayStore
- Simplificar a implementação do fluxo 3DS (2.x)
- Reduzir tempo de integração e custo de manutenção
- Oferecer uma base extensível para novos provedores

---

## 🧩 O que o SDK resolve?

Com este SDK, você não precisa se preocupar com:

- Diferenças entre protocolos e APIs de adquirentes
- Fluxos distintos de autenticação (frictionless vs challenge)
- Orquestração do ciclo completo do 3DS
- Validações, callbacks e estados intermediários
- Manutenção de múltiplas integrações específicas

---

## 🔐 Funcionalidades

- Iniciação e condução do fluxo 3DS
- Suporte a fluxo **Frictionless** e **Challenge**
- Comunicação unificada com PayStore e adquirentes/gateways
- Abstração completa dos providers de 3DS
- Tratamento padronizado de respostas e estados da autenticação
- Arquitetura extensível para novos adquirentes
