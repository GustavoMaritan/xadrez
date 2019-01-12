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

    //if (!_moverPeca()) return ev.preventDefault();
}

function _moverPeca(destino, peca) {
    let elem = $(ev.target).hasClass('casa')
        ? $(ev.target)
        : $(ev.target).closest('casa');
    let pos = elem.attr('data-pos').split('-');
    let movimento = movimentos.find(x => +x.r == +pos[0] && +x.c == +pos[1]);
    if (!movimento) return false; // CASA NAO ENCONTRADA
    let pc = document.getElementById(data);
    let old = $(pc).closest('div');
    if (!_liberaMovXequeMate(ev.target, pc)) return false; // XEQUE 
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
    _move(movimento.roque.peca, [movimento.roque.vai.r, movimento.roque.vai.c]);
}

function _liberaMovXequeMate(casaDestino, peca) {
    if (!noXequeMateMovs.lenght) return true;
    let _posDest = $(casaDestino).attr('data-pos').split('-').map(Number);
    let _posPeca = $(peca).attr('data-pos').split('-').map(Number);
    let _peca = noXequeMateMovs.find(x => x.peca[0] == _posPeca[0] && x.peca[1] == _posPeca[1])
    if (!_peca) return false;
    return _peca.movimentos.some(x => x.r == _posDest[0] && x.c == _posDest[1]);
}

function _move(from, to, speed) {
    from = from || [1, 8];
    to = to || [8, 1];
    let width = ($('.tabuleiro').width() * 12.5) / 100;
    let height = ($('.tabuleiro').height() * 12.5) / 100;
    let position = $(`.peca[data-pos="${from[0]}-${from[1]}"]`).position();
    let casasCols = width * (from[1] - to[1]) * (from[1] > to[1] ? 1 : -1);
    casasCols = casasCols * (from[1] > to[1] ? -1 : 1);
    let casasRows = height * (from[0] - to[0]) * (from[0] > to[0] ? 1 : -1);
    casasRows = casasRows * (from[0] > to[0] ? -1 : 1);
    $(`.peca[data-pos="${from[0]}-${from[1]}"]`).animate({
        left: position.left + casasCols,
        top: position.top + casasRows,
    }, speed || 500, function () {
        let peca = $(this);
        peca.attr(`data-pos`, `${to[0]}-${to[1]}`);
        peca.attr(`data-virgem`, 0);
        peca.css({ left: 'auto', top: 'auto' })
        $(`.casa[data-pos="${from[0]}-${from[1]}"]`).empty();
        $(`.casa[data-pos="${to[0]}-${to[1]}"]`).html(peca);
    });
}