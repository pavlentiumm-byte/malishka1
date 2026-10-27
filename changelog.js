"use strict";

// История продукта: новые выпуски добавляем в начало массива.
// Один пункт описывает итог функции или группы связанных исправлений,
// а не отдельные коммиты и промежуточные изменения. Даты — YYYY-MM-DD.
// Тексты в каждой паре: [русский, английский].
const releaseNotes = [
  {
    date: "2026-10-27",
    title: ["Локации, статистика и безопасность · этап 6", "Locations, statistics and safety · stage 6"],
    changes: [
      {title: ["Примеры локаций", "Example locations"], text: ["Каталог вымышленных студий и площадок с поиском и фильтрами. Фотографии иллюстративные, цены условные; реального бронирования нет.", "A searchable directory of fictional studios and venues. Photos are illustrative and prices are samples; real booking is unavailable."]},
      {title: ["Локальная статистика", "Local statistics"], text: ["Отклики, завершённые съёмки и другие измеримые локальные действия. Недоступные показатели аудитории не заменяются выдуманными числами.", "Responses, completed shoots and other measurable local actions. Unavailable audience metrics are not replaced with invented numbers."]},
      {title: ["Блокировки и жалобы", "Blocks and reports"], text: ["Блокировка скрывает профиль и личный чат, сохраняя историю. Разблокировка доступна в настройках безопасности. Жалобы на профили, сообщения и объявления сохраняются как черновики без отправки модераторам.", "Blocking hides the profile and personal chat while preserving history. Unblock in safety settings. Profile, message and announcement reports are saved as drafts without delivery to moderators."]}
    ],
    note: ["Локальная демонстрация; серверная модерация и реальные площадки не подключены.", "Local demo; server moderation and real venues are not connected."]
  },
  {
    date: "2026-10-27",
    title: ["Портфолио и отзывы · этап 5", "Portfolio and reviews · stage 5"],
    changes: [
      {title: ["История проекта", "Project details"], text: ["Концепция, дата, жанр, условия использования и команда с ролями. Отметки участников неподтверждённые; старые фото сохранены.", "Concept, date, genre, usage terms and team roles. Member tags are unconfirmed; existing photos are preserved."]},
      {title: ["Отзывы после съёмки", "Post-shoot reviews"], text: ["Тестовая оценка и комментарий доступны после завершения локальной съёмки. Жалобы сохраняются черновиками без отправки модераторам.", "Test scores and comments are available after completing a local shoot. Reports are saved as drafts without delivery to moderators."]},
      {title: ["Верификация", "Verification"], text: ["Можно сохранить тип будущей проверки. Документы не запрашиваются, реальная проверка не запускается, значок подтверждения не выдаётся.", "Save the type of future verification. No documents are requested, real verification is not started and no verified badge is granted."]}
    ],
    note: ["Локальная демонстрация. Тестовые оценки не формируют реальный рейтинг.", "Local demo. Test scores do not form a real rating."]
  },
  {
    date: "2026-10-27",
    title: ["Совместная подготовка · этап 4", "Team preparation · stage 4"],
    changes: [
      {title: ["Группы и команды", "Groups and teams"], text: ["Локальные групповые чаты с текстом, изображениями, составом и ролями. Сохранённые команды доступны из избранного и используются при создании съёмки.", "Local group chats with text, images, members and roles. Saved teams are accessible from favorites and can be used when creating a shoot."]},
      {title: ["Мудборды", "Moodboards"], text: ["Изображения и ссылки с комментариями, редактированием и изменением порядка. Мудборд и группу можно привязать к съёмке и открыть из её карточки.", "Images and links with comments, editing and reordering. Link a board or group to a shoot and open it from the shoot card."]}
    ],
    note: ["Всё сохраняется в этом браузере. Добавление участника не отправляет приглашение и не подтверждает его участие.", "Everything stays in this browser. Adding a member does not send an invitation or confirm participation."]
  },
  {
    date: "2026-10-27",
    title: ["Календарь доступности · этап 3", "Availability calendar · stage 3"],
    changes: [
      {title: ["Статусы дат", "Date statuses"], text: ["В календаре можно отметить свободные, занятые и предварительно забронированные даты. Подтверждённые съёмки отмечаются автоматически, включая следующий день при ночной съёмке.", "Mark dates available, busy or tentative. Confirmed shoots appear automatically, including the next day for overnight shoots."]},
      {title: ["Видимость расписания", "Schedule visibility"], text: ["В профиле доступны приватный режим, только свободные даты или все статусы. Предпросмотр показывает, что будет видно другим, без адресов и участников. Настройка локальная; расписание не публикуется.", "Choose private, available dates only or all statuses. Preview what others would see without addresses or participants. This is local; the schedule is not published."]}
    ],
    note: ["В предложении съёмки показана твоя занятость. Расписание демонстрационных специалистов неизвестно — дату нужно уточнить в чате.", "Proposals show your availability. Demo specialists have no shared schedule; discuss the date in chat."]
  },
  {
    date: "2026-10-27",
    title: ["Поиск команды · этап 2", "Team recruitment · stage 2"],
    changes: [
      {title: ["Подробные объявления", "Detailed announcements"], text: ["Описание, жанр, несколько специальностей и число мест, бюджет, требования, срок откликов, изображения и ссылки на референсы. Добавлены редактирование и удаление с подтверждением.", "Description, genre, multiple roles and places, budget, requirements, application deadline, images and reference links. Edit announcements or delete with confirmation."]},
      {title: ["Подбор команды", "Team selection"], text: ["Фильтры учитывают жанр и все роли. У откликов появился статус «Принят», а заполнение мест контролируется. Действия автора и участника остаются локальной демонстрацией.", "Filters include genre and all roles. Responses can be accepted with capacity checks. Organizer and participant actions remain a local demo."]}
    ],
    note: ["Существующие объявления и отклики сохранены. Данные не отправляются другим людям.", "Existing announcements and responses are preserved. Data is not sent to other people."]
  },
  {
    date: "2026-10-27",
    title: ["Съёмки: черновики и согласование · этап 1", "Shoots: drafts and approval · stage 1"],
    changes: [
      {title: ["Полное предложение", "Detailed proposals"], text: ["В профили возвращена кнопка «Предложить съёмку». Добавлены концепция, дата, продолжительность, место, роль и оплата. Черновик можно проверить и отредактировать до добавления в локальный чат.", "Profiles include Propose a shoot again. Add concept, date, duration, location, role and payment. Review and edit drafts before adding them to the local chat."]},
      {title: ["Статусы и история", "Statuses and history"], text: ["В отдельном деморежиме можно принять, отклонить или обсудить предложение. Изменение подтверждённых условий требует повторного согласования. История сохраняет старые и новые значения.", "Explicit demo recipient actions allow accepting, declining and discussing proposals. Changes to confirmed terms require approval again. History preserves old and new values."]},
      {title: ["Чат и календарь", "Chat and calendar"], text: ["Подтверждённые съёмки автоматически попадают в календарь без дублей. Черновики и история проектов доступны в профиле → Мои съёмки.", "Confirmed shoots appear in the calendar automatically without duplicates. Drafts and project history are in Profile → My shoots."]}
    ],
    note: ["Локальная демонстрация: ответы получателя не являются действиями реального человека. Старые переписки, события и портфолио сохраняются.", "Local demo: recipient replies are not actions by a real person. Existing chats, events and portfolios are preserved."]
  },
{
  "date": "2026-10-27",
  "title": [
    "Спокойнее интерфейс, проще навигация",
    "Calmer controls, simpler navigation"
  ],
  "changes": [
    {
      "title": [
        "Единый стиль управления",
        "Consistent controls"
      ],
      "text": [
        "Обновлены кнопки, поля, переключатели и выбор файлов. Уточнены отступы, размеры, состояния фокуса и расположение действий в формах.",
        "Refined buttons, fields, switches and file selection, with consistent spacing, sizing, focus states and form actions."
      ]
    },
    {
      "title": [
        "Личные инструменты в профиле",
        "Personal tools in your profile"
      ],
      "text": [
        "Календарь перенесён из главного меню в профиль. Создание предложений съёмок убрано из профилей и чатов; ранее сохранённые записи доступны.",
        "The calendar moved from main navigation into the profile. Creating shoot proposals was removed from profiles and chats; existing records remain accessible."
      ]
    },
    {
      "title": [
        "Концепция ВКадре Pro",
        "ВКадре Pro concept"
      ],
      "text": [
        "В профиле и настройках можно посмотреть идею подписки: расширенное портфолио, статистику, шаблоны объявлений и подборки участников. Базовое общение остаётся бесплатным. Цены, оплата и платные ограничения не включены.",
        "Explore a subscription concept from your profile and settings: expanded portfolios, insights, announcement templates and talent collections. Core communication stays free. Pricing, payments and paid limits are not enabled."
      ]
    },
    {
      "title": [
        "Компьютер и телефон",
        "Desktop and mobile"
      ],
      "text": [
        "Обновлены мобильное меню, шапка, модальные окна и сетки форм. Увеличены зоны нажатия и убраны длинные надписи из компактных элементов.",
        "Updated mobile navigation, header, dialogs and form grids. Increased touch targets and shortened labels in compact controls."
      ]
    }
  ]
},
{
  "date": "2026-10-27",
  "title": [
    "Варианты входа при регистрации",
    "Sign-in options at registration"
  ],
  "changes": [
    {
      "title": [
        "Google, Яндекс, Telegram и VK",
        "Google, Yandex, Telegram and VK"
      ],
      "text": [
        "В форме нового профиля появились четыре варианта входа. Каждый помечен как неподключённый: локальная демонстрация не авторизует через сервисы и не создаёт аккаунты. Заполнение локального профиля по-прежнему доступно.",
        "New profile registration now shows four sign-in options. Each is marked as not connected: the local demo does not authenticate with providers or create accounts. Local profile creation remains available."
      ]
    }
  ]
},
{
  "date": "2026-10-26",
  "title": [
    "Команда и подготовка к съёмке",
    "Team and shoot preparation"
  ],
  "changes": [
    {
      "title": [
        "Фильтры и отклики",
        "Filters and responses"
      ],
      "text": [
        "Добавлены фильтры по городу, роли, дате и оплате, режим «Мои отклики», статусы приглашения и отказа, переходы в профиль и чат кандидата. Закрытые и прошедшие объявления скрыты по умолчанию. Для знакомства с разделом можно добавить примеры.",
        "Filter by city, role, date and payment. My responses shows invitation and decline statuses; candidate profiles and chats are linked. Closed and past announcements are hidden by default. Optional examples help explore the section."
      ]
    },
    {
      "title": [
        "Перенос и отмена",
        "Rescheduling and cancellation"
      ],
      "text": [
        "Условия и участников можно изменить после обсуждения; связанная запись календаря обновляется. При отмене требуется причина, съёмка удаляется из календаря, а её история остаётся в чате.",
        "Edit details and participants after discussing them; the linked calendar entry updates. Cancellation requires a reason, removes the calendar entry and keeps the history in chat."
      ]
    },
    {
      "title": [
        "Мудборд и подготовка",
        "Moodboard and preparation"
      ],
      "text": [
        "В карточках съёмок и календаре доступны референсы: изображения и ссылки. Добавляй задачи, назначай ответственных и отмечай готовность.",
        "Shoot cards and linked calendar entries now include image and link references. Add tasks, assign owners and mark them complete."
      ]
    },
    {
      "title": [
        "Напоминания",
        "Reminders"
      ],
      "text": [
        "В шапке появился раздел с напоминаниями о съёмках в ближайшие 24 часа и предложениях без договорённости дольше суток. Напоминания можно скрыть и восстановить.",
        "The header now links to reminders for shoots within 24 hours and proposals awaiting agreement for over a day. Dismiss and restore reminders as needed."
      ]
    }
  ],
  "note": [
    "Локальная демонстрация. Данные не отправляются другим людям. Напоминания работают внутри открытого сайта, без фоновых уведомлений.",
    "Local demo. Data is not sent to other people. Reminders work inside the open site, without background notifications."
  ]
},
  {
    date: "2026-10-26",
    title: ["От знакомства к съёмке", "From a connection to a shoot"],
    changes: [
      {
        title: ["Предложения съёмок", "Shoot proposals"],
        text: ["В профилях и чатах появилась кнопка «Предложить съёмку». Идея, дата, время, место и условия TFP или оплаты собираются в карточку в чате.", "Profiles and chats now include a Propose a shoot button. The concept, date, time, location and TFP or payment terms appear together in a chat card."]
      },
      {
        title: ["Поиск команды", "Team recruitment"],
        text: ["Новый раздел с объявлениями о съёмках: можно указать нужную роль, сохранить отклики, закрыть набор и открыть его снова.", "A new section for shoot announcements: specify the role you need, save responses, close recruitment and reopen it."]
      },
      {
        title: ["Свободные даты", "Available dates"],
        text: ["В своём профиле можно добавлять и удалять свободные даты. Прошедшие даты автоматически скрываются.", "Add and remove available dates in your profile. Past dates are automatically hidden."]
      },
      {
        title: ["Договорённости и календарь", "Agreements and calendar"],
        text: ["После обсуждения предложение можно отметить как договорённость, указать участников и перенести детали в календарь. Повторное нажатие не создаёт дубликат. Отметку ставишь ты — это не автоматическое подтверждение собеседника.", "After discussing a proposal, mark it as agreed, list the participants and add the details to your calendar. Repeated clicks do not create duplicates. You set this status; it is not automatic confirmation from the other person."]
      },
      {
        title: ["Индикатор непрочитанных", "Unread indicator"],
        text: ["Уменьшили и скорректировали положение точки на значке чатов, чтобы она аккуратнее сочеталась с иконкой.", "Refined the unread dot’s size and position to fit the chat icon more neatly."]
      },
      {
        title: ["История обновлений", "Update history"],
        text: ["В настройках появился список изменений с датами и описанием значимых обновлений. Связанные мелкие правки объединяются в один пункт.", "Settings now include dated release notes for meaningful updates. Related small adjustments are grouped into a single entry."]
      }
    ],
    note: ["Эти функции пока работают локально: объявления, отклики, предложения и договорённости сохраняются в этом браузере и не отправляются другим людям.", "These features currently work locally: announcements, responses, proposals and agreements stay in this browser and are not sent to other people."]
  }
];

function releaseNotesMarkup() {
  const local = pair => esc(pair[settings.language === "en" ? 1 : 0]);
  return `<details class="surface settings-panel settings-section" data-section="changelog">
    <summary>${tr("История обновлений", "Update history")}</summary>
    <div class="settings-section-body release-notes">
      <p>${tr("Новые возможности и заметные улучшения ВКадре — от новых к старым.", "New features and meaningful improvements to ВКадре, newest first.")}</p>
      ${releaseNotes.map(release => `<article class="release-entry">
        <time datetime="${esc(release.date)}">${esc(new Date(release.date + "T12:00:00").toLocaleDateString(settings.language === "en" ? "en-GB" : "ru-RU", {day:"numeric", month:"long", year:"numeric"}))}</time>
        <h3>${local(release.title)}</h3>
        <ul>${release.changes.map(change => `<li><strong>${local(change.title)}</strong><p>${local(change.text)}</p></li>`).join("")}</ul>
        ${release.note ? `<p class="release-note">${local(release.note)}</p>` : ""}
      </article>`).join("")}
    </div>
  </details>`;
}
