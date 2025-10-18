document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const content = document.querySelector('.content');
    const tocContent = document.getElementById('toc-content');

    function showPage(pageId) {
        sidebarLinks.forEach(link => link.classList.remove('active'));
        
        const activeLink = document.querySelector(`.sidebar a[href="#${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        loadPageContent(pageId);
    }

    function loadPageContent(pageId) {
        // Remove existing page content except home
        const existingPages = content.querySelectorAll('.page:not(#home)');
        existingPages.forEach(page => page.remove());
        
        const homePage = document.getElementById('home');
        if (pageId !== 'home') {
            homePage.classList.remove('active');
        }

        // Load external page content dynamically
        if (pageId !== 'home') {
            fetch(`${pageId}.html`)
                .then(response => {
                    if (!response.ok) throw new Error('Page not found');
                    return response.text();
                })
                .then(html => {
                    const temp = document.createElement('div');
                    temp.innerHTML = html;

                    // Take all children, wrap in a .page container if needed
                    const newPage = document.createElement('div');
                    newPage.classList.add('page', 'active');
                    newPage.id = pageId;
                    newPage.innerHTML = temp.innerHTML;

                    content.appendChild(newPage);

                    // ✅ FIX: Generate TOC AFTER new content is inserted
                    generateTableOfContents(newPage);
                })
                .catch(error => {
                    console.error('Error loading page:', error);
                    tocContent.innerHTML = '<p>Error loading page content.</p>';
                });
        } else {
            homePage.classList.add('active');
            // ✅ FIX: Also regenerate TOC for home page if needed
            generateTableOfContents(homePage);
        }
    }

    function generateTableOfContents(pageElement) {
        if (!pageElement) return;

        const headings = pageElement.querySelectorAll('h2, h3'); // include h3 for better depth
        let tocHTML = '';

        if (headings.length === 0) {
            tocHTML = '<p>No table of contents available for this page.</p>';
        } else {
            tocHTML = '<ul>';
            headings.forEach((heading, index) => {
                const headingText = heading.textContent.trim();
                const headingId = `${pageElement.id}-heading-${index}`;
                heading.id = headingId;
                tocHTML += `<li><a href="#${headingId}">${headingText}</a></li>`;
            });
            tocHTML += '</ul>';
        }

        tocContent.innerHTML = tocHTML;
    }

    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });

    // Initialize with home page
    showPage('home');

    // Handle hash changes (e.g. direct links)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showPage(hash);
        }
    });
});
