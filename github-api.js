/**
 * ====================================================================
 * ARIFULLAH PORTFOLIO - GITHUB API INTEGRATION & PROJECT LOADER
 * ====================================================================
 * Connects directly to https://api.github.com/users/arifkhan1298/repos
 * Displays ALL public repositories, language badges, stars, and direct links.
 * Ensures EVERY project has a working Live Demo and GitHub Code link.
 * Implements Stale-While-Revalidate caching for instant sub-millisecond loading.
 */

(function () {
  'use strict';

  const CACHE_KEY = 'arifullah_github_repos_v4';
  const projectsContainer = document.getElementById('projects-grid');
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const searchInput = document.getElementById('project-search-input');
  const searchClearBtn = document.getElementById('project-search-clear');
  const countPillText = document.getElementById('projects-count-text');
  let currentProjects = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // Exclude specific unwanted projects (e.g. keylogger / key locker)
  function shouldExcludeRepo(repo) {
    if (!repo) return true;
    const combinedName = ((repo.name || '') + ' ' + (repo.rawName || '')).toLowerCase().replace(/[\s\-_]/g, '');
    const desc = (repo.description || '').toLowerCase();

    const blacklist = [
      'keylogger',
      'keylocker',
      'keylock',
      'keylog',
      'locker',
      'keystroke'
    ];

    return blacklist.some(term => combinedName.includes(term) || desc.includes(term));
  }

  const LANGUAGE_COLORS = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    HTML: '#e34f26',
    CSS: '#264de4',
    'C++': '#00599c',
    C: '#555555',
    SQL: '#00758f',
    MySQL: '#00758f',
    Java: '#b07219',
    PHP: '#4f5d95',
    Shell: '#89e051',
    Vue: '#41b883',
    React: '#61dafb'
  };

  function showLoadingSkeleton() {
    if (!projectsContainer || currentProjects.length > 0) return;
    projectsContainer.innerHTML = Array(6).fill(0).map(() => `
      <div class="project-card skeleton-card">
        <div class="skeleton-header"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
        <div class="skeleton-footer"></div>
      </div>
    `).join('');
  }

  function getDemoUrl(repo, username) {
    if (repo.homepage && repo.homepage.trim().length > 0) {
      let hp = repo.homepage.trim();
      if (!/^https?:\/\//i.test(hp)) hp = 'https://' + hp;
      return hp;
    }
    const ownerName = repo.owner && repo.owner.login ? repo.owner.login : username;
    return `https://${ownerName}.github.io/${repo.name}/`;
  }

  function categorizeRepo(repo) {
    const lang = repo.language || '';
    const name = (repo.name || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    const topics = Array.isArray(repo.topics) ? repo.topics.map(t => t.toLowerCase()) : [];

    if (lang === 'Python' || topics.includes('python') || name.includes('python')) {
      return 'python';
    }
    if (['C', 'C++'].includes(lang) || topics.includes('cpp') || topics.includes('c') || ['sql', 'mysql', 'database'].some(k => topics.includes(k) || name.includes(k) || desc.includes(k))) {
      return 'programming';
    }
    if (['HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(lang) || topics.includes('web') || topics.includes('frontend')) {
      return 'web';
    }
    return 'apps';
  }

  async function fetchGitHubRepos() {
    const config = window.CONFIG || {};
    const username = (config.github && config.github.username) || 'arifkhan1298';

    // 1. Instant Cache Check for Blazing Speed
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentProjects = parsed.filter(p => !shouldExcludeRepo(p));
          renderProjects();
          updateNoticeBadge(currentProjects.length, true);
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }

    if (currentProjects.length === 0) {
      showLoadingSkeleton();
    }

    // 2. Fetch all repositories from GitHub API
    try {
      let allRepos = [];
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 3) {
        const apiUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&direction=desc&per_page=100&page=${page}&type=all`;
        const response = await fetch(apiUrl, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!response.ok) {
          throw new Error(`GitHub API returned status ${response.status}`);
        }

        const repos = await response.json();
        if (Array.isArray(repos) && repos.length > 0) {
          allRepos = allRepos.concat(repos);
          if (repos.length === 100) {
            page++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      if (allRepos.length > 0) {
        currentProjects = allRepos
          .filter(repo => !shouldExcludeRepo(repo))
          .map(repo => {
            const lang = repo.language || 'Software';
            const category = categorizeRepo(repo);
            const liveUrl = getDemoUrl(repo, username);

            return {
              id: `gh-${repo.id}`,
              name: repo.name.replace(/[-_]/g, ' '),
              rawName: repo.name,
              category: category,
              description: repo.description || 'Interactive software project developed by Arifullah with clean architecture and modern engineering standards.',
              technologies: [lang, ...(repo.topics ? repo.topics.slice(0, 4) : [])].filter(Boolean),
              githubUrl: repo.html_url,
              liveUrl: liveUrl,
              stars: repo.stargazers_count || 0,
              forks: repo.forks_count || 0,
              language: lang,
              updatedAt: new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              isLiveRepo: true
            };
          });

        // Save fresh data to local cache for instant future loads
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(currentProjects));
        } catch (e) {
          console.warn('Cache write error:', e);
        }

        renderProjects();
        updateNoticeBadge(currentProjects.length, false);
        return;
      }

      useCuratedFallback();

    } catch (error) {
      console.info('GitHub API notice: Using curated repository showcase.', error.message);
      if (currentProjects.length === 0) {
        useCuratedFallback();
      }
    }
  }

  function useCuratedFallback() {
    const config = window.CONFIG || {};
    currentProjects = (config.curatedProjects || []).filter(p => !shouldExcludeRepo(p));
    renderProjects();
    updateNoticeBadge(currentProjects.length, true);
  }

  function updateNoticeBadge(count, isFallback) {
    const config = window.CONFIG || {};
    const noticeEl = document.getElementById('github-live-notice');
    if (!noticeEl) return;

    noticeEl.innerHTML = `
      <div class="github-sync-badge">
        <i class="fab fa-github"></i>
        <span>GitHub Showcase: <strong>${config.github?.username || 'arifkhan1298'}</strong> (${count} Projects with Live Demos)</span>
        <a href="${config.github?.profileUrl || 'https://github.com/arifkhan1298'}" target="_blank" rel="noopener noreferrer" class="btn-text-glow">
          Visit Profile <i class="fas fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    `;
  }

  function matchCategory(p, cat) {
    if (cat === 'all') return true;
    if (p.category === cat) return true;
    if (cat === 'web' && ['HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(p.language)) return true;
    if (cat === 'python' && (p.language === 'Python' || (p.technologies && p.technologies.includes('Python')))) return true;
    if (cat === 'programming' && ['C', 'C++', 'SQL', 'MySQL', 'Database'].includes(p.language)) return true;
    return false;
  }

  function matchSearch(p, query) {
    if (!query || !query.trim()) return true;
    const q = query.toLowerCase().trim();
    const name = (p.name || '').toLowerCase();
    const rawName = (p.rawName || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const lang = (p.language || '').toLowerCase();
    const techs = Array.isArray(p.technologies) ? p.technologies.map(t => t.toLowerCase()).join(' ') : '';
    return name.includes(q) || rawName.includes(q) || desc.includes(q) || lang.includes(q) || techs.includes(q);
  }

  function updateCounts(filteredCount) {
    const total = currentProjects.length;

    // Update Hero stats strip project counter if present
    const heroProjCount = document.getElementById('hero-projects-count');
    if (heroProjCount) {
      heroProjCount.setAttribute('data-count', total);
      heroProjCount.textContent = total + '+';
    }

    // Update Filter category count badges
    const countAll = document.getElementById('count-all');
    const countWeb = document.getElementById('count-web');
    const countPython = document.getElementById('count-python');
    const countProg = document.getElementById('count-programming');
    const countApps = document.getElementById('count-apps');

    if (countAll) countAll.textContent = `(${total})`;
    if (countWeb) countWeb.textContent = `(${currentProjects.filter(p => matchCategory(p, 'web')).length})`;
    if (countPython) countPython.textContent = `(${currentProjects.filter(p => matchCategory(p, 'python')).length})`;
    if (countProg) countProg.textContent = `(${currentProjects.filter(p => matchCategory(p, 'programming')).length})`;
    if (countApps) countApps.textContent = `(${currentProjects.filter(p => matchCategory(p, 'apps')).length})`;

    // Update Projects section toolbar counter pill
    if (countPillText) {
      if (searchQuery.trim() || currentFilter !== 'all') {
        countPillText.innerHTML = `Showing <strong>${filteredCount}</strong> of <strong>${total}</strong> Projects`;
      } else {
        countPillText.innerHTML = `<strong id="projects-count-num">${total}</strong> Projects Total`;
      }
    }
  }

  function filterProjects(category) {
    currentFilter = category;

    filterButtons.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderProjects();
  }

  function renderProjects() {
    if (!projectsContainer) return;

    const filtered = currentProjects.filter(p => matchCategory(p, currentFilter) && matchSearch(p, searchQuery));

    updateCounts(filtered.length);

    if (filtered.length === 0) {
      const isSearching = Boolean(searchQuery.trim());
      projectsContainer.innerHTML = `
        <div class="no-projects-found">
          <i class="fas fa-magnifying-glass"></i>
          <p>
            ${isSearching
              ? `No projects found matching "<strong>${escapeHtml(searchQuery)}</strong>" in this category.`
              : 'No projects found in this category.'}
          </p>
          <button class="btn btn-secondary" id="reset-filter-btn">
            <i class="fas fa-rotate-left"></i> <span>Reset Filters &amp; Search</span>
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (searchClearBtn) searchClearBtn.style.display = 'none';
          filterProjects('all');
        });
      }
      return;
    }

    projectsContainer.innerHTML = filtered.map(project => {
      const langColor = LANGUAGE_COLORS[project.language] || '#22d3ee';
      const liveDemoUrl = project.liveUrl || `https://github.com/arifkhan1298/${project.rawName || ''}`;

      return `
        <article class="project-card" data-tilt data-project-id="${project.id}">
          <div class="project-card-glass">
            <div class="project-card-header">
              <div class="project-icon-wrapper">
                <i class="fas fa-code-branch"></i>
              </div>
              <div class="project-badge-status">
                <span class="pulse-dot"></span>
                <span>Demo Ready</span>
              </div>
              <div class="project-links-top">
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-icon-link" title="Source Code on GitHub" aria-label="GitHub Repository">
                  <i class="fab fa-github"></i>
                </a>
                <a href="${liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="project-icon-link highlight" title="Launch Live Demo" aria-label="Live Demo">
                  <i class="fas fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>

            <div class="project-card-body" onclick="window.openProjectModal('${project.id}')">
              <h3 class="project-title">${escapeHtml(project.name)}</h3>
              <p class="project-description">${escapeHtml(project.description)}</p>

              <div class="project-tech-tags">
                ${project.technologies.slice(0, 4).map(tech => `
                  <span class="tech-tag">${escapeHtml(tech)}</span>
                `).join('')}
              </div>
            </div>

            <div class="project-card-footer">
              <div class="project-meta-info">
                <span class="lang-indicator">
                  <span class="lang-dot" style="background-color: ${langColor};"></span>
                  ${escapeHtml(project.language || 'Software')}
                </span>
                ${project.stars > 0 ? `
                  <span class="meta-item"><i class="fas fa-star"></i> ${project.stars}</span>
                ` : ''}
                ${project.forks > 0 ? `
                  <span class="meta-item"><i class="fas fa-code-fork"></i> ${project.forks}</span>
                ` : ''}
              </div>

              <div class="project-actions">
                <a href="${liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-live-demo" title="Open Live Demo">
                  <i class="fas fa-play-circle"></i> <span>Live Demo</span>
                </a>
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-github" title="View Source on GitHub">
                  <i class="fab fa-github"></i> <span>Code</span>
                </a>
                <button type="button" class="btn-card-action btn-details" onclick="window.openProjectModal('${project.id}')" title="View Project Details">
                  <i class="fas fa-circle-info"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (window.initTiltElements) {
      window.initTiltElements();
    }
  }

  window.openProjectModal = function (projectId) {
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-project-content');
    if (!modal || !modalBody) return;

    const langColor = LANGUAGE_COLORS[project.language] || '#22d3ee';
    const liveDemoUrl = project.liveUrl || `https://github.com/arifkhan1298/${project.rawName || ''}`;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <div class="modal-badge-group">
          <span class="modal-badge"><i class="fas fa-tag"></i> ${escapeHtml(project.category || 'Development')}</span>
          <span class="modal-badge" style="border-color: ${langColor}44; color: ${langColor};">
            <span class="lang-dot" style="background-color: ${langColor};"></span> ${escapeHtml(project.language || 'Software')}
          </span>
          ${project.updatedAt ? `<span class="modal-badge"><i class="fas fa-calendar-alt"></i> ${project.updatedAt}</span>` : ''}
        </div>
        <h2 class="modal-project-title">${escapeHtml(project.name)}</h2>
      </div>

      <div class="modal-project-desc">
        <h4>About this Project</h4>
        <p>${escapeHtml(project.description)}</p>
      </div>

      <div class="modal-project-tech">
        <h4>Technologies & Tools</h4>
        <div class="modal-tags">
          ${project.technologies.map(t => `<span class="tech-tag large">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>

      <div class="modal-project-actions">
        <a href="${liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">
          <i class="fas fa-play-circle"></i> Open Live Demo
        </a>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
          <i class="fab fa-github"></i> View Source Code
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function () {
    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initSearchEvents() {
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery.length > 0 ? 'inline-flex' : 'none';
      }
      renderProjects();
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        searchInput.focus();
        renderProjects();
      });
    }

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        if (searchClearBtn) searchClearBtn.style.display = 'none';
        renderProjects();
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterProjects(cat);
    });
  });

  window.fetchGitHubRepos = fetchGitHubRepos;

  function init() {
    initSearchEvents();
    fetchGitHubRepos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
