function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (!movimentos.length)
        return ev.preventDefault();
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    let elem = $(ev.target).hasClass('casa')
        ? $(ev.target)
        : $(ev.target).closest('casa');

    let pos = elem.attr('data-pos').split('-');

    let casa = movimentos.find(x => +x.r == +pos[0] && +x.c == +pos[1]);

    if (!casa)
        return ev.preventDefault();

    let pc = document.getElementById(data);

    let old = $(pc).closest('div');

    $(pc).attr('data-pos', pos.join('-'));

    $(ev.target).html(pc);
    //resetMovs();
    efetivoMov(ev.target, old);
}
