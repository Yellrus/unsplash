// Enable inline svg in IE 11
import svg4everybody from 'svg4everybody';
// Enable picture in IE 11
import pictureFill from 'picturefill';
// Enable object-fit in IE 11
import objectFitImages from 'object-fit-images';
import scrollToTop from './modules/ScrollToTop';

import axios from 'axios';
import InfiniteScroll from 'infinite-scroll';

svg4everybody();
pictureFill();
objectFitImages();
scrollToTop();

document.addEventListener('DOMContentLoaded', () => {
    console.info('Привет, дорогой друг!');

    class Gallery {
        constructor() {
            this.gridGallery = document.querySelector('.image-grid');

            this.api_client = `9a4c56787ba6dec93047598c4649ec7e6469ece539cae79aedcec4d2e1c1a734`;
            this.api_url = `https://api.unsplash.com/search/photos?page=1&per_page=11&client_id=${
                this.api_client
            }`;
            this.form = document.querySelector('#formPhotoSearch');
            this.inputForm = document.querySelector('input');
            this.searchHandler = false;
            this.category = '';

            this.searchSubmit();
            this.infinityScroll();
            this.changeCategory();
            this.modalInit();
        }

        _render(data) {
            return data
                .map(({ id, likes, urls, user, links }) => {
                    return `<figure
    class="media image-item" data-id="${id}"
>


            <img
                class="media__img"
                src="${urls.regular}"
                alt=""
            />
            <div class="media__info">
        <div class="media__panel">
            <div class="media__like like">
                <div class="like__btn">
                    <svg class="like__icon" version="1.1" viewBox="0 0 32 32" width="32" height="32" aria-hidden="false">
                        <path
                            d="M17.4 29c-.8.8-2 .8-2.8 0l-12.3-12.8c-3.1-3.1-3.1-8.2 0-11.4 3.1-3.1 8.2-3.1 11.3 0l2.4 2.8 2.3-2.8c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.4l-12.2 12.8z">
                        </path>
                    </svg>
                    <div class="like__count">${likes}</div>
                </div>
            </div>
        </div>
        <div class="media__panel">
            <div class="user">
                <div class="user__avatar">
                    <img src="${user.profile_image.medium}" alt="" />
                </div>
                <div class="user__name">${user.first_name}</div>
            </div>
            <div class="download">
                <a
                    class="download__link"
                    title="Скачать изображение"
                    href="${links.download}?force=true"
                    rel="nofollow"
                    download=""
                >
                    <svg
                        class="download__icon"
                        version="1.1"
                        viewBox="0 0 32 32"
                        width="32"
                        height="32"
                        aria-hidden="false"
                    >
                        <path
                            d="M25.8 15.5l-7.8 7.2v-20.7h-4v20.7l-7.8-7.2-2.7 3 12.5 11.4 12.5-11.4z"
                        ></path>
                    </svg>

                    <span class="sr-only">Скачать</span>
                </a>
            </div>
        </div>
    </div>


</figure>`;
                })
                .join('');
        }

        async getSearchImages(category) {
            let url = `${this.api_url}&query=${category}`;

            await axios.get(url).then(({ data }) => {
                const gridGallery = document.querySelector('.image-grid'),
                    images = data.results;

                gridGallery.innerHTML = `${this._render(images)}`;
            });
        }

        search() {
            let value = this.inputForm.value;

            this.getSearchImages(value);
            this.infinityScroll(value);
        }

        infinityScroll(category) {
            let self = this;

            self.category = category;

            const infScroll = new InfiniteScroll('.image-grid', {
                path: function() {
                    if (self.category && self.category !== '') {
                        self.searchHandler = true;

                        return `https://api.unsplash.com/search/photos?page=${
                            this.pageIndex
                        }&client_id=${self.api_client}&query=${self.category}`;
                    } else {
                        return (
                            'https://api.unsplash.com/photos?client_id=' +
                            '9a4c56787ba6dec93047598c4649ec7e6469ece539cae79aedcec4d2e1c1a734' +
                            '&page=' +
                            this.pageIndex
                        );
                    }
                },
                // load response as flat text
                responseType: 'text',
                status: '.page-load-status',
                history: false,
            });

            infScroll.on('load', response => {
                let data = JSON.parse(response),
                    images = data;

                if (self.searchHandler) {
                    images = data.results;
                }

                let items = self._render(images);

                let htmlItems = $(items);
                infScroll.appendItems(htmlItems);
            });

            infScroll.loadNextPage();
        }

        searchSubmit() {
            this.form.addEventListener('submit', e => {
                e.preventDefault();

                const title = document.querySelector('.js-category-title'),
                    value = this.inputForm.value;

                title.innerHTML = `${value}`;

                this.search();
            });
        }

        changeCategory() {
            const categoryWrap = document.querySelector('.nav__items'),
                title = document.querySelector('.js-category-title');

            categoryWrap.addEventListener('click', e => {
                let target = e.target,
                    categoryName = target.textContent.toLowerCase().trim();

                if (!target.classList.contains('nav__link')) return;

                this.getSearchImages(categoryName);

                this.infinityScroll(categoryName);

                title.innerHTML = `${categoryName}`;
            });
        }

        _renderModalContent(src, likes, download) {
            const modalContent = document.querySelector('.modal__content');

            modalContent.innerHTML = `
            <div class="modal__panel">
                <div class="like">
                    <div class="like__btn">
                        <svg class="like__icon" version="1.1" viewBox="0 0 32 32" width="32" height="32" aria-hidden="false">
                            <path
                                d="M17.4 29c-.8.8-2 .8-2.8 0l-12.3-12.8c-3.1-3.1-3.1-8.2 0-11.4 3.1-3.1 8.2-3.1 11.3 0l2.4 2.8 2.3-2.8c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.4l-12.2 12.8z">
                            </path>
                        </svg>
                        <div class="like__count">${likes}</div>
                    </div>
                </div>
                <div class="download">
                <a
                    class="download__link"
                    title="Скачать изображение"
                    href="${download}?force=true"
                    rel="nofollow"
                    download=""
                >
                    <span>Скачать</span>
                </a>
            </div>
            </div>
            <div class="modal__body">
                <img class="modal__img" src="${src}" alt="">
            </div>
            `;
        }

        modalInit() {
            let modal = document.getElementById('mediaInfo'),
                imagesWrap = document.querySelector('.js-images');

            window.onclick = function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.classList.remove('open');
                }
            };

            imagesWrap.addEventListener('click', e => {
                let target = e.target;

                if (!target.classList.contains('media__info')) return;

                let parent = target.closest('.media'),
                    imgSrc = parent.querySelector('.media__img').src,
                    likes = parent.querySelector('.like__count').textContent,
                    download = target.querySelector('.download__link').href;

                this._renderModalContent(imgSrc, likes, download);

                modal.style.display = 'block';
                document.body.classList.add('open');
            });
        }
    }

    let unsplash = new Gallery();
});
