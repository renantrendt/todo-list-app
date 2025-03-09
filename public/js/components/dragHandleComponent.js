export function createDragHandle() {
    const dragHandle = document.createElement('span');
    dragHandle.textContent = '☰';
    dragHandle.classList.add('drag-handle');
    dragHandle.setAttribute('title', 'Arrastar para reordenar');
    dragHandle.style.position = 'absolute';
    dragHandle.style.right = '10px';
    dragHandle.style.top = '10px';
    
    dragHandle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        console.log('Drag handle mousedown');
    });
    
    dragHandle.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        console.log('Drag handle touchstart');
    }, { passive: true });
    
    return dragHandle;
}
