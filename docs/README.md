# 📚 Documentação Técnica — Plataforma Enlace

Este diretório centraliza toda a engenharia de requisitos, modelagem, arquitetura, contratos de banco de dados, APIs, especificações de frontend/backend, segurança, acessibilidade e operações da **Plataforma Enlace**.

---

## 🗂 Estrutura das Fases e Módulos

| Fase / Pasta | Escopo & Descrição | Principais Entregas |
|---|---|---|
| [`00 - CASCATA/`](./00%20-%20CASCATA/) | Engenharia de Requisitos & Domínio | Visão do produto, RFs (RF-001 a 048), RNs (RN-001 a 022), RNF/SLOs, Casos de Uso, Matriz de Rastreabilidade |
| [`01 - DIAGRAMAS/`](./01%20-%20DIAGRAMAS/) | Modelagem Visual C4 & Mermaid | Diagramas de Contexto, Containers, Componentes, ERD, DDD, FSM, Sequência, DFD |
| [`02 - ARQUITETURA/`](./02%20-%20ARQUITETURA/) | Decisões Formais (ADRs) | Modular Monolith, PostgreSQL Vault, Policy Engine ABAC/RBAC, Outbox Pattern, Esteganografia |
| [`03 - BANCO DE DADOS/`](./03%20-%20BANCO%20DE%20DADOS/) | DDLs e Scripts SQL PostgreSQL 16+ | Schemas, Extensões, Perfis, Acessibilidade, Paywall, Finanças/Splits, Cofre Civil e PostGIS |
| [`04 - API/`](./04%20-%20API/) | Contratos OpenAPI 3.1 & DTOs | Especificação Swagger/OpenAPI 3.1 mestra e dicionário de validação Zod |
| [`05 - FRONTEND/`](./05%20-%20FRONTEND/) | Arquitetura Web & Design System | Next.js 14 SSR, Design System Sensual-Luminoso (Marsala & Gold), Tokens CSS |
| [`06 - BACKEND/`](./06%20-%20BACKEND/) | Arquitetura Hexagonal & Concorrência | Módulos DDD, Concorrência atômica, Cache Redis, Idempotência de pagamentos |
| [`07 - SEGURANCA/`](./07%20-%20SEGURANCA/) | Hardening, KMS & DevSecOps | Gestão de chaves KMS, Isolamento do cofre civil AES-256-GCM, Notificação ANPD |
| [`08 - UX-UI/`](./08%20-%20UX-UI/) | Experiência Inclusiva | Jornadas do usuário, Microcopy humanizado, Tom de voz sensual-inclusivo |
| [`09 - ACESSIBILIDADE/`](./09%20-%20ACESSIBILIDADE/) | WCAG 2.1 AA & Protocolos | Manual de acessibilidade estrutural, Protocolos para acompanhantes e clientes PcD |
| [`10 - TESTES/`](./10%20-%20TESTES/) | Estratégia de Qualidade | Pirâmide de testes, Quality Gates, Casos de teste de segurança e Pentest checklist |
| [`11 - DEVOPS/`](./11%20-%20DEVOPS/) | CI/CD & Deploy Zero-Downtime | Pipelines GitHub Actions, SAST, SBOM CycloneDX, Cosign, Canary Release |
| [`12 - OBSERVABILIDADE/`](./12%20-%20OBSERVABILIDADE/) | OpenTelemetry, Prometheus & SRE | Telemetria distribuída, higienização de PII em logs, regras de alerta de SLOs |
| [`13 - OPERACAO/`](./13%20-%20OPERACAO/) | Runbooks SRE & Resiliência | Runbooks SEV-1 a SEV-4, Política de backup WORM imutável, Contingência |
