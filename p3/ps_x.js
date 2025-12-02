(function(){
    'use strict';

    const form = document.querySelector('.registration-form');
    if (!form) return;

    function makeErrorEl(msg){
        const el = document.createElement('div');
        el.className = 'form-error';
        el.textContent = msg;
        return el;
    }

    function setError(input, msg){
        const group = input.closest('.form-group') || input.parentElement;
        clearError(input);
        const err = makeErrorEl(msg);
        group.appendChild(err);
        input.setAttribute('aria-invalid','true');
    }

    function clearError(input){
        const group = input.closest('.form-group') || input.parentElement;
        const prev = group.querySelector('.form-error');
        if (prev) prev.remove();
        input.removeAttribute('aria-invalid');
    }

    function validateEmail(email){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone){
        
        const digits = phone.replace(/[^0-9]/g,'');
        return digits.length >= 7 && digits.length <= 15;
    }

    function showAlert(message, type = 'success'){
        
        const existing = form.querySelector('.form-alert');
        if (existing) existing.remove();
        const alert = document.createElement('div');
        alert.className = `form-alert alert alert-${type}`;
        alert.setAttribute('role','status');
        alert.setAttribute('aria-live','polite');
        alert.textContent = message;
        form.prepend(alert);
        
        if (type === 'success') setTimeout(()=> alert.remove(), 4000);
    }

    
    form.addEventListener('input', (e)=>{
        const t = e.target;
        if (t && (t.matches('input') || t.matches('select') || t.matches('textarea'))){
            clearError(t);
        }
    });

    
    form.addEventListener('reset', ()=>{
        const errs = form.querySelectorAll('.form-error');
        errs.forEach(n=>n.remove());
        const alert = form.querySelector('.form-alert');
        if (alert) alert.remove();
    });

    form.addEventListener('submit', function(evt){
        evt.preventDefault();
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');
        const confirm = form.querySelector('#confirm');
        const phone = form.querySelector('#number');

        let valid = true;

        if (!name || !name.value.trim()){
            valid = false;
            setError(name, 'Please enter your name.');
        }

        if (!email || !email.value.trim() || !validateEmail(email.value.trim())){
            valid = false;
            setError(email, 'Please enter a valid email address.');
        }

        if (!password || password.value.length < 8){
            valid = false;
            setError(password, 'Password must be at least 8 characters.');
        }

        if (!confirm || confirm.value !== password.value){
            valid = false;
            setError(confirm, 'Passwords do not match.');
        }

        if (phone && phone.value.trim()){
            if (!validatePhone(phone.value.trim())){
                valid = false;
                setError(phone, 'Enter a valid phone number (7–15 digits).');
            }
        }

        if (!valid){
            showAlert('Please fix the errors above and try again.', 'danger');
            return;
        }

        
        showAlert('Registration successful — thank you!', 'success');

        
        
        const controls = form.querySelectorAll('input,select,button,textarea');
        controls.forEach(c => c.disabled = true);

        setTimeout(()=>{
            controls.forEach(c => c.disabled = false);
            form.reset();
        }, 1200);
    });

})();