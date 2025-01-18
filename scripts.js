class AlbumCarousel {
    constructor() {
        this.albums = [
            { 
                id: 1, 
                src: "Images/Album/BrasilianSkies.jpg", 
                alt: "Album 1",
                rating: [1, 1, 1, 2, 0], // [full, full, full, half, empty]
                review: "A masterpiece of Brazilian jazz fusion, featuring intricate rhythms and melodic complexity."
            },
            { 
                id: 2, 
                src: "Images/Album/ClubedaEsquina.jpg", 
                alt: "Album 2",
                rating: [1, 1, 1, 1, 1], // All full stars
                review: "Milton Nascimento's magnum opus, a perfect blend of MPB and progressive rock."
            },
            { 
                id: 3, 
                src: "Images/Album/FloatingPoints.jpg", 
                alt: "Album 3",
                rating: [1, 1, 1, 1, 0], // Four full stars
                review: "Electronic experimentation meets jazz in this groundbreaking album."
            },
            { 
                id: 4, 
                src: "Images/Album/Gingko.jpg", 
                alt: "Album 4",
                rating: [1, 1, 1, 0, 0], // Three full stars
                review: "A beautiful ambient journey through minimalist soundscapes."
            },
            { 
                id: 5, 
                src: "Images/Album/Hexalogy.jpg", 
                alt: "Album 5",
                rating: [1, 1, 1, 2, 0], // Three and a half stars
                review: "An ambitious six-part series that pushes musical boundaries."
            },
            { 
                id: 6, 
                src: "Images/Album/IGOR.jpg", 
                alt: "Album 6",
                rating: [1, 1, 1, 1, 2], // Four and a half stars
                review: "Tyler, The Creator's most cohesive and mature work to date."
            }
        ];
        
        this.transitioning = false;
        this.wrapper = document.getElementById('carouselWrapper');
        this.prevButton = document.getElementById('nextButton');
        this.nextButton = document.getElementById('prevButton');
        
        this.init();
    }

    init() {
        this.renderAlbums();
        this.setupEventListeners();
    }

    getPositionStyles(index) {
        return {
            zIndex: this.albums.length - index,
            transform: `translateX(${index * 20}px`,

        };
    }

    renderAlbums() {
        this.wrapper.innerHTML = '';
        this.albums.forEach((album, index) => {
            const albumElement = document.createElement('div');
            albumElement.className = 'album';
            
            const styles = this.getPositionStyles(index);
            Object.assign(albumElement.style, {
                zIndex: styles.zIndex,
                transform: styles.transform,
                opacity: styles.opacity
            });

            const img = document.createElement('img');
            img.src = album.src;
            img.alt = album.alt;

            albumElement.appendChild(img);
            this.wrapper.appendChild(albumElement);
        });
    }
    

    setupEventListeners() {
        this.prevButton.addEventListener('click', () => this.rotate('left'));
        this.nextButton.addEventListener('click', () => this.rotate('right'));
    }

    rotate(direction) {
        if (this.transitioning) return;
        
        this.transitioning = true;
        this.prevButton.disabled = true;
        this.nextButton.disabled = true;

        const albums = Array.from(this.wrapper.children);
        
        if (direction === 'right') {
            // Animate first album out to top
            albums.forEach((album, index) => {
                if (index === 0) {
                    album.style.opacity = '0';
                    album.style.transform = 'translate(10px, -100%) rotate(-10deg)';
                } else {
                    const newStyles = this.getPositionStyles(index - 1);
                    album.style.transform = newStyles.transform;
                    album.style.opacity = newStyles.opacity;
                    album.style.zIndex = newStyles.zIndex;
                }
            });

            setTimeout(() => {
                this.albums.push(this.albums.shift());
                this.renderAlbums();
                
                setTimeout(() => {
                    this.transitioning = false;
                    this.prevButton.disabled = false;
                    this.nextButton.disabled = false;
                }, 500);
            }, 500);
        } else {
            // Create and animate the incoming album
            const newAlbum = document.createElement('div');
            newAlbum.className = 'album';
            const lastAlbum = this.albums[this.albums.length - 1];
            
            // Set initial position (off-screen to the left and rotated)
            newAlbum.style.transform = 'translate(-100px, 10px) rotate(10deg)';
            newAlbum.style.opacity = '0';
            newAlbum.style.zIndex = this.albums.length + 1;

            const img = document.createElement('img');
            img.src = lastAlbum.src;
            img.alt = lastAlbum.alt;
            newAlbum.appendChild(img);
            this.wrapper.insertBefore(newAlbum, this.wrapper.firstChild);

            // Animate other albums back
            albums.forEach((album, index) => {
                const newStyles = this.getPositionStyles(index + 1);
                album.style.transform = newStyles.transform;
                album.style.opacity = newStyles.opacity;
                album.style.zIndex = newStyles.zIndex;
            });

            // Animate new album in
            setTimeout(() => {
                newAlbum.style.transform = this.getPositionStyles(0).transform;
                newAlbum.style.opacity = '1';
            }, 50);

            setTimeout(() => {
                this.albums.unshift(this.albums.pop());
                this.renderAlbums();
                
                setTimeout(() => {
                    this.transitioning = false;
                    this.prevButton.disabled = false;
                    this.nextButton.disabled = false;
                }, 500);
            }, 500);
        }
    }
}

// Initialize the carousel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AlbumCarousel();
});