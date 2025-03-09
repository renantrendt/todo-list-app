export function createTaskInput(taskText, onEnter) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = taskText;
    input.placeholder = 'Tarefa';
    
    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            onEnter(this.value);
            this.blur();
            this.readOnly = true;
            this.addEventListener('click', function() {
                this.readOnly = false;
            }, { once: true });
        }
    });
    
    return input;
}

export function createDurationInput(duration, onEnter) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = duration;
    input.placeholder = 'Tempo (min)';
    
    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            onEnter(this.value);
            this.blur();
            this.readOnly = true;
            this.addEventListener('click', function() {
                this.readOnly = false;
            }, { once: true });
        }
    });
    
    return input;
}
