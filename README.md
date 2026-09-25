# PLATAFORMA ENLACE — ESPECIFICAÇÃO DE ENGENHARIA DE SOFTWARE

> **Status do Projeto:** Fase de Especificação, Domínio e Arquitetura Congelável (Ciclo em Cascata Rastreável)  
> **Classificação de Qualidade:** Nível Enterprise 9.5+/10 (DDD + Hexagonal + Modular Monolith + STRIDE + DevSecOps)  
> **Nome da Marca:** **ENLACE** (*Identidade Premium Brasileira com Alcance Internacional*)  
> **Segmento:** Marketplace & Ecossistema Digital de Relações e Serviços Adultos Inclusivos  
> **Pilares:** Acessibilidade no Domínio, Inclusão Plural, Não-Burocracia, Anonimato Estrutural e Monetização Híbrida  
> **Mercado Piloto:** Acre (Validação de Densidade e Resiliência) → Expansão Nacional (Brasil)  

---

## 1. Sumário Executivo do Produto

A **Plataforma Enlace** é concebida como uma evolução estrutural, ética e tecnológica em relação a plataformas legadas de anúncios para acompanhantes (como o *Fatal Model*). O sistema adota a mais rigorosa engenharia de software para resolver problemas crônicos da indústria:

1. **Acessibilidade como Atributo de Domínio de Primeira Classe:** O modelo semântico cruza requisitos funcionais de clientes com comodidades e capacitações de prestadores (incluindo acompanhantes e clientes com deficiência).
2. **Separação Canônica entre Account, Identity e Profile:** A identidade civil de batismo e dados documentais de acompanhantes residem exclusivamente em um **Cofre Criptografado Isolado (AES-256-GCM)**, enquanto clientes operam compulsoriamente sob **pseudônimos opacos** (`Cliente_XXXX`).
3. **Motor de Políticas Explícito (Policy Engine com RBAC + ABAC):** Nenhuma decisão de acesso ou permissão é espalhada em condicionais soltas no código. Políticas determinísticas (`AgePolicy`, `IdentityPolicy`, `ContentAccessPolicy`, `TrustPolicy`) regem todo o sistema.
4. **Desacoplamento do Ciclo de Relacionamento:** A jornada do usuário é modelada em etapas independentes: `Discovery` $\rightarrow$ `Contact` $\rightarrow$ `Request` $\rightarrow$ `Acceptance` $\rightarrow$ `Appointment` $\rightarrow$ `Payment` $\rightarrow$ `Completion` $\rightarrow$ `Review`.
5. **Entitlements Dedicados para Conteúdo Digital:** O paywall não se baseia em flags booleanas; modela direitos de acesso granulares (compra avulsa perpétua, pacotes e assinaturas recorrentes com split instantâneo Pix 85/15).
6. **Observabilidade, DevSecOps e Anti-Scraping Nativos:** Telemetria via OpenTelemetry, SBOM, assinatura de containers via Cosign, testes de acessibilidade no CI/CD (`@axe-core`), e defesas ativas contra bots e doxxing.

---

## 2. Metodologia: Cascata Rastreável com Portões de Qualidade (Quality Gates)

O projeto adota o modelo em **Cascata com iterações no interior de cada fase (Método Caracol)**, regido pela **Regra de Ouro da Engenharia**:

> **"Nenhuma funcionalidade, entidade de banco, endpoint ou linha de código entra em produção sem possuir: Requisito $\rightarrow$ Regra de Negócio $\rightarrow$ Política de Autorização $\rightarrow$ Desenho Arquitetural $\rightarrow$ Teste Automatizado $\rightarrow$ Evidência de Verificação."**

```text
[00 - CASCATA: Requisitos, Domínio e Políticas]
                         │
                         ▼
[01 - DIAGRAMAS: Modelagem C4, DDD e Fluxos]
                         │
                         ▼
[02 a 13: Arquitetura, Contratos, Schemas, Código e Operação]
```

---

## 3. Índice Geral da Documentação

