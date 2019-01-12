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

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let elem = $(ev.target).hasClass('casa')
        ? $(ev.target)
        : $(ev.target).closest('casa');
    let pos = elem.attr('data-pos').split('-');
    let movimento = movimentos.find(x => +x.r == +pos[0] && +x.c == +pos[1]);
    if (!movimento) return ev.preventDefault(); // CASA NAO ENCONTRADA
    let pc = document.getElementById(data);
    let old = $(pc).closest('div');
    if (!_liberaMovXequeMate(ev.target, pc)) return ev.preventDefault(); // XEQUE 
    $(pc).attr('data-pos', pos.join('-'));
    $(pc).attr('data-virgem', 0);
    $(ev.target).html(pc);
    _setMovPeao2(movimento);
    _setMovRoque(movimento)
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

function _setMovPeao2(movimento) {
    if (movimento.peao2Atk)
        $(`.casa[data-pos="${movimento.peao2Atk[0]}-${movimento.peao2Atk[1]}"]`).empty();
    $(`.casa`).removeAttr('data-peao2');
    if (!movimento.peao2) return;
    $(`.casa[data-pos="${movimento.peao2.r}-${movimento.peao2.c}"]`)
        .attr('data-peao2', `${movimento.r}-${movimento.c}`);
}

function _setMovRoque(movimento) {
    if (!movimento.roque) return;
    let torre = $(`.peca[data-pos="${movimento.roque.peca[0]}-${movimento.roque.peca[1]}"]`);
    torre.closest('.casa').empty();
    torre.attr('data-pos', movimento.roque.vai.r + '-' + movimento.roque.vai.c);
    $(`.casa[data-pos="${movimento.roque.vai.r + '-' + movimento.roque.vai.c}"]`).html(torre);
}

function _liberaMovXequeMate(casaDestino, peca) {
    if (!noXequeMateMovs.lenght) return true;
    let _posDest = $(casaDestino).attr('data-pos').split('-').map(Number);
    let _posPeca = $(peca).attr('data-pos').split('-').map(Number);
    let _peca = noXequeMateMovs.find(x => x.peca[0] == _posPeca[0] && x.peca[1] == _posPeca[1])
    if (!_peca) return false;
    return _peca.movimentos.some(x => x.r == _posDest[0] && x.c == _posDest[1]);
}
