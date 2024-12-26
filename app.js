const root = document.documentElement

const translate = document.getElementById('translate')
const theme = document.getElementById('theme')

const openMenu = document.querySelector('.open')
const closeMenu = document.querySelector('.close')

const menu = document.querySelector('nav')
const mediaQuery = window.matchMedia('(max-width: 560px)')

const dynamicWord = document.getElementById('dynamic-word')
const words = ['web', 'mobile']
let wordIndex = 0;

const backHome = document.querySelector('.up')

const meContacterButton = document.querySelector("#a-propos button")

const sections = document.querySelectorAll('[data-section]')
let obs = null

theme.addEventListener('click', () => {
    root.classList.toggle("light")
    root.style.transition = 'background .3s'
    theme.innerText = root.classList.contains('light') ? 'dark_mode': 'light_mode'
})

const handleMenuDisplay = (e) => {
  if (e.matches) {
    menu.classList.remove('reveal')
    menu.classList.add('entry')
    menu.style.display = 'none';
    openMenu.style.display = 'block'
    closeMenu.style.display = 'block'
    backHome.style.visibility = 'visible'
  } else {
    menu.classList.remove('entry')
    menu.classList.add('reveal')
    menu.style.display = 'block'
    openMenu.style.display = 'none'
    closeMenu.style.display = 'none'
    backHome.style.visibility = 'hidden'
  }
}

handleMenuDisplay(mediaQuery);
mediaQuery.addEventListener('change', handleMenuDisplay);

openMenu.addEventListener('click', () => {
    menu.style.display = 'block'
    openMenu.style.visibility = 'hidden'
})

closeMenu.addEventListener('click', () => {
    menu.classList.remove('animation', 'entry')
    menu.classList.add('end');

    menu.addEventListener('animationend', () => {
        menu.style.display = 'none';
        openMenu.style.visibility = 'visible';
        menu.classList.add('animation', 'entry')
        menu.classList.remove('end');
    }, { once: true });
});

function displayWord() {
    if (wordIndex >= words.length) {
        wordIndex = 0;
    }

    const letters = words[wordIndex].split("");
    let letterIndex = 0;
    dynamicWord.innerText = "";

    const letterInterval = setInterval(() => {
        if (letterIndex < letters.length) {
            dynamicWord.innerText += letters[letterIndex];
            letterIndex++;
        } else {
            clearInterval(letterInterval);
        }
    }, 200);

    wordIndex++;
}

setInterval(displayWord, 2000);

meContacterButton.addEventListener('click', () => {
  window.location.href = '#contact'
})

const activate = (el) => {
    const id = el.getAttribute('id')

    backHome.style.display = id === 'accueil' ? 'none': 'block'

    const a = document.querySelector(`a[href="#${id}"]`)

    if (a === null) {
        return
    }

    menu.querySelectorAll('.active').forEach(node => node.classList.remove('active'))
    
    a.classList.add('active')
}

const callback = function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            activate(entry.target)
        }
    })
}

const scrollSpy = function (elements) {
    if (obs !== null) {
        elements.forEach(el => observer.unobserve(el))
    }

    const y = Math.round(window.innerHeight * .4)
    obs = new IntersectionObserver(callback, {
        rootMargin: `-${window.innerHeight - y - 1}px 0px -${y}px 0px`
    })
    sections.forEach(s => obs.observe(s))
}

/**
 * 
 * @param {Function} callback 
 * @param {number} delay 
 * @return {Function}
 */
const debounce = function (callback, delay){
    let timer;
    return function(){
        let args = arguments;
        let context = this;
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback.apply(context, args);
        }, delay)
    }
}

if (sections.length > 0) {
    scrollSpy(sections)
    let windowH = window.innerHeight
    window.addEventListener('resize', debounce(function () {
        if (window.innerHeight !== windowH) {
            scrollSpy(sections)
            windowH = window.innerHeight
        }
    }, 500))
}

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animation');
            observer.unobserve(entry.target);
        }
    })
}, {threshold: .1});

document.querySelectorAll('.zoom, .reveal, .entry').forEach(r => { observer.observe(r); });