### Fase 00 — Engenharia de Requisitos, Domínio e Governança (Cascata)
- [00.01 - Visão do Produto](00%20-%20CASCATA/00.01%20-%20Visao%20do%20Produto.md): Proposta de valor, diferenciais éticos e os 5 pilares de engenharia.
- [00.02 - Objetivos Estratégicos](00%20-%20CASCATA/00.02%20-%20Objetivos%20Estrategicos.md): Metas temporais, polo piloto Acre e KPIs.
- [00.03 - Escopo e Fronteiras](00%20-%20CASCATA/00.03%20-%20Escopo%20e%20Fronteiras.md): Fronteiras operacionais e delimitações explícitas de escopo.
- [00.04 - Stakeholders e Atores](00%20-%20CASCATA/00.04%20-%20Stakeholders%20e%20Atores.md): Matriz de partes interessadas, níveis 0 a 4 e matriz RACI.
- [00.05 - Personas do Sistema](00%20-%20CASCATA/00.05%20-%20Personas%20do%20Sistema.md): 5 personas detalhadas cobrindo a pluralidade do público.
- [00.05B - Glossário de Domínio e Linguagem Ubíqua](00%20-%20CASCATA/00.05b%20-%20Glossario%20de%20Dominio%20e%20Linguagem%20Ubiqua.md): Dicionário formal DDD e separação Account vs Identity vs Profile.
- [00.06 - Requisitos Funcionais (RF)](00%20-%20CASCATA/00.06%20-%20Requisitos%20Funcionais%20(RF).md): Catálogo numerado do RF-001 ao RF-048.
- [00.07 - Requisitos Não-Funcionais e SLOs Quantitativos](00%20-%20CASCATA/00.07%20-%20Requisitos%20Nao-Funcionais%20(RNF).md): SLOs formais sob ISO/IEC 25010 (NFR-PERF, NFR-AVAIL, NFR-RPO, NFR-RTO).
- [00.08 - Regras de Negócio (RN)](00%20-%20CASCATA/00.08%20-%20Regras%20de%20Negocio%20(RN).md): 22 regras determinísticas de negócio, maioridade +18 e split 85/15.
- [00.09 - Restrições e Não-Escopo](00%20-%20CASCATA/00.09%20-%20Restricoes%20e%20Nao-Escopo.md): Enquadramento penal brasileiro (Art. 228 a 231 do Código Penal).
- [00.10 - Premissas de Engenharia: Modular Monolith Hexagonal](00%20-%20CASCATA/00.10%20-%20Premissas%20de%20Engenharia.md): Estrutura canônica de módulos DDD e a regra "Domínio não conhece infraestrutura".
- [00.11 - Casos de Uso Especificados](00%20-%20CASCATA/00.11%20-%20Casos%20de%20Uso%20Especificados.md): Detalhamento formal dos fluxos UC-01 a UC-10.
- [00.12 - Critérios de Aceitação Formal (Gherkin)](00%20-%20CASCATA/00.12%20-%20Criterios%20de%20Aceitacao%20(Gherkin).md): Cenários BDD executáveis para homologação.
- [00.13 - Engenharia de Segurança e Trust](00%20-%20CASCATA/00.13%20-%20Engenharia%20de%20Seguranca%20e%20Trust.md): Mitigação de ameaças, cofre civil e esteganografia anti-vazamento.
- [00.13B - Motor de Políticas e Controle de Acesso (RBAC + ABAC)](00%20-%20CASCATA/00.13b%20-%20Policy%20Engine%20e%20Controle%20de%20Acesso%20(RBAC%20+%20ABAC).md): Policy Engine explícito eliminando `if`s dispersos.
- [00.14 - Privacidade, Anonimato e LGPD](00%20-%20CASCATA/00.14%20-%20Privacidade,%20Anonimato%20e%20LGPD.md): Mapeamento de bases legais e Privacy by Design.
- [00.14B - Classificação e Governança de Dados](00%20-%20CASCATA/00.14b%20-%20Classificacao%20e%20Governanca%20de%20Dados.md): Níveis Público, Restrito e Altamente Sensível, com Data Minimization by Design.
- [00.15 - Acessibilidade Estrutural e Inclusão](00%20-%20CASCATA/00.15%20-%20Acessibilidade%20Estrutural%20e%20Inclusao.md): Ontologia de acessibilidade de 5 dimensões e conformidade WCAG 2.2 AA.
- [00.16 - Plano de Testes e Qualidade](00%20-%20CASCATA/00.16%20-%20Plano%20de%20Testes%20e%20Qualidade.md): Estratégia da pirâmide de testes e matriz de cobertura.
- [00.17 - Matriz de Rastreabilidade Bidirecional](00%20-%20CASCATA/00.17%20-%20Matriz%20de%20Rastreabilidade.md): Vínculo bidirecional entre requisitos, regras e componentes.
- [00.18 - Critérios de Release e Deployment](00%20-%20CASCATA/00.18%20-%20Criterios%20de%20Release%20e%20Deployment.md): Quality Gates de 0 a 5 e Blue-Green deployment.
- [00.19 - Anti-Scraping e Proteção de Borda](00%20-%20CASCATA/00.19%20-%20Anti-Scraping%20e%20Protecao%20de%20Borda.md): Proteção de catálogo, paginação por cursor e rate limiting.
- [00.20 - Pipeline de Ingestão de Mídia e Stripping](00%20-%20CASCATA/00.20%20-%20Pipeline%20de%20Ingestao%20de%20Midia%20e%20Stripping.md): Pipeline assíncrono de upload, remoção de EXIF e anti-CSAM.
- [00.21 - Observabilidade e Telemetria (OpenTelemetry)](00%20-%20CASCATA/00.21%20-%20Observabilidade%20e%20Telemetria%20(OpenTelemetry).md): Logs estruturados JSON com mascaramento de PII e métricas Prometheus.
- [00.22 - CI/CD, DevSecOps e Supply Chain Security](00%20-%20CASCATA/00.22%20-%20CI-CD,%20DevSecOps%20e%20Supply%20Chain%20Security.md): Quality Gates, SBOM (CycloneDX) e assinatura Cosign.
- [00.23 - Backup, Resiliência e Disaster Recovery](00%20-%20CASCATA/00.23%20-%20Backup,%20Resiliencia%20e%20Disaster%20Recovery.md): RPO $\le 5\text{m}$, RTO $\le 60\text{m}$, política WORM e testes mensais de restauração.
- [00.24 - Infraestrutura como Código (IaC) e Ambientes](00%20-%20CASCATA/00.24%20-%20Infraestrutura%20como%20Codigo%20(IaC)%20e%20Ambientes.md): Módulos OpenTofu/Terraform para dev, staging e production.
- [00.25 - Escopo do MVP vs. V2 vs. V3](00%20-%20CASCATA/00.25%20-%20Escopo%20do%20MVP%20vs%20V2%20vs%20V3.md): Controle estrito do escopo inicial para o polo Acre.
- [00.26 - Matriz de Rastreabilidade Mestra End-to-End](00%20-%20CASCATA/00.26%20-%20Matriz%20de%20Rastreabilidade%20Mestra.md): Mapeamento unificado ponta a ponta.

