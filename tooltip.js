let tooltip;

function render_tooltip(tooltip, chapters) {
    chapters.forEach(chapter => {
        chapter.addEventListener('mouseenter', function() {
            const alt = this.querySelector('img').alt;
            tooltip.textContent = alt;
            tooltip.style.display = 'block';

            // Posicionar el recuadro flotante cerca del div
            const rect = chapter.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + 3}px`;
        });

        chapter.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    });
} 

function define_tooltip() {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = "";
    document.body.appendChild(tooltip);
    return tooltip;
}

document.addEventListener("DOMContentLoaded", () => {
    tooltip = define_tooltip();
})

document.addEventListener("chaptersLoaded", () => {
    const chapters = document.querySelectorAll(".chapter");
    render_tooltip(tooltip, chapters);
})