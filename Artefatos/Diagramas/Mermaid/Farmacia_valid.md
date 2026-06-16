---
config:
  layout: elk
---
sequenceDiagram
    participant FarmaciaG8 as Farmácia G8
    participant ReceitaController as ReceitaController
    participant Receita as Receita
    participant ReceitaItem as ReceitaItem
    
    FarmaciaG8->>ReceitaController: Enviar UUID
    ReceitaController->>Receita: Buscar receita
    Receita-->>ReceitaController: Receita encontrada
    ReceitaController->>ReceitaItem: Buscar medicamentos
    ReceitaController->>ReceitaItem: Itens da receita
    ReceitaItem-->>ReceitaController: Medicamentos retornados
    ReceitaController->>Receita: Atualizar status
    ReceitaController->>FarmaciaG8: Receita válida
    FarmaciaG8->>ReceitaController: Dispensar
    ReceitaController->>Receita: Atualizar status
    Receita-->>FarmaciaG8: Status dispensada