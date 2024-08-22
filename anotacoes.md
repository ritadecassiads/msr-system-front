## Explicações
-> Observable<any>: significa que ele retornará um fluxo de dados assíncrono que os componentes podem se inscrever para receber a resposta.

-> Pipe: é um método que permite encadear operadores que serão aplicados ao fluxo de dados do Observable.
    -> Você deve usar .pipe sempre que precisar:
        Transformar ou filtrar dados recebidos de um observable.
        Realizar ações colaterais com os dados.
        Capturar e tratar erros.

-> Map: é um operador que transforma os dados emitidos pelo Observable

## Fazer
-> Pensar numa forma diferente de criar um usuário, ja que só será criado um novo usuário através de um admin