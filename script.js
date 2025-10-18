document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const content = document.querySelector('.content');
    const tocContent = document.getElementById('toc-content');

    function showPage(pageId) {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.sidebar a[href="#${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        loadPageContent(pageId);
        generateTableOfContents(pageId);
    }

    function loadPageContent(pageId) {
        // Remove existing page content except home
        const existingPages = content.querySelectorAll('.page:not(#home)');
        existingPages.forEach(page => page.remove());
        
        // Hide home page if not home
        const homePage = document.getElementById('home');
        if (pageId !== 'home') {
            homePage.classList.remove('active');
        }
        
        // Load external page content
        if (pageId !== 'home') {
            fetch(`${pageId}.html`)
                .then(response => {
                    if (!response.ok) throw new Error('Page not found');
                    return response.text();
                })
                .then(html => {
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    const newPage = temp.firstElementChild;
                    
                    // Add active class and append to content
                    newPage.classList.add('active');
                    content.appendChild(newPage);
                })
                .catch(error => {
                    console.error('Error loading page:', error);
                    tocContent.innerHTML = '<p>Error loading page content.</p>';
                });
        } else {
            homePage.classList.add('active');
        }
    }

    function generateTableOfContents(pageId) {
        const page = document.getElementById(pageId) || document.querySelector('.page.active');
        if (!page) return;
        
        const headings = page.querySelectorAll('h2');
        let tocHTML = '';
        
        if (headings.length === 0) {
            tocHTML = '<p>No table of contents available for this page.</p>';
        } else {
            tocHTML = '<ul>';
            headings.forEach((heading, index) => {
                const headingText = heading.textContent.trim();
                const headingId = `${pageId}-heading-${index}`;
                heading.id = headingId;
                tocHTML += `<li><a href="#${headingId}">${headingText}</a></li>`;
            });
            tocHTML += '</ul>';
        }
        
        tocContent.innerHTML = tocHTML;
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });

    // Initialize with home page
    showPage('home');

    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showPage(hash);
        }
    });
});