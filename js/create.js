window.$create = (function () {
    function _tabuleiro() {
        for (let i = 0; i < 8; i++) {
            let cors = ['clara', 'escura'];
            let cor = i % 2 == 0 ? 0 : 1;
            for (let j = 0; j < 8; j++) {
                $('.tabuleiro').append(
                    `<div tabindex="0" class="casa ${cors[cor]}" ondrop="drop(event)" ondragover="allowDrop(event)"` +
                    ` data-col="${j + 1}" data-row="${i + 1}" data-pos="${i + 1}-${j + 1}"></div>`
                )
                cor = cor == 1 ? 0 : 1;
            }
        }
    }

    function _peao(rodada) {
        for (let p = 0; p < 8; p++) {
            $(`[data-pos="2-${p + 1}"]`)
                .html(_html(rodada % 2 != 0 ? 'clara' : 'escura', p, 'peao', `2-${p + 1}`));
        }
        for (let p = 0; p < 8; p++) {
            $(`[data-pos="7-${p + 1}"]`)
                .html(_html(rodada % 2 != 0 ? 'escura' : 'clara', p, 'peao', `7-${p + 1}`));
        }
    }

    function _pecasMedias(rodada) {
        let pc = {
            torre: [`1-1`, `1-8`, `8-1`, `8-8`],
            cavalo: [`1-2`, `1-7`, `8-2`, `8-7`],
            bispo: [`1-3`, `1-6`, `8-3`, `8-6`]
        }
        Object.keys(pc).forEach(x => {
            pc[x].forEach((y, i) => {
                $(`[data-pos="${y}"]`).html(
                    _html(rodada % 2 != 0
                        ? i < 2 ? 'clara' : 'escura'
                        : i < 2 ? 'escura' : 'clara', i, x, y, 'media')
                );
            })
        });
    }

    function _pecasgrandes(rodada) {
        $(`[data-pos="1-5"]`).html(
            _html(rodada % 2 != 0 ? 'clara' : 'escura', 1, 'rainha', '1-5', 'grande')
        );
        $(`[data-pos="1-4"]`).html(
            _html(rodada % 2 != 0 ? 'clara' : 'escura', 1, 'rei', '1-4', 'grande')
        );
        $(`[data-pos="8-5"]`).html(
            _html(rodada % 2 != 0 ? 'escura' : 'clara', 1, 'rainha', '8-5', 'grande')
        );
        $(`[data-pos="8-4"]`).html(
            _html(rodada % 2 != 0 ? 'escura' : 'clara', 1, 'rei', '8-4', 'grande')
        );
    }

    function _html(cor, id, tipo, pos, tam) {
        return `<img id="${tipo}-${cor}-${id}"` +
            ` src="./pecas/${tipo}${cor != 'clara' ? 2 : ''}.png"` +
            ' draggable="true"' +
            ' ondragstart="drag(event)"' +
            ` data-pos="${pos}"` +
            ` data-tipo="${tipo}"` +
            ` data-cor="${cor}"` +
            ` data-virgem="1"` +
            ` class="peca ${cor} ${tam}">`
    }

    function _init() {
        _tabuleiro();
        if (false) {
            // GAMBI SÓ PRA TESTES
            $('.casa[data-pos="1-1"]').html($create.html('clara', new Date().getTime(), 'torre', "1-1", 'media'));
            $('.casa[data-pos="1-4"]').html($create.html('clara', new Date().getTime(), 'rei', "1-4", 'grande'));
            $('.casa[data-pos="1-8"]').html($create.html('clara', new Date().getTime(), 'torre', "1-8", 'media'));
            return
        };
        _peao(1);
        _pecasMedias(1);
        _pecasgrandes(1);
    }

    function _new(rodada) {
        _removePecas()
        _peao(rodada);
        _pecasMedias(rodada);
        _pecasgrandes(rodada);
    }

    function _removePecas() {
        $('.casa').empty();
        $utils.removeAllClass();
    }

    return {
        init: _init,
        html: _html,
        new: _new
    };
})();