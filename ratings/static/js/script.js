const API_BASE_URL = 'http://127.0.0.1:8000/ratings/api/ratings/';

let currentRating = 0;
let allRatings = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Ratings App Initialized");
    const elements = {
        form: document.getElementById('reviewForm'),
        ratingValue: document.getElementById('ratingValue'),
        feedback: document.getElementById('feedback'),
        customerMobile: document.getElementById('customerMobile'),
        partnerMobile: document.getElementById('partnerMobile'),
        reviewsList: document.getElementById('reviewsList'),
        avgRating: document.getElementById('avgRating'),
        avgStars: document.getElementById('avgStars'),
        totalReviews: document.getElementById('totalReviews'),
        ratingBars: document.getElementById('ratingBars'),
        ratingFilter: document.getElementById('ratingFilter'),
        sortFilter: document.getElementById('sortFilter'),
        submitBtn: document.getElementById('submitBtn')
    };
    
    let allGood = true;
    for (let [name, el] of Object.entries(elements)) {
        if (!el) {
            console.error(`❌ Missing element: ${name}`);
            allGood = false;
        } else {
            console.log(`✅ Found: ${name}`);
        }
    }
    
    if (!allGood) {
        console.error("Fix missing elements in HTML");
        return;
    }
    
    setupStarRating();

    elements.form.addEventListener('submit', submitReview);
    elements.ratingFilter.addEventListener('change', filterReviews);
    elements.sortFilter.addEventListener('change', filterReviews);
    
    fetchRatings();
});

function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    console.log(`⭐ Found ${stars.length} stars`);
    
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            currentRating = parseInt(e.target.dataset.rating);
            document.getElementById('ratingValue').value = currentRating;
            updateStarDisplay(currentRating);
            console.log(`⭐ Rating selected: ${currentRating}`);
        });
        
        star.addEventListener('mouseover', (e) => {
            const hoverRating = parseInt(e.target.dataset.rating);
            updateStarDisplay(hoverRating);
        });
        
        star.addEventListener('mouseout', () => {
            updateStarDisplay(currentRating);
        });
    });
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fa-solid fa-star';
        } else {
            star.className = 'fa-regular fa-star';
        }
    });
}

async function fetchRatings() {
    try {
        console.log("📡 Fetching ratings...");
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        allRatings = await response.json();
        console.log(`✅ Received ${allRatings.length} ratings`);
        
        displayRatings(allRatings);
        updateRatingSummary(allRatings);
        
    } catch (error) {
        console.error("❌ Fetch error:", error);
        document.getElementById('reviewsList').innerHTML = `
            <div class="error">
                Failed to load reviews. Make sure server is running.
            </div>
        `;
    }
}

function displayRatings(ratings) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (ratings.length === 0) {
        reviewsList.innerHTML = '<div class="loading">No reviews yet</div>';
        return;
    }
    
    reviewsList.innerHTML = ratings.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">📱 ${r.customer_mobile || 'Unknown'}</span>
                    <div class="review-stars">
                        ${generateStars(r.rating)}
                    </div>
                </div>
            </div>
            <div class="partner-name">Partner: ${r.partner_mobile || 'Unknown'}</div>
            ${r.feedback ? `<p class="review-text">"${r.feedback}"</p>` : ''}
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? 
            '<i class="fa-solid fa-star"></i>' : 
            '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

function updateRatingSummary(ratings) {
    if (ratings.length === 0) return;
    
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    document.getElementById('avgRating').textContent = avg.toFixed(1);
    document.getElementById('avgStars').innerHTML = generateStars(Math.round(avg));
    document.getElementById('totalReviews').textContent = 
        `${ratings.length} ${ratings.length === 1 ? 'review' : 'reviews'}`;
    
    const dist = [0, 0, 0, 0, 0];
    ratings.forEach(r => dist[r.rating - 1]++);
    
    const barsHtml = dist.map((count, i) => {
        const percentage = (count / ratings.length) * 100;
        return `
            <div class="rating-bar-item">
                <span>${i + 1} ★</span>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="bar-count">${count}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('ratingBars').innerHTML = barsHtml;
}

async function submitReview(e) {
    e.preventDefault();
    
    const rating = currentRating;
    const feedback = document.getElementById('feedback').value;
    const customer = document.getElementById('customerMobile').value;
    const partner = document.getElementById('partnerMobile').value;
    
    if (!rating) {
        alert('Please select a rating');
        return;
    }
    
    if (!customer) {
        alert('Please enter customer ID');
        return;
    }
    
    if (!partner) {
        alert('Please enter partner ID');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    const formData = {
        rating: rating,
        feedback: feedback,
        customer_mobile:customer,
        partner_mobile: partner
    };
    
    console.log("📦 Submitting:", formData);
    
    try {
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        
        const result = await response.json();
        console.log("✅ Success:", result);
        
        alert('✅ Review submitted successfully!');
        
        document.getElementById('reviewForm').reset();
        currentRating = 0;
        updateStarDisplay(0);
        
        fetchRatings();
        
    } catch (error) {
        console.error("❌ Error:", error);
        alert('Failed to submit review. Check console for details.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
    }
}

function filterReviews() {
    const ratingFilter = parseInt(document.getElementById('ratingFilter').value);
    const sortFilter = document.getElementById('sortFilter').value;
    
    let filtered = [...allRatings];
    
    if (ratingFilter > 0) {
        filtered = filtered.filter(r => r.rating === ratingFilter);
    }
    
    switch(sortFilter) {
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        case 'highest':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            filtered.sort((a, b) => a.rating - b.rating);
            break;
    }
    
    displayRatings(filtered);
}