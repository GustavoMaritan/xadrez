function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (settings.game.jogadorVezCor != $(ev.target).attr('data-cor'))
        return ev.preventDefault();
    if (!movimentos.length)
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
    let casa = movimentos.find(x => +x.r == +pos[0] && +x.c == +pos[1]);
    if (!casa) return ev.preventDefault();
    let pc = document.getElementById(data);
    let old = $(pc).closest('div');
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
