document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const scoreBtn = document.getElementById('score-btn');
    const clearBtn = document.getElementById('clear-btn');
    const takeAgainBtn = document.getElementById('take-again-btn');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const shareTextBtn = document.getElementById('share-text-btn');
    const shareXBtn = document.getElementById('share-x-btn');
    const form = document.getElementById('purity-form');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const testContainer = document.getElementById('test-container');
    const resultContainer = document.getElementById('result-container');
    const scoreEl = document.getElementById('score');
    
    let currentScore = 0;

    // Special checkbox animations
    const specialCheckboxes = {
        'q4': { type: 'text', content: 'wowee' },
        'q30': { type: 'text', content: '👀' },
        'q69': { type: 'image', content: 'grok.png' }
    };

    // Function to create and animate overlay
    function showOverlay(config) {
        const overlay = document.createElement('div');
        overlay.className = 'checkbox-overlay';
        
        if (config.type === 'image') {
            const img = document.createElement('img');
            img.src = config.content;
            overlay.appendChild(img);
        } else {
            overlay.textContent = config.content;
        }
        
        document.body.appendChild(overlay);

        // Remove overlay after animation completes
        setTimeout(() => {
            overlay.remove();
        }, 1500);
    }

    // Track individual question clicks
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'question_toggle', {
                    'question_id': e.target.id,
                    'action': e.target.checked ? 'checked' : 'unchecked'
                });
            }
        });
    });

    // Add event listeners to special checkboxes
    Object.keys(specialCheckboxes).forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                // Only trigger animation when checking, not unchecking
                if (e.target.checked) {
                    showOverlay(specialCheckboxes[checkboxId]);
                }
            });
        }
    });

    // Calculate and display score
    scoreBtn.addEventListener('click', () => {
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        currentScore = 100 - checkedCount;

        // Track score submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'score_calculated', {
                'score': currentScore,
                'questions_checked': checkedCount
            });
        }

        scoreEl.textContent = currentScore;
        testContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        window.scrollTo(0, 0);
    });

    // Clear all checkboxes
    clearBtn.addEventListener('click', () => {
        // Track clear action
        if (typeof gtag !== 'undefined') {
            gtag('event', 'clear_checkboxes', {
                'event_category': 'engagement'
            });
        }
        
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
    });

    // Return to test (Take again)
    takeAgainBtn.addEventListener('click', () => {
        // Track take again action
        if (typeof gtag !== 'undefined') {
            gtag('event', 'take_again', {
                'event_category': 'engagement',
                'previous_score': currentScore
            });
        }
        
        // Clear all checkboxes
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        testContainer.style.display = 'block';
        resultContainer.style.display = 'none';
        window.scrollTo(0, 0);
    });
    
    // Share functionality
    function getShareText() {
        return `I scored ${currentScore} on the AI purity test. ${window.location.href}`;
    }
    
    // Copy link
    copyLinkBtn.addEventListener('click', async () => {
        // Track copy link action
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': 'copy_link',
                'content_type': 'score',
                'score': currentScore
            });
        }
        
        const shareText = getShareText();
        try {
            await navigator.clipboard.writeText(shareText);
            const originalText = copyLinkBtn.textContent;
            copyLinkBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyLinkBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            alert('Failed to copy to clipboard');
        }
    });
    
    // Share via Text (SMS)
    shareTextBtn.addEventListener('click', () => {
        // Track share via text action
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': 'sms',
                'content_type': 'score',
                'score': currentScore
            });
        }
        
        const shareText = getShareText();
        const smsLink = `sms:?&body=${encodeURIComponent(shareText)}`;
        window.location.href = smsLink;
    });
    
    // Share on X (Twitter)
    shareXBtn.addEventListener('click', () => {
        // Track share on X action
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': 'twitter',
                'content_type': 'score',
                'score': currentScore
            });
        }
        
        const shareText = getShareText();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    });
});