---

### Fase 01 — Modelagem e Diagramação Visual (Mermaid)
- [01.01 - Diagrama de Contexto Geral](01%20-%20DIAGRAMAS/01.01%20-%20Diagrama%20de%20Contexto%20Geral.md)
- [01.02 - Diagramas de Casos de Uso (UML)](01%20-%20DIAGRAMAS/01.02%20-%20Diagramas%20de%20Casos%20de%20Uso%20(UML).md)
- [01.03 - Arquitetura C4 - Nível 1 (Contexto)](01%20-%20DIAGRAMAS/01.03%20-%20Arquitetura%20C4%20-%20Nivel%201%20Contexto.md)
- [01.04 - Arquitetura C4 - Nível 2 (Containers)](01%20-%20DIAGRAMAS/01.04%20-%20Arquitetura%20C4%20-%20Nivel%202%20Containers.md)
- [01.05 - Arquitetura C4 - Nível 3 (Componentes do Core)](01%20-%20DIAGRAMAS/01.05%20-%20Arquitetura%20C4%20-%20Nivel%203%20Componentes.md)
- [01.06 - Modelo de Entidade e Relacionamento (ERD)](01%20-%20DIAGRAMAS/01.06%20-%20Modelo%20de%20Entidade%20e%20Relacionamento%20(ER).md)
- [01.07 - Diagrama de Classes de Domínio (DDD)](01%20-%20DIAGRAMAS/01.07%20-%20Diagrama%20de%20Classes%20de%20Dominio.md)
- [01.08 - Diagramas de Sequência Operacionais](01%20-%20DIAGRAMAS/01.08%20-%20Diagramas%20de%20Sequencia%20Operacionais.md)
- [01.09 - Diagramas de Atividades e Workflows](01%20-%20DIAGRAMAS/01.09%20-%20Diagramas%20de%20Atividades%20e%20Workflows.md)
- [01.10 - Máquinas de Estados Finitos (FSM)](01%20-%20DIAGRAMAS/01.10%20-%20Maquinas%20de%20Estados%20Finitos.md)
- [01.11 - Arquitetura de Implantação (Deployment)](01%20-%20DIAGRAMAS/01.11%20-%20Arquitetura%20de%20Implantacao%20(Deployment).md)
- [01.12 - Diagramas de Fluxo de Dados (DFD)](01%20-%20DIAGRAMAS/01.12%20-%20Diagramas%20de%20Fluxo%20de%20Dados%20(DFD).md)
- [01.13 - Modelo de Ameaças (STRIDE Threat Model)](01%20-%20DIAGRAMAS/01.13%20-%20Modelo%20de%20Ameacas%20(STRIDE%20-%20Threat%20Model).md)
- [01.14 - Fluxos de Autenticação e Identidade](01%20-%20DIAGRAMAS/01.14%20-%20Fluxos%20de%20Autenticacao%20e%20Identidade.md)
- [01.15 - Fluxo de Solicitação e Conexão Externa](01%20-%20DIAGRAMAS/01.15%20-%20Fluxo%20de%20Solicitacao%20e%20Conexao%20Externa.md)
- [01.16 - Fluxos Financeiros e Monetização](01%20-%20DIAGRAMAS/01.16%20-%20Fluxos%20Financeiros%20e%20Monetizacao.md)
- [01.17 - Ciclo de Vida de Conteúdo e Mídia Privada](01%20-%20DIAGRAMAS/01.17%20-%20Ciclo%20de%20Vida%20de%20Conteudo%20e%20Midia%20Privada.md)
- [01.18 - Fluxo de Assinaturas e Destaque](01%20-%20DIAGRAMAS/01.18%20-%20Fluxo%20de%20Assinaturas%20e%20Destaque.md)
- [01.19 - Avaliação Bilateral e Scoring Confidencial](01%20-%20DIAGRAMAS/01.19%20-%20Avaliacao%20Bilateral%20e%20Scoring%20Confidencial.md)
- [01.20 - Motor de Compatibilidade e Acessibilidade](01%20-%20DIAGRAMAS/01.20%20-%20Motor%20de%20Compatibilidade%20e%20Acessibilidade.md)
- [01.21 - Arquitetura Hexagonal dos Módulos](01%20-%20DIAGRAMAS/01.21%20-%20Arquitetura%20Hexagonal%20dos%20Modulos.md)
- [01.22 - Barramento de Eventos de Domínio (Domain Events)](01%20-%20DIAGRAMAS/01.22%20-%20Barramento%20de%20Eventos%20de%20Dominio%20(Domain%20Events).md)
- [01.23 - Modelo de Entitlements de Conteúdo](01%20-%20DIAGRAMAS/01.23%20-%20Modelo%20de%20Entitlements%20de%20Conteudo.md)
- [01.24 - Pipeline de Observabilidade e Rastreamento Distribuído](01%20-%20DIAGRAMAS/01.24%20-%20Pipeline%20de%20Observabilidade%20e%20Rastreamento%20Distribuido.md)

