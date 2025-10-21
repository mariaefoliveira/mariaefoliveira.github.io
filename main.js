function loadProfileImage() {
    const githubUsername = 'mariaefoliveira';
    const profileImageContainer = document.getElementById('profile-image-container');

    if (profileImageContainer && githubUsername) {
        fetch(`https://api.github.com/users/${githubUsername}`)
            .then(response => {
                if (!response.ok) throw new Error('Falha ao buscar dados do usuário GitHub.');
                return response.json();
            })
            .then(data => {
                if (data.avatar_url) {
                    const img = document.createElement('img');
                    img.src = data.avatar_url;
                    img.alt = `Foto de Perfil de ${githubUsername}`;
                    img.className = 'w-36 h-36 rounded-full profile-border object-cover transition-transform image-hover';
                    img.loading = 'lazy';

                    profileImageContainer.innerHTML = '';
                    profileImageContainer.appendChild(img);
                } else {
                    profileImageContainer.innerHTML = '<span class="text-red-500">Erro: Perfil não encontrado!</span>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar a imagem de perfil do GitHub:', error);
                profileImageContainer.innerHTML = `
                    <span class="text-red-500">Erro ao carregar o perfil do GitHub.<br>${error.message}</span>
                `;
            });
    }
}

// ===========================================
// LÓGICA DOS PROJETOS COM FILTRO POR ABAS (Novo Código)
// ===========================================
let allProjectsData = []; // Variável para armazenar todos os projetos

/**
 * Renderiza os projetos filtrados pela categoria.
 * @param {string} category - A categoria a ser exibida ('Dashboard' ou 'Analises').
 */
function renderProjects(category) {
    const projectsGrid = document.getElementById('projetos-grid');
    if (!projectsGrid) return;

    // Limpa o grid antes de renderizar os novos projetos
    projectsGrid.innerHTML = '';

    // Filtra os projetos pela categoria
    const filteredProjects = allProjectsData.filter(project => 
        project.category === category
    );

    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = `
            <p class="text-lg text-muted-foreground text-center col-span-full py-10">
                Ainda não há projetos na categoria "${category}".
            </p>
        `;
        return;
    }

    // Renderiza os projetos filtrados
    filteredProjects.forEach(project => {
        const technologiesHtml = project.tecnologias.map(tech =>
            `<span class="inline-block bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">${tech}</span>`
        ).join('');

        const projectHtml = `
            <div class="bg-card rounded-xl overflow-hidden shadow-xl transition-all duration-300 card-hover border border-border/50">
                <img src="${project.image}" alt="Imagem do Projeto ${project.title}" class="w-full h-48 object-cover">
                <div class="p-6 space-y-4">
                    <h3 class="text-xl font-semibold text-foreground">${project.title}</h3>
                    <p class="text-sm text-muted-foreground">${project.description}</p>
                    <div class="flex flex-wrap gap-2 pt-2">
                        ${technologiesHtml}
                    </div>
                    <div class="pt-4 flex gap-4">
                        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg text-sm font-medium transition flex items-center gap-2">
                            <i class="fas fa-eye"></i> Ver Demo
                        </a>
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-lg text-sm font-medium transition flex items-center gap-2">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    </div>
                </div>
            </div>
        `;
        projectsGrid.insertAdjacentHTML('beforeend', projectHtml);
    });
}

/**
 * Atualiza o estilo visual dos botões de aba (Estado Ativo/Inativo).
 * @param {string} activeCategory - A categoria que deve estar ativa.
 */
function updateTabStyles(activeCategory) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        const category = btn.getAttribute('data-category');
        const isSelected = category === activeCategory;

        // Limpa estilos de todos
        btn.classList.remove('bg-accent', 'text-accent-foreground');
        btn.classList.remove('text-muted-foreground', 'hover:text-foreground', 'hover:bg-secondary');
        
        if (isSelected) {
            // Estilos para botão ATIVO (Destacado)
            btn.classList.add('bg-accent', 'text-accent-foreground', 'hover:bg-accent/80');
            btn.setAttribute('aria-selected', 'true');
        } else {
            // Estilos para botões INATIVOS (Secundário)
            btn.classList.add('text-muted-foreground', 'hover:text-foreground', 'hover:bg-secondary');
            btn.setAttribute('aria-selected', 'false');
        }
    });
}


/**
 * Função principal para carregar os dados e configurar os ouvintes de evento das abas.
 */
function initProjects() {
    fetch('projects.json')
        .then(response => {
            if (!response.ok) throw new Error(`Falha ao carregar projects.json. Status: ${response.status}`);
            return response.json();
        })
        .then(projects => {
            allProjectsData = projects; // Salva todos os dados na variável global
            
            // 1. Configura os ouvintes de evento para os botões das abas
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    
                    // Atualiza a aparência e renderiza o conteúdo
                    updateTabStyles(category);
                    renderProjects(category);

                    // Opcional: Rola para o topo da seção de projetos
                    document.getElementById('projetos').scrollIntoView({ behavior: 'smooth' });
                });
            });

            // 2. Renderiza a aba padrão ('Dashboard') na primeira carga
            updateTabStyles('Dashboard');
            renderProjects('Dashboard');
        })
        .catch(error => {
            console.error('Erro ao carregar ou processar os projetos:', error);
            const projectsGrid = document.getElementById('projetos-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = `<p class="text-lg text-red-500 text-center col-span-full">
                    Não foi possível carregar os projetos. Verifique o arquivo projects.json e o console.
                </p>`;
            }
        });
}

// Chame as funções de inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadProfileImage();
    initProjects(); // Chama a função principal que gerencia as abas
});


