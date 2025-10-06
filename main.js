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

function loadProjects() {
    fetch('projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar projetos.');
            return response.json();
        })
        .then(projects => {
            const grid = document.getElementById('projetos-grid');
            if (!grid) return;
            grid.innerHTML = '';
            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'bg-card rounded-xl shadow-lg p-6 flex flex-col gap-4 card-hover transition h-full';
                card.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover rounded-lg mb-4 image-hover transition" loading="lazy">
                    <h3 class="text-xl font-bold text-foreground">${project.title}</h3>
                    <p class="text-muted-foreground mb-2">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-2">
                        ${project.tecnologias.map(tec => `<span class="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">${tec}</span>`).join('')}
                    </div>
                    <div class="flex gap-3 mt-auto">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline flex items-center gap-1"><i class="fab fa-github"></i> Código</a>
                        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline flex items-center gap-1"><i class="fas fa-external-link-alt"></i> Demo</a>
                    </div>
                `;
                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar projetos:', error);
            const grid = document.getElementById('projetos-grid');
            if (grid) grid.innerHTML = '<p class="text-red-500">Não foi possível carregar os projetos.</p>';
        });
}

// Garanta que ambas funções sejam chamadas
document.addEventListener('DOMContentLoaded', () => {
    loadProfileImage();
    loadProjects();
});
