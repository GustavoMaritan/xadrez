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
    if (!_moverPeca(ev.target, document.getElementById(data))) return ev.preventDefault();
}

function _moverPeca(destino, peca, manual) {
    let elem = $(destino).hasClass('casa')
        ? $(destino)
        : $(destino).closest('casa');
    let pos = elem.attr('data-pos').split('-');
    let movimento = movimentos.find(x => +x.r == +pos[0] && +x.c == +pos[1]);
    if (!movimento) return false; // CASA NAO ENCONTRADA
    let pc = peca;
    if (!_liberaMovXequeMate(destino, pc)) return false; // XEQUE 
    if (manual)
        _move($(pc).attr('data-pos').split('-').map(Number), pos, null, () => {
            _finalizaDrop(pc, destino, movimento);
        });
    else {
        $(pc).attr('data-pos', pos.join('-'));
        $(pc).attr('data-virgem', 0);
        if (elem.find('.peca')) {
            _setLixo(elem.find('.peca'));
        }
        $(destino).html(pc);
        _finalizaDrop(pc, destino, movimento);
    }
}

function _setLixo(elem) {
    $(`.lixo>div.${elem.attr('data-cor')}`).append(`
    <div>
        <img 
            src="./pecas/${elem.attr('data-tipo')}${elem.attr('data-cor') == 'clara' ? '' : '2'}.png" 
            data-tipo="${elem.attr('data-tipo')}"
            class="peca-lixo ${
        elem.attr('data-tipo') == 'rei'
            ? 'grande' : elem.attr('data-tipo') == 'peao'
                ? 'pequena' : 'media'
        } "></img>
    </div >
    `)
}

function _finalizaDrop(pc, destino, movimento) {
    let old = $(pc).closest('div');
    _setMovPeao2(movimento);
    _setMovRoque(movimento)
    let classe = $(pc).attr('data-cor');
    let total = $(`div.${classe}>.jogadas > p`).length;
    $(`div.${classe}>.jogadas`).prepend(`<p> ${total + 1} - ${$(pc).attr('data-tipo')} - ${$(destino).attr('data-pos')}</p > `)
    $utils.efetivoMov(destino, old);
    $verificaXeque(pc);
    settings.game.alterarJogadorVez({
        peca: $(pc).attr('data-tipo'),
        from: $(old).attr('data-pos').split('-').map(Number),
        to: $(destino).attr('data-pos').split('-').map(Number)
    });
    $('.peca').removeAttr('data-ativo');
}

function _setMovPeao2(movimento) {
    if (movimento.peao2Atk)
        $(`.casa[data-pos="${movimento.peao2Atk[0]}-${movimento.peao2Atk[1]}"]`).empty();
    $(`.casa`).removeAttr('data-peao2');
    if (!movimento.peao2) return;
    $(`.casa[data-pos="${movimento.peao2.r}-${movimento.peao2.c}"]`)
        .attr('data-peao2', `${movimento.r} -${movimento.c} `);
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

function _move(from, to, speed, callback) {
    let width = ($('.tabuleiro').width() * 12.5) / 100;
    let height = ($('.tabuleiro').height() * 12.5) / 100;
    let _peca = $(`.peca[data-pos="${from[0]}-${from[1]}"]`);
    let position = _peca.position();
    let casasCols = width * (from[1] - to[1]) * (from[1] > to[1] ? 1 : -1);
    casasCols = casasCols * (from[1] > to[1] ? -1 : 1);
    let casasRows = height * (from[0] - to[0]) * (from[0] > to[0] ? 1 : -1);
    casasRows = casasRows * (from[0] > to[0] ? -1 : 1);
    _peca.animate({
        left: position.left + casasCols,
        top: position.top + casasRows,
    }, speed || 500, function () {
        let peca = $(this);
        peca.attr(`data-pos`, `${to[0]}-${to[1]}`);
        peca.attr(`data-virgem`, 0);
        peca.css({ left: 'auto', top: 'auto' })
        $(`.casa[data-pos="${from[0]}-${from[1]}"]`).empty();
        let casaTo = $(`.casa[data-pos="${to[0]}-${to[1]}"]`);
        if (casaTo.find('.peca'))
            _setLixo(casaTo.find('.peca'));
        casaTo.html(peca);
        
        callback && callback();
    });
}