---

### Fase 02 — Arquitetura de Domínio e Decisões Formais (ADRs)
- [02.01 - Visão Arquitetural e Contratos entre os 13 Módulos](02%20-%20ARQUITETURA/02.01%20-%20Visao%20Arquitetural%20e%20Modulos.md)
- [02.02 - ADR-001: Modular Monolith em Detrimento de Microsserviços](02%20-%20ARQUITETURA/02.02%20-%20ADR-001%20Modular%20Monolith%20vs%20Microservices.md)
- [02.03 - ADR-002: PostgreSQL com Schemas Isolados e Cofre Civil](02%20-%20ARQUITETURA/02.03%20-%20ADR-002%20PostgreSQL%20com%20Schemas%20Isolados%20e%20Vault.md)
- [02.04 - ADR-003: Policy Engine Centralizado (RBAC + ABAC)](02%20-%20ARQUITETURA/02.04%20-%20ADR-003%20Policy%20Engine%20e%20Controle%20ABAC.md)
- [02.05 - ADR-004: Comunicação Event-Driven com Transactional Outbox](02%20-%20ARQUITETURA/02.05%20-%20ADR-004%20Event-Driven%20Interno%20com%20Outbox%20Pattern.md)
- [02.06 - ADR-005: Esteganografia Dinâmica e Proteção Audiovisual Leve](02%20-%20ARQUITETURA/02.06%20-%20ADR-005%20Esteganografia%20e%20DRM%20Leve%20de%20Midia.md)

