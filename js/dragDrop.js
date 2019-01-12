function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (settings.game.mate)
        return ev.preventDefault();
    if (settings.game.jogadorVezCor != $(ev.target).attr('data-cor'))
        return ev.preventDefault();
    if (!movimentos.length)
        return ev.preventDefault();
    let _pos = $(ev.target).attr('data-pos').split('-').map(Number);
    if (
        noXequeMateMovs.length &&
        !noXequeMateMovs.some(x => x.peca[0] == _pos[0] && x.peca[1] == _pos[1] && x.movimentos.length)
    )
        return ev.preventDefault();
    ev.dataTransfer.setData("text", ev.target.id);
}

function _liberaMovXequeMate(casaDestino, peca) {
    if (!noXequeMateMovs.lenght) return true;
    let _posDest = $(casaDestino).attr('data-pos').split('-').map(Number);
    let _posPeca = $(peca).attr('data-pos').split('-').map(Number);
    let _peca = noXequeMateMovs.find(x => x.peca[0] == _posPeca[0] && x.peca[1] == _posPeca[1])
    if (!_peca) return false;
    return _peca.movimentos.some(x => x.r == _posDest[0] && x.c == _posDest[1]);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let elem = $(ev.target).hasClass('casa')
        ? $(ev.target)
        : $(ev.target).closest('casa');
    let pos = elem.attr('data-pos').split('-');
    let casa = movimentos.find(x => +x.r == +pos[0] && +x.c == +pos[1]);
    if (!casa) return ev.preventDefault();
    let pc = document.getElementById(data);
    let old = $(pc).closest('div');
    if (!_liberaMovXequeMate(ev.target, pc)) return ev.preventDefault();
    $(pc).attr('data-pos', pos.join('-'));
    $(ev.target).html(pc);
    let classe = $(pc).attr('data-cor');
    let total = $(`div.${classe}>.jogadas>p`).length;
    $(`div.${classe}>.jogadas`).prepend(`<p>${total + 1} - ${$(pc).attr('data-tipo')} - ${$(ev.target).attr('data-pos')}</p>`)
    $utils.efetivoMov(ev.target, old);
    $verificaXeque(pc);
    settings.game.alterarJogadorVez({
        peca: $(pc).attr('data-tipo'),
        from: $(old).attr('data-pos').split('-').map(Number),
        to: $(ev.target).attr('data-pos').split('-').map(Number)
    });
}
