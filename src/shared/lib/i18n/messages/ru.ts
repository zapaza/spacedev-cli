export default {
  terminal: {
    title: 'Spacedev CLI | Портфолио Терминал',
    welcome: 'Доступ разрешен. Терминал инициализирован. Введите "help", чтобы увидеть список команд.',
    prompt: "visitor{'@'}spacedev:~$",
    loading: 'Загрузка',
    syncing: 'СИНХРОНИЗАЦИЯ...',
    cleared: 'Терминал очищен.',
  },
  cmd: {
    help: {
      title: 'ДОСТУПНЫЕ КОМАНДЫ:',
      desc: 'Показать доступные команды'
    },
    clear: {
       desc: 'Очистить историю терминала'
    },
    project: {
       desc: 'Список проектов',
       usage: 'Использование: project projects'
    },
    ls: {
       desc: 'Список элементов (например, ls projects)',
       usage: 'Доступные пути: projects, courses, education',
       projects: 'ПРОЕКТЫ:',
       courses: 'КУРСЫ И СЕРТИФИКАЦИИ:'
    },
    about: {
       desc: 'Об авторе',
       identified: 'ИДЕНТИФИЦИРОВАН:',
       role: 'РОЛЬ:',
       bio: 'БИО:',
       skills: 'НАВЫКИ:',
       location: 'ЛОКАЦИЯ:',
       status: 'СТАТУС:'
    },
    teach: {
       desc: 'Научи меня чему-то новому',
       usage: 'Использование: teach',
       loading: 'Загрузка модулей знаний...',
       facts: [
         '1. Первый программист в истории – Ада Лавлейс (1843)\n\nAda Lovelace написала первый алгоритм для Charles Babbage Analytical Engine в 1843 году.\n\nЭто был алгоритм вычисления чисел Бернулли.\n\nВажно:\nмашина никогда не была построена, но алгоритм существовал — поэтому она считается первым программистом.',
         '2. Первый компьютерный баг был настоящим насекомым (1947)\n\nGrace Hopper и её команда нашли мотылька, застрявшего в реле компьютера Harvard Mark II.\n\nОни приклеили его в журнал с подписью:\n\n"First actual case of bug being found"\n\nОтсюда пошёл термин debugging.',
         '3. Первый язык высокого уровня — Fortran (1957)\n\nСоздан командой под руководством John Backus в IBM.\n\nFortran впервые позволил писать:\n\nDO I = 1, 10\n\nвместо машинного кода.\n\nЭто ускорило разработку программ в десятки раз.',
         '4. Язык C был создан для разработки Unix (1972)\n\nDennis Ritchie создал C в Bell Labs для переписывания Unix.\n\nДо этого Unix был написан на ассемблере.\n\nC позволил сделать Unix переносимым.\n\nСегодня C лежит в основе:\n\nLinux\n\nWindows\n\nmacOS\n\nGit\n\nPython interpreter',
         '5. Первый вирус появился в 1971 — Creeper\n\nВирус Creeper распространялся по ARPANET и выводил сообщение:\n\nI\'M THE CREEPER: CATCH ME IF YOU CAN\n\nОн не был вредоносным — эксперимент.',
         '6. Первый сайт в мире работает до сих пор (1991)\n\nСоздан Tim Berners-Lee.\n\nАдрес:\n\ninfo.cern.ch\n\nОн описывал, что такое World Wide Web.',
         '7. Первый программист Microsoft написал Altair BASIC за 2 месяца (1975)\n\nBill Gates и Paul Allen написали BASIC для Altair 8800.\n\nИнтересно:\nу них даже не было самого компьютера — писали на симуляторе.',
         '8. Термин "open source" появился только в 1998\n\nДо этого использовали термин:\n\nfree software\n\n"Open source" придумали для бизнеса, чтобы звучало менее политически.',
         '9. Первый JavaScript был написан за 10 дней (1995)\n\nСоздан Brendan Eich.\n\nПервоначальное название:\n\nMocha → LiveScript → JavaScript\n\nОн создавался для браузера Netscape Navigator.',
         '10. Git был создан за 10 дней (2005)\n\nLinus Torvalds написал первую версию Git за 10 дней.\n\nПричина — конфликт Linux с системой BitKeeper.\n\nСегодня Git используется практически во всей индустрии.'
       ]
    },
    matrix: {
       desc: 'Войти в матрицу',
       follow: 'Следуй за белым кроликом...'
    },
    exit: {
       desc: 'Завершить сессию',
       terminating: 'Завершение сессии...',
       goodbye: 'Прощай, пользователь.'
    },
    senior: {
        desc: 'Разблокировать максимальный опыт',
        activated: 'ВНИМАНИЕ: Обнаружены уровни Senior. Перенаправление питания на красные подсистемы...',
        overdrive: 'OVERDRIVE АКТИВИРОВАН.',
        deactivated: 'Режим Senior деактивирован. Восстановление визуального баланса...'
    },
    refactor: {
        desc: 'Оптимизировать кодовую базу',
        scanning: 'Сканирование технического долга...',
        complete: 'Рефакторинг завершен. Найдено 0 багов (проигнорировано).'
    },
    sudo: {
        desc: 'Выполнить команду от имени суперпользователя',
        denied: 'пользователь visitor не входит в список sudoers. Об этом инциденте будет сообщено.'
    },
    echo: {
        desc: 'Вывести текст в терминал'
    },
    lang: {
        desc: 'Смена языка интерфейса (ru/en)',
        usage: 'Использование: lang <ru|en>',
        current: 'Текущий язык: {lang}',
        available: 'Доступные: ru, en',
        changed: 'Язык изменен на {lang}',
        opening: 'Открытие {type} для {slug}...'
    }
  },
  status: {
    time: 'ВРЕМЯ',
    mode: 'РЕЖИМ',
    lang: 'ЯЗЫК',
    tip: 'ПОДСКАЗКА',
    tips: [
      'Введите "help" для списка команд',
      'Попробуйте "matrix" для эффекта',
      'Используйте "project" для просмотра проектов',
      'Tab для автодополнения',
      'Arrow Up для истории',
      'Загляните в "about", чтобы узнать больше',
      'Эффекты ЭЛТ активны',
      'Нейронная связь синхронизирована'
    ]
  },
  errors: {
    unknownCommand: 'Неизвестная команда: {cmd}',
    invalidUsage: 'Неверное использование: {usage}',
    projectNotFound: 'Проект не найден: {slug}',
    autocompleteMatches: 'Совпадения: {matches}'
  },
  render: {
    engine: 'Visual Engine v1.0.4',
    processing: 'ОБРАБОТКА...',
    stable: 'СВЯЗЬ СТАБИЛЬНА',
    lowPerf: 'РЕЖИМ НИЗКОЙ ПРОИЗВОДИТЕЛЬНОСТИ АКТИВЕН',
    resolution: 'РАЗРЕШЕНИЕ:',
    fps: 'КАДРЫ/С:',
    loading: 'Загрузка',
    neural: 'Нейронный интерфейс синхронизирован с входным потоком терминала'
  },
  profile: {
    name: 'Станислав Чумаков (spaceDev)',
    title: 'Senior Frontend Engineer / Frontend Architect',
    bio: `Обнаружен frontend-разработчик. Активен с 04.2018.\n            Класс: Senior. Предыдущая роль: Team Lead (Frontend / Design).\n\n            Специализация:\n            — архитектура SPA\n            — построение масштабируемых UI-систем\n            — разработка data-driven интерфейсов\n            — оптимизация производительности и стабильности\n\n            Статус: production-ready\n            Архитектурное мышление: подтверждено\n            Уровень доступа: Senior`,
    location: 'Distributed / Remote-first',
    status: 'Доступен для миссий в глубоком космосе',
  },
  projects: {
    datatree: {
      name: 'dataTree',
      summary: 'Профессиональный инструмент для визуализации и анализа данных',
      description: 'Профессиональный инструмент для визуализации, анализа и сравнения структур JSON и XML непосредственно в браузере. Ориентирован на повышение производительности и удобство для разработчиков.',
    },
    frontbeancms: {
      name: 'FrontBeanCMS',
      summary: 'Высокопроизводительный фронтенд на базе Nuxt 4 (NDA)',
      description: 'Современный высокопроизводительный фронтенд на базе Nuxt 4, спроектированный для работы в качестве внешней CMS для веб-проектов на Django. Реализация: SSR, автоматическая генерация типов из OpenAPI, динамические Sitemap и мета-теги, PWA.',
    },
    acena: {
      name: 'Aceña',
      summary: 'Современная образовательная платформа (LMS)',
      description: 'Aceña — это современная образовательная платформа (LMS) для учителей иностранных языков. Vue.js + Capacitor для кроссплатформенности. Инструменты создания уроков с помощью ИИ, интерактивные задания и аналитика.',
    },
  },
  notFound: {
    navigating: '> навигация к {path}',
    resolving: '> разрешение маршрута...',
    syncing: '> синхронизация таймлайнов [past|future]...',
    scanning: '> сканирование секторов...',
    seekingSector: 'поиск сектора: /routes/…',
    checksumMismatch: 'несовпадение контрольной суммы',
    temporalDesync: '> ОБНАРУЖЕНА ВРЕМЕННАЯ ДЕСИНХРОНИЗАЦИЯ',
    routeNotFound: '> МАРШРУТ_НЕ_НАЙДЕН',
    outsideMap: '> вы за пределами карты',
    typeHome: "> Введите 'home' для возврата",
    returning: '> Возврат к известному таймлайну...',
    homeDesc: 'Вернуться на главную страницу',
    sceneSubText: 'МАРШРУТ_НЕ_НАЙДЕН',
  },
  courses: {
    'advanced-webgl': {
      title: 'Advanced WebGL & Shaders',
      provider: 'Bruno Simon / Three.js Journey',
    },
    'design-systems': {
      title: 'Enterprise Design Systems with Figma',
      provider: 'Interaction Design Foundation',
    },
    'rust-systems-prog': {
      title: 'Rust for Systems Programming',
      provider: 'Pluralsight',
    },
  }
}
