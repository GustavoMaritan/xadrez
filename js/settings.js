window.settings = {
    ajudas: {
        movimentos: true,
        ultimoMovimento: true,
        ultimoMovimentoClick: true,
        selected: true,
        check: true
    },
    game: {
        rodada: 1,
        xeque: null,
        mate: null,
        _jogadorVez: 1,
        jogador1: {
            id: 1,
            cor: 'clara',
            jogadas: []
        },
        jogador2: {
            id: 2,
            cor: 'escura',
            jogadas: []
        },
        get jogadorVez() {
            return settings.game['jogador' + settings.game._jogadorVez];
        },
        get jogadorVezCor() {
            return settings.game['jogador' + settings.game._jogadorVez].cor;
        },
        setMovimentoJogVez(mov) {
            settings.game.jogadorVez.jogadas.push(mov);
        },
        alterarJogadorVez(mov) {
            settings.game.setMovimentoJogVez(mov);
            settings.game._jogadorVez = settings.game._jogadorVez == 1 ? 2 : 1;
            $(`.historico>div>span`).removeClass('ativo');
            $(`.historico>div.${settings.game.jogadorVez.cor}>span`).addClass('ativo');
        },
        resetPlayer() {
            settings.game.jogador1.jogadas = settings.game.jogador2.jogadas = [];
            settings.game.jogador1.cor = settings.game.jogador2.cor;
            settings.game.jogador2.cor = settings.game.jogador2.cor == 'clara' ? 'escura' : 'clara';
        },
        _new() {
            settings.historico.push({
                rodada: settings.game.rodada,
                vencedor: null,
                jogador1: {
                    id: 1,
                    cor: settings.game.jogador1.cor,
                    jogadas: settings.game.jogador1.jogadas
                },
                jogador2: {
                    id: 2,
                    cor: settings.game.jogador2.cor,
                    jogadas: settings.game.jogador2.jogadas
                }
            })
            settings.game.rodada++;
            settings.game.resetPlayer();
            settings.game._jogadorVez =
                settings.game.jogador1.cor == 'clara' ? 1 : 2;
            settings.game.xeque = null;
            settings.game.mate = null;
        }
    },
    historico: []
}