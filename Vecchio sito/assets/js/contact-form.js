/**
 * Local Contact Form Handler - Ingenio by Tutor Consulting
 * Initializes searchable Provincia select (Choices.js), international phone input (intl-tel-input),
 * client-side validation in Italian, and mailto: submission with on-screen confirmation.
 */
(function () {
    'use strict';

    var MESSAGES = {
        required: 'Questo campo è obbligatorio.',
        email: 'Inserisci un indirizzo email valido.',
        phone: 'Inserisci un numero di telefono valido.'
    };

    var RECIPIENT = 'commerciale@tutorconsulting.it';

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('ing-form-form-242');
        if (!form) return;

        var itiInstance = null;
        var choicesInstance = null;

        // 1. Initialize international phone input (default Italy +39, 100% local)
        var phoneInput = document.getElementById('ing-form-242-field_3');
        if (phoneInput && typeof window.intlTelInput === 'function') {
            itiInstance = window.intlTelInput(phoneInput, {
                initialCountry: 'it',
                preferredCountries: ['it', 'ch', 'sm', 'fr', 'de', 'gb', 'us'],
                countrySearch: false,
                fixDropdownWidth: false,
                countryListAriaLabel: 'Elenco dei paesi'
            });
        }

        // 2. Initialize Choices.js on Provincia select
        var selectEl = document.getElementById('ing-form-242-field_4');
        if (selectEl && typeof window.Choices === 'function') {
            choicesInstance = new window.Choices(selectEl, {
                searchEnabled: true,
                removeItems: true,
                removeItemButton: true,
                shouldSort: false,
                fuseOptions: { threshold: 0.1, distance: 1000 },
                loadingText: 'In caricamento ...',
                noResultsText: 'Nessun risultato trovato',
                noChoicesText: 'Non ci sono elementi tra cui scegliere',
                itemSelectText: '',
                callbackOnCreateTemplates: function () {
                    return {
                        option: function (item) {
                            var opt = window.Choices.defaults.templates.option.call(this, item);
                            if (item.placeholder === true) {
                                opt.classList.add('placeholder');
                            }
                            return opt;
                        }
                    };
                }
            });

            var choicesWrapper = selectEl.closest('.choices');
            if (choicesWrapper) {
                choicesWrapper.addEventListener('click', function (e) {
                    if (
                        choicesWrapper.classList.contains('is-open') &&
                        (e.target.classList.contains('choices__inner') || e.target.classList.contains('choices__arrow'))
                    ) {
                        choicesInstance.hideDropdown();
                    }
                });
            }
        }

        // 3. Field validation helpers
        function clearError(input) {
            input.classList.remove('ing-form-error');
            input.setAttribute('aria-invalid', 'false');
            var parentBlock = input.closest('.ing-form-field-row-block') || input.closest('.iti') || input.parentElement;
            var errId = input.id + '-error';
            var existing = document.getElementById(errId);
            if (existing) existing.remove();
            var fieldWrap = input.closest('.ing-form-field');
            if (fieldWrap && !fieldWrap.querySelector('input.ing-form-error, select.ing-form-error, textarea.ing-form-error')) {
                fieldWrap.classList.remove('ing-form-has-error');
            }
            if (parentBlock && parentBlock.classList) {
                parentBlock.classList.remove('ing-form-has-error');
            }
        }

        function setError(input, message) {
            clearError(input);
            input.classList.add('ing-form-error');
            input.setAttribute('aria-invalid', 'true');
            var fieldWrap = input.closest('.ing-form-field');
            if (fieldWrap) fieldWrap.classList.add('ing-form-has-error');

            var errEl = document.createElement('em');
            errEl.id = input.id + '-error';
            errEl.className = 'ing-form-error';
            errEl.setAttribute('role', 'alert');
            errEl.textContent = message;

            var itiWrap = input.closest('.iti');
            if (itiWrap && itiWrap.parentElement) {
                itiWrap.insertAdjacentElement('afterend', errEl);
            } else {
                input.insertAdjacentElement('afterend', errEl);
            }
        }

        function validateField(input) {
            var val = (input.value || '').trim();
            if (input.hasAttribute('required') && !val) {
                setError(input, MESSAGES.required);
                return false;
            }
            if (input.type === 'email' && val) {
                var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!emailRe.test(val)) {
                    setError(input, MESSAGES.email);
                    return false;
                }
            }
            if (input.type === 'tel' && val) {
                var digits = val.replace(/\D/g, '');
                if (!/^[\d()\-+\s]+$/.test(val) || digits.length < 6 || digits.length > 16) {
                    setError(input, MESSAGES.phone);
                    return false;
                }
            }
            clearError(input);
            return true;
        }

        var trackedInputs = form.querySelectorAll(
            '#ing-form-242-field_1, #ing-form-242-field_2, #ing-form-242-field_2-last, #ing-form-242-field_3, #ing-form-242-field_6, #ing-form-242-field_5'
        );
        trackedInputs.forEach(function (inp) {
            inp.addEventListener('blur', function () {
                if (inp.value.trim() || inp.classList.contains('ing-form-error')) {
                    validateField(inp);
                }
            });
            inp.addEventListener('input', function () {
                if (inp.classList.contains('ing-form-error')) {
                    validateField(inp);
                }
            });
        });

        // 4. Form submission -> validate -> mailto + inline confirmation
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Honeypot check
            var honeypot = document.getElementById('ing-form-242-field_7');
            if (honeypot && honeypot.value.trim() !== '') {
                return;
            }

            var firstInvalid = null;
            var allValid = true;
            trackedInputs.forEach(function (inp) {
                if (!validateField(inp)) {
                    allValid = false;
                    if (!firstInvalid) firstInvalid = inp;
                }
            });

            if (!allValid) {
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            var ragioneSociale = document.getElementById('ing-form-242-field_1').value.trim();
            var nome = document.getElementById('ing-form-242-field_2').value.trim();
            var cognome = document.getElementById('ing-form-242-field_2-last').value.trim();
            var rawPhone = phoneInput ? phoneInput.value.trim() : '';
            var phoneFormatted = rawPhone;
            if (rawPhone && itiInstance && typeof itiInstance.getSelectedCountryData === 'function') {
                var cData = itiInstance.getSelectedCountryData();
                if (cData && cData.dialCode && rawPhone.indexOf('+') !== 0) {
                    phoneFormatted = '+' + cData.dialCode + ' ' + rawPhone;
                }
            }
            var email = document.getElementById('ing-form-242-field_6').value.trim();
            var citta = document.getElementById('ing-form-242-field_5').value.trim();
            var provincia = selectEl ? (selectEl.value || '').trim() : '';

            var subject = 'Richiesta contatto dal sito INGENIO - ' + ragioneSociale;
            var bodyLines = [
                'Buongiorno,',
                '',
                'è stata compilata una nuova richiesta di contatto dal sito Ingenio:',
                '',
                '• Ragione sociale: ' + ragioneSociale,
                '• Referente: ' + nome + ' ' + cognome,
                '• Cellulare: ' + (phoneFormatted || 'Non specificato'),
                '• Email: ' + email,
                '• Città: ' + citta,
                '• Provincia: ' + (provincia || 'Non specificata'),
                ''
            ];
            var mailtoUrl =
                'mailto:' +
                RECIPIENT +
                '?subject=' +
                encodeURIComponent(subject) +
                '&body=' +
                encodeURIComponent(bodyLines.join('\r\n'));

            // Open default email client
            window.location.href = mailtoUrl;

            // Show inline confirmation box
            var existingConf = document.getElementById('ing-form-confirmation-242');
            if (existingConf) existingConf.remove();

            var conf = document.createElement('div');
            conf.id = 'ing-form-confirmation-242';
            conf.className = 'ing-form-confirmation-box';
            conf.setAttribute('role', 'status');
            conf.innerHTML =
                '<h4>Richiesta pronta per l’invio</h4>' +
                '<p>Grazie <strong></strong>, abbiamo preparato l’email indirizzata a <strong>commerciale@tutorconsulting.it</strong> con i dati inseriti. Conferma l’invio dal tuo programma di posta elettronica.</p>' +
                '<div class="ing-form-confirmation-actions">' +
                '<a class="btn-mailto-direct" href="' + mailtoUrl.replace(/"/g, '&quot;') + '">Apri di nuovo l’email</a>' +
                '<button type="button" class="btn-reset-form">Compila una nuova richiesta</button>' +
                '</div>';
            conf.querySelector('strong').textContent = nome + ' ' + cognome;

            form.style.display = 'none';
            form.parentElement.appendChild(conf);

            conf.querySelector('.btn-reset-form').addEventListener('click', function () {
                form.reset();
                if (choicesInstance) {
                    choicesInstance.destroy();
                    selectEl.selectedIndex = 0;
                    choicesInstance.init();
                }
                conf.remove();
                form.style.display = '';
            });
        });
    });
})();
