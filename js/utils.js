window.$utils = {
    removeAllClass: () => {
        $(`.casa`).removeClass('selected');
        $(`.casa`).removeClass('select');
        $(`.casa`).removeClass('comer');
        $(`.casa`).removeClass('on');
        $(`.casa`).removeClass('go');
    },
    efetivoMov: (div, old) => {
        $(`.casa`).removeClass('selected');
        $(`.casa`).removeClass('select');
        $(`.casa`).removeClass('comer');
        $(`.casa`).removeClass('on');
        $(`.casa`).removeClass('go');
        if (settings.ajudas.ultimoMovimento) {
            $(div).addClass('go');
            $(old).addClass('on');
        }
    },
    resetMovs: () => {
        $(`.casa`).removeClass('select');
        $(`.casa`).removeClass('comer');
        $(`.casa`).removeClass('selected');
        if (!settings.ajudas.ultimoMovimentoClick) {
            $(`.casa`).removeClass('on')
            $(`.casa`).removeClass('go');
        }
    }
}