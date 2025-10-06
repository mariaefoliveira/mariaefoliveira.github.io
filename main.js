// Inicialização ao carregar a página (apenas projetos)
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

// Função para carregar e renderizar projetos
function loadProjects() {
    fetch('projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar projects.json');
            return response.json();
        })
        .then(data => {
            // Ordena por data (mais recente primeiro)
            const sortedProjects = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            renderProjects(sortedProjects);
        })
        .catch(error => {
            console.error('Erro ao carregar projetos:', error);
            const grid = document.getElementById('projetos-grid');
            grid.innerHTML = '<p class="text-center text-muted-foreground col-span-full">Erro ao carregar projetos. Verifique o arquivo projects.json.</p>';
        });
}

// Função para renderizar os cards de projetos
function renderProjects(projetos) {
    const grid = document.getElementById('projetos-grid');
    grid.innerHTML = ''; // Limpa o grid

    projetos.forEach(projeto => {
        const card = document.createElement('div');
        card.className = 'card-hover overflow-hidden bg-card/50 backdrop-blur-sm border-glass-border rounded-lg hover:border-accent/50 transition-all duration-300';

        let imageHtml = '';
        if (projeto.image) {
            imageHtml = `
                <div class="overflow-hidden h-48 bg-gradient-primary">
                    <img src="${projeto.image}" alt="${projeto.title}" class="w-full h-full object-cover image-hover" loading="lazy">
                </div>
            `;
        }

        card.innerHTML = `
            ${imageHtml}
            <div class="p-6 space-y-4">
                <div>
                    <h3 class="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">${projeto.title}</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">${projeto.description}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${projeto.tecnologias.map(tech => `<span class="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border">${tech}</span>`).join('')}
                </div>
                <div class="flex gap-3 pt-2">
                    <a href="${projeto.githubUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 px-4 py-2 bg-transparent border border-border hover:border-accent hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition btn-hover flex items-center justify-center gap-2">
                        <i class="fab fa-github w-4 h-4"></i> Código
                    </a>
                    <a href="${projeto.demoUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 px-4 py-2 bg-gradient-primary hover:opacity-90 rounded-md text-sm font-medium transition text-primary-foreground flex items-center justify-center gap-2">
                        <i class="fas fa-external-link-alt w-4 h-4"></i> Demo
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}
