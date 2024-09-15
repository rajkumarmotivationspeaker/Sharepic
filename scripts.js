document.addEventListener('DOMContentLoaded', function () {
    loadImages();
});

// Toggle upload form visibility
function toggleUploadForm() {
    const form = document.getElementById('upload-form');
    const plusIcon = document.getElementById('plus-icon');
    
    if (form.style.display === 'flex') {
        form.style.display = 'none';
        plusIcon.style.display = 'block';
    } else {
        form.style.display = 'flex';
        plusIcon.style.display = 'none';
    }
}

// Handle image upload
function uploadImage() {
    const input = document.getElementById('upload-input');
    const captionInput = document.getElementById('caption-input');
    const file = input.files[0];
    const caption = captionInput.value || 'No caption';

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageSrc = e.target.result;

            const storedImages = JSON.parse(localStorage.getItem('images')) || [];
            const storedCaptions = JSON.parse(localStorage.getItem('captions')) || [];
            const storedLikes = JSON.parse(localStorage.getItem('likes')) || [];

            storedImages.push(imageSrc);
            storedCaptions.push(caption);
            storedLikes.push(0); // Initialize like count

            localStorage.setItem('images', JSON.stringify(storedImages));
            localStorage.setItem('captions', JSON.stringify(storedCaptions));
            localStorage.setItem('likes', JSON.stringify(storedLikes));

            captionInput.value = '';
            input.value = '';

            setTimeout(() => {
                loadImages();
                toggleUploadForm();
            }, 500);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image to upload.');
    }
}

// Load images, captions, and likes
function loadImages() {
    const gallery = document.getElementById('gallery');
    const storedImages = JSON.parse(localStorage.getItem('images')) || [];
    const storedCaptions = JSON.parse(localStorage.getItem('captions')) || [];
    const storedLikes = JSON.parse(localStorage.getItem('likes')) || [];

    gallery.innerHTML = '';

    storedImages.forEach((imageSrc, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = storedCaptions[index];

        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = storedCaptions[index];

        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.innerHTML = `
            <span class="like-icon">❤️</span>
            <span class="like-count">${storedLikes[index]}</span>
        `;
        likeButton.addEventListener('click', () => {
            toggleLike(index);
        });

        imageItem.appendChild(img);
        imageItem.appendChild(caption);
        imageItem.appendChild(likeButton);

        gallery.appendChild(imageItem);
    });
}

// Toggle like button
function toggleLike(index) {
    const storedLikes = JSON.parse(localStorage.getItem('likes')) || [];
    const currentLikes = storedLikes[index] || 0;

    storedLikes[index] = currentLikes + 1;
    localStorage.setItem('likes', JSON.stringify(storedLikes));
    
    loadImages(); // Reload images to update like count
}
