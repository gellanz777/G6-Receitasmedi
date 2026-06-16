classDiagram
    class Receita {
        -id_receita: int
        -titulo: string
        -descricao: string
        -modo_preparo: string
        -tempo_preparo_min: int
        -porcoes: int
        -data_criacao: date
    }

    class Ingrediente {
        -id_ingrediente: int
        -nome: string
    }

    class Categoria {
        -id_categoria: int
        -nome: string
    }

    class Usuario {
        -id_usuario: int
        -nome: string
        -email: string
        -senha: string
    }

    class ReceitaIngrediente {
        -id_receita_ingrediente: int
        -id_receita: int
        -id_ingrediente: int
        -quantidade: string
        -unidade_medida: string
    }

    class Comentario {
        -id_comentario: int
        -id_usuario: int
        -id_receita: int
        -texto: string
        -data_comentario: date
    }

    class Avaliacao {
        -id_avaliacao: int
        -id_usuario: int
        -id_receita: int
        -nota: int
    }

    Receita "1" --> "*" ReceitaIngrediente : possui
    Ingrediente "1" --> "*" ReceitaIngrediente : compõe
    Categoria "1" --> "*" Receita : classifica
    Usuario "1" --> "*" Receita : cria
    Receita "1" --> "*" Comentario : recebe
    Usuario "1" --> "*" Comentario : escreve
    Receita "1" --> "*" Avaliacao : tem
    Usuario "1" --> "*" Avaliacao : faz