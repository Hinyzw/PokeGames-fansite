
        // Função para atualizar o ícone do perfil
        function updateProfileIcon() {
            const savedTrainer = localStorage.getItem('selectedTrainer');
            const savedImage = localStorage.getItem('selectedTrainerImage');
            
            if (savedTrainer && savedImage) {
                const profileIcon = document.getElementById('profile-icon');
                if (profileIcon) {
                    profileIcon.src = savedImage;
                }
            }
        }
    
        // Atualiza o ícone quando a página carrega
        document.addEventListener('DOMContentLoaded', updateProfileIcon);