let movimentos = [];
let movimentosNoCheck = [];
let noXequeMateMovs = [];
$create.init();

$(document).on('mousedown', '.peca', function () {
    $('.peca').removeAttr('data-ativo');
    if (settings.game.mate) return;
    let cor = $(this).attr('data-cor');
    if (settings.game.jogadorVezCor != cor) return;
    let _pos = $(this).attr('data-pos').split('-').map(Number);
    if (
        noXequeMateMovs.length &&
        !noXequeMateMovs.some(x => x.peca[0] == _pos[0] && x.peca[1] == _pos[1] && x.movimentos.length)
    ) return;
    $utils.resetMovs();
    movimentos = [];            // TODO MOVIMENTOS POSSIVEIS
    movimentosNoCheck = [];     // MOVIMENTOS POSSIVEIS CASO PECA QUE PROTEGE O REI
    $jogadas[$(this).attr('data-tipo')](this, true);
    if (noXequeMateMovs.length) {
        let _peca = noXequeMateMovs.find(y => y.peca[0] == _pos[0] && y.peca[1] == _pos[1])
        if (!_peca) movimentos = [];
        else
            movimentos = movimentos.filter(x => _peca.movimentos.some(y => y.r == x.r && y.c == x.c));
    }
    $setCasas(movimentos);
    if (movimentos.length)
        $(this).attr('data-ativo', true);
    if (movimentos.length && settings.ajudas.selected) {
        $(this).closest(`.casa`).addClass('selected');
    }
});

$(document).on('mousedown', '.casa', function () {
    let peca = $('.peca[data-ativo]')[0];
    if (!peca) return;
    _moverPeca($(this), peca, true);
});

//GAMBI INSERE PECAS
let corDefault = 'clara';
$(document).on('keydown', '.casa', function (e) {
    if (e.keyCode == 46)
        return $(this).empty();
    if (e.keyCode == 104) {
        corDefault = corDefault == 'clara' ? 'escura' : 'clara';
        return;
    }

    if (![97, 98, 99, 100, 101, 102,].includes(e.keyCode)) return;

    let tipo = e.keyCode == 97
        ? 'rei'
        : e.keyCode == 98
            ? 'rainha'
            : e.keyCode == 99
                ? 'torre'
                : e.keyCode == 100
                    ? 'cavalo'
                    : e.keyCode == 101
                        ? 'bispo'
                        : 'peao';

    $(this).html($create.html(corDefault, new Date().getTime(), tipo, $(this).data('pos'), 'medio'));
});

/*
    * RODAR TABULEIRO
    * TABULEIRO INVERTIDO (ORDEM CORDENADAS)
    https://br.freepik.com/
*/