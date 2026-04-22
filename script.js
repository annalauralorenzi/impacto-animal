/**
 * Impacto Animal - ALPA
 * Scripts de interatividade do site
 */

(() => {
    'use strict';

    // ==========================================================
    // Header dinâmico (muda ao rolar)
    // ==========================================================
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================================================
    // Menu mobile
    // ==========================================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-link');

    const openMenu = () => nav.classList.add('open');
    const closeMenu = () => nav.classList.remove('open');

    navToggle?.addEventListener('click', openMenu);
    navClose?.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open')
            && !nav.contains(e.target)
            && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // ==========================================================
    // Animações fade-in ao rolar (IntersectionObserver)
    // ==========================================================
    const animatedSelectors = [
        '.section-header',
        '.project-text',
        '.project-card',
        '.pillar',
        '.step',
        '.plan-card',
        '.seal-card',
        '.seal-cta',
        '.partner',
        '.partners-cta',
        '.contact-info',
        '.contact-form',
        '.highlight-card',
        '.month-card',
        '.projection-summary',
        '.results-cta'
    ];

    const animatedEls = document.querySelectorAll(animatedSelectors.join(','));
    animatedEls.forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animatedEls.forEach(el => io.observe(el));

    // ==========================================================
    // Formulário de contato (Formspree)
    // ==========================================================
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    const setFeedback = (message, type = 'info') => {
        if (!feedback) return;
        const colors = {
            info: '',
            warning: '#F4A261',
            success: '#2A9D8F',
            error: '#E76F51'
        };
        feedback.style.color = colors[type] || '';
        feedback.textContent = message;
    };

    // Máscara dinâmica de telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const whatsappInput = form?.querySelector('#whatsapp');
    whatsappInput?.addEventListener('input', (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
        let formatted = digits;
        if (digits.length > 2 && digits.length <= 6) {
            formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        } else if (digits.length > 6 && digits.length <= 10) {
            formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        } else if (digits.length === 11) {
            formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        }
        e.target.value = formatted;
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setFeedback('');

        const data = {
            name: form.name.value.trim(),
            company: form.company.value.trim(),
            email: form.email.value.trim(),
            whatsapp: form.whatsapp.value.trim(),
            message: form.message.value.trim()
        };

        if (!data.name || !data.company || !data.email || !data.whatsapp) {
            setFeedback('Por favor, preencha nome, empresa, e-mail e WhatsApp.', 'warning');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            setFeedback('Informe um e-mail válido.', 'warning');
            return;
        }

        const digitsOnly = data.whatsapp.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 11) {
            setFeedback('Informe um WhatsApp válido com DDD (10 ou 11 dígitos).', 'warning');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        setFeedback('Enviando sua mensagem...', 'info');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                setFeedback('Obrigado! Recebemos sua mensagem e entraremos em contato em breve.', 'success');
                form.reset();
            } else {
                const result = await response.json().catch(() => ({}));
                const msg = result?.errors?.[0]?.message
                    || 'Ops, não conseguimos enviar. Tente novamente em instantes.';
                setFeedback(msg, 'error');
            }
        } catch (err) {
            setFeedback('Falha de conexão. Verifique sua internet e tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }
    });

    // ==========================================================
    // Ano dinâmico no rodapé
    // ==========================================================
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ==========================================================
    // Resultados dinâmicos (página /resultados.html)
    // Lê data/castracoes.json e recalcula:
    //   - total de castrações
    //   - total de microchipagens
    //   - animais potencialmente evitados (método conservador)
    //   - nota de metodologia com a composição real
    // Se o fetch falhar (ex.: file://), mantém os valores estáticos do HTML.
    // ==========================================================
    const statEvitadosEl = document.getElementById('statEvitados');
    if (statEvitadosEl) {
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el != null && value !== undefined && value !== null) {
                el.textContent = value;
            }
        };

        const formatarComposicao = (c) => {
            const partes = [];
            const push = (count, singular, plural) => {
                if (!count) return;
                partes.push(`${count} ${count === 1 ? singular : plural}`);
            };
            push(c.gataFemea, 'gata', 'gatas');
            push(c.cadela, 'cadela', 'cadelas');
            push(c.gatoMacho, 'gato macho', 'gatos machos');
            push(c.caoMacho, 'cão macho', 'cães machos');
            if (partes.length === 0) return '';
            if (partes.length === 1) return partes[0];
            return partes.slice(0, -1).join(', ') + ' e ' + partes[partes.length - 1];
        };

        fetch('data/castracoes.json', { cache: 'no-cache' })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                const c = data.castracoes || {};
                const m = data.multiplicadoresConservadores || {};

                const totalCastracoes =
                    (c.gataFemea || 0) +
                    (c.gatoMacho || 0) +
                    (c.cadela || 0) +
                    (c.caoMacho || 0);

                const totalEvitados =
                    (c.gataFemea || 0) * (m.gataFemea || 0) +
                    (c.gatoMacho || 0) * (m.gatoMacho || 0) +
                    (c.cadela || 0)    * (m.cadela || 0) +
                    (c.caoMacho || 0)  * (m.caoMacho || 0);

                setText('statCastracoes', totalCastracoes);
                setText('statMicrochipagens', data.microchipagens);
                setText('statEvitados', `~${totalEvitados}`);
                setText('periodoResultados', data.atualizadoEm);

                const composicao = formatarComposicao(c);
                const plural = totalCastracoes === 1 ? 'castração realizada' : 'castrações realizadas';
                const nota = `Estimativa conservadora baseada nas ${totalCastracoes} ${plural}`
                    + (composicao ? ` (${composicao}),` : ',')
                    + ' considerando a descendência direta ao longo de ~5 anos de vida reprodutiva.';
                setText('notaEvitados', nota);
            })
            .catch(() => { /* mantém valores estáticos do HTML */ });
    }

    // ==========================================================
    // Destaque do link ativo no menu conforme rola
    // ==========================================================
    const sections = document.querySelectorAll('section[id]');
    const activateLink = () => {
        const scrollY = window.pageYOffset + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (!link) return;
            if (scrollY >= top && scrollY < top + height) {
                link.style.color = 'var(--color-primary)';
            } else {
                link.style.color = '';
            }
        });
    };
    window.addEventListener('scroll', activateLink, { passive: true });
})();
