function resetMovs() {
    $(`.casa`).removeClass('on')
    $(`.casa`).removeClass('select');
    $(`.casa`).removeClass('comer');
    $(`.casa`).removeClass('go');
}

function efetivoMov(div) {
    $(`.casa`).removeClass('select');
    $(`.casa`).removeClass('comer');
    $(div).addClass('go');
}