---

### Fase 03 — Engenharia de Dados e DDL PostgreSQL 16+
- [03.01 - Extensões, Esquemas e Enums Globais](03%20-%20BANCO%20DE%20DADOS/03.01%20-%20Esquema%20Geral%20e%20Extensoes.sql)
- [03.02 - Tabelas de Identidade e Perfis Sociais](03%20-%20BANCO%20DE%20DADOS/03.02%20-%20Tabelas%20de%20Identidade%20e%20Perfis.sql)
- [03.03 - Tabelas de Acessibilidade no Domínio](03%20-%20BANCO%20DE%20DADOS/03.03%20-%20Tabelas%20de%20Acessibilidade%20no%20Dominio.sql)
- [03.04 - Tabelas de Conteúdo Digital, Paywall e Entitlements](03%20-%20BANCO%20DE%20DADOS/03.04%20-%20Tabelas%20de%20Conteudo%20e%20Entitlements.sql)
- [03.05 - Tabelas Financeiras, Ordens de Compra e Splits](03%20-%20BANCO%20DE%20DADOS/03.05%20-%20Tabelas%20Financeiras,%20Ordens%20e%20Splits.sql)
- [03.06 - Tabelas de Confiança, Avaliações Bilaterais e Segurança](03%20-%20BANCO%20DE%20DADOS/03.06%20-%20Tabelas%20de%20Confianca,%20Avaliacoes%20e%20Seguranca.sql)
- [03.07 - Cofre Civil Criptografado e Row-Level Security (RLS)](03%20-%20BANCO%20DE%20DADOS/03.07%20-%20Cofre%20Civil%20Criptografado%20e%20RLS.sql)
- [03.08 - Índices de Performance PostGIS e Busca Espacial](03%20-%20BANCO%20DE%20DADOS/03.08%20-%20Indices%20de%20Performance%20e%20Otimizacao%20PostGIS.sql)

---

### Fase 04 — Contratos de API e Validação
- [04.01 - Especificação OpenAPI 3.1 Mestra (YAML)](04%20-%20API/04.01%20-%20Especificacao%20OpenAPI%203.1%20Mestra.yaml)
- [04.02 - Dicionário de DTOs e Validações Zod (TypeScript)](04%20-%20API/04.02%20-%20Dicionario%20de%20DTOs%20e%20Validacoes%20Zod.md)

---

### Fases de Sustentação Técnica (05 a 13)
- `05 - FRONTEND/`: Estrutura Next.js 14 SSR, componentes Radix UI e acessibilidade WCAG 2.2 AA.
- `06 - BACKEND/`: Core da aplicação em TypeScript sob arquitetura Hexagonal.
- `07 - SEGURANCA/`: Políticas de rotação KMS, auditoria de chaves e gestão de vulnerabilidades.
- `08 - UX-UI/`: Fluxos de usabilidade inclusiva e testes com usuários de tecnologias assistivas.
- `09 - ACESSIBILIDADE/`: Diretrizes NBR 9050, testes manuais com leitores de tela e laudos.
- `10 - TESTES/`: Suítes de testes unitários, integração, contratos e testes E2E com Playwright.
- [11.01 - Pipeline CI/CD GitHub Actions (YAML)](11%20-%20DEVOPS/11.01%20-%20Pipeline%20CI-CD%20GitHub%20Actions.yaml): Quality Gates automatizados com SAST, SBOM e assinatura Cosign.
- [12.01 - Configuração do OpenTelemetry Collector (YAML)](12%20-%20OBSERVABILIDADE/12.01%20-%20Configuracao%20OpenTelemetry%20Collector.yaml): Pipelines de traces, métricas e logs higienizados.
- [12.02 - Regras de Alerta Prometheus SLOs (YAML)](12%20-%20OBSERVABILIDADE/12.02%20-%20Regras%20de%20Alerta%20Prometheus%20SLOs.yaml): Alertas de latência P95 e falhas financeiras.
- [13.01 - Runbook Operacional de Incidentes (SRE Playbook)](13%20-%20OPERACAO/13.01%20-%20Runbook%20de%20Incidente%20e%20Contingencia.md): Playbooks para incidentes SEV-1 e procedimentos de contingência.
