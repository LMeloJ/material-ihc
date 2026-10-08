# Material Didático e Interativo de IHC (Interação Humano-Computador)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Publicado-success?style=flat-square&logo=github)](https://lmelo.github.io/material-ihc/)
[![License: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg?style=flat-square)](LICENSE)
[![Padrão: ABNT](https://img.shields.io/badge/Refer%C3%AAncias-ABNT-informational?style=flat-square)](#referências-bibliográficas)

Repositório acadêmico com material didático completo para o ensino e aprendizagem dos conceitos fundamentais de **Interação Humano-Computador (IHC)**, **Design de Interação (IxD)** e **Experiência do Usuário (UX)**.

O material combina **teoria concisa e rigorosa**, ancorada nos principais autores clássicos e contemporâneos da literatura científica, com **exemplos visuais e laboratórios dinâmicos interativos** desenvolvidos em HTML5, CSS3 e JavaScript puro para cada um dos tópicos.

---

## 🧭 Sumário e Trilha de Aprendizado

A trilha didática está organizada cronologicamente segundo o ciclo de vida de usabilidade e as fases do design centrado no humano (*Human-Centered Design*):

| # | Módulo Didático | Foco Teórico Principal | Experimento Interativo Embutido |
|---|-----------------|------------------------|---------------------------------|
| **01** | [Introdução à IHC](pages/01-introducao-ihc.html) | Histórico (Bush, Engelbart, Xerox, Apple), ISO 9241-11, Semiótica e a Lei de Fitts | Linha do tempo histórica + Simulador motor da Lei de Fitts |
| **02** | [Avaliação de Interfaces & Heurísticas de Nielsen](pages/02-heuristicas-nielsen.html) | Métodos de inspeção, Engenharia de Desconto, as 10 Heurísticas e Escala de Gravidade | Laboratório de Auditoria: identificação de falhas em mockup |
| **03** | [Personas & Mapas de Empatia](pages/03-personas-mapas-empatia.html) | Goal-Directed Design (Alan Cooper), tipos de metas e cartografia empática (Dave Gray) | Construtor dinâmico de personas e post-its no Canvas de Empatia |
| **04** | [Point of View (PoV) & How Might We](pages/04-pov-how-might-we.html) | Declaração de PoV (Stanford d.school), antipatterns de solução e perguntas HMW (Min Basadur) | Gerador de PoV assistido com validador de antipatterns |
| **05** | [Brainwriting, SCAMPER & Piores Ideias](pages/05-brainwriting-ideacao.html) | Limitações do brainstorming falado, método 6-3-5 (Rohrbach), operador SCAMPER e inversão | Painel interativo SCAMPER + Inversor de piores ideias |
| **06** | [Pitches Curtos Iniciais](pages/06-pitches-curtos.html) | Validação de dor sem demo de produto, método SRI NABC e Elevator Pitch (Moore) | Teleprompter e cronômetro de 60s com ritmo guiado por fases |
| **07** | [Prototipação de Baixa Fidelidade & Mágico de Oz](pages/07-prototipacao-baixa-fidelidade.html) | Paper prototyping (Snyder), desinibição da crítica e simulação de IA pelo Mágico de Oz (Kelley) | Simulador WOz de tela dupla: visão do usuário vs bastidores do mágico |
| **08** | [Interaction Design & Princípios de Norman](pages/08-interaction-design.html) | Dimensões do IxD, Affordance vs Signifier, Mapeamento Natural, Feedback e Portas de Norman | Simulador de Mapeamento de Fogão 2x2 + Teste de Porta de Norman |
| **09** | [Acessibilidade Digital & Diretrizes WCAG](pages/09-acessibilidade-wcag.html) | Legislação (LBI), Princípios POUR da WCAG 2.1/2.2 e critérios de conformidade (A, AA, AAA) | Calculadora de contraste de cor em tempo real + Filtro de Daltonismo |
| **10** | [Jornada do Usuário (Customer Journey)](pages/10-jornada-do-usuario.html) | Fases, touchpoints, canais, dores e a curva de sentimentos (Kalbach, Stickdorn) | Editor de jornada com curva emocional dinâmica em SVG |
| **11** | [Interfaces de Média Fidelidade (Wireframes)](pages/11-interfaces-media-fidelidade.html) | Wireframes estruturais cinzas, hierarquia tipográfica, grid de 8pt e anotações funcionais | Comparador Esboço vs Wireframe com inspeção e grid overlay |

---

## 🚀 Como Publicar no GitHub Pages

Este projeto foi construído propositalmente com **tecnologias web nativas (Vanilla HTML, CSS e JavaScript)**, dispensando etapas de *build*, Node.js, Webpack ou ferramentas de compilação. Isso garante compatibilidade imediata e nativa com o **GitHub Pages**:

### Passo a Passo de Ativação:
1. Faça o envio (*push*) dos arquivos para o seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: adicionar páginas didáticas e interativas de IHC"
   git push origin main
   ```
2. No repositório no GitHub, acesse a aba **Settings** (Configurações).
3. Na barra lateral esquerda, clique em **Pages** (dentro da seção *Code and automation*).
4. Na seção **Build and deployment**:
   - **Source:** Selecione `Deploy from a branch`.
   - **Branch:** Selecione `main` e a pasta `/ (root)`.
   - Clique em **Save**.
5. Aguarde cerca de 1 a 2 minutos. O GitHub gerará o link oficial do seu site, geralmente no formato:
   `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

---

## 💻 Como Rodar e Testar Localmente

Você pode visualizar o material localmente de duas maneiras muito simples:

### Opção 1: Abrir diretamente no navegador
Dê um duplo clique no arquivo [`index.html`](file:///c:/Users/leonm/projects/material-ihc/index.html) ou arraste-o para qualquer navegador web moderno (Chrome, Firefox, Safari, Edge).

### Opção 2: Servidor local HTTP rápido (Recomendado)
Para uma experiência idêntica à do GitHub Pages:

- **Via Python 3:**
  ```bash
  python -m http.server 8000
  ```
  Acesse no navegador: `http://localhost:8000`

- **Via Node (npx serve):**
  ```bash
  npx serve .
  ```

- **Via VS Code:**
  Instale a extensão *Live Server* e clique em **Go Live** no canto inferior direito.

---

## 📁 Estrutura de Arquivos e Diretórios

```
material-ihc/
├── index.html                           # Página Inicial (Home Hub e Trilha Metodológica)
├── README.md                            # Documentação estruturada e guia de publicação
├── assets/
│   ├── css/
│   │   ├── main.css                     # Sistema de design, tokens, temas claro/escuro e layout
│   │   └── widgets.css                  # Estilos dos 11 laboratórios e simuladores interativos
│   └── js/
│       ├── main.js                      # Gerenciamento de tema, navegação e utilitários globais
│       └── widgets/
│           ├── 01-timeline.js           # Linha do tempo e simulador da Lei de Fitts
│           ├── 02-heuristics-evaluator.js # Laboratório de auditoria heurística de Nielsen
│           ├── 03-persona-map.js        # Gerador de personas e mapa de empatia com post-its
│           ├── 04-pov-hmw.js            # Construtor de PoV e gerador de perguntas HMW
│           ├── 05-ideation-tools.js     # Painel SCAMPER e inversor de piores ideias
│           ├── 06-pitch-timer.js        # Teleprompter e cronômetro de 60s para pitches
│           ├── 07-wizard-oz.js          # Simulador de tela dupla do Mágico de Oz
│           ├── 08-norman-principles.js  # Mapeamento de fogão e portas de Norman
│           ├── 09-wcag-lab.js           # Cálculo de contraste e filtros de daltonismo
│           ├── 10-journey-map.js        # Mapa de jornada com curva dinâmica em SVG
│           └── 11-wireframe-mid.js      # Inspetor de média fidelidade com grid overlay
└── pages/
    ├── 01-introducao-ihc.html           # 1. Introdução à IHC, histórico e usabilidade
    ├── 02-heuristicas-nielsen.html      # 2. Avaliação de interfaces e heurísticas de Nielsen
    ├── 03-personas-mapas-empatia.html   # 3. Personas e mapas de empatia
    ├── 04-pov-how-might-we.html         # 4. Point of View (PoV) e How Might We
    ├── 05-brainwriting-ideacao.html     # 5. Brainwriting 6-3-5, SCAMPER e Worst Ideas
    ├── 06-pitches-curtos.html           # 6. Pitches curtos iniciais (sem demonstração)
    ├── 07-prototipacao-baixa-fidelidade.html # 7. Prototipação de baixa fidelidade e Mágico de Oz
    ├── 08-interaction-design.html       # 8. Interaction Design e princípios de Norman
    ├── 09-acessibilidade-wcag.html      # 9. Acessibilidade digital e diretrizes WCAG
    ├── 10-jornada-do-usuario.html       # 10. Mapeamento da jornada do usuário
    └── 11-interfaces-media-fidelidade.html # 11. Interfaces de média fidelidade (wireframes)
```

---

## 📚 Referências Bibliográficas (Normas ABNT)

Todo o conteúdo teórico disponibilizado neste repositório fundamenta-se nas seguintes obras de referência da literatura de IHC:

1. **BARBOSA, Simone Diniz Junqueira; SILVA, Bruno Santana da.** *Interação Humano-Computador*. Rio de Janeiro: Elsevier / Campus, 2010.
2. **BASADUR, Min; GRAEN, George B.; GREEN, Stephen G.** Training in creative problem solving: Effects on ideation and problem finding and solving in an industrial research organization. *Organizational Behavior and Human Performance*, v. 30, n. 1, p. 41-70, 1982.
3. **BUSH, Vannevar.** As We May Think. *The Atlantic Monthly*, v. 176, n. 1, p. 101-108, 1945.
4. **BUXTON, Bill.** *Sketching User Experiences: Getting the Design Right and the Right Design*. San Francisco: Morgan Kaufmann, 2007.
5. **CARLSON, Curtis R.; WILMOT, William W.** *Innovation: The Five Disciplines for Creating What Customers Want*. New York: Crown Business, 2006.
6. **COOPER, Alan.** *The Inmates Are Running the Asylum: Why High-Tech Products Drive Us Crazy and How to Restore the Sanity*. Indianapolis: Sams Publishing, 1999.
7. **COOPER, Alan; REIMANN, Robert; CRONIN, David; NOESSEL, Christopher.** *About Face: The Essentials of Interaction Design*. 4. ed. Indianapolis: John Wiley & Sons, 2014.
8. **DE SOUZA, Clarisse Sieckenius.** *The Semiotic Engineering of Human-Computer Interaction*. Cambridge: MIT Press, 2005.
9. **DIEHL, Michael; STROEBE, Wolfgang.** Productivity loss in brainstorming groups: Toward the solution of a riddle. *Journal of Personality and Social Psychology*, v. 53, n. 3, p. 497-509, 1987.
10. **EBERLE, Bob.** *SCAMPER: Games for Imagination Development*. Buffalo: D.O.K. Publishers, 1971.
11. **FITTS, Paul M.** The information capacity of the human motor system in controlling the amplitude of movement. *Journal of Experimental Psychology*, v. 47, n. 6, p. 381-391, 1954.
12. **GARRETT, Jesse James.** *The Elements of User Experience: Patient-Centered Design for the Web and Beyond*. 2. ed. Berkeley: New Riders, 2011.
13. **GIBSON, James J.** *The Ecological Approach to Visual Perception*. Boston: Houghton Mifflin, 1979.
14. **GRAY, Dave; BROWN, Sunni; MACANUFO, James.** *Gamestorming: A Playbook for Innovators, Rulebreakers, and Changemakers*. Sebastopol: O'Reilly Media, 2010.
15. **HORTON, Sarah; QUESENBERY, Whitney.** *A Web for Everyone: Designing Accessible User Experiences*. Brooklyn: Rosenfeld Media, 2014.
16. **INTERNATIONAL ORGANIZATION FOR STANDARDIZATION.** *ISO 9241-11: Ergonomics of human-system interaction - Part 11: Usability: Definitions and concepts*. Geneva: ISO, 2018.
17. **KALBACH, Jim.** *Mapping Experiences: A Complete Guide to Creating Value through Journeys, Blueprints, and Diagrams*. Sebastopol: O'Reilly Media, 2016.
18. **KELLEY, John F.** An iterative design methodology for user-friendly natural language office information applications. *ACM Transactions on Office Information Systems (TOIS)*, v. 2, n. 1, p. 26-41, 1984.
19. **MOORE, Geoffrey A.** *Crossing the Chasm: Marketing and Selling High-Tech Products to Mainstream Customers*. New York: HarperBusiness, 1991.
20. **NIELSEN, Jakob.** *Usability Engineering*. San Francisco: Morgan Kaufmann, 1994.
21. **NIELSEN, Jakob; MOLICH, Rolf.** Heuristic evaluation of user interfaces. In: *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '90)*. New York: ACM, 1990. p. 249-256.
22. **NORMAN, Donald A.** *The Design of Everyday Things: Revised and Expanded Edition*. New York: Basic Books, 2013.
23. **PREECE, Jennifer; ROGERS, Yvonne; SHARP, Helen.** *Interaction Design: Beyond Human-Computer Interaction*. 4. ed. Chichester: John Wiley & Sons, 2015.
24. **ROHRBACH, Bernd.** Kreativ nach Noten: Das 6-3-5 Verfahren, eine Methode zur systematischen Ideenfindung. *Absatzwirtschaft*, v. 12, p. 73-75, 1969.
25. **SNYDER, Carolyn.** *Paper Prototyping: The Fast and Easy Way to Design and Refine User Interfaces*. San Francisco: Morgan Kaufmann, 2003.
26. **STICKDORN, Marc; SCHNEIDER, Jakob.** *This is Service Design Thinking: Basics, Tools, Cases*. Amsterdam: BIS Publishers, 2011.
27. **W3C (World Wide Web Consortium).** *Web Content Accessibility Guidelines (WCAG) 2.2*. W3C Recommendation, 2023. Disponível em: <https://www.w3.org/TR/WCAG22/>.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [MIT](LICENSE), permitindo seu uso livre, cópia, modificação e distribuição para fins educacionais, acadêmicos e comerciais.
