(() => {
    const $setOcupadas = (_casa, _movList, _tipo, ocupadas) => {
        let _pos = _casa.attr('data-pos').split('-').map(Number);
        if (_casa.html())
            ocupadas.push(_pos);
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
    const $validMovs = (ocupadas, movNoCheck, item, ativo, element, casa, mov, pos) => {
        if (item) return $setMovNoCheck(ocupadas, movNoCheck, item);
        if (ocupadas.length) {
            if (ativo) return false;
            let _rei = ocupadas.find(x => $(`.peca[data-pos="${x[0]}-${x[1]}"]`).attr('data-tipo') == 'rei');
            if (_rei) {
                let col = ocupadas.filter(
                    (x => x[1] > _rei[1] && x[1] < +pos[1]) ||
                    (x => x[1] < _rei[1] && x[1] > +pos[1]) ||
                    (x => x[0] > _rei[0] && x[0] < +pos[0]) ||
                    (x => x[0] < _rei[0] && x[0] > +pos[0])
                )
                if (col.length) return false;
            } else {
                return false;
            }
        }
        if (!ativo && _mesmaCor(element, casa)) return mov;
        if (_mesmaCor(element, casa)) return false;
        mov.a = casa.html() ? 'atk' : 'mov';
        return mov;
    };

    const $torre = {
        getPositions(pos, filter) {
            let movs = [];
            for (let p = 0; p < 2; p++) {
                for (let value = 1; value < 9; value++) {
                    if (value == (p % 2 == 0 ? +pos[0] : +pos[1])) continue;

                    // movs.push({
                    //     r: p % 2 == 0 ? value : +pos[0],
                    //     c: p % 2 == 0 ? +pos[1] : value,
                    //     t: p % 2 == 0 ? 'row' : 'col'
                    // });

                    movs = _filter(movs, {
                        r: p % 2 == 0 ? value : +pos[0],
                        c: p % 2 == 0 ? +pos[1] : value,
                        t: p % 2 == 0 ? 'row' : 'col'
                    }, filter, pos);
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
            return $validMovs(ocupadas, movimentosNoCheckTorre, item, ativo, element, casaMov, mov, pos);
        },
        setMov(movs, pos, element, ativo, item) {
            movs.forEach(x => {
                let mov = $torre.movValid(x, pos, element, ativo, item);
                if (!mov) return;
                let casa = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
                let m = _verificaPeao2(casa, mov);
                if (m) {
                    movimentos.push(m);
                    return;
                }
                movimentos.push(mov);
            });
        }
    }
    const $bispo = {
        getPositions(pos, filter) {
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
                        movs = _filter(movs, { r, c }, filter, pos);
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
                $setOcupadas(casa, movimentosNoCheckBispo, tipo, ocupadas);
            }
            return $validMovs(ocupadas, movimentosNoCheckBispo, item, ativo, element, casaMov, mov, pos);
        },
        setMov(movs, pos, element, ativo, item) {
            movs.forEach(x => {
                let mov = $bispo.movValid(x, pos, element, ativo, item);
                if (!mov) return;
                let casa = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
                let m = _verificaPeao2(casa, mov);
                if (m) {
                    movimentos.push(m);
                    return;
                }
                movimentos.push(mov);
            });
        }
    }
    const $cavalo = {
        getPositions(pos, filter) {
            let movs = [];
            for (let k = 0; k < 2; k++) { // esqueda | direita
                for (let p = 0; p < 2; p++) { // cima | baixo
                    for (let q = 0; q < 2; q++) { // jg1 | jg2
                        let m = {
                            r: pos[0] + ((q % 2 == 0 ? 1 : 2) * (p % 2 == 0 ? -1 : 1)),
                            c: pos[1] + ((q % 2 == 0 ? 2 : 1) * (k % 2 == 0 ? -1 : 1))
                        };
                        if (m.r > 0 && m.r < 9 && m.c > 0 && m.c < 9)
                            movs = _filter(movs, m, filter, pos);
                    }
                }
            }
            return movs;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
                if (!casa.html()) {
                    let m = _verificaPeao2(casa, x);
                    if (m) {
                        movimentos.push(m);
                        return;
                    }
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
        getPositions(element, pos, isClara, ativo, filter) {
            let virgem = !!+$(element).attr('data-virgem');
            let movs = _filter([], {
                r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                c: +pos[1] + 1,
                t: 'atk'
            }, filter, pos);
            movs = _filter(movs, {
                r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                c: +pos[1] - 1,
                t: 'atk'
            }, filter, pos);
            if (ativo) {
                movs = _filter(movs, {
                    r: +pos[0] + (isClara ? 1 : -1),
                    c: +pos[1],
                    t: 'mov'
                }, filter, pos);
                if (virgem)
                    movs = _filter(movs, {
                        r: +pos[0] + (isClara ? 2 : -2),
                        c: +pos[1],
                        t: 'mov',
                        peao2: {
                            r: +pos[0] + (isClara ? 1 : -1),
                            c: +pos[1],
                        }
                    }, filter, pos);
            }

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
                    if (casa.html() && !_mesmaCor(element, casa))
                        movimentos.push(x);
                    else {
                        let m = _verificaPeao2(casa, x);
                        m && movimentos.push(m);
                    }

                }
            });
        }
    }
    const $rei = {
        getPositions(pos, element, ativo) {
            let movs = roque();
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

            function roque() {
                let virgem = !!+$(element).attr('data-virgem');
                let _movs = [];
                let torres =
                    $(`.peca[data-tipo="torre"][data-virgem="1"][data-cor="${$(element).attr('data-cor')}"]`);

                if (!virgem || !torres.length || settings.game.xeque) return _movs;

                torres.each(function (i) {
                    let t = $(this).attr('data-pos').split('-').map(Number);
                    let tipoRoque = pos[1] - t[1] == '3' ? 'rei' : 'rainha';
                    let ini = pos[1] > t[1] ? t[1] : pos[1];
                    let fim = pos[1] > t[1] ? pos[1] : t[1];
                    let roqueDisposivel = [];
                    for (let i = ini + 1; i < fim; i++) {
                        let casa = _getCasa({
                            r: pos[0],
                            c: i
                        });
                        roqueDisposivel.push(!casa.html());
                    }
                    if (roqueDisposivel.some(x => !x)) return;
                    let _mov = {
                        r: pos[0],
                        c: tipoRoque == 'rei' ? 2 : 6,
                        roque: {
                            peca: t,
                            vai: {
                                r: pos[0],
                                c: tipoRoque == 'rei' ? 3 : 5
                            }
                        }
                    }
                    _movs.push(_mov);
                });
                return _movs;
            }
        },
        setMov(movs, pos, element) {
            let corAdvers = $(element).attr('data-cor') == 'clara' ? 'escura' : 'clara';
            $(`.peca[data-cor="${corAdvers}"]`).each(function (obj) {
                $jogadas[$(this).attr('data-tipo')](this);
            });
            let possiveis = movs.map(x => {
                if (!movimentos.some(y => y.r == x.r && y.c == x.c)) {
                    let casa = _getCasa(x);
                    let m = _verificaPeao2(casa, x);
                    if (m) return m;
                    x.a = casa.html() ? 'atk' : 'mov';
                    return x;
                }
            }).filter(x => x);
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
        if (!settings.ajudas.movimentos) return;
        $movimentos.map(x => {
            let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
            casa.addClass(x.a == 'mov' ? 'select' : 'comer');
        });
    }
    const _verificaAdversario = (element) => {
        let corAdvers = $(element).attr('data-cor') == 'clara' ? 'escura' : 'clara';
        $(`.peca[data-cor="${corAdvers}"]`).each(function (obj) {
            if (['bispo', 'torre', 'rainha'].includes($(this).attr('data-tipo'))) {
                $jogadas[$(this).attr('data-tipo')](this, false, element);
            }
        });
    }
    const _filterMovs = (element, movs, item) => {
        if (item) return movs;
        _verificaAdversario(element);
        return movimentosNoCheck.length
            ? movs.filter(x => movimentosNoCheck.some(y => y.some(z => z.r == x.r && z.c == x.c)))
            : movs;
    }
    const _filter = (movs, mov, filter, pos) => {
        if (!filter || !filter.length)
            movs.push(mov);
        else if (mov.r == filter[0] && mov.c == filter[1]) {
            mov.atacante = pos;
            movs.push(mov);
        }
        return movs;
    }
    const _verificaXeque = (element) => {
        noXequeMateMovs = [];
        let cor = $(element).attr('data-cor');
        let _rei = $(`.peca[data-tipo="rei"][data-cor="${cor == 'clara' ? 'escura' : 'clara'}"]`);
        let _pos = _rei.attr('data-pos').split('-').map(Number);
        movimentos = [];
        $(`.peca[data-cor="${cor}"]`).each(function (obj) {
            $jogadas[$(this).attr('data-tipo')](this, false, false, _pos);
        });
        if (!movimentos.filter(x => x.atacante).length) {
            settings.game.xeque = null;
            return;
        }
        settings.game.xeque = movimentos.filter(x => x.atacante);
        $(_rei).closest('.casa').addClass('comer');
        _xequeMate();
    }
    const _xequeMate = () => {
        movimentos = [];
        const _r = settings.game.xeque[0].r;
        const _c = settings.game.xeque[0].c;
        const _rei = $(`.peca[data-pos="${_r}-${_c}"]`);
        if (settings.game.xeque.length > 1) {
            $jogadas.rei(_rei, true);
            if (movimentos.length) {
                noXequeMateMovs = [{ peca: [_r, _c], movimentos: movimentos }];
                return;
            }
            settings.game.mate = true;
            console.log('Xeque Mate');
            return;
        }
        let _movPossiveis = _mateMovPossiveis([_r, _c], settings.game.xeque[0].atacante);
        $jogadas.rei(_rei, true);
        noXequeMateMovs = [{ peca: [_r, _c], movimentos: movimentos }];
        $(`.peca[data-cor="${$(_rei).attr('data-cor')}"]`).not('[data-tipo="rei"]').each(function (obj) {
            let _pos = $(this).attr('data-pos').split('-').map(Number);
            movimentos = [];
            $jogadas[$(this).attr('data-tipo')](this, true);
            noXequeMateMovs.push({
                peca: [_pos[0], _pos[1]],
                movimentos: movimentos.filter(x => _movPossiveis.some(y => y[0] == x.r && y[1] == x.c))
            });
        });
        if (!noXequeMateMovs.some(x => x.movimentos.length)) {
            settings.game.mate = true;
            console.log('Xeque Mate');
            return;
        }
    }
    const _mateMovPossiveis = (rei, atack) => {
        //DESCUBRIR TODOS MOVIMENTOS PARA FULGA DO XEQUE...
        //SEM O REI
        //[[r,c]]
        let opcoes = [atack, rei];
        let result = [];
        let cont = 0;
        if (opcoes[0][0] < opcoes[1][0]) {
            for (let i = opcoes[0][0]; i <= opcoes[1][0]; i++)
                result.push([i]);
        } else if (opcoes[0][0] > opcoes[1][0]) {
            for (let i = opcoes[0][0]; i >= opcoes[1][0]; i--)
                result.push([i]);
        } else {
            let loop = (opcoes[0][1] - opcoes[1][1]);
            loop = loop < 0 ? loop * -1 : loop;
            for (let i = 0; i <= loop; i++) {
                result.push([opcoes[0][0]])
            }
        }
        if (opcoes[0][1] < opcoes[1][1]) {
            for (let i = opcoes[0][1]; i <= opcoes[1][1]; i++) {
                result[cont].push(i);
                cont++;
            }
        } else if (opcoes[0][1] > opcoes[1][1]) {
            for (let i = opcoes[0][1]; i >= opcoes[1][1]; i--) {
                result[cont].push(i);
                cont++;
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                result[i].push(opcoes[0][1]);
            }
        }
        return result.filter(x => `${x[0]}-${x[1]}` != `${opcoes[1][0]}-${opcoes[1][1]}`);
    }
    const _verificaPeao2 = (casa, mov) => {
        let peao2 = $(casa).attr('data-peao2');
        if (!peao2) return false;
        mov.a = 'atk';
        mov.peao2Atk = peao2.split('-').map(Number);
        return mov;
    };

    const _jogadas = {
        peao: (element, ativo, item, filter) => {
            let isClara = $(element).attr(`data-cor`) == 'clara';
            let pos = _getPosition(element);
            let movs = $peao.getPositions(element, pos, isClara, ativo, filter);
            movs = _filterMovs(element, movs, item);
            $peao.setMov(movs, pos, element, ativo, item);
        },
        torre: (element, ativo, item, filter) => {
            let pos = _getPosition(element);
            let movs = $torre.getPositions(pos, filter);
            movs = _filterMovs(element, movs, item);
            $torre.setMov(movs, pos, element, ativo, item);
        },
        cavalo: (element, ativo, item, filter) => {
            let pos = _getPosition(element);
            let movs = $cavalo.getPositions(pos, filter);
            movs = _filterMovs(element, movs, item);
            $cavalo.setMov(movs, pos, element, ativo, item);
        },
        bispo: (element, ativo, item, filter) => {
            let pos = _getPosition(element);
            let movs = $bispo.getPositions(pos, filter);
            movs = _filterMovs(element, movs, item);
            $bispo.setMov(movs, pos, element, ativo, item);
        },
        rainha: (element, ativo, item, filter) => {
            let pos = _getPosition(element);
            let movs = $torre.getPositions(pos, filter);
            movs = _filterMovs(element, movs, item);
            $torre.setMov(movs, pos, element, ativo, item);
            movs = $bispo.getPositions(pos, filter);
            movs = _filterMovs(element, movs, item);
            $bispo.setMov(movs, pos, element, ativo, item);
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
    window.$verificaXeque = _verificaXeque;
})();