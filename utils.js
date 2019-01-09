function resetMovs() {
    $(`.casa`).removeClass('select');
    $(`.casa`).removeClass('comer');
    if (!settings.ajudas.ultimoMovimentoClick) {
        $(`.casa`).removeClass('on')
        $(`.casa`).removeClass('go');
    }
}

function efetivoMov(div, old) {
    $(`.casa`).removeClass('select');
    $(`.casa`).removeClass('comer');
    $(`.casa`).removeClass('on');
    $(`.casa`).removeClass('go');
    if (settings.ajudas.ultimoMovimento) {
        $(div).addClass('go');
        $(old).addClass('on');
    }
}