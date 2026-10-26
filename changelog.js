"use strict";

// История продукта: новые выпуски добавляем в начало массива.
// Один пункт описывает итог функции или группы связанных исправлений,
// а не отдельные коммиты и промежуточные изменения. Даты — YYYY-MM-DD.
// Тексты в каждой паре: [русский, английский].
const releaseNotes = [
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
