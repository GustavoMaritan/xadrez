(() => {
    const $setOcupadas = (_casa, _movList, _tipo, ocupadas) => {
        let _pos = _casa.attr('data-pos').split('-').map(Number);
        if (!ocupadas) return;
        if (_casa.html()) {
            ocupadas.push(_pos);
        }
        if (_tipo == 'rei')
            _movList.push({
                r: _pos[0],
                c: _pos[1]
            });
    };
    const $setMovNoCheck = (_ocupadas, _movimentosNoCheck, _item) => {
        if (_ocupadas.length > 1) return false;
        if (!_movimentosNoCheck.length) return false;
        let itemPos = $(_item).attr('data-pos').split('-').map(Number);
        if (!_movimentosNoCheck.some(x => x.r == itemPos[0] && x.c == itemPos[1])) return false;
        movimentosNoCheck.push(_movimentosNoCheck);
        return false;
    };

    const $torre = {
        getPositions(pos, ativo) {
            let movs = [];
            for (let p = 0; p < 2; p++) {
                for (let value = 1; value < 9; value++) {
                    if (value == (p % 2 == 0 ? +pos[0] : +pos[1])) continue;
                    movs.push({
                        r: p % 2 == 0 ? value : +pos[0],
                        c: p % 2 == 0 ? +pos[1] : value,
                        t: p % 2 == 0 ? 'row' : 'col'
                    })
                }
            }
            return movs;
        },
        movValid(mov, pos, element, ativo, item) {
            let isRow = mov.t == 'row';
            let r = {
                start: +pos[isRow ? 0 : 1],
                end: mov[isRow ? 'r' : 'c']
            };
            let casa;
            let ocupadas = [];
            let casaMov = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
            let tipo = casaMov.find('img').attr('data-tipo');
            let movimentosNoCheckTorre = [];
            if (r.start > r.end) {
                for (let p = r.start - 1; p > r.end; p--) {
                    casa = isRow
                        ? $(`.casa[data-pos="${p}-${mov.c}"]`)
                        : $(`.casa[data-pos="${mov.r}-${p}"]`);
                    $setOcupadas(casa, movimentosNoCheckTorre, tipo, ocupadas);
                }
            } else {
                for (let p = r.start + 1; p < r.end; p++) {
                    casa = isRow
                        ? $(`.casa[data-pos="${p}-${mov.c}"]`)
                        : $(`.casa[data-pos="${mov.r}-${p}"]`);
                    $setOcupadas(casa, movimentosNoCheckTorre, tipo, ocupadas);
                }
            }
            if (item) return $setMovNoCheck(ocupadas, movimentosNoCheckTorre, item);
            if (ocupadas.length) return false;
            if (!ativo && _mesmaCor(element, casaMov)) return mov;
            if (_mesmaCor(element, casaMov)) return false;
            mov.a = casaMov.html() ? 'atk' : 'mov';
            return mov;
        },
        setMov(movs, pos, element, ativo, item) {
            movs.forEach(x => {
                let mov = $torre.movValid(x, pos, element, ativo, item);
                if (!mov) return;
                movimentos.push(mov);
            });
        }
    }
    const $bispo = {
        getPositions(pos) {
            let movs = [];

            for (let p = 0; p < 4; p++) {
                let cond = true;
                let r = pos[0];
                let c = pos[1];
                while (cond) {
                    r += p < 2
                        ? p % 2 == 0 ? -1 : 1
                        : p % 2 == 0 ? -1 : 1;
                    c += p < 2
                        ? p % 2 == 0 ? -1 : 1
                        : p % 2 == 0 ? 1 : -1;
                    if (
                        (p == 0 && r > 0 && c > 0) ||
                        (p == 1 && r < 9 && c < 9) ||
                        (p == 2 && r > 0 && c < 9) ||
                        (p == 3 && r < 9 && c > 0)
                    )
                        movs.push({ r, c });
                    else
                        cond = false;
                }
            }
            return movs;
        },
        movValid(mov, pos, element, ativo, item) {
            let r = {
                start: pos[0] > mov.r ? mov.r : pos[0],
                end: pos[0] > mov.r ? pos[0] : mov.r
            };
            let casa;
            let ocupadas = [];
            let col = pos[0] > mov.r ? mov.c : pos[1];
            let multi = pos[0] > mov.r
                ? mov.c > pos[1] ? -1 : 1
                : pos[1] > mov.c ? -1 : 1;

            let casaMov = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
            let tipo = casaMov.find('img').attr('data-tipo');
            let movimentosNoCheckBispo = [];

            for (let p = r.start + 1; p < r.end; p++) {
                col += (1 * multi);
                casa = $(`.casa[data-pos="${p}-${col}"]`);
                $setOcupadas(casa, movimentosNoCheckBispo, tipo);
            }
            if (item) return $setMovNoCheck(ocupadas, movimentosNoCheckBispo, item);
            if (ocupadas.length) return false;
            if (!ativo && _mesmaCor(element, casaMov)) return mov;
            if (_mesmaCor(element, casaMov)) return false;
            mov.a = casaMov.html() ? 'atk' : 'mov';
            return mov;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                let mov = $bispo.movValid(x, pos, element, ativo);
                if (!mov) return;
                movimentos.push(mov);
            });
        }
    }
    const $cavalo = {
        getPositions(pos) {
            let movs = [];
            for (let k = 0; k < 2; k++) { // esqueda | direita
                for (let p = 0; p < 2; p++) { // cima | baixo
                    for (let q = 0; q < 2; q++) { // jg1 | jg2
                        let m = {
                            r: pos[0] + ((q % 2 == 0 ? 1 : 2) * (p % 2 == 0 ? -1 : 1)),
                            c: pos[1] + ((q % 2 == 0 ? 2 : 1) * (k % 2 == 0 ? -1 : 1))
                        };
                        if (m.r > 0 && m.r < 9 && m.c > 0 && m.c < 9)
                            movs.push(m)
                    }
                }
            }
            return movs;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
                if (!casa.html()) {
                    x.a = 'mov';
                    movimentos.push(x);
                    return;
                }
                if ((!ativo && _mesmaCor(element, casa)) || !_mesmaCor(element, casa)) {
                    x.a = 'atk';
                    movimentos.push(x);
                };
            });
        }
    }
    const $peao = {
        getPositions(pos, isClara, ativo) {
            let movs = [
                {
                    r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                    c: +pos[1] + 1,
                    t: 'atk'
                }, {
                    r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                    c: +pos[1] - 1,
                    t: 'atk'
                }
            ];

            if (ativo)
                movs.push({
                    r: +pos[0] + (isClara ? 1 : -1),
                    c: +pos[1],
                    t: 'mov'
                })
            return movs;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
                x.a = x.t;
                if (x.t == 'mov') {
                    if (!casa.html()) {
                        movimentos.push(x);
                    }
                } else {
                    if (!ativo) {
                        if (!casa.html() || _mesmaCor(element, casa))
                            movimentos.push(x);
                    }
                    if (casa.html() && !_mesmaCor(element, casa)) {
                        movimentos.push(x);
                    }
                }
            });
        }
    }
    const $rei = {
        getPositions(pos, element, ativo) {
            let movs = [];
            for (let p = 0; p < 4; p++) {
                let mr = p == 0 ? -1 : p == 1 ? 0 : 1;
                let mc = p == 3 ? 0 : -1;
                let l1 = {
                    r: pos[0] + mr,
                    c: pos[1] + mc
                }
                let l2 = {
                    r: pos[0] + (mr * -1),
                    c: pos[1] + (mc * -1)
                }
                if (l1.r > 0 && l1.r < 9 && l1.c > 0 && l1.c < 9) {
                    let casa = _getCasa(l1);
                    if (
                        (!casa.html() || !_mesmaCor(element, casa)) ||
                        (!ativo && _mesmaCor(element, casa))
                    )
                        movs.push(l1);
                }
                if (l2.r > 0 && l2.r < 9 && l2.c > 0 && l2.c < 9) {
                    let casa = _getCasa(l2);
                    if (
                        (!casa.html() || !_mesmaCor(element, casa)) ||
                        (!ativo && _mesmaCor(element, casa))
                    )
                        movs.push(l2);
                }
            }
            return movs;
        },
        setMov(movs, pos, element) {
            let corAdvers = $(element).attr('data-cor') == 'clara' ? 'escura' : 'clara';
            $(`.peca[data-cor="${corAdvers}"]`).each(function (obj) {
                $jogadas[$(this).attr('data-tipo')](this);
            });
            console.log('movimentos', movimentos)
            console.log('movs', movs)
            let possiveis = movs.map(x => {
                if (!movimentos.some(y => y.r == x.r && y.c == x.c)) {
                    let casa = _getCasa(x);
                    x.a = casa.html() ? 'atk' : 'mov';
                    return x;
                }
            }).filter(x => x);
            console.log('possiveis', possiveis)

            return possiveis;
        }
    }
    const _getCasa = (x) => {
        return $(`.casa[data-pos="${x.r}-${x.c}"]`);
    }
    const _mesmaCor = (element, casa) => {
        return $(element).attr(`data-cor`) == casa.find('img').attr(`data-cor`);
    }
    const _getPosition = (element) => {
        return $(element).attr('data-pos').split('-').map(Number);
    }
    const _setCasas = ($movimentos) => {
        $movimentos.map(x => {
            let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
            casa.addClass(x.a == 'mov' ? 'select' : 'comer');
        });
    }
    const _verificaAdversario = (element) => {
        let corAdvers = $(element).attr('data-cor') == 'clara' ? 'escura' : 'clara';
        $(`.peca[data-cor="${corAdvers}"]`).each(function (obj) {
            $jogadas[$(this).attr('data-tipo')](this, false, element);
            if (['bispo', 'torre', 'rainha'].includes($(this).attr('data-tipo'))) {
            }
        });
    }
    const _filterMovs = (element, movs, item) => {
        if (item) return movs;
        _verificaAdversario(element);

        console.log(movimentosNoCheck)
        return movimentosNoCheck.length
            ? movs.filter(x => movimentosNoCheck.some(y => y.some(z => z.r == x.r && z.c == x.c)))
            : movs;
    }

    const _jogadas = {
        peao: (element, ativo, item) => {
            let isClara = $(element).attr(`data-cor`) == 'clara';
            let pos = _getPosition(element);
            let movs = $peao.getPositions(pos, isClara, ativo);
            movs = _filterMovs(element, movs, item);
            $peao.setMov(movs, pos, element, ativo);
        },
        torre: (element, ativo, item) => {
            let pos = _getPosition(element);
            let movs = $torre.getPositions(pos, ativo);
            movs = _filterMovs(element, movs, item);
            $torre.setMov(movs, pos, element, ativo, item);
        },
        cavalo: (element, ativo, item) => {
            let pos = _getPosition(element);
            let movs = $cavalo.getPositions(pos);
            movs = _filterMovs(element, movs, item);
            $cavalo.setMov(movs, pos, element, ativo);
        },
        bispo: (element, ativo, item) => {
            let pos = _getPosition(element);
            let movs = $bispo.getPositions(pos, ativo);
            movs = _filterMovs(element, movs, item);
            $bispo.setMov(movs, pos, element, ativo);
        },
        rainha: (element, ativo, item) => {
            let pos = _getPosition(element);
            let movs = $torre.getPositions(pos, ativo);
            movs = _filterMovs(element, movs, item);
            $torre.setMov(movs, pos, element, ativo);
            movs = $bispo.getPositions(pos, ativo);
            movs = _filterMovs(element, movs, item);
            $bispo.setMov(movs, pos, element, ativo);
        },
        rei: (element, ativo) => {
            let pos = _getPosition(element);
            let movs = $rei.getPositions(pos, element, ativo);
            if (!ativo) {
                movs.forEach(x => movimentos.push({ r: x.r, c: x.c }));
                return;
            }
            movimentos = $rei.setMov(movs, pos, element);
        }
    }
    window.$jogadas = _jogadas;
    window.$setCasas = _setCasas;
})();