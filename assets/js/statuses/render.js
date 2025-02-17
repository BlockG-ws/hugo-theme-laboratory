class Fetcher {
    constructor(instanceUrl, userId, extraParams={}) {
        this.instanceUrl = instanceUrl;
        this.userId = userId;
        this.extraParams = extraParams;
        this.posts = [];
        this.loading = false;
        this.hasMore = true;
        this.maxId = null;

        this.postsContainer = document.getElementById('posts');
        this.loadingElement = document.querySelector('.loading');
        this.errorElement = document.querySelector('.error');
        // 缓存已知的表情映射
        this.emojiCache = new Map();
        /* 建立灯箱 */
        this.lightbox = document.getElementById('lightbox');
        // cw
        this.setupContentWarningToggles();

        this.init();
        this.setupLightbox();
    }

    async init() {
        this.setupScrollListener();
        await this.loadPosts();
    }

    setupScrollListener() {
        window.addEventListener('scroll', this.throttle(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                if (!this.loading && this.hasMore) {
                    this.loadPosts();
                }
            }
        }, 200));
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    setupLightbox() {
        this.lightbox.addEventListener('click', () => {
            this.lightbox.classList.remove('active');
            this.lightbox.innerHTML = '';
        });
    }

    showInLightbox(imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        this.lightbox.innerHTML = '';
        this.lightbox.appendChild(img);
        this.lightbox.classList.add('active');
    }

    setupContentWarningToggles() {
        this.postsContainer.addEventListener('click', (event) => {
            const toggleButton = event.target.closest('.spoiler-toggle');

            if (toggleButton) {
                const spoilerWrapper = toggleButton.closest('.content-warning');
                const spoilerContent = spoilerWrapper.querySelector('.spoiler-content');

                const isHidden = spoilerContent.hidden;
                spoilerContent.hidden = !isHidden;

                toggleButton.setAttribute('aria-expanded', !isHidden);
                toggleButton.textContent = isHidden ? 'Hide content' : 'Show content';
            }
        });
    }


    renderMediaAttachments(attachments) {
        if (!attachments || attachments.length === 0) return '';

        const mediaHtml = attachments.map(attachment => {
            const description = attachment.description ?
                `<div class="media-description">${attachment.description}</div>` : '';

            switch (attachment.type) {
                case 'image':
                    return `
                                <div class="media-attachment">
                                    <img
                                        src="${attachment.preview_url || attachment.url}"
                                        alt="${attachment.description || ''}"
                                        loading="lazy"
                                        onclick="fetcher.showInLightbox('${attachment.url}')"
                                    >
                                    ${description}
                                </div>
                            `;
                case 'video':
                    return `
                                <div class="media-attachment video">
                                    <video
                                        controls
                                        preload="metadata"
                                        poster="${attachment.preview_url}"
                                    >
                                        <source src="${attachment.url}" type="video/mp4">
                                        Your browser does not support video playback.
                                    </video>
                                    ${description}
                                </div>
                            `;
                case 'audio':
                    return `
                                <div class="media-attachment">
                                    <audio controls preload="metadata">
                                        <source src="${attachment.url}">
                                        Your browser does not support audio playback.
                                    </audio>
                                    ${description}
                                </div>
                            `;
                default:
                    return `
                                <div class="media-attachment">
                                    <a href="${attachment.url}" target="_blank">
                                        Download media
                                    </a>
                                    ${description}
                                </div>
                            `;
            }
        }).join('');

        return `<div class="media-attachments">${mediaHtml}</div>`;
    }


    async loadPosts() {
        try {
            this.loading = true;
            this.showLoading();

            const params = new URLSearchParams({
                limit: '20'
            });

            if (this.maxId) {
                params.append('max_id', this.maxId);
            }
            // Append extraParams to params if not empty
            for (const [key, value] of Object.entries(this.extraParams)) {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value);
                }
            }


            const response = await fetch(
                `${this.instanceUrl}/api/v1/accounts/${this.userId}/statuses?${params}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                console.error('Failed to fetch posts');
            }

            const posts = await response.json();

            if (posts.length === 0) {
                this.hasMore = false;
                return;
            }

            this.maxId = posts[posts.length - 1].id;
            this.posts = [...this.posts, ...posts];
            this.renderPosts(posts);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.loading = false;
            this.hideLoading();
        }
    }

    updateEmojiCache(emojis) {
        emojis.forEach(emoji => {
            this.emojiCache.set(emoji.shortcode, emoji.url);
        });
    }

    replaceEmojis(content, emojis) {
        // 更新表情缓存
        this.updateEmojiCache(emojis);

        // 使用正则表达式匹配所有 :shortcode: 格式的文本
        return content.replace(/:([a-zA-Z0-9_]+):/g, (match, shortcode) => {
            const emojiUrl = this.emojiCache.get(shortcode);
            if (emojiUrl) {
                return `<img
                            class="custom-emoji"
                            src="${emojiUrl}"
                            alt=":${shortcode}:"
                            title=":${shortcode}:"
                            onerror="this.classList.add('emoji-error')"
                        >`;
            }
            // 如果找不到对应的表情，保留原始文本
            return match;
        });
    }

    renderAuthor(account) {
        return `
                    <div class="post-author">
                        <img
                            class="author-avatar"
                            src="${account.avatar}"
                            alt="${account.display_name}"
                            loading="lazy"
                        >
                        <div class="author-info">
                            <span class="display-name">
                                ${this.replaceEmojis(account.display_name, account.emojis || [])}
                            </span>
                            <span class="account-name">@${account.acct}</span>
                        </div>
                    </div>
                `;
    }

    // 渲染帖子操作区域
    renderPostActions(post) {
        const postUrl = post.url;
        return `
                    <div class="post-actions">
                        <span class="timestamp">${new Date(post.created_at).toLocaleString()}</span>
                        <a href="${postUrl}"
                           class="post-link"
                           target="_blank"
                           title="在新窗口打开帖子">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                            </svg>
                            打开原帖
                        </a>
                    </div>
                `;
    }



    renderPostContent(post) {
        const processedContent = this.replaceEmojis(post.content, post.emojis || []);
        const mediaAttachments = this.renderMediaAttachments(post.media_attachments);

        if (post.sensitive) {
            return `
             ${this.renderAuthor(post.account)}
             <div class="content-warning">
                <div class="spoiler-header">
                    <span class="spoiler-text">${this.replaceEmojis(post.spoiler_text, post.emojis || [])}</span>
                    <button class="spoiler-toggle" aria-expanded="false">
                        Show content
                    </button>
                </div>
                <div class="spoiler-content" hidden>
                    ${this.replaceEmojis(post.content, post.emojis || [])}
                    ${mediaAttachments}
                </div>
            </div>
            ${this.renderPostActions(post)}
            `
        }

        return `
                    ${this.renderAuthor(post.account)}
                    <div class="content">${processedContent}</div>
                    ${mediaAttachments}
                    ${this.renderPostActions(post)}
                `;
    }

    renderPosts(posts) {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';

            if (post.reblog) {
                // 这是一个转发的帖子
                postElement.innerHTML = `
                            <div class="reblog-header">
                                <a href="${this.instanceUrl}/@${post.account.acct}"
                                   class="username"
                                   target="_blank">
                                    ${post.account.display_name}
                                </a>
                                转发了
                            </div>
                            <div class="reblogged-content">
                                ${this.renderPostContent(post.reblog)}
                            </div>
                            <div class="post-actions">
                                <span class="timestamp">${new Date(post.created_at).toLocaleString()}</span>
                            </div>
                        `;
            } else {
                // 这是一个原创帖子
                postElement.innerHTML = this.renderPostContent(post);
            }

            this.postsContainer.appendChild(postElement);
        });
    }

    showLoading() {
        this.loadingElement.classList.add('visible');
    }

    hideLoading() {
        this.loadingElement.classList.remove('visible');
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
    }
}
