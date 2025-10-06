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
