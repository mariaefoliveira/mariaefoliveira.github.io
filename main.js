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

// ----------------------------------------------------
// NOVO CÓDIGO: Função para carregar e exibir os projetos
// ----------------------------------------------------
function loadProjects() {
    const projectsGrid = document.getElementById('projetos-grid');
    if (!projectsGrid) return; // Sai se o container não existir

    // Caminho do arquivo JSON (deve estar na raiz)
    fetch('projects.json')
        .then(response => {
            if (!response.ok) throw new Error(`Falha ao carregar projects.json. Status: ${response.status}`);
            return response.json();
        })
        .then(projects => {
            projects.forEach(project => {
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
        })
        .catch(error => {
            console.error('Erro ao carregar os projetos:', error);
            projectsGrid.innerHTML = `<p class="text-lg text-red-500 text-center col-span-full">
                Não foi possível carregar os projetos. Verifique o arquivo projects.json e o console do navegador.
            </p>`;
        });
}

// Chame a função ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadProfileImage();
});

