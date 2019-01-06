window.$create = (function () {
    function _tabuleiro() {
        for (let i = 0; i < 8; i++) {
            let cors = ['escura', 'clara'];
            let cor = i % 2 == 0 ? 0 : 1;
            for (let j = 0; j < 8; j++) {
                $('.tabuleiro').append(
                    `<div class="casa ${cors[cor]}" ondrop="drop(event)" ondragover="allowDrop(event)"` +
                    ` data-col="${j + 1}" data-row="${i + 1}" data-pos="${i + 1}-${j + 1}"></div>`
                )
                cor = cor == 1 ? 0 : 1;
            }
        }
    }

    function _peao() {
        for (let p = 0; p < 8; p++) {
            $(`[data-pos="2-${p + 1}"]`)
                .html(_html('clara', p, 'peao', `2-${p + 1}`));
        }
        for (let p = 0; p < 8; p++) {
            $(`[data-pos="7-${p + 1}"]`)
                .html(_html('escura', p, 'peao', `7-${p + 1}`));
        }
    }

    function _pecasMedias() {
        let pc = {
            torre: [`1-1`, `1-8`, `8-1`, `8-8`],
            cavalo: [`1-2`, `1-7`, `8-2`, `8-7`],
            bispo: [`1-3`, `1-6`, `8-3`, `8-6`]
        }
        Object.keys(pc).forEach(x => {
            pc[x].forEach((y, i) => {
                $(`[data-pos="${y}"]`).html(_html(i < 2 ? 'clara' : 'escura', i, x, y, 'media'));
            })
        });
    }

    function _html(cor, id, tipo, pos, tam) {
        return `<img id="${tipo}-${cor}-${id}"` +
            ` src="./pecas/${tipo}${cor != 'clara' ? 2 : ''}.png"` +
            ' draggable="true"' +
            ' ondragstart="drag(event)"' +
            ` data-pos="${pos}"` +
            ` data-tipo="${tipo}"` +
            ` data-cor="${cor}"` +
            ` class="peca ${cor} ${tam}">`
    }

    function _init() {
        _tabuleiro();
        _peao();
        _pecasMedias();
    }

    return {
        init: _init,
        html: _html
    };
})();