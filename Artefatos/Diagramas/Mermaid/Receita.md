---
config:
  layout: elk
---
sequenceDiagram
    participant Medico
    participant Frontend
    participant ReceitaController
    participant ProntuarioG5
    participant Receita
    participant ReceitaItem
    
    Medico->>Frontend: Preenche receita
    Frontend->>ReceitaController: POST /receita
    ReceitaController->>ProntuarioG5: Validar prontuário
    ProntuarioG5-->>ReceitaController: Prontuário válido
    ReceitaController->>Receita: Criar receita
    Receita-->>ReceitaController: Receita criada
    ReceitaController->>ReceitaItem: Criar itens
    ReceitaItem-->>ReceitaController: Itens salvos
    ReceitaController-->>Frontend: Retorna receita