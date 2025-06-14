async function fetchAgricultureNews(category = 'latest') {
    const apiKey = '7fefd15db3fd4a97a03962e561b97a88'; // Replace with your News API key
    const region = 'Kerala'; // You can make this dynamic based on user location
    
    let query = `agriculture+${region}`;
    if (category !== 'latest') {
        query += `+${category}`;
    }
    
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${apiKey}`);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            const newsContainer = document.querySelector('.news-content');
            newsContainer.innerHTML = ''; // Clear existing news
            
            // Display up to 3 news items
            data.articles.slice(0, 3).forEach(article => {
                const date = new Date(article.publishedAt).toLocaleDateString();
                
                const newsItem = `
                    <div class="news-item">
                        <div class="news-title">${article.title}</div>
                        <div class="news-description">
                            ${article.description ? article.description.substring(0, 100) + '...' : ''}
                        </div>
                        <div class="news-meta">
                            <span class="news-date">${date}</span>
                            <a href="${article.url}" target="_blank" class="read-more">Read More</a>
                        </div>
                    </div>
                `;
                
                newsContainer.innerHTML += newsItem;
            });
        } else {
            const newsContainer = document.querySelector('.news-content');
            newsContainer.innerHTML = '<div class="news-item"><div class="news-title">No news found</div><div class="news-description">No agriculture news is currently available for this category. Please try again later.</div></div>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        const newsContainer = document.querySelector('.news-content');
        newsContainer.innerHTML = '<div class="news-item"><div class="news-title">Error loading news</div><div class="news-description">There was a problem loading the news. Please check your connection and try again.</div></div>';
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchAgricultureNews();
    
    // Setup tab functionality to fetch different types of news
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.style.background = '#f1f1f1';
                btn.style.color = '#333';
            });
            
            // Add active class to clicked button
            this.style.background = '#4CAF50';
            this.style.color = 'white';
            
            // Fetch news based on the selected tab
            const category = this.textContent.toLowerCase();
            fetchAgricultureNews(category);
        });
    